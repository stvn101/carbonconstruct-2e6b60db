
import { supabase } from '@/integrations/supabase/client';
import { SavedProject } from '@/types/project';
import { CalculationResult, MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonCalculations";
import { Json } from '@/integrations/supabase/types';

export async function fetchUserProjects(userId: string): Promise<SavedProject[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  
  if (!data) return [];
  
  // Transform the data to match our SavedProject interface
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
    data: project.data || {}
  }));
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
  }
): Promise<SavedProject> {
  const newProject = {
    name: project.name,
    description: project.description,
    user_id: userId,
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
    data: data.data || {}
  };
}

export async function updateProject(project: SavedProject): Promise<SavedProject> {
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
  
  // Update local state with the new updated_at
  return { 
    ...project, 
    updated_at: new Date().toISOString() 
  };
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
