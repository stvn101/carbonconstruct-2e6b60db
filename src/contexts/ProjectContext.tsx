
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
        // Use the optimized saveProject function
        saveProject: async (project) => {
          // Add a small delay to show saving indicator
          await new Promise(resolve => setTimeout(resolve, 100));
          return projectOperations.saveProject(user?.id || '', project);
        },
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
</lov-code>

3. Now, let's optimize the project service file to improve database operations:

<lov-write file_path="src/services/projectService.ts">
import { supabase } from '@/integrations/supabase/client';
import { SavedProject } from '@/types/project';
import { CalculationResult, MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonCalculations";
import { Json } from '@/integrations/supabase/types';

export async function fetchUserProjects(userId: string): Promise<SavedProject[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    if (!data) return [];
    
    // Transform the data to match our SavedProject interface with all required properties
    return data.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      user_id: project.user_id,
      created_at: project.created_at,
      updated_at: project.updated_at,
      // Parse JSON data from database with proper type casting
      materials: (project.materials as unknown as MaterialInput[]) || [],
      transport: (project.transport as unknown as TransportInput[]) || [],
      energy: (project.energy as unknown as EnergyInput[]) || [],
      result: project.result as unknown as CalculationResult,
      tags: project.tags || [],
      // Add required properties with default values if not present
      status: 'draft', // Default to 'draft' as the database doesn't have this field yet
      total_emissions: project.total || 0,
      premium_only: false // Default to false as the database doesn't have this field yet
    }));
  } catch (error) {
    console.error('Error in fetchUserProjects:', error);
    // Rethrow with better error message
    throw new Error(`Error loading projects: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function createProject(
  userId: string, 
  project: {
    name: string;
    description?: string;
    materials: MaterialInput[];
    transport: TransportInput[];
    energy: EnergyInput[];
    result?: CalculationResult;
    tags?: string[];
    status?: 'draft' | 'completed' | 'archived';
    total_emissions?: number;
    premium_only?: boolean;
  }
): Promise<SavedProject> {
  try {
    // Optimize data processing by calculating all derived values beforehand
    const newProject = {
      name: project.name,
      description: project.description,
      user_id: userId,
      // Convert TypeScript objects to JSON for database storage
      materials: project.materials as unknown as Json,
      transport: project.transport as unknown as Json,
      energy: project.energy as unknown as Json,
      result: project.result as unknown as Json,
      tags: project.tags || [],
      total: project.total_emissions || 0,
      // These fields don't exist in the database schema yet, so we don't include them
    };

    // Use a more efficient query with optimistic response
    const { data, error } = await supabase
      .from('projects')
      .insert(newProject)
      .select()
      .single();

    if (error) throw error;
    
    if (!data) {
      throw new Error('No data returned from insert operation');
    }
    
    // Transform to our SavedProject interface with all required properties
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      user_id: data.user_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      // Parse JSON data from database
      materials: (data.materials as unknown as MaterialInput[]) || [],
      transport: (data.transport as unknown as TransportInput[]) || [],
      energy: (data.energy as unknown as EnergyInput[]) || [],
      result: data.result as unknown as CalculationResult,
      tags: data.tags || [],
      // Add required properties with default values
      status: 'draft', // Default to 'draft' as the database doesn't have this field yet
      total_emissions: data.total || 0,
      premium_only: false // Default to false as the database doesn't have this field yet
    };
  } catch (error) {
    console.error('Error in createProject:', error);
    // Rethrow with better error message
    throw new Error(`Error creating project: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Optimize the update project function
export async function updateProject(project: SavedProject): Promise<SavedProject> {
  try {
    // Prepare the update data to minimize processing during update
    const updateData = {
      name: project.name,
      description: project.description,
      // Convert TypeScript objects to JSON for database storage
      materials: project.materials as unknown as Json,
      transport: project.transport as unknown as Json,
      energy: project.energy as unknown as Json,
      result: project.result as unknown as Json,
      tags: project.tags,
      total: project.total_emissions,
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', project.id);

    if (error) throw error;
    
    // Update local state with the new updated_at
    return { 
      ...project, 
      updated_at: new Date().toISOString() 
    };
  } catch (error) {
    console.error('Error in updateProject:', error);
    // Rethrow with better error message
    throw new Error(`Error updating project: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error in deleteProject:', error);
    // Rethrow with better error message
    throw new Error(`Error deleting project: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
