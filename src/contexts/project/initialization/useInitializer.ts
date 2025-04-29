
import { useState, useCallback, useRef } from 'react';
import { checkSupabaseConnectionWithRetry } from '@/services/supabase/connection';
import { isOffline, showErrorToast, showSuccessToast } from '@/utils/errorHandling';
import ErrorTrackingService from '@/services/error/errorTrackingService';
import { User } from '@supabase/supabase-js';

/**
 * Hook to handle data initialization process
 */
export const useInitializer = (
  user: User | null,
  setIsLoading: (loading: boolean) => void,
  initializeData: () => Promise<void>,
  subscribeToProjects: () => any,
  connectionRetries: number,
  initializationAttempts: number, 
  incrementAttempts: () => void,
  resetConnectionRetries: () => void,
  incrementRetries: () => void,
  setProjectChannel: (channel: any | null) => void
) => {
  const [hasInitialized, setHasInitialized] = useState(false);
  
  // Helper function to start initialization process
  const startDataInitialization = useCallback(async () => {
    if (!user || hasInitialized) return;
    
    try {
      setIsLoading(true);
      incrementAttempts();
      
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
          incrementRetries();
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
      resetConnectionRetries();
      
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
      incrementRetries();
    }
  }, [
    user, 
    hasInitialized, 
    subscribeToProjects, 
    initializeData, 
    initializationAttempts, 
    incrementAttempts,
    resetConnectionRetries,
    incrementRetries,
    setIsLoading,
    setProjectChannel
  ]);

  return {
    hasInitialized,
    setHasInitialized,
    startDataInitialization
  };
};
