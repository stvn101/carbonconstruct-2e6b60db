
import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { loadProjects } from '@/utils/projectLoader';
import { useRetry } from '@/hooks/useRetry';
import { useNetworkEffect } from '@/hooks/useNetworkEffect';
import { SavedProject } from '@/types/project';
import { clearErrorToasts } from '@/utils/errorHandling';

// Maximum number of retry attempts
const MAX_RETRIES = 3;

export const useProjectsLoader = (
  user: any,
  setProjects: (projects: SavedProject[]) => void,
  setIsLoading: (loading: boolean) => void,
  setFetchError: (error: Error | null) => void,
  retryCount: number,
  setRetryCount: (count: number) => void
) => {
  // Track mounted state to prevent memory leaks
  const isMountedRef = useRef(true);
  const initialLoadAttemptedRef = useRef(false);
  const activeRequestRef = useRef(false);
  
  // Clear stale errors on component mount
  useEffect(() => {
    const toastIds = ["projects-load-error", "projects-load-failed", "projects-offline"];
    clearErrorToasts(toastIds);
    
    return () => {
      // Mark component as unmounted
      isMountedRef.current = false;
      // Clear toasts when component unmounts to prevent stuck messages
      clearErrorToasts(toastIds);
    };
  }, []);
  
  const loadProjectsCallback = useCallback(async () => {
    // Skip if component is unmounted or if a request is already in progress
    if (!isMountedRef.current || activeRequestRef.current) return;
    
    if (!user) {
      setProjects([]);
      setIsLoading(false);
      setFetchError(null); // Clear any previous error state
      return;
    }

    // Mark that we've attempted to load at least once
    initialLoadAttemptedRef.current = true;
    
    // Prevent concurrent requests
    activeRequestRef.current = true;
    setIsLoading(true);
    
    try {
      await loadProjects(user.id, setProjects, setFetchError);
      
      // Only show retry toast for retry attempts, not the initial load
      if (retryCount > 0) {
        toast.error("Retrying connection... Please wait.", {
          duration: 3000,
          id: "projects-load-retry"
        });
      }
      
      // Clear fetch error if successful
      if (isMountedRef.current) {
        setFetchError(null);
      }
    } catch (error) {
      // Error is already handled in loadProjects
      console.error('Project loading failed:', error);
    } finally {
      // Only update state if still mounted
      if (isMountedRef.current) {
        setIsLoading(false);
        activeRequestRef.current = false;
      }
    }
  }, [user, retryCount, setProjects, setIsLoading, setFetchError]);

  // Use the retry mechanism with improved options
  const { isRetrying } = useRetry({
    callback: loadProjectsCallback,
    maxRetries: MAX_RETRIES,
    onMaxRetriesReached: () => {
      // Skip if component is unmounted
      if (!isMountedRef.current) return;
      
      // Dismiss any retry toasts first
      toast.dismiss("projects-load-retry");
      
      // Show final error only if we've tried multiple times
      if (retryCount > 0) {
        toast.error("Unable to load projects. Please check your connection or try again later.", {
          duration: 8000,
          id: "projects-load-failed"
        });
      }
      
      // Set error state for UI to show appropriate message
      setFetchError(new Error("Failed to load projects after multiple attempts"));
    },
    retryCount,
    setRetryCount
  });

  // Handle network status changes
  useNetworkEffect(
    // When going offline
    () => {
      // Skip if component is unmounted
      if (!isMountedRef.current) return;
      
      // Don't reset retry count when going offline - we'll retry when back online
      setFetchError(new Error("You are currently offline"));
    },
    // When coming back online
    () => {
      // Skip if component is unmounted
      if (!isMountedRef.current) return;
      
      // Only attempt to reload if we've already tried loading at least once
      if (initialLoadAttemptedRef.current) {
        // Reset retry count and immediately attempt to load
        setRetryCount(0);
        setFetchError(null);
        activeRequestRef.current = false; // Clear any stuck active request flag
        loadProjectsCallback();
      }
    }
  );

  return {
    loadProjects: loadProjectsCallback,
    isRetrying
  };
};
