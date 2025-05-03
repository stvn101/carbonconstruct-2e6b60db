
import { useMemo, useCallback } from 'react';
import { useProjectState } from './useProjectState';
import { useProjectOperations } from './useProjectOperations';
import { useProjectExports } from './useProjectExports';
import { SavedProject } from '@/types/project';
import { useAuth } from '@/contexts/auth';
import { loadProjects as loadProjectsUtil } from '@/utils/projectLoader';

export const useProjectProvider = () => {
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

  const projectOperations = useProjectOperations(user?.id, setProjects, () => {});
  const projectExports = useProjectExports();

  const getProject = useCallback((id: string) => {
    return projects.find(p => p.id === id);
  }, [projects]);

  // Add loadProjects function
  const loadProjects = useCallback(async () => {
    if (!user?.id) {
      return [];
    }
    
    setIsLoading(true);
    try {
      const loadedProjects = await loadProjectsUtil(user.id, setProjects, setFetchError);
      setIsLoading(false);
      return loadedProjects;
    } catch (error) {
      console.error("Error loading projects:", error);
      setIsLoading(false);
      return [];
    }
  }, [user?.id, setProjects, setFetchError, setIsLoading]);

  const contextValue = useMemo(() => ({
    projects,
    isLoading,
    fetchError,
    saveProject: async (project: Omit<SavedProject, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100));
        return await projectOperations.createProject(project);
      } catch (error) {
        console.error("Error in saveProject:", error);
        throw error;
      }
    },
    updateProject: async (project: SavedProject) => {
      try {
        return await projectOperations.updateProject(project);
      } catch (error) {
        console.error("Error in updateProject:", error);
        throw error;
      }
    },
    deleteProject: async (id: string) => {
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
    loadProjects,
  }), [projects, isLoading, fetchError, projectOperations, projectExports, getProject, loadProjects]);

  return {
    contextValue,
    setProjects,
    setIsLoading,
    setFetchError,
    retryCount,
    setRetryCount
  };
};
