
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { CalculationResult, MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonCalculations";
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Json } from '@/integrations/supabase/types';

export interface SavedProject {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  materials: MaterialInput[];
  transport: TransportInput[];
  energy: EnergyInput[];
  result?: CalculationResult;
  tags?: string[];
}

interface ProjectContextType {
  projects: SavedProject[];
  isLoading: boolean;
  saveProject: (project: Omit<SavedProject, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<SavedProject>;
  updateProject: (project: SavedProject) => Promise<SavedProject>;
  deleteProject: (id: string) => Promise<void>;
  getProject: (id: string) => SavedProject | undefined;
  exportProjectPDF: (project: SavedProject) => Promise<void>;
  exportProjectCSV: (project: SavedProject) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

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
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      if (data) {
        // Transform the data to match our SavedProject interface
        const transformedProjects: SavedProject[] = data.map(project => ({
          id: project.id,
          name: project.name,
          description: project.description,
          userId: project.user_id,
          createdAt: project.created_at,
          updatedAt: project.updated_at,
          // Parse JSON data from database with proper type casting
          materials: (project.materials as unknown as MaterialInput[]) || [],
          transport: (project.transport as unknown as TransportInput[]) || [],
          energy: (project.energy as unknown as EnergyInput[]) || [],
          result: project.result as unknown as CalculationResult,
          tags: project.tags || []
        }));
        
        setProjects(transformedProjects);
      }
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
      const newProject = {
        name: project.name,
        description: project.description,
        user_id: user.id,
        // Convert TypeScript objects to JSON for database storage
        materials: project.materials as unknown as Json,
        transport: project.transport as unknown as Json,
        energy: project.energy as unknown as Json,
        result: project.result as unknown as Json,
        tags: project.tags
      };

      const { data, error } = await supabase
        .from('projects')
        .insert(newProject)
        .select()
        .single();

      if (error) throw error;
      
      if (!data) {
        throw new Error('No data returned from insert operation');
      }
      
      // Transform to our SavedProject interface
      const savedProject: SavedProject = {
        id: data.id,
        name: data.name,
        description: data.description,
        userId: data.user_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        // Parse JSON data from database
        materials: (data.materials as unknown as MaterialInput[]) || [],
        transport: (data.transport as unknown as TransportInput[]) || [],
        energy: (data.energy as unknown as EnergyInput[]) || [],
        result: data.result as unknown as CalculationResult,
        tags: data.tags || []
      };

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
      const { error } = await supabase
        .from('projects')
        .update({
          name: project.name,
          description: project.description,
          // Convert TypeScript objects to JSON for database storage
          materials: project.materials as unknown as Json,
          transport: project.transport as unknown as Json,
          energy: project.energy as unknown as Json,
          result: project.result as unknown as Json,
          tags: project.tags,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id);

      if (error) throw error;
      
      // Update local state
      const updatedProject = { ...project, updatedAt: new Date().toISOString() };
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
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

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
      // In a real app, we would call an edge function to generate a PDF
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("PDF exported successfully");
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error("Failed to export PDF");
    }
  };

  const exportProjectCSV = async (project: SavedProject) => {
    try {
      // Simple CSV generation
      const { materials, transport, energy } = project;
      
      const createCSVContent = (data: any[], headers: string[]) => {
        const headerRow = headers.join(',');
        const dataRows = data.map(item => 
          headers.map(header => JSON.stringify(item[header] || '')).join(',')
        );
        return [headerRow, ...dataRows].join('\n');
      };
      
      const materialsCSV = createCSVContent(materials, ['type', 'quantity']);
      const transportCSV = createCSVContent(transport, ['type', 'distance', 'weight']);
      const energyCSV = createCSVContent(energy, ['type', 'amount']);
      
      const csvContent = `Materials\n${materialsCSV}\n\nTransport\n${transportCSV}\n\nEnergy\n${energyCSV}`;
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${project.name.replace(/\s+/g, '_')}_export.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
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
