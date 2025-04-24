
import { useCallback, useRef, useEffect } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { SavedProject } from '@/types/project';
import { supabase } from '@/integrations/supabase/client';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';
import { isOffline } from '@/utils/errorHandling';
import { checkSupabaseConnection } from '@/services/supabase/connection';
import ErrorTrackingService from '@/services/error/errorTrackingService';

export const useProjectRealtime = (
  userId: string | undefined, 
  setProjects: Dispatch<SetStateAction<SavedProject[]>>
) => {
  const retryCount = useRef(0);
  const maxRetries = 3;
  const channelRef = useRef<RealtimeChannel | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSubscribingRef = useRef(false);
  const mountedRef = useRef(true);
  
  // Clean up on unmount
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      if (channelRef.current) {
        try {
          supabase.removeChannel(channelRef.current);
        } catch (err) {
          console.error("Error removing channel on unmount:", err);
        }
        channelRef.current = null;
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, []);
  
  // Set up health check interval
  useEffect(() => {
    if (!userId || !mountedRef.current) return;
    
    const healthCheckInterval = setInterval(async () => {
      // Skip health check if we're already trying to subscribe or if unmounted
      if (isSubscribingRef.current || !mountedRef.current) return;
      
      try {
        const isConnected = await checkSupabaseConnection();
        
        // If we detected a disconnection, try to reconnect
        if (!isConnected && channelRef.current && mountedRef.current) {
          console.log('Health check failed, attempting to reconnect realtime subscription');
          
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          
          reconnectTimeoutRef.current = setTimeout(() => {
            if (!mountedRef.current) return;
            
            try {
              if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
              }
              channelRef.current = null;
              retryCount.current = 0;
              
              if (mountedRef.current) {
                const newChannel = subscribeToProjects();
                if (newChannel) {
                  console.log("Re-established realtime subscription after health check");
                }
              }
            } catch (err) {
              console.error("Error during channel reconnection:", err);
            }
          }, 2000);
        }
      } catch (err) {
        console.warn("Error during health check:", err);
      }
    }, 30000); // Check every 30 seconds
    
    return () => {
      clearInterval(healthCheckInterval);
    };
  }, [userId]);
  
  const subscribeToProjects = useCallback(() => {
    // Don't subscribe if no user or already subscribing
    if (!userId || isSubscribingRef.current) return null;
    
    // Don't subscribe if offline
    if (isOffline()) {
      console.log('Offline detected, skipping realtime subscription');
      return null;
    }
    
    // Don't retry too many times
    if (retryCount.current >= maxRetries) {
      console.warn(`Not attempting realtime subscription after ${maxRetries} failed attempts`);
      return null;
    }

    isSubscribingRef.current = true;
    
    try {
      // Clean up any existing channel
      if (channelRef.current) {
        try {
          supabase.removeChannel(channelRef.current);
        } catch (err) {
          console.error("Error removing existing channel:", err);
        }
        channelRef.current = null;
      }
      
      // Create a new channel
      const projectChannel = supabase.channel(`projects:user_id=eq.${userId}`)
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

      channelRef.current = projectChannel;

      const handleSubscriptionStatus = (status: string) => {
        if (status === 'SUBSCRIBED') {
          retryCount.current = 0;
          console.log('Realtime subscription established successfully');
        } else if (status === 'CHANNEL_ERROR') {
          retryCount.current += 1;
          console.warn(`Realtime subscription error (attempt ${retryCount.current}/${maxRetries})`);
          
          if (retryCount.current < maxRetries && mountedRef.current) {
            const backoffDelay = Math.min(1000 * Math.pow(2, retryCount.current), 10000);
            
            if (reconnectTimeoutRef.current) {
              clearTimeout(reconnectTimeoutRef.current);
            }
            
            reconnectTimeoutRef.current = setTimeout(() => {
              if (!mountedRef.current) return;
              isSubscribingRef.current = false;
              subscribeToProjects();
            }, backoffDelay);
          } else {
            // Log to error tracking service if we've reached max retries
            ErrorTrackingService.captureException(
              new Error(`Failed to establish realtime subscription after ${maxRetries} attempts`),
              { component: 'useProjectRealtime' }
            );
            isSubscribingRef.current = false;
          }
        } else if (status === 'CLOSED') {
          console.log('Realtime channel closed');
          isSubscribingRef.current = false;
        } else if (status === 'TIMED_OUT') {
          console.warn('Realtime subscription timed out');
          isSubscribingRef.current = false;
          
          // Try again if we haven't reached max retries
          if (retryCount.current < maxRetries && mountedRef.current) {
            retryCount.current += 1;
            const backoffDelay = Math.min(1000 * Math.pow(2, retryCount.current), 10000);
            
            if (reconnectTimeoutRef.current) {
              clearTimeout(reconnectTimeoutRef.current);
            }
            
            reconnectTimeoutRef.current = setTimeout(() => {
              if (!mountedRef.current) return;
              subscribeToProjects();
            }, backoffDelay);
          }
        }
      };
      
      projectChannel.subscribe(handleSubscriptionStatus);
      isSubscribingRef.current = false;
      return projectChannel;
    } catch (error) {
      console.error('Error setting up realtime subscription:', error);
      ErrorTrackingService.captureException(
        error instanceof Error ? error : new Error(String(error)),
        { component: 'useProjectRealtime', action: 'subscribe' }
      );
      retryCount.current += 1;
      isSubscribingRef.current = false;
      return null;
    }
  }, [userId, setProjects, maxRetries]);

  return { subscribeToProjects };
};
