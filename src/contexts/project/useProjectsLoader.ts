import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { loadProjects } from '@/utils/projectLoader';
import { useRetry } from '@/hooks/useRetry';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { SavedProject } from '@/types/project';
import { 
  clearErrorToasts, 
  showErrorToast,
  showSuccessToast
} from '@/utils/errorHandling';
import { checkSupabaseConnectionWithRetry } from '@/services/supabase/connection';

// Number of retry attempts for project loading
const MAX_RETRIES = 2; // Reduced from 3 to 2

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
  const { isOnline } = useNetworkStatus();
  
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
  
  /**
   * Enhanced load projects function with connection checks and better error handling
   */
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
    
    // Check if we're online first
    if (!isOnline) {
      if (isMountedRef.current) {
        setFetchError(new Error("You are currently offline"));
        setIsLoading(false);
        activeRequestRef.current = false;
        
        // Show offline toast
        showErrorToast(
          "You're offline. Project data will load when you reconnect.", 
          "projects-offline", 
          { persistent: true }
        );
      }
      return;
    }
    
    // Check database connection before attempting to load
    const canConnect = await checkSupabaseConnectionWithRetry(1);
    if (!canConnect) {
      if (isMountedRef.current) {
        setFetchError(new Error("Unable to connect to the database"));
        setIsLoading(false);
        activeRequestRef.current = false;
        
        // Only show toast for non-initial loads to prevent duplicate messages
        if (retryCount > 0) {
          showErrorToast(
            "Unable to connect to the server. Using offline mode.", 
            "projects-db-offline", 
            { duration: 8000 }
          );
        }
      }
      return;
    }
    
    try {
      await loadProjects(user.id, setProjects, setFetchError);
      
      // Only show retry toast for retry attempts, not the initial load
      if (retryCount > 0) {
        showErrorToast(
          "Retrying connection... Please wait.", 
          "projects-load-retry", 
          { duration: 3000 }
        );
      }
      
      // Clear fetch error if successful
      if (isMountedRef.current) {
        setFetchError(null);
        
        // Show success toast only on recovery from error state
        if (retryCount > 0) {
          showSuccessToast("Projects loaded successfully!", "projects-load-success");
        }
      }
    } catch (error) {
      // Error is already handled in loadProjects
      console.error('Project loading failed:', error);
      
      // Additional error handling can go here if needed
    } finally {
      // Only update state if still mounted
      if (isMountedRef.current) {
        setIsLoading(false);
        activeRequestRef.current = false;
      }
    }
  }, [user, retryCount, isOnline, setProjects, setIsLoading, setFetchError]);

  // Use the retry mechanism with improved options
  const retryResult = useRetry({
    callback: loadProjectsCallback,
    maxRetries: MAX_RETRIES,
    onMaxRetriesReached: () => {
      // Skip if component is unmounted
      if (!isMountedRef.current) return;
      
      // Dismiss any retry toasts first
      toast.dismiss("projects-load-retry");
      
      // Don't show the failure toast if we're offline - that's expected
      if (isOnline && retryCount > 0) {
        showErrorToast(
          "Unable to load projects. Please check your connection or try again later.", 
          "projects-load-failed", 
          { duration: 8000 }
        );
      }
      
      // Set error state for UI to show appropriate message
      setFetchError(new Error("Failed to load projects after multiple attempts"));
    },
    retryCount,
    setRetryCount
  });

  const { isRetrying } = retryResult;

  // Handle network status changes
  useNetworkStatus();
  
  // Effect for handling online/offline status changes
  useEffect(() => {
    if (!isMountedRef.current) return;
    
    // When going offline
    if (!isOnline) {
      setFetchError(new Error("You are currently offline"));
      
      // Don't reset retry count when going offline - we'll retry when back online
      showErrorToast(
        "You're offline. Project data will load when you reconnect.", 
        "projects-offline", 
        { persistent: true }
      );
    } 
    // When coming back online
    else if (initialLoadAttemptedRef.current) {
      // Clear offline error toast
      toast.dismiss("projects-offline");
      
      // Reset retry count and immediately attempt to load
      setRetryCount(0);
      setFetchError(null);
      activeRequestRef.current = false; // Clear any stuck active request flag
      
      // Small delay before reloading to let network stabilize
      setTimeout(() => {
        if (isMountedRef.current) {
          loadProjectsCallback();
        }
      }, 1000);
    }
  }, [isOnline, loadProjectsCallback, setRetryCount, setFetchError]);

  return {
    loadProjects: loadProjectsCallback,
    isRetrying
  };
};

export const fetchProjectsWithErrorHandling = async (supabase: any, showToasts: boolean = true): Promise<any[]> => {
  try {
    return await supabase.from('projects').select('*');
  } catch (error) {
    const customError = error as Error;
    console.error('Failed to fetch projects:', customError);
    throw customError;
  }
};
