
import { toast } from 'sonner';
import { SavedProject } from '@/types/project';
import { createProject as apiCreateProject, updateProject as apiUpdateProject, deleteProject as apiDeleteProject } from '@/services/projectService';
import { showErrorToast } from '@/utils/errorHandling';
import { Dispatch, SetStateAction } from 'react';
import { isOffline } from '@/utils/errorHandling';
import { CalculationResult, MaterialInput, TransportInput, EnergyInput } from '@/lib/carbonExports';

export interface CreateProjectInput {
  name: string;
  description?: string;
  materials: MaterialInput[];
  transport: TransportInput[];
  energy: EnergyInput[];
  result?: CalculationResult;
  tags?: string[];
  status?: "draft" | "active" | "completed" | "archived";
  total_emissions?: number;
  premium_only?: boolean;
}

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
      // Convert to the correct type for API call
      const projectInput = {
        name: project.name,
        description: project.description,
        materials: project.materials,
        transport: project.transport,
        energy: project.energy,
        result: project.result,
        tags: project.tags,
        // Map the status to match the allowed values
        status: project.status,
        total_emissions: project.total_emissions,
        premium_only: project.premium_only
      };
      
      const newProject = await apiCreateProject(userId, projectInput);
      setProjects(prevProjects => [...prevProjects, newProject]);
      toast.success("Project created successfully!");
      return newProject;
    } catch (error) {
      console.error("Error creating project:", error);
      showErrorToast("Failed to create project. Please try again.", "project-create-error");
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
      showErrorToast("Failed to update project. Please try again.", "project-update-error");
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
      showErrorToast("Failed to delete project. Please try again.", "project-delete-error");
      return false;
    }
  };

  return {
    createProject,
    updateProject,
    deleteProject,
  };
};
