
import { useCallback } from 'react';
import { toast } from 'sonner';
import { loadProjects } from '@/utils/projectLoader';
import { useRetry } from '@/hooks/useRetry';
import { useNetworkEffect } from '@/hooks/useNetworkEffect';
import { SavedProject } from '@/types/project';

const MAX_RETRIES = 3;

export const useProjectsLoader = (
  user: any,
  setProjects: (projects: SavedProject[]) => void,
  setIsLoading: (loading: boolean) => void,
  setFetchError: (error: Error | null) => void,
  retryCount: number,
  setRetryCount: (count: number) => void
) => {
  const loadProjectsCallback = useCallback(async () => {
    if (!user) {
      setProjects([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      await loadProjects(user.id, setProjects, setFetchError);
      if (retryCount > 0) {
        toast.error("Failed to load your projects. Retrying...", {
          duration: 3000,
          id: "projects-load-error"
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, retryCount, setProjects, setIsLoading, setFetchError]);

  useRetry({
    callback: loadProjectsCallback,
    maxRetries: MAX_RETRIES,
    onMaxRetriesReached: () => {
      toast.error("Unable to load projects. Please check your connection or try again later.", {
        duration: 5000,
        id: "projects-load-failed"
      });
    },
    retryCount,
    setRetryCount
  });

  useNetworkEffect(
    () => {
      setRetryCount(MAX_RETRIES);
    },
    () => {
      setRetryCount(0);
      loadProjectsCallback();
    }
  );

  return loadProjectsCallback;
};
