
import { supabase } from '@/integrations/supabase/client';
import { SavedProject } from '@/types/project';
import { toast } from 'sonner';
import { RealtimeChannel } from '@supabase/supabase-js';

export const useProjectRealtime = (
  userId: string | undefined,
  setProjects: (projects: SavedProject[]) => void
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
            const newProject = payload.new as SavedProject;
            setProjects(prev => {
              if (prev.some(p => p.id === newProject.id)) {
                return prev;
              }
              return [...prev, newProject];
            });
            setTimeout(() => toast.success('New project created'), 0);
          } 
          else if (payload.eventType === 'UPDATE') {
            const updatedProject = payload.new as SavedProject;
            setProjects(prev => 
              prev.map(p => p.id === updatedProject.id ? updatedProject : p)
            );
            setTimeout(() => toast.success('Project updated'), 0);
          }
          else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            setProjects(prev => prev.filter(p => p.id !== deletedId));
            setTimeout(() => toast.success('Project deleted'), 0);
          }
        }
      )
      .subscribe();

    return projectChannel;
  };

  return { subscribeToProjects };
};
