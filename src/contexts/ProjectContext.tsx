
import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { ProjectContextType } from '@/types/project';
import { useProjectProvider } from './project/useProjectProvider';
import { useProjectsLoader } from './project/useProjectsLoader';
import { useProjectRealtime } from './project/useProjectRealtime';
import { supabase } from '@/integrations/supabase/client';

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export { type SavedProject } from '@/types/project';

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const {
    contextValue,
    setProjects,
    setIsLoading,
    setFetchError,
    retryCount,
    setRetryCount
  } = useProjectProvider();

  const { subscribeToProjects } = useProjectRealtime(user?.id, setProjects);

  const loadProjects = useProjectsLoader(
    user,
    setProjects,
    setIsLoading,
    setFetchError,
    retryCount,
    setRetryCount
  );

  useEffect(() => {
    let projectChannel;
    
    if (user) {
      loadProjects();
      projectChannel = subscribeToProjects();
    } else {
      setProjects([]);
      setIsLoading(false);
    }

    return () => {
      if (projectChannel) {
        supabase.removeChannel(projectChannel);
      }
    };
  }, [user, loadProjects, subscribeToProjects, setProjects, setIsLoading]);

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};

