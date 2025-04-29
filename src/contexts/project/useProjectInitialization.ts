
import { useState, useCallback, useEffect } from 'react';
import { checkSupabaseConnectionWithRetry } from '@/services/supabase/connection';
import { isOffline, showErrorToast, showSuccessToast } from '@/utils/errorHandling';
import ErrorTrackingService from '@/services/error/errorTrackingService';
import { User } from '@supabase/supabase-js';
import { Dispatch, SetStateAction } from 'react';
import { SavedProject } from '@/types/project';

type UseProjectInitializationProps = {
  user: User | null;
  setProjects: Dispatch<SetStateAction<SavedProject[]>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setFetchError: Dispatch<SetStateAction<Error | null>>;
  subscribeToProjects: () => any;
  initializeData: () => Promise<void>;
};

export const useProjectInitialization = ({
  user,
  setProjects,
  setIsLoading,
  setFetchError,
  subscribeToProjects,
  initializeData
}: UseProjectInitializationProps) => {
  const [hasInitialized, setHasInitialized] = useState(false);
  const [projectChannel, setProjectChannel] = useState<any | null>(null);
  const [initializationAttempts, setInitializationAttempts] = useState(0);
  const [connectionRetries, setConnectionRetries] = useState(0);

  // Effect for initial load and handling user changes
  useEffect(() => {
    let isMounted = true;
    
    const startInitialization = () => {
      if (isMounted && user && !hasInitialized) {
        startDataInitialization();
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
          const supabase = require('@/integrations/supabase/client').supabase;
          supabase.removeChannel(projectChannel);
        } catch (err) {
          console.error("Error removing channel on unmount:", err);
        }
      }
    };
  }, [user, hasInitialized, setProjects, setIsLoading]);

  // Helper function to start initialization process
  const startDataInitialization = useCallback(async () => {
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

      // Set up realtime subscription
      try {
        const channel = subscribeToProjects();
        if (channel) {
          setProjectChannel(channel);
        }
      } catch (subscribeError) {
        console.warn("Failed to set up realtime subscription:", subscribeError);
        // Non-critical error, continue without realtime updates
      }
      
      // Initialize data
      await initializeData();
      
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
        { component: 'ProjectInitialization', action: 'initialize', attempt: initializationAttempts }
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
    initializeData, 
    initializationAttempts, 
    setIsLoading
  ]);

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
        startDataInitialization();
      }
    }, interval);
    
    return () => clearTimeout(timer);
  }, [user, hasInitialized, connectionRetries, startDataInitialization]);

  // Listen for online status changes to trigger reconnection
  useEffect(() => {
    const handleOnline = () => {
      if (user && !hasInitialized) {
        // Reset connection retries when network comes back
        setConnectionRetries(0);
        // Small delay to let connection stabilize
        setTimeout(() => {
          startDataInitialization();
        }, 2000);
      }
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [user, hasInitialized, startDataInitialization]);

  return {
    hasInitialized,
    startDataInitialization,
    projectChannel
  };
};
