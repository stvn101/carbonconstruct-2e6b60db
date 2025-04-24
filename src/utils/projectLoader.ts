
import { toast } from 'sonner';
import { fetchUserProjects } from '@/services/projectService';
import { isOffline, handleFetchError, clearErrorToasts } from '@/utils/errorHandling';
import { trackMetric } from '@/contexts/performance/metrics';
import { SavedProject } from '@/types/project';

export const loadProjects = async (
  userId: string | undefined,
  setProjects: (projects: SavedProject[]) => void,
  setFetchError: (error: Error | null) => void,
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
    const projectData = await fetchUserProjects(userId);
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
    } else {
      // Handle empty response gracefully
      setProjects([]);
      setFetchError(null);
      console.warn('No project data returned, but no error occurred');
    }
  } catch (error) {
    console.error('Error loading projects:', error);
    const handledError = handleFetchError(error, 'loading-projects');
    setFetchError(handledError);
    
    // Don't throw if it's just a network error - it will be handled by the retry mechanism
    if (!isOffline() && !(error instanceof TypeError && error.message.includes('fetch'))) {
      throw handledError;
    }
  }
};
