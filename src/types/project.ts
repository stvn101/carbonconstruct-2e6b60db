
import { CalculationResult, MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonCalculations";

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

export interface ProjectContextType {
  projects: SavedProject[];
  isLoading: boolean;
  saveProject: (project: Omit<SavedProject, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<SavedProject>;
  updateProject: (project: SavedProject) => Promise<SavedProject>;
  deleteProject: (id: string) => Promise<void>;
  getProject: (id: string) => SavedProject | undefined;
  exportProjectPDF: (project: SavedProject) => Promise<void>;
  exportProjectCSV: (project: SavedProject) => Promise<void>;
}
