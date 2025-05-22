
import { UserProfile } from '@/types/auth';
import { CalculationResult, MaterialInput, TransportInput, EnergyInput } from '@/lib/carbonExports';

export interface SavedProject {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  
  // Data for calculation with strict typing
  materials: MaterialInput[];
  transport: TransportInput[];
  energy: EnergyInput[];
  result?: CalculationResult;
  tags: string[];
  
  // Additional properties with specific types
  // Update status to include 'active'
  status: 'draft' | 'active' | 'completed' | 'archived';
  region?: string;
  total_emissions: number;
  premium_only: boolean;
}

export interface ProjectFormData {
  name: string;
  description?: string;
}

export interface ProjectContextType {
  projects: SavedProject[];
  selectedProject?: SavedProject | null;
  isLoading: boolean;
  fetchError: Error | null;
  saveProject: (project: Omit<SavedProject, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<SavedProject>;
  updateProject: (project: SavedProject) => Promise<SavedProject>;
  deleteProject: (id: string) => Promise<void>;
  getProject: (id: string) => SavedProject | undefined;
  exportProjectPDF: (project: SavedProject) => Promise<void>;
  exportProjectCSV: (project: SavedProject) => Promise<void>;
  loadProjects?: () => Promise<SavedProject[] | undefined>;
}

// Helper function with proper type annotations
export const formatProjectForUI = (project: SavedProject): SavedProject & { 
  userId: string;
  createdAt: string;
  updatedAt: string;
} => {
  return {
    ...project,
    userId: project.user_id,
    createdAt: project.created_at,
    updatedAt: project.updated_at
  };
};

// Helper function with proper type annotations
export const formatProjectForDB = (project: SavedProject & {
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}): SavedProject => {
  const { userId, createdAt, updatedAt, ...rest } = project;
  return {
    ...rest,
    user_id: userId || rest.user_id,
    created_at: createdAt || rest.created_at,
    updated_at: updatedAt || rest.updated_at
  };
};
