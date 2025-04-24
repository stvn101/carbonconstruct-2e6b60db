
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { loadProjects } from '@/utils/projectLoader';
import { useRetry } from '@/hooks/useRetry';
import { useNetworkEffect } from '@/hooks/useNetworkEffect';
import { SavedProject } from '@/types/project';
import { clearErrorToasts } from '@/utils/errorHandling';

// Reduced max retries to prevent too many attempts
const MAX_RETRIES = 2;

export const useProjectsLoader = (
  user: any,
  setProjects: (projects: SavedProject[]) => void,
  setIsLoading: (loading: boolean) => void,
  setFetchError: (error: Error | null) => void,
  retryCount: number,
  setRetryCount: (count: number) => void
) => {
  // Clear stale errors on component mount
  useEffect(() => {
    clearErrorToasts(["projects-load-error", "projects-load-failed", "projects-offline"]);
    
    return () => {
      // Clear toasts when component unmounts to prevent stuck messages
      clearErrorToasts(["projects-load-error", "projects-load-failed", "projects-offline"]);
    };
  }, []);
  
  const loadProjectsCallback = useCallback(async () => {
    if (!user) {
      setProjects([]);
      setIsLoading(false);
      setFetchError(null); // Clear any previous error state
      return;
    }

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
    } catch (error) {
      // Error is already handled in loadProjects
      console.error('Project loading failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, retryCount, setProjects, setIsLoading, setFetchError]);

  // Use the retry mechanism with improved options
  const { isRetrying } = useRetry({
    callback: loadProjectsCallback,
    maxRetries: MAX_RETRIES,
    onMaxRetriesReached: () => {
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
      // Don't reset retry count when going offline - we'll retry when back online
      setFetchError(new Error("You are currently offline"));
    },
    // When coming back online
    () => {
      // Reset retry count and immediately attempt to load
      setRetryCount(0);
      setFetchError(null);
      loadProjectsCallback();
    }
  );

  return {
    loadProjects: loadProjectsCallback,
    isRetrying
  };
};
