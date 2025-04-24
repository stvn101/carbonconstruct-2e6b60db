
import { useCallback, useRef, useEffect } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { SavedProject } from '@/types/project';
import { supabase } from '@/integrations/supabase/client';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';
import { isOffline } from '@/utils/errorHandling';
import { checkSupabaseConnection } from '@/services/supabseFallbackService';

export const useProjectRealtime = (
  userId: string | undefined, 
  setProjects: Dispatch<SetStateAction<SavedProject[]>>
) => {
  const retryCount = useRef(0);
  const maxRetries = 3;
  const channelRef = useRef<RealtimeChannel | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Connection health check
  useEffect(() => {
    let mounted = true;
    const healthCheckInterval = setInterval(async () => {
      if (!userId || !mounted) return;
      
      const isConnected = await checkSupabaseConnection();
      if (!isConnected && channelRef.current && mounted) {
        // If health check fails but we think we have a channel, try to reconnect
        console.log('Health check failed, attempting to reconnect realtime subscription');
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = setTimeout(() => {
          supabase.removeChannel(channelRef.current!);
          channelRef.current = null;
          if (mounted) subscribeToProjects();
        }, 2000);
      }
    }, 30000); // Check every 30 seconds
    
    return () => {
      mounted = false;
      clearInterval(healthCheckInterval);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [userId]);
  
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
            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = setTimeout(() => subscribeToProjects(), backoffDelay);
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

  // Auto-cleanup on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return { subscribeToProjects };
};
