
import React, { createContext, useContext, useEffect, useCallback } from 'react';
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
      toast.error("You're offline. Project data will load when you reconnect.", {
        id: "projects-offline",
        duration: 0
      });
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const projectData = await fetchUserProjects(user.id);
      setProjects(projectData);
      setFetchError(null);
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

  // Network status monitoring
  useEffect(() => {
    const cleanup = addNetworkListeners(
      // Offline callback
      () => {
        // We're offline, no need to retry until we're back online
        if (fetchError) {
          setRetryCount(MAX_RETRIES); // Stop retry attempts while offline
        }
      },
      // Online callback
      () => {
        // We're back online, reset retry count and load projects
        if (fetchError) {
          setRetryCount(0); // Reset retry count
          loadProjects(); // Try loading projects again
        }
      }
    );
    
    return cleanup;
  }, [fetchError, loadProjects, setRetryCount]);

  useEffect(() => {
    if (fetchError && retryCount < MAX_RETRIES) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        loadProjects();
      }, Math.min(2000 * (retryCount + 1), 10000));
      
      return () => clearTimeout(timer);
    }
    
    if (fetchError && retryCount >= MAX_RETRIES) {
      toast.error("Unable to load projects. Please check your connection.", {
        duration: 5000,
        id: "projects-load-failed"
      });
    }
  }, [fetchError, retryCount, loadProjects]);

  useEffect(() => {
    const projectChannel = subscribeToProjects();
    
    if (user) {
      loadProjects();
    } else {
      setProjects([]);
      setIsLoading(false);
    }

    return () => {
      if (projectChannel) {
        supabase.removeChannel(projectChannel);
      }
    };
  }, [user, loadProjects, subscribeToProjects]);

  const getProject = (id: string) => {
    return projects.find(p => p.id === id);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        isLoading,
        saveProject: (project) => projectOperations.saveProject(user?.id || '', project),
        updateProject: projectOperations.updateProject,
        deleteProject: projectOperations.deleteProject,
        getProject,
        exportProjectPDF: projectExports.exportProjectPDF,
        exportProjectCSV: projectExports.exportProjectCSV,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
