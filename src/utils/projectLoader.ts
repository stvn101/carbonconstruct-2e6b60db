
import { toast } from 'sonner';
import { fetchUserProjects } from '@/services/projectService';
import { isOffline, clearErrorToasts } from '@/utils/errorHandling';
import { trackMetric } from '@/contexts/performance/metrics';
import { SavedProject } from '@/types/project';
import { retryWithBackoff } from '@/utils/errorHandling/timeoutHelper';

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
    return;
  }
  
  // Clear any stale error toasts first
  clearErrorToasts([
    "projects-load-error", 
    "projects-load-failed", 
    "projects-offline"
  ]);
  
  if (isOffline()) {
    setFetchError(new Error('You are currently offline'));
    toast.error("You're offline. Project data will load when you reconnect.", {
      id: "projects-offline",
      duration: 0, // Keep showing until back online
    });
    return;
  }
  
  const startTime = performance.now();
  
  try {
    // Use the retryWithBackoff utility for better reliability
    const projectData = await retryWithBackoff(
      () => fetchUserProjects(userId, page, limit),
      2, // Max retries
      1000, // Initial delay
      {
        onRetry: (attempt) => {
          console.info(`Retrying project fetch (${attempt}/2)...`);
        },
        shouldRetry: (error) => {
          // Only retry network/timeout errors, not permission or other errors
          return error instanceof TypeError || 
                (error instanceof Error && error.message.includes('timeout'));
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
        "projects-load-failed"
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
      toast.error("Unable to load your projects. Please try again later.", {
        id: "projects-load-error",
        duration: 5000
      });
      
      throw error;
    }
    
    return [];
  }
};
