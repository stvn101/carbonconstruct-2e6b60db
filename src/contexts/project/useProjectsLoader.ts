
import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { toast } from 'sonner';
import { fetchUserProjects, createProject as apiCreateProject, updateProject as apiUpdateProject, deleteProject as apiDeleteProject } from '@/services/projectService';
import { 
  isOffline, 
  showErrorToast, 
  clearErrorToasts
} from '@/utils/errorHandling';
import { SavedProject } from '@/types/project';
import { useAuth } from '@/contexts/auth';
import { useCalculator } from '@/contexts/calculator';
import { loadProjects } from '@/utils/projectLoader';
import { useProjectOperations } from './useProjectOperations';
import React from 'react';

// Define ProjectsContextType
interface ProjectsContextType {
  projects: SavedProject[];
  isLoading: boolean;
  fetchError: Error | null;
  createProject: (project: Omit<SavedProject, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<SavedProject | null>;
  updateProject: (project: SavedProject) => Promise<SavedProject | null>;
  deleteProject: (projectId: string) => Promise<boolean>;
  loadProjects: () => Promise<SavedProject[] | undefined>;
}

// Create a context with a default null value
const ProjectsContext = createContext<ProjectsContextType>(null as any);

export const ProjectsProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<Error | null>(null);
  const { user } = useAuth();
  
  // Defensive check for useCalculator to avoid context error
  let resetCalculator: () => void;
  try {
    const calculator = useCalculator();
    resetCalculator = calculator.setCalculationInput ? 
      () => calculator.setCalculationInput({
        materials: [{ type: "concrete", quantity: 1000 }],
        transport: [{ type: "truck", distance: 100, weight: 1000 }],
        energy: [{ type: "electricity", amount: 500 }]
      }) : 
      () => console.log('Calculator reset not available');
  } catch (error) {
    console.warn('CalculatorProvider not found, using no-op resetCalculator');
    resetCalculator = () => {}; // Fallback to prevent crash
  }
  
  /**
   * Wrapper for the loadProjects utility function
   */
  const loadProjectsWrapper = useCallback(async () => {
    if (!user?.id) {
      setProjects([]);
      setFetchError(null);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const projectData = await loadProjects(
        user.id, 
        setProjects, 
        setFetchError
      );
      
      setIsLoading(false);
      return projectData;
    } catch (error) {
      setIsLoading(false);
      return [];
    }
  }, [user?.id]);
  
  useEffect(() => {
    if (user?.id) {
      loadProjectsWrapper();
    } else {
      setProjects([]);
    }
  }, [user?.id, loadProjectsWrapper]);
  
  // Use the extracted project operations hook
  const { createProject, updateProject, deleteProject } = useProjectOperations(
    user?.id, 
    setProjects, 
    resetCalculator
  );
  
  const value: ProjectsContextType = {
    projects,
    isLoading,
    fetchError,
    createProject,
    updateProject,
    deleteProject,
    loadProjects: loadProjectsWrapper,
  };
  
  // Return an object with a Provider function to avoid JSX in .ts file
  return {
    Provider: function ProjectsContextProvider({ children }: { children: React.ReactNode }) {
      // Use React.createElement to avoid JSX in .ts file
      return React.createElement(
        ProjectsContext.Provider,
        { value },
        children
      );
    }
  };
};

export const useProjects = (): ProjectsContextType => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
};
