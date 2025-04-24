
import { useCallback } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { SavedProject } from '@/types/project';
import { supabase } from '@/integrations/supabase/client';
import { Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';
import { handleFetchError } from '@/utils/errorHandling';

export const useProjectRealtime = (
  userId: string | undefined, 
  setProjects: Dispatch<SetStateAction<SavedProject[]>>
) => {
  const subscribeToProjects = useCallback(() => {
    if (!userId) return null;

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
        if (status !== 'SUBSCRIBED') {
          console.error('Failed to subscribe to project updates:', status);
        }
      });

      return projectChannel;
    } catch (error) {
      handleFetchError(error, 'realtime-subscription');
      return null;
    }
  }, [userId, setProjects]);

  return { subscribeToProjects };
};
