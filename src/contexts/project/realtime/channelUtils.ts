
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { SavedProject } from '@/types/project';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';
import ErrorTrackingService from '@/services/error/errorTrackingService';

/**
 * Creates and configures a Supabase realtime channel for project updates
 * with optimized connection handling and error recovery
 */
export const createProjectChannel = (
  userId: string,
  setProjects: Dispatch<SetStateAction<SavedProject[]>>,
  handleSubscriptionStatus: (status: string) => void
): RealtimeChannel | null => {
  try {
    // Create a new channel with optimized configuration
    // Using a specific filter reduces the load on realtime.list_changes
    const channelName = `projects:user_id=eq.${userId}`;
    const projectChannel = supabase.channel(channelName, {
      config: {
        broadcast: { self: false },
        presence: { key: userId }
        // Remove invalid retry configuration properties
        // We'll handle retries in the subscription handler instead
      }
    })
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'projects',
        filter: `user_id=eq.${userId}` 
      }, (payload) => {
        try {
          const newProject = payload.new as SavedProject;
          setProjects((prev) => {
            // Prevent duplicates
            if (prev.some(p => p.id === newProject.id)) {
              return prev;
            }
            return [...prev, newProject];
          });
          toast.success('Project added', {
            id: `project-added-${newProject.id.substring(0, 5)}`,
            duration: 3000
          });
        } catch (err) {
          console.error("Error handling INSERT event:", err);
        }
      })
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'projects',
        filter: `user_id=eq.${userId}` 
      }, (payload) => {
        try {
          const updatedProject = payload.new as SavedProject;
          setProjects((prev) => 
            prev.map(project => project.id === updatedProject.id ? updatedProject : project)
          );
        } catch (err) {
          console.error("Error handling UPDATE event:", err);
        }
      })
      .on('postgres_changes', { 
        event: 'DELETE', 
        schema: 'public', 
        table: 'projects',
        filter: `user_id=eq.${userId}` 
      }, (payload) => {
        try {
          const deletedId = (payload.old as SavedProject).id;
          setProjects((prev) => 
            prev.filter(project => project.id !== deletedId)
          );
          
          toast.info('Project deleted', {
            id: `project-deleted-${deletedId.substring(0, 5)}`,
            duration: 3000
          });
        } catch (err) {
          console.error("Error handling DELETE event:", err);
        }
      });

    projectChannel.subscribe(handleSubscriptionStatus);
    return projectChannel;
  } catch (error) {
    console.error('Error creating project channel:', error);
    ErrorTrackingService.captureException(
      error instanceof Error ? error : new Error(String(error)),
      { component: 'channelUtils', action: 'createProjectChannel' }
    );
    return null;
  }
};

/**
 * Safely removes a channel if it exists
 */
export const removeChannel = (channel: RealtimeChannel | null): void => {
  if (channel) {
    try {
      supabase.removeChannel(channel);
    } catch (err) {
      console.error("Error removing channel:", err);
    }
  }
};
