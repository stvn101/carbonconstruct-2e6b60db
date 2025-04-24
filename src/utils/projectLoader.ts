
import { toast } from 'sonner';
import { fetchUserProjects } from '@/services/projectService';
import { isOffline, handleFetchError } from '@/utils/errorHandling';
import { trackMetric } from '@/contexts/performance/metrics';
import { SavedProject } from '@/types/project';

export const loadProjects = async (
  userId: string | undefined,
  setProjects: (projects: SavedProject[]) => void,
  setFetchError: (error: Error | null) => void,
) => {
  if (!userId) {
    setProjects([]);
    return;
  }
  
  if (isOffline()) {
    setFetchError(new Error('You are currently offline'));
    toast.error("You're offline. Project data will load when you reconnect.", {
      id: "projects-offline",
      duration: 5000,
    });
    return;
  }
  
  const startTime = performance.now();
  
  try {
    const projectData = await fetchUserProjects(userId);
    setProjects(projectData);
    setFetchError(null);
    
    toast.dismiss("projects-load-error");
    toast.dismiss("projects-offline");
    toast.dismiss("projects-load-failed");
    
    const loadTime = performance.now() - startTime;
    trackMetric({
      metric: 'projects_load_time',
      value: loadTime,
      tags: { count: projectData.length.toString() }
    });
  } catch (error) {
    console.error('Error loading projects:', error);
    const handledError = handleFetchError(error, 'loading-projects');
    setFetchError(handledError);
    throw handledError;
  }
};
