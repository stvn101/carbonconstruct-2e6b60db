
// Import required types if not already imported
import { UserProfile } from '@/types/auth';
import { CalculationResult, MaterialInput, TransportInput, EnergyInput } from '@/lib/carbonCalculations';

export interface SavedProject {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  
  // Data for calculation
  materials: MaterialInput[];
  transport: TransportInput[];
  energy: EnergyInput[];
  result?: CalculationResult;
  tags?: string[];
  
  // Additional properties
  data?: any;
  region?: string;
  total_emissions?: number;
  premium_only?: boolean;
  status?: 'draft' | 'completed' | 'archived';
}

export interface ProjectFormData {
  name: string;
  description?: string;
}

// Add ProjectContextType for ProjectContext.tsx
export interface ProjectContextType {
  projects: SavedProject[];
  isLoading: boolean;
  saveProject: (project: Omit<SavedProject, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<SavedProject>;
  updateProject: (project: SavedProject) => Promise<SavedProject>;
  deleteProject: (id: string) => Promise<void>;
  getProject: (id: string) => SavedProject | undefined;
  exportProjectPDF: (project: SavedProject) => Promise<void>;
  exportProjectCSV: (project: SavedProject) => Promise<void>;
}

// Helper function to convert from DB format (snake_case) to UI format (camelCase) if needed
export const formatProjectForUI = (project: SavedProject): any => {
  return {
    ...project,
    userId: project.user_id,
    createdAt: project.created_at,
    updatedAt: project.updated_at
  };
};

// Helper function to convert from UI format (camelCase) to DB format (snake_case) if needed
export const formatProjectForDB = (project: any): Partial<SavedProject> => {
  const { userId, createdAt, updatedAt, ...rest } = project;
  return {
    ...rest,
    user_id: userId,
    created_at: createdAt,
    updated_at: updatedAt
  };
};
