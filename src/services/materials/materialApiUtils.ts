
// Import necessary functions and types
import { supabase } from '@/integrations/supabase/client';
import { performDbOperation } from '@/services/supabase/db';
import { SupabaseMaterial } from './materialTypes';
import { toast } from 'sonner';

/**
 * Handle errors from material API operations
 */
export function handleMaterialApiError(error: unknown, operation: string) {
  console.error(`Error trying to ${operation}:`, error);
  
  // Show toast error to the user
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  toast.error(`Material data issue: ${errorMessage.slice(0, 100)}${errorMessage.length > 100 ? '...' : ''}`);
}

/**
 * Fetch materials from the Supabase API
 */
export async function fetchMaterialsFromApi(): Promise<SupabaseMaterial[]> {
  return await performDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      return data || [];
    },
    'fetch materials',
    {
      retries: 2,
      timeout: 10000,
      fallbackData: []
    }
  );
}

/**
 * Fetch material categories using the secure database function
 */
export async function fetchCategoriesFromApi(): Promise<string[]> {
  return await performDbOperation(
    async () => {
      // Use the secure function to get material categories
      const { data, error } = await supabase.rpc('get_material_categories');
      
      if (error) {
        console.error('Error fetching material categories:', error);
        throw error;
      }
      
      // Extract categories from the result
      return data ? data.map(row => row.category).filter(Boolean) : [];
    },
    'fetch material categories',
    {
      retries: 2,
      timeout: 5000,
      fallbackData: []
    }
  );
}
