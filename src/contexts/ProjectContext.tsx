
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { ProjectContextType } from '@/types/project';
import { useProjectProvider } from './project/useProjectProvider';
import { useProjectsLoader } from './project/useProjectsLoader';
import { useProjectRealtime } from './project/useProjectRealtime';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ErrorTrackingService from '@/services/error/errorTrackingService';
import { checkSupabaseConnectionWithRetry } from '@/services/supabase/connection';

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

  const [hasInitialized, setHasInitialized] = useState(false);
  const [projectChannel, setProjectChannel] = useState<any | null>(null);
  
  const { subscribeToProjects } = useProjectRealtime(user?.id, setProjects);

  // Here's the fix: useProjectsLoader returns an object with loadProjects function and isRetrying boolean
  const { loadProjects } = useProjectsLoader(
    user,
    setProjects,
    setIsLoading,
    setFetchError,
    retryCount,
    setRetryCount
  );

  // Check connection and initialize data
  useEffect(() => {
    let isMounted = true;
    
    const initializeData = async () => {
      if (!user || hasInitialized) return;
      
      try {
        // First verify we can connect before attempting to load or subscribe
        const canConnect = await checkSupabaseConnectionWithRetry(2, 1000);
        
        if (!isMounted) return;
        
        if (!canConnect) {
          toast.error("Unable to connect to the server. Using offline mode.", {
            id: "offline-mode-notification",
            duration: 5000
          });
          setIsLoading(false);
          return;
        }

        // Now correctly calling the loadProjects function
        loadProjects();
        
        // Only set up realtime if we have a connection
        const channel = subscribeToProjects();
        if (channel) {
          setProjectChannel(channel);
        }
        
        setHasInitialized(true);
      } catch (error) {
        console.error("Error initializing project data:", error);
        ErrorTrackingService.captureException(
          error instanceof Error ? error : new Error(String(error)),
          { component: 'ProjectProvider', action: 'initialize' }
        );
        setIsLoading(false);
      }
    };
    
    if (user) {
      initializeData();
    } else {
      setProjects([]);
      setIsLoading(false);
      setHasInitialized(false);
    }

    return () => {
      isMounted = false;
      if (projectChannel) {
        supabase.removeChannel(projectChannel);
      }
    };
  }, [user, loadProjects, subscribeToProjects, setProjects, setIsLoading, hasInitialized]);

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};
