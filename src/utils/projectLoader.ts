
import { toast } from 'sonner';
import { fetchUserProjects } from '@/services/projectService';
import { 
  isOffline, 
  showErrorToast, 
  clearErrorToasts 
} from '@/utils/errorHandling/networkStatusHelper';
import { trackMetric } from '@/contexts/performance/metrics';
import { SavedProject } from '@/types/project';
import { retryWithBackoff } from '@/utils/errorHandling/timeoutHelper';
import { checkSupabaseConnectionWithRetry } from '@/services/supabase/connection';

/**
 * Loads projects with optimized pagination and retries
 */
export const loadProjects = async (
  userId: string | undefined,
  setProjects: (projects: SavedProject[]) => void,
  setFetchError: (error: Error | null) => void,
  page: number = 0,
  limit: number = 50 // Default to a reasonable batch size
) => {
  if (!userId) {
    setProjects([]);
    setFetchError(null);
    return [];
  }
  
  // Clear any stale error toasts first
  clearErrorToasts([
    "projects-load-error", 
    "projects-load-failed", 
    "projects-offline"
  ]);
  
  if (isOffline()) {
    setFetchError(new Error('You are currently offline'));
    showErrorToast(
      "You're offline. Project data will load when you reconnect.", 
      "projects-offline", 
      { persistent: true }
    );
    return [];
  }
  
  // Check database connection before attempting to load
  const canConnect = await checkSupabaseConnectionWithRetry(1);
  if (!canConnect) {
    setFetchError(new Error("Unable to connect to the database"));
    showErrorToast(
      "Unable to connect to the server. Using offline mode.", 
      "projects-db-offline", 
      { duration: 8000 }
    );
    return [];
  }
  
  const startTime = performance.now();
  
  try {
    // Use the retryWithBackoff utility with more conservative settings
    const projectData = await retryWithBackoff(
      () => fetchUserProjects(userId, page, limit),
      2, // Max retries (reduced from 3 to 2)
      2000, // Initial delay (increased from 1000ms to 2000ms)
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
              (error.message.includes('timeout') || error.message.includes('network'))))
          );
        }
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
    if (!isOffline() && !(error instanceof TypeError && error.message.includes('fetch'))) {
      showErrorToast(
        "Unable to load your projects. Please try again later.", 
        "projects-load-error", 
        { duration: 5000 }
      );
    }
    
    return [];
  }
};
