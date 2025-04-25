import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { ProjectContextType } from '@/types/project';
import { useProjectProvider } from './project/useProjectProvider';
import { useProjectsLoader } from './project/useProjectsLoader';
import { useProjectRealtime } from './project/useProjectRealtime';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ErrorTrackingService from '@/services/error/errorTrackingService';
import { 
  checkSupabaseConnectionWithRetry 
} from '@/services/supabase/connection';
import { 
  showErrorToast,
  showSuccessToast 
} from '@/utils/errorHandling/networkStatusHelper';

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
  const [initializationAttempts, setInitializationAttempts] = useState(0);
  
  const { subscribeToProjects } = useProjectRealtime(user?.id, setProjects);

  const { loadProjects } = useProjectsLoader(
    user,
    setProjects,
    setIsLoading,
    setFetchError,
    retryCount,
    setRetryCount
  );

  const initializeData = useCallback(async () => {
    if (!user || hasInitialized) return;
    
    try {
      setIsLoading(true);
      setInitializationAttempts(prev => prev + 1);
      
      const canConnect = await checkSupabaseConnectionWithRetry(1, 3000);
      
      if (!canConnect) {
        if (initializationAttempts > 0) {
          showErrorToast(
            "Unable to connect to the server. Using offline mode.", 
            "offline-mode-notification",
            { duration: 8000 }
          );
        }
        
        setIsLoading(false);
        return;
      }

      await loadProjects();
      
      try {
        const channel = subscribeToProjects();
        if (channel) {
          setProjectChannel(channel);
        }
      } catch (subscribeError) {
        console.warn("Failed to set up realtime subscription:", subscribeError);
      }
      
      setHasInitialized(true);
      
      if (initializationAttempts > 1) {
        showSuccessToast(
          "Connection restored! Your data is now up-to-date.", 
          "connection-restored-success"
        );
      }
    } catch (error) {
      console.error("Error initializing project data:", error);
      ErrorTrackingService.captureException(
        error instanceof Error ? error : new Error(String(error)),
        { component: 'ProjectProvider', action: 'initialize', attempt: initializationAttempts }
      );
      setIsLoading(false);
      
      if (initializationAttempts > 1) {
        showErrorToast(
          "Unable to load project data. Please try again later.", 
          "project-init-error",
          { duration: 8000 }
        );
      }
    }
  }, [user, hasInitialized, loadProjects, subscribeToProjects, initializationAttempts, setIsLoading, setRetryCount]);

  useEffect(() => {
    let isMounted = true;
    
    const startInitialization = () => {
      if (isMounted && user && !hasInitialized) {
        initializeData();
      } else if (isMounted && !user) {
        setProjects([]);
        setIsLoading(false);
        setHasInitialized(false);
        setInitializationAttempts(0);
      }
    };
    
    const initTimer = setTimeout(startInitialization, 800);

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
  }, [user, initializeData, hasInitialized, loadProjects, subscribeToProjects, setProjects, setIsLoading, setRetryCount]);

  useEffect(() => {
    if (!user || hasInitialized || initializationAttempts === 0) {
      return;
    }
    
    const interval = initializationAttempts === 1 ? 10000 :
                     initializationAttempts === 2 ? 30000 :
                     initializationAttempts === 3 ? 60000 : 120000;
    
    const timer = setTimeout(() => {
      initializeData();
    }, interval);
    
    return () => clearTimeout(timer);
  }, [user, hasInitialized, initializationAttempts, initializeData]);

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};
