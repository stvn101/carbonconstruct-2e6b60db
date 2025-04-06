
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { SavedProject, ProjectContextType } from '@/types/project';
import { fetchUserProjects, createProject, updateProject as updateProjectInDB, deleteProject as deleteProjectInDB } from '@/services/projectService';
import { exportProjectToPDF, exportProjectToCSV } from '@/utils/exportUtils';

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

  useEffect(() => {
    if (user) {
      loadProjects();
    } else {
      setProjects([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const projectData = await fetchUserProjects(user.id);
      setProjects(projectData);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error("Failed to load your projects");
    } finally {
      setIsLoading(false);
    }
  };

  const saveProject = async (project: Omit<SavedProject, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      throw new Error('You must be logged in to save projects');
    }

    try {
      const savedProject = await createProject(user.id, project);
      setProjects(prevProjects => [...prevProjects, savedProject]);
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
      setProjects(prevProjects => 
        prevProjects.map(p => p.id === project.id ? updatedProject : p)
      );
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
      setProjects(prevProjects => prevProjects.filter(p => p.id !== id));
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
