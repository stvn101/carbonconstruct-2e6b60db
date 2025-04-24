
import { supabase } from '@/integrations/supabase/client';
import { SavedProject } from '@/types/project';
import { toast } from 'sonner';
import { Dispatch, SetStateAction } from 'react';

export const useProjectRealtime = (
  userId: string | undefined,
  setProjects: Dispatch<SetStateAction<SavedProject[]>>
) => {
  const subscribeToProjects = () => {
    if (!userId) return null;

    const projectChannel = supabase
      .channel('project_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Received real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setProjects((prev) => {
              const newProject = payload.new as SavedProject;
              if (prev.some(p => p.id === newProject.id)) {
                return prev;
              }
              return [...prev, newProject];
            });
            setTimeout(() => toast.success('New project created'), 0);
          } 
          else if (payload.eventType === 'UPDATE') {
            setProjects((prev) => {
              const updatedProject = payload.new as SavedProject;
              return prev.map(p => p.id === updatedProject.id ? updatedProject : p);
            });
            setTimeout(() => toast.success('Project updated'), 0);
          }
          else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            setProjects((prev) => prev.filter(p => p.id !== deletedId));
            setTimeout(() => toast.success('Project deleted'), 0);
          }
        }
      )
      .subscribe();

    return projectChannel;
  };

  return { subscribeToProjects };
};
