import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { toast } from 'sonner';
import { fetchUserProjects, createProject as apiCreateProject, updateProject as apiUpdateProject, deleteProject as apiDeleteProject } from '@/services/projectService';
import { 
  isOffline, 
  showErrorToast, 
  clearErrorToasts,
  retryWithBackoff 
} from '@/utils/errorHandling';
import { trackMetric } from '@/contexts/performance/metrics';
import { SavedProject, NewProject, ProjectResult } from '@/types/project';
import { useAuth } from '@/contexts/auth';
import { useCalculator } from '@/contexts/calculator';
import { checkSupabaseConnectionWithRetry } from '@/services/supabase/connection';

interface ProjectsContextType {
  projects: SavedProject[];
  isLoading: boolean;
  fetchError: Error | null;
  createProject: (project: NewProject) => Promise<SavedProject | null>;
  updateProject: (project: SavedProject) => Promise<SavedProject | null>;
  deleteProject: (projectId: string) => Promise<boolean>;
  loadProjects: () => Promise<SavedProject[] | undefined>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { resetCalculator } = useCalculator();
  
  /**
   * Load projects with optimized pagination, retries, and improved connection handling
   */
  const loadProjects = useCallback(async () => {
    if (!user?.id) {
      setProjects([]);
      setFetchError(null);
      return;
    }
    
    setIsLoading(true);
    setFetchError(null);
    
    // Clear any stale error toasts first
    clearErrorToasts([
      "projects-load-error", 
      "projects-load-failed", 
      "projects-offline"
    ]);
    
    if (isOffline()) {
      setFetchError(new Error('You are currently offline'));
      showErrorToast(
        "You're offline. Project data will load when you reconnect.", 
        "projects-offline", 
        { persistent: true }
      );
      setIsLoading(false);
      return [];
    }
    
    // Check database connection before attempting to load with improved reliability
    const canConnect = await checkSupabaseConnectionWithRetry(2, 10000);
    if (!canConnect) {
      setFetchError(new Error("Unable to connect to the database"));
      showErrorToast(
        "Unable to connect to the server. Using offline mode.", 
        "projects-db-offline", 
        { duration: 10000 }
      );
      setIsLoading(false);
      return [];
    }
    
    const startTime = performance.now();
    
    try {
      // Use the retryWithBackoff utility with more conservative settings
      const projectData = await retryWithBackoff(
        () => fetchUserProjects(user.id),
        2, // Max retries (reduced from 3 to 2)
        5000, // Initial delay (increased from 2000ms to 5000ms)
        {
          onRetry: (attempt) => {
            console.info(`Retrying project fetch (${attempt}/2)...`);
          },
          shouldRetry: (error) => {
            // Only retry network/timeout errors, not permission or other errors
            // and don't retry if we're now offline
            return (
              !isOffline() && 
              (error instanceof TypeError || 
               (error instanceof Error && 
                (error.message.includes('timeout') || 
                 error.message.includes('network') ||
                 error.message.includes('connection'))))
            );
          },
          maxDelay: 30000, // Cap delay at 30 seconds
          factor: 1.5     // Use a more conservative growth factor
        }
      );
      
      // Check for undefined or null before setting
      if (projectData) {
        setProjects(projectData);
        setFetchError(null);
        
        // Clear any error toasts on success
        clearErrorToasts([
          "projects-load-error", 
          "projects-offline", 
          "projects-load-failed",
          "projects-db-offline"
        ]);
        
        const loadTime = performance.now() - startTime;
        trackMetric({
          metric: 'projects_load_time',
          value: loadTime,
          tags: { count: projectData.length.toString() }
        });
        
        setIsLoading(false);
        return projectData;
      } else {
        // Handle empty response gracefully
        setProjects([]);
        setFetchError(null);
        console.warn('No project data returned, but no error occurred');
        setIsLoading(false);
        return [];
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      
      // Set appropriate error for user display
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to load projects';
      
      setFetchError(new Error(errorMessage));
      
      // Show a helpful error toast if it's not just a network issue
      if (!isOffline()) {
        showErrorToast(
          "Unable to load your projects. Please try again later.", 
          "projects-load-error", 
          { duration: 8000 }
        );
      }
      setIsLoading(false);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);
  
  useEffect(() => {
    if (user?.id) {
      loadProjects();
    } else {
      setProjects([]);
    }
  }, [user?.id, loadProjects]);
  
  const createProject = async (project: NewProject): Promise<SavedProject | null> => {
    if (!user?.id) {
      toast.error("You must be logged in to create a project.");
      return null;
    }
    
    try {
      const newProject = await apiCreateProject(user.id, project);
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
  
  const value: ProjectsContextType = {
    projects,
    isLoading,
    fetchError,
    createProject,
    updateProject,
    deleteProject,
    loadProjects,
  };
  
  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = (): ProjectsContextType => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
};
