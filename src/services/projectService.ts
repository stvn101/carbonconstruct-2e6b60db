import { supabase } from '@/integrations/supabase/client';
import { SavedProject } from '@/types/project';
import { CalculationResult } from '@/lib/carbonCalculations';
import { MaterialInput, TransportInput, EnergyInput, CalculationResult as ExtendedCalculationResult } from '@/lib/carbonExports';
import { Json } from '@/integrations/supabase/types';
import { performDbOperation } from './supabase';

/**
 * Fetch all projects for a user with improved error handling and pagination
 */
export async function fetchUserProjects(
  userId: string, 
  page: number = 0, 
  pageSize: number = 50
): Promise<SavedProject[]> {
  return performDbOperation(
    async () => {
      // Calculate range for pagination
      const from = page * pageSize;
      const to = from + pageSize - 1;

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      
      if (!data) return [];
      
      // Transform the data to match our SavedProject interface with all required properties
      return data.map(project => {
        // Parse JSON data from database with proper type casting
        const materials = (project.materials as unknown as MaterialInput[]) || [];
        const transport = (project.transport as unknown as TransportInput[]) || [];
        const energy = (project.energy as unknown as EnergyInput[]) || [];
        
        // Parse result and add timestamp if missing
        let result: ExtendedCalculationResult | undefined;
        if (project.result) {
          const baseResult = project.result as unknown as CalculationResult;
          result = {
            ...baseResult,
            timestamp: (project.result as any)?.timestamp || new Date().toISOString()
          };
        }
        
        return {
          id: project.id,
          name: project.name,
          description: project.description,
          user_id: project.user_id,
          created_at: project.created_at,
          updated_at: project.updated_at,
          materials: materials,
          transport: transport,
          energy: energy,
          result: result,
          tags: project.tags || [],
          // Add required properties with default values if not present
          status: 'draft', // Default to 'draft' as the database doesn't have this field yet
          total_emissions: project.total || 0, // Use the 'total' column for emissions
          premium_only: false // Default to false as the database doesn't have this field yet
        };
      });
    },
    'load user projects',
    { fallbackData: [] }
  );
}

/**
 * Create a new project with improved error handling
 */
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
  return performDbOperation(
    async () => {
      // Add timestamp to result if it's missing
      let resultWithTimestamp: ExtendedCalculationResult | undefined;
      if (project.result) {
        resultWithTimestamp = {
          ...project.result,
          timestamp: new Date().toISOString()
        };
      }
      
      const newProject = {
        name: project.name,
        description: project.description,
        user_id: userId,
        // Convert TypeScript objects to JSON for database storage
        materials: project.materials as unknown as Json,
        transport: project.transport as unknown as Json,
        energy: project.energy as unknown as Json,
        result: resultWithTimestamp as unknown as Json,
        tags: project.tags || [],
        total: project.total_emissions || 0, // Ensure we update the 'total' column
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
        result: data.result ? {
          ...(data.result as unknown as CalculationResult),
          timestamp: (data.result as any)?.timestamp || new Date().toISOString()
        } : undefined,
        tags: data.tags || [],
        // Add required properties with default values
        status: 'draft', // Default to 'draft' as the database doesn't have this field yet
        total_emissions: data.total || 0, // Use the 'total' column
        premium_only: false // Default to false as the database doesn't have this field yet
      };
    },
    'create project'
  );
}

/**
 * Update an existing project with improved error handling
 */
export async function updateProject(project: SavedProject): Promise<SavedProject> {
  return performDbOperation(
    async () => {
      // Ensure result has timestamp if it exists
      let resultWithTimestamp = project.result;
      if (resultWithTimestamp && !resultWithTimestamp.timestamp) {
        resultWithTimestamp = {
          ...resultWithTimestamp,
          timestamp: new Date().toISOString()
        };
      }
      
      const { error } = await supabase
        .from('projects')
        .update({
          name: project.name,
          description: project.description,
          // Convert TypeScript objects to JSON for database storage
          materials: project.materials as unknown as Json,
          transport: project.transport as unknown as Json,
          energy: project.energy as unknown as Json,
          result: resultWithTimestamp as unknown as Json,
          tags: project.tags,
          total: project.total_emissions, // Ensure we update the 'total' column
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id);

      if (error) throw error;
      
      // Update local state with the new updated_at
      return { 
        ...project, 
        updated_at: new Date().toISOString(),
        result: resultWithTimestamp
      };
    },
    'update project'
  );
}

/**
 * Delete a project with improved error handling
 */
export async function deleteProject(id: string): Promise<void> {
  return performDbOperation(
    async () => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    'delete project'
  );
}
