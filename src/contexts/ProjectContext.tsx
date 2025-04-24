
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
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

  // Properly destructure the loadProjects function from the hook
  const { loadProjects } = useProjectsLoader(
    user,
    setProjects,
    setIsLoading,
    setFetchError,
    retryCount,
    setRetryCount
  );

  // Initialize connection check and data loading
  const initializeData = useCallback(async () => {
    if (!user || hasInitialized) return;
    
    try {
      setIsLoading(true);
      
      // First verify we can connect before attempting to load or subscribe
      const canConnect = await checkSupabaseConnectionWithRetry(2, 1500);
      
      if (!canConnect) {
        toast.error("Unable to connect to the server. Using offline mode.", {
          id: "offline-mode-notification",
          duration: 5000
        });
        setIsLoading(false);
        return;
      }

      // Load projects data
      await loadProjects();
      
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
      
      // Show friendly error message to the user
      toast.error("Unable to load project data. Please try again later.", {
        id: "project-init-error",
        duration: 5000
      });
    }
  }, [user, hasInitialized, loadProjects, subscribeToProjects, setProjects, setIsLoading, setRetryCount]);

  // Check connection and initialize data
  useEffect(() => {
    let isMounted = true;
    
    const startInitialization = () => {
      if (isMounted && user && !hasInitialized) {
        initializeData();
      } else if (isMounted && !user) {
        setProjects([]);
        setIsLoading(false);
        setHasInitialized(false);
      }
    };
    
    // Start with a small delay to ensure auth state is stable
    const initTimer = setTimeout(startInitialization, 300);

    return () => {
      isMounted = false;
      clearTimeout(initTimer);
      
      if (projectChannel) {
        try {
          supabase.removeChannel(projectChannel);
        } catch (err) {
          console.error("Error removing channel on unmount:", err);
        }
      }
    };
  }, [user, initializeData, loadProjects, subscribeToProjects, setProjects, setIsLoading, hasInitialized, setRetryCount]);

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};
