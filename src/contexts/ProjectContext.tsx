
import React, { createContext, useContext, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/auth';
import { ProjectContextType, SavedProject } from '@/types/project';
import { fetchUserProjects } from '@/services/projectService';
import { toast } from 'sonner';
import { useProjectState } from './project/useProjectState';
import { useProjectOperations } from './project/useProjectOperations';
import { useProjectExports } from './project/useProjectExports';
import { useProjectRealtime } from './project/useProjectRealtime';
import { supabase } from '@/integrations/supabase/client';
import { handleFetchError, isOffline, addNetworkListeners } from '@/utils/errorHandling';
import { trackMetric } from './performance/metrics';

// Define the MAX_RETRIES constant
const MAX_RETRIES = 3;

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export { type SavedProject } from '@/types/project';

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const {
    projects,
    setProjects,
    isLoading,
    setIsLoading,
    fetchError,
    setFetchError,
    retryCount,
    setRetryCount,
  } = useProjectState();

  const projectOperations = useProjectOperations(setProjects);
  const projectExports = useProjectExports();
  const { subscribeToProjects } = useProjectRealtime(user?.id, setProjects);

  const loadProjects = useCallback(async () => {
    if (!user) {
      setProjects([]);
      setIsLoading(false);
      return;
    }
    
    if (isOffline()) {
      setFetchError(new Error('You are currently offline'));
      // Use an ID for the toast to prevent duplicates
      toast.error("You're offline. Project data will load when you reconnect.", {
        id: "projects-offline",
        duration: 5000, // Set a reasonable duration instead of keeping it forever
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
      
      // Dismiss any existing error toasts when we successfully load data
      toast.dismiss("projects-load-error");
      toast.dismiss("projects-offline");
      toast.dismiss("projects-load-failed");
      
      // Track load performance
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
      
      // Only show toast on first error to avoid toast spam
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

  // Network status monitoring
  useEffect(() => {
    const cleanup = addNetworkListeners(
      // Offline callback
      () => {
        // We're offline, no need to retry until we're back online
        if (fetchError) {
          setRetryCount(MAX_RETRIES); // Stop retry attempts while offline
          
          // Show offline toast when we go offline
          toast.error("You're offline. Some features may be limited until connection is restored.", {
            id: "offline-status",
            duration: 0 // Keep showing until back online
          });
        }
      },
      // Online callback
      () => {
        // We're back online, reset retry count and load projects
        toast.dismiss("offline-status"); // Remove offline toast
        toast.success("You're back online!", { 
          id: "online-status",
          duration: 3000
        });
        
        if (fetchError) {
          setRetryCount(0); // Reset retry count
          loadProjects(); // Try loading projects again
        }
      }
    );
    
    return cleanup;
  }, [fetchError, loadProjects, setRetryCount]);

  // Handle retries with exponential backoff
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (fetchError && retryCount < MAX_RETRIES) {
      // Calculate backoff delay - starts at 2s, then 4s, then 8s
      const backoffDelay = Math.min(2000 * Math.pow(2, retryCount), 10000);
      
      timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        loadProjects();
      }, backoffDelay);
      
      return () => {
        if (timer) clearTimeout(timer);
      };
    }
    
    if (fetchError && retryCount >= MAX_RETRIES) {
      toast.error("Unable to load projects. Please check your connection or try again later.", {
        duration: 5000,
        id: "projects-load-failed"
      });
    }
    
    return undefined;
  }, [fetchError, retryCount, loadProjects, setRetryCount]);

  // Initial data loading when user changes
  useEffect(() => {
    let projectChannel;
    
    if (user) {
      loadProjects();
      projectChannel = subscribeToProjects();
    } else {
      setProjects([]);
      setIsLoading(false);
    }

    return () => {
      if (projectChannel) {
        supabase.removeChannel(projectChannel);
      }
    };
  }, [user, loadProjects, subscribeToProjects, setProjects, setIsLoading]);

  const getProject = useCallback((id: string) => {
    return projects.find(p => p.id === id);
  }, [projects]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    projects,
    isLoading,
    saveProject: async (project) => {
      try {
        // Add a small delay to show saving indicator
        await new Promise(resolve => setTimeout(resolve, 100));
        return await projectOperations.saveProject(user?.id || '', project);
      } catch (error) {
        console.error("Error in saveProject:", error);
        throw error; // Re-throw to allow handling at component level
      }
    },
    updateProject: async (project) => {
      try {
        return await projectOperations.updateProject(project);
      } catch (error) {
        console.error("Error in updateProject:", error);
        throw error;
      }
    },
    deleteProject: async (id) => {
      try {
        await projectOperations.deleteProject(id);
      } catch (error) {
        console.error("Error in deleteProject:", error);
        throw error;
      }
    },
    getProject,
    exportProjectPDF: projectExports.exportProjectPDF,
    exportProjectCSV: projectExports.exportProjectCSV,
  }), [projects, isLoading, projectOperations, projectExports, getProject, user?.id]);

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};
