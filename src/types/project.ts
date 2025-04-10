
// Import required types if not already imported
import { UserProfile } from '@/types/auth';

export interface SavedProject {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
  user_id: string;
  data: any;
  region?: string;
  total_emissions?: number;
  premium_only?: boolean;
  status?: 'draft' | 'completed' | 'archived';
  // Add any other properties based on your application's needs
}

export interface ProjectFormData {
  name: string;
  description?: string;
}

// Add other types as needed for your project
