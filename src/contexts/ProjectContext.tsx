
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { ProjectContextType } from '@/types/project';
import { useProjectProvider } from './project/useProjectProvider';
import { ProjectsProvider } from './project/useProjectsLoader';
import { useProjectRealtime } from './project/useProjectRealtime';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ErrorTrackingService from '@/services/error/errorTrackingService';
import { 
  checkSupabaseConnectionWithRetry 
} from '@/services/supabase/connection';
import { 
  showErrorToast,
  showSuccessToast,
  isOffline
} from '@/utils/errorHandling';

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
  const [connectionRetries, setConnectionRetries] = useState(0);
  
  const { subscribeToProjects } = useProjectRealtime(user?.id, setProjects);

  // Get the Provider component from ProjectsProvider
  const { Provider } = ProjectsProvider({ children });
  
  const initializeData = useCallback(async () => {
    if (!user || hasInitialized) return;
    
    try {
      setIsLoading(true);
      setInitializationAttempts(prev => prev + 1);
      
      // Check if we're offline first
      if (isOffline()) {
        showErrorToast(
          "You're offline. Project data will load when you reconnect.", 
          "project-offline-mode",
          { persistent: true }
        );
        setIsLoading(false);
        return;
      }
      
      // Improved connection check with longer timeout for initial load
      const canConnect = await checkSupabaseConnectionWithRetry(
        Math.min(initializationAttempts + 1, 3), // More retries on subsequent attempts
        8000 // Longer timeout for connection check
      );
      
      if (!canConnect) {
        // First attempt should not show an error toast, but subsequent ones should
        if (initializationAttempts > 0) {
          showErrorToast(
            "Unable to connect to the server. Using offline mode.", 
            "offline-mode-notification",
            { duration: 10000 }
          );
          
          // Schedule a retry with backoff
          setConnectionRetries(prev => prev + 1);
        }
        
        setIsLoading(false);
        return;
      }

      // Load the projects with better error handling
      // First attempt to correctly use the Provider component returned from ProjectsProvider
      // Here we're trying to establish realtime connection as well
      try {
        const channel = subscribeToProjects();
        if (channel) {
          setProjectChannel(channel);
        }
      } catch (subscribeError) {
        console.warn("Failed to set up realtime subscription:", subscribeError);
        // Non-critical error, continue without realtime updates
      }
      
      // Mark as initialized and reset connection retries
      setHasInitialized(true);
      setConnectionRetries(0);
      
      // Show a success message if we previously had connection issues
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
      
      // Only show error message after multiple attempts
      if (initializationAttempts > 1) {
        showErrorToast(
          "Unable to load project data. Please try again later.", 
          "project-init-error",
          { duration: 8000 }
        );
      }
      
      // Schedule a retry with backoff
      setConnectionRetries(prev => prev + 1);
    }
  }, [
    user, 
    hasInitialized, 
    subscribeToProjects, 
    initializationAttempts, 
    setIsLoading
  ]);

  // Effect for initial load and handling user changes
  useEffect(() => {
    let isMounted = true;
    
    const startInitialization = () => {
      if (isMounted && user && !hasInitialized) {
        initializeData();
      } else if (isMounted && !user) {
        // Reset state when user logs out
        setProjects([]);
        setIsLoading(false);
        setHasInitialized(false);
        setInitializationAttempts(0);
        setConnectionRetries(0);
      }
    };
    
    // Delay initial load slightly to allow auth to settle
    const initTimer = setTimeout(startInitialization, 1000);

    return () => {
      isMounted = false;
      clearTimeout(initTimer);
      
      // Clean up subscription on unmount
      if (projectChannel) {
        try {
          supabase.removeChannel(projectChannel);
        } catch (err) {
          console.error("Error removing channel on unmount:", err);
        }
      }
    };
  }, [user, initializeData, hasInitialized, setProjects, setIsLoading]);

  // Effect for connection retries with exponential backoff
  useEffect(() => {
    if (!user || hasInitialized || connectionRetries === 0) {
      return;
    }
    
    // Use exponential backoff for retries with longer intervals
    // First retry: 15s, second: 45s, third: 90s, subsequent: 3min
    const getRetryInterval = () => {
      if (connectionRetries === 1) return 15000;
      if (connectionRetries === 2) return 45000;
      if (connectionRetries === 3) return 90000;
      return 180000; // 3 minutes for subsequent retries
    };
    
    const interval = getRetryInterval();
    console.log(`Scheduling retry attempt in ${interval/1000}s (retry #${connectionRetries})`);
    
    const timer = setTimeout(() => {
      if (!hasInitialized) {
        initializeData();
      }
    }, interval);
    
    return () => clearTimeout(timer);
  }, [user, hasInitialized, connectionRetries, initializeData]);

  // Listen for online status changes to trigger reconnection
  useEffect(() => {
    const handleOnline = () => {
      if (user && !hasInitialized) {
        // Reset connection retries when network comes back
        setConnectionRetries(0);
        // Small delay to let connection stabilize
        setTimeout(() => {
          initializeData();
        }, 2000);
      }
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [user, hasInitialized, initializeData]);

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};
