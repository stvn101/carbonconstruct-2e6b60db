
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';
import { SavedProject, ProjectContextType } from '@/types/project';
import { fetchUserProjects, createProject, updateProject as updateProjectInDB, deleteProject as deleteProjectInDB } from '@/services/projectService';
import { exportProjectToPDF, exportProjectToCSV } from '@/utils/exportUtils';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Use useCallback for loadProjects to avoid unnecessary re-creations
  const loadProjects = useCallback(async () => {
    if (!user) {
      setProjects([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const projectData = await fetchUserProjects(user.id);
      setProjects(projectData);
      setFetchError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error loading projects:', error);
      setFetchError(error instanceof Error ? error : new Error('Failed to load projects'));
      // Only show toast for first error, not for retry failures
      if (retryCount === 0) {
        toast.error("Failed to load your projects. Retrying...", {
          duration: 3000,
          id: "projects-load-error" // Prevent duplicate toasts
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, retryCount]);

  // Add retry logic
  useEffect(() => {
    if (fetchError && retryCount < MAX_RETRIES) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        loadProjects();
      }, Math.min(2000 * (retryCount + 1), 10000)); // Exponential backoff with max
      
      return () => clearTimeout(timer);
    }
    
    // If we've reached max retries and still have an error, show a final message
    if (fetchError && retryCount >= MAX_RETRIES) {
      toast.error("Unable to load projects. Please check your connection.", {
        duration: 5000,
        id: "projects-load-failed"
      });
    }
  }, [fetchError, retryCount, loadProjects]);

  useEffect(() => {
    let projectChannel: RealtimeChannel;

    if (user) {
      loadProjects();

      // Setup realtime subscription
      projectChannel = supabase
        .channel('project_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'projects',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Received real-time update:', payload);
            
            // Use functional updates to avoid dependency on current state
            if (payload.eventType === 'INSERT') {
              const newProject = payload.new as SavedProject;
              setProjects(prev => {
                // Check if project already exists to avoid duplicates
                if (prev.some(p => p.id === newProject.id)) {
                  return prev;
                }
                return [...prev, newProject];
              });
              // Avoid calling toast inside state updates
              setTimeout(() => toast.success('New project created'), 0);
            } 
            else if (payload.eventType === 'UPDATE') {
              const updatedProject = payload.new as SavedProject;
              setProjects(prev => 
                prev.map(p => p.id === updatedProject.id ? updatedProject : p)
              );
              setTimeout(() => toast.success('Project updated'), 0);
            }
            else if (payload.eventType === 'DELETE') {
              const deletedId = payload.old.id;
              setProjects(prev => prev.filter(p => p.id !== deletedId));
              setTimeout(() => toast.success('Project deleted'), 0);
            }
          }
        )
        .subscribe();
    } else {
      setProjects([]);
      setIsLoading(false);
    }

    return () => {
      if (projectChannel) {
        supabase.removeChannel(projectChannel);
      }
    };
  }, [user, loadProjects]); // Added loadProjects as dependency

  const saveProject = async (project: Omit<SavedProject, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      throw new Error('You must be logged in to save projects');
    }

    try {
      const savedProject = await createProject(user.id, project);
      // Let the realtime subscription handle the state update
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
      // Let the realtime subscription handle the state update
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
      // Let the realtime subscription handle the state update
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error('Delete project error:', error);
      toast.error("Failed to delete project");
      throw error;
    }
  };

  const getProject = (id: string) => {
    return projects.find(p => p.id === id);
  };

  const exportProjectPDF = async (project: SavedProject) => {
    try {
      toast.success("PDF export started");
      await exportProjectToPDF(project);
      toast.success("PDF exported successfully");
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error("Failed to export PDF");
    }
  };

  const exportProjectCSV = async (project: SavedProject) => {
    try {
      await exportProjectToCSV(project);
      toast.success("CSV exported successfully");
    } catch (error) {
      console.error('CSV export failed:', error);
      toast.error("Failed to export CSV");
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        isLoading,
        saveProject,
        updateProject,
        deleteProject,
        getProject,
        exportProjectPDF,
        exportProjectCSV,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

