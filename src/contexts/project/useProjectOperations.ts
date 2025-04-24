
import { toast } from 'sonner';
import { SavedProject } from '@/types/project';
import { 
  createProject, 
  updateProject as updateProjectInDB, 
  deleteProject as deleteProjectInDB 
} from '@/services/projectService';
import { Dispatch, SetStateAction } from 'react';
import { withTimeout, isOffline } from '@/utils/errorHandling';

export const useProjectOperations = (setProjects: Dispatch<SetStateAction<SavedProject[]>>) => {
  const saveProject = async (userId: string, project: Omit<SavedProject, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (isOffline()) {
      toast.error("You're offline. Please check your connection and try again.");
      throw new Error("Network offline");
    }
    
    try {
      // Use a timeout to prevent hanging indefinitely
      const savedProject = await withTimeout(
        createProject(userId, project),
        15000 // 15 second timeout
      );
      
      toast.success("Project saved successfully");
      return savedProject;
    } catch (error) {
      console.error('Error saving project:', error);
      
      if (error instanceof Error && error.message.includes('timeout')) {
        toast.error("Saving project timed out. Please try again when you have a better connection.");
      } else {
        toast.error("Failed to save project. Please check your connection and try again.");
      }
      
      throw error;
    }
  };

  const updateProject = async (project: SavedProject) => {
    if (isOffline()) {
      toast.error("You're offline. Please check your connection and try again.");
      throw new Error("Network offline");
    }
    
    try {
      const updatedProject = await withTimeout(
        updateProjectInDB(project),
        15000 // 15 second timeout
      );
      
      toast.success("Project updated successfully");
      return updatedProject;
    } catch (error) {
      console.error('Update project error:', error);
      
      if (error instanceof Error && error.message.includes('timeout')) {
        toast.error("Updating project timed out. Please try again when you have a better connection.");
      } else {
        toast.error("Failed to update project. Please check your connection and try again.");
      }
      
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    if (isOffline()) {
      toast.error("You're offline. Please check your connection and try again.");
      throw new Error("Network offline");
    }
    
    try {
      await withTimeout(
        deleteProjectInDB(id),
        10000 // 10 second timeout
      );
      
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error('Delete project error:', error);
      
      if (error instanceof Error && error.message.includes('timeout')) {
        toast.error("Deleting project timed out. Please try again when you have a better connection.");
      } else {
        toast.error("Failed to delete project. Please check your connection and try again.");
      }
      
      throw error;
    }
  };

  return {
    saveProject,
    updateProject,
    deleteProject,
  };
};
