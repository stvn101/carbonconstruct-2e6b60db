
import { toast } from 'sonner';
import { SavedProject } from '@/types/project';
import { 
  createProject, 
  updateProject as updateProjectInDB, 
  deleteProject as deleteProjectInDB 
} from '@/services/projectService';
import { Dispatch, SetStateAction } from 'react';

export const useProjectOperations = (setProjects: Dispatch<SetStateAction<SavedProject[]>>) => {
  const saveProject = async (userId: string, project: Omit<SavedProject, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const savedProject = await createProject(userId, project);
      toast.success("Project saved successfully");
      return savedProject;
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error("Failed to save project");
      throw error;
    }
  };

  const updateProject = async (project: SavedProject) => {
    try {
      const updatedProject = await updateProjectInDB(project);
      toast.success("Project updated successfully");
      return updatedProject;
    } catch (error) {
      console.error('Update project error:', error);
      toast.error("Failed to update project");
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await deleteProjectInDB(id);
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error('Delete project error:', error);
      toast.error("Failed to delete project");
      throw error;
    }
  };

  return {
    saveProject,
    updateProject,
    deleteProject,
  };
};
