
import { toast } from 'sonner';
import { SavedProject } from '@/types/project';
import { createProject as apiCreateProject, updateProject as apiUpdateProject, deleteProject as apiDeleteProject } from '@/services/projectService';
import { showErrorToast } from '@/utils/errorHandling';
import { Dispatch, SetStateAction } from 'react';
import { isOffline } from '@/utils/errorHandling';

export const useProjectOperations = (
  userId: string | undefined,
  setProjects: Dispatch<SetStateAction<SavedProject[]>>,
  resetCalculator: () => void
) => {
  const createProject = async (
    project: Omit<SavedProject, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<SavedProject | null> => {
    if (!userId) {
      toast.error("You must be logged in to create a project.");
      return null;
    }
    
    try {
      const newProject = await apiCreateProject(userId, project);
      setProjects(prevProjects => [...prevProjects, newProject]);
      toast.success("Project created successfully!");
      return newProject;
    } catch (error) {
      console.error("Error creating project:", error);
      showErrorToast("Failed to create project. Please try again.");
      return null;
    }
  };
  
  const updateProject = async (project: SavedProject): Promise<SavedProject | null> => {
    try {
      if (isOffline()) {
        toast.error("You're offline. Please check your connection and try again.");
        return null;
      }
      
      const updatedProject = await apiUpdateProject(project);
      setProjects(prevProjects =>
        prevProjects.map(p => (p.id === project.id ? updatedProject : p))
      );
      toast.success("Project updated successfully!");
      return updatedProject;
    } catch (error) {
      console.error("Error updating project:", error);
      showErrorToast("Failed to update project. Please try again.");
      return null;
    }
  };
  
  const deleteProject = async (projectId: string): Promise<boolean> => {
    try {
      if (isOffline()) {
        toast.error("You're offline. Please check your connection and try again.");
        return false;
      }
      
      await apiDeleteProject(projectId);
      setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
      toast.success("Project deleted successfully!");
      resetCalculator();
      return true;
    } catch (error) {
      console.error("Error deleting project:", error);
      showErrorToast("Failed to delete project. Please try again.");
      return false;
    }
  };

  return {
    createProject,
    updateProject,
    deleteProject,
  };
};
