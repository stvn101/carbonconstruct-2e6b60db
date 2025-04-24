
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { fetchUserProjects } from '@/services/projectService';
import { isOffline, addNetworkListeners } from '@/utils/errorHandling';
import { trackMetric } from '../performance/metrics';
import { handleFetchError } from '@/utils/errorHandling';

const MAX_RETRIES = 3;

export const useProjectsLoader = (
  user: any,
  setProjects: any,
  setIsLoading: any,
  setFetchError: any,
  retryCount: number,
  setRetryCount: any
) => {
  const loadProjects = useCallback(async () => {
    if (!user) {
      setProjects([]);
      setIsLoading(false);
      return;
    }
    
    if (isOffline()) {
      setFetchError(new Error('You are currently offline'));
      toast.error("You're offline. Project data will load when you reconnect.", {
        id: "projects-offline",
        duration: 5000,
      });
      setIsLoading(false);
      return;
    }
    
    const startTime = performance.now();
    setIsLoading(true);
    try {
      const projectData = await fetchUserProjects(user.id);
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
      
      if (retryCount === 0) {
        toast.error("Failed to load your projects. Retrying...", {
          duration: 3000,
          id: "projects-load-error"
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, retryCount, setProjects, setIsLoading, setFetchError]);

  useEffect(() => {
    const cleanup = addNetworkListeners(
      () => {
        if (setFetchError) {
          setRetryCount(MAX_RETRIES);
          toast.error("You're offline. Some features may be limited until connection is restored.", {
            id: "offline-status",
            duration: 0
          });
        }
      },
      () => {
        toast.dismiss("offline-status");
        toast.success("You're back online!", { 
          id: "online-status",
          duration: 3000
        });
        
        if (setFetchError) {
          setRetryCount(0);
          loadProjects();
        }
      }
    );
    
    return cleanup;
  }, [setFetchError, loadProjects, setRetryCount]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (setFetchError && retryCount < MAX_RETRIES) {
      const backoffDelay = Math.min(2000 * Math.pow(2, retryCount), 10000);
      
      timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        loadProjects();
      }, backoffDelay);
      
      return () => {
        if (timer) clearTimeout(timer);
      };
    }
    
    if (setFetchError && retryCount >= MAX_RETRIES) {
      toast.error("Unable to load projects. Please check your connection or try again later.", {
        duration: 5000,
        id: "projects-load-failed"
      });
    }
    
    return undefined;
  }, [setFetchError, retryCount, loadProjects, setRetryCount]);

  return loadProjects;
};

