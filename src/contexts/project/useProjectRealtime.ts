
import { useCallback, useRef } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { SavedProject } from '@/types/project';
import { supabase } from '@/integrations/supabase/client';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';
import { isOffline } from '@/utils/errorHandling';

export const useProjectRealtime = (
  userId: string | undefined, 
  setProjects: Dispatch<SetStateAction<SavedProject[]>>
) => {
  const retryCount = useRef(0);
  const maxRetries = 3;
  const channelRef = useRef<RealtimeChannel | null>(null);
  
  const subscribeToProjects = useCallback(() => {
    if (!userId) return null;
    if (isOffline()) {
      console.log('Offline detected, skipping realtime subscription');
      return null;
    }
    if (retryCount.current >= maxRetries) {
      console.warn(`Not attempting realtime subscription after ${maxRetries} failed attempts`);
      return null;
    }

    try {
      // Clean up any existing subscription first
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      
      const projectChannel = supabase.channel(`projects:user_id=eq.${userId}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'projects',
          filter: `user_id=eq.${userId}` 
        }, (payload) => {
          const newProject = payload.new as SavedProject;
          setProjects((prev) => [...prev, newProject]);
          toast.info('New project added');
        })
        .on('postgres_changes', { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'projects',
          filter: `user_id=eq.${userId}` 
        }, (payload) => {
          const updatedProject = payload.new as SavedProject;
          setProjects((prev) => 
            prev.map(project => project.id === updatedProject.id ? updatedProject : project)
          );
        })
        .on('postgres_changes', { 
          event: 'DELETE', 
          schema: 'public', 
          table: 'projects',
          filter: `user_id=eq.${userId}` 
        }, (payload) => {
          const deletedId = (payload.old as SavedProject).id;
          setProjects((prev) => 
            prev.filter(project => project.id !== deletedId)
          );
          toast.info('Project deleted');
        });

      channelRef.current = projectChannel;

      projectChannel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          retryCount.current = 0;
          console.log('Realtime subscription established successfully');
        } else if (status === 'CHANNEL_ERROR') {
          retryCount.current += 1;
          console.warn(`Realtime subscription error (attempt ${retryCount.current}/${maxRetries})`);
          
          if (retryCount.current < maxRetries) {
            // Implement exponential backoff for retries
            const backoffDelay = Math.min(1000 * Math.pow(2, retryCount.current), 10000);
            setTimeout(() => subscribeToProjects(), backoffDelay);
          }
        } else if (status === 'CLOSED') {
          console.log('Realtime channel closed');
        }
      });

      return projectChannel;
    } catch (error) {
      console.error('Error setting up realtime subscription:', error);
      retryCount.current += 1;
      return null;
    }
  }, [userId, setProjects, maxRetries]);

  return { subscribeToProjects };
};
