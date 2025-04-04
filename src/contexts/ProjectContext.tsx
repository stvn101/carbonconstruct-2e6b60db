
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { CalculationResult, MaterialInput, TransportInput, EnergyInput, MATERIAL_FACTORS, ENERGY_FACTORS } from "@/lib/carbonCalculations";

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

  const loadProjects = () => {
    setIsLoading(true);
    try {
      const savedProjects = localStorage.getItem(`projects-${user?.id}`);
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error("Failed to load your projects");
    } finally {
      setIsLoading(false);
    }
  };

  const saveProjects = async (updatedProjects: SavedProject[]) => {
    if (user) {
      try {
        localStorage.setItem(`projects-${user.id}`, JSON.stringify(updatedProjects));
      } catch (error) {
        console.error('Error saving projects:', error);
        toast.error("Failed to save your projects");
        throw error;
      }
    }
  };

  const saveProject = async (project: Omit<SavedProject, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      throw new Error('You must be logged in to save projects');
    }

    const newProject: SavedProject = {
      ...project,
      id: uuidv4(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedProjects = [...projects, newProject];
    await saveProjects(updatedProjects);
    setProjects(updatedProjects);
    toast.success("Project saved successfully");
    return newProject;
  };

  const updateProject = async (project: SavedProject) => {
    const updatedProjects = projects.map(p => 
      p.id === project.id 
        ? { ...project, updatedAt: new Date().toISOString() } 
        : p
    );
    
    await saveProjects(updatedProjects);
    setProjects(updatedProjects);
    toast.success("Project updated successfully");
    return project;
  };

  const deleteProject = async (id: string) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    await saveProjects(updatedProjects);
    setProjects(updatedProjects);
    toast.success("Project deleted successfully");
  };

  const getProject = (id: string) => {
    return projects.find(p => p.id === id);
  };

  const exportProjectPDF = async (project: SavedProject) => {
    try {
      toast.success("PDF export started");
      // In a real app, this would call a service to generate a PDF
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
      const materialsCSV = project.materials.map(m => 
        `${m.type},${m.quantity},${MATERIAL_FACTORS[m.type].unit}`
      ).join('\n');
      
      const transportCSV = project.transport.map(t => 
        `${t.type},${t.distance},${t.weight}`
      ).join('\n');
      
      const energyCSV = project.energy.map(e => 
        `${e.type},${e.amount},${ENERGY_FACTORS[e.type].unit}`
      ).join('\n');
      
      const csvContent = `Materials\nType,Quantity,Unit\n${materialsCSV}\n\nTransport\nType,Distance,Weight\n${transportCSV}\n\nEnergy\nType,Amount,Unit\n${energyCSV}`;
      
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
