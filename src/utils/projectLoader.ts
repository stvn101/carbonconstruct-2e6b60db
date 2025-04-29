import { toast } from 'sonner';
import { fetchUserProjects } from '@/services/projectService';
import { 
  isOffline, 
  showErrorToast, 
  clearErrorToasts,
  retryWithBackoff 
} from '@/utils/errorHandling';
import { trackMetric } from '@/contexts/performance/metrics';
import { SavedProject } from '@/types/project';
import { checkSupabaseConnectionWithRetry } from '@/services/supabase/connection';
import { Dispatch, SetStateAction } from 'react';

/**
 * Loads projects with optimized pagination, retries, and improved connection handling
 */
export const loadProjects = async (
  userId: string,
  setProjects: Dispatch<SetStateAction<SavedProject[]>>,
  setFetchError: Dispatch<SetStateAction<Error | null>>,
  page: number = 0,
  limit: number = 50 // Default to a reasonable batch size
): Promise<SavedProject[]> => {
  // Clear any stale error toasts first
  clearErrorToasts([
    "projects-load-error", 
    "projects-load-failed", 
    "projects-offline"
  ]);
  
  if (isOffline()) {
    const error = new Error('You are currently offline');
    setFetchError(error);
    showErrorToast(
      "You're offline. Project data will load when you reconnect.", 
      "projects-offline", 
      { persistent: true }
    );
    return [];
  }
  
  // Check database connection before attempting to load with improved reliability
  const canConnect = await checkSupabaseConnectionWithRetry(2, 10000);
  if (!canConnect) {
    const error = new Error("Unable to connect to the database");
    setFetchError(error);
    showErrorToast(
      "Unable to connect to the server. Using offline mode.", 
      "projects-db-offline", 
      { duration: 10000 }
    );
    return [];
  }
  
  const startTime = performance.now();
  
  try {
    // Use the retryWithBackoff utility with more conservative settings
    const projectData = await retryWithBackoff(
      () => fetchUserProjects(userId, page, limit),
      2, // Max retries (reduced from 3 to 2)
      5000, // Initial delay (increased from 2000ms to 5000ms)
      {
        onRetry: (attempt) => {
          console.info(`Retrying project fetch (${attempt}/2)...`);
        },
        shouldRetry: (error) => {
          // Only retry network/timeout errors, not permission or other errors
          // and don't retry if we're now offline
          return (
            !isOffline() && 
            (error instanceof TypeError || 
             (error instanceof Error && 
              (error.message.includes('timeout') || 
               error.message.includes('network') ||
               error.message.includes('connection'))))
          );
        },
        maxDelay: 30000, // Cap delay at 30 seconds
        factor: 1.5     // Use a more conservative growth factor
      }
    );
    
    // Check for undefined or null before setting
    if (projectData) {
      setProjects(projectData);
      setFetchError(null);
      
      // Clear any error toasts on success
      clearErrorToasts([
        "projects-load-error", 
        "projects-offline", 
        "projects-load-failed",
        "projects-db-offline"
      ]);
      
      const loadTime = performance.now() - startTime;
      trackMetric({
        metric: 'projects_load_time',
        value: loadTime,
        tags: { count: projectData.length.toString() }
      });
      
      return projectData;
    } else {
      // Handle empty response gracefully
      setProjects([]);
      setFetchError(null);
      console.warn('No project data returned, but no error occurred');
      return [];
    }
  } catch (error) {
    console.error('Error loading projects:', error);
    
    // Set appropriate error for user display
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to load projects';
    
    setFetchError(new Error(errorMessage));
    
    // Show a helpful error toast if it's not just a network issue
    if (!isOffline()) {
      showErrorToast(
        "Unable to load your projects. Please try again later.", 
        "projects-load-error", 
        { duration: 8000 }
      );
    }
    
    return [];
  }
};
