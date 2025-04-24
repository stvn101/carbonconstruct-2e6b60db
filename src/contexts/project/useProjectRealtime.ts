import { useCallback, useRef } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { SavedProject } from '@/types/project';
import { supabase } from '@/integrations/supabase/client';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';

export const useProjectRealtime = (
  userId: string | undefined, 
  setProjects: Dispatch<SetStateAction<SavedProject[]>>
) => {
  const retryCount = useRef(0);
  const maxRetries = 3;
  
  const subscribeToProjects = useCallback(() => {
    if (!userId || retryCount.current >= maxRetries) return null;

    try {
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

      projectChannel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          retryCount.current = 0;
        } else if (status === 'CHANNEL_ERROR' || status === 'CLOSED') {
          retryCount.current += 1;
          
          if (retryCount.current < maxRetries) {
            console.warn(`Realtime subscription attempt ${retryCount.current} failed, will retry`);
          } else {
            console.error(`Failed to establish realtime connection after ${maxRetries} attempts`);
          }
        }
      });

      return projectChannel;
    } catch (error) {
      console.error('Error setting up realtime subscription:', error);
      retryCount.current += 1;
      return null;
    }
  }, [userId, setProjects]);

  return { subscribeToProjects };
};
