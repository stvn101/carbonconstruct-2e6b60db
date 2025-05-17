
import { supabase } from '@/integrations/supabase/client';
import type { ApiRequestOptions, MaterialApiResponse, CategoriesApiResponse } from './materialApiTypes';
import { adaptDbMaterialToApp, type DbMaterial } from '../adapters/materialDbAdapter';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

/**
 * Fetch materials from the database
 * @param options API request options
 * @returns Promise with material data or error
 */
export async function fetchMaterialsFromApi(options: ApiRequestOptions = {}): Promise<MaterialApiResponse> {
  const {
    columns = '*',
    limit = 1000,
    offset = 0,
    category,
    region,
    maxRetries = 3,
    timeout = 10000,
  } = options;

  let attempts = 0;
  
  // Use exponential backoff for retries
  const getBackoffTime = (attempt: number) => Math.min(2 ** attempt * 500, 10000);
  
  while (attempts < maxRetries) {
    try {
      // Create query builder
      let query = supabase
        .from('materials')
        .select(columns)
        .range(offset, offset + limit - 1);
      
      // Apply filters if provided
      if (category) {
        query = query.eq('applicable_standards', category);
      }
      
      // Set timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      // Execute query
      const { data, error } = await query;
      clearTimeout(timeoutId);
      
      if (error) {
        console.error('Error fetching materials:', error);
        attempts++;
        
        if (attempts < maxRetries) {
          const backoffTime = getBackoffTime(attempts);
          console.log(`Retrying in ${backoffTime}ms (attempt ${attempts}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
          continue;
        }
        
        return { data: null, error };
      }
      
      // Map the data from database format to app format
      const mappedData = data.map(item => {
        // Need to adapt the database material format to our app format
        return adaptDbMaterialToApp(item as DbMaterial);
      });
      
      return { data: mappedData, error: null };
    } catch (error) {
      console.error('Error in materials API call:', error);
      attempts++;
      
      if (attempts < maxRetries) {
        const backoffTime = getBackoffTime(attempts);
        console.log(`Retrying in ${backoffTime}ms (attempt ${attempts}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        continue;
      }
      
      return { data: null, error: error as Error };
    }
  }
  
  return { data: null, error: new Error('Max retries reached fetching materials') };
}

/**
 * Fetch material categories from the database
 * @param options API request options
 * @returns Promise with category data or error
 */
export async function fetchMaterialCategoriesFromApi(options: ApiRequestOptions = {}): Promise<CategoriesApiResponse> {
  try {
    // Fetch all material categories
    const { data: categories, error } = await supabase
      .from('material_categories')
      .select('name');
    
    if (error) {
      console.error('Error fetching material categories:', error);
      return { data: [], error };
    }
    
    // Extract category names
    const categoryNames = categories.map(cat => cat.name);
    
    return { data: categoryNames, error: null };
  } catch (error) {
    console.error('Error in categories API call:', error);
    return { data: [], error: error as Error };
  }
}

/**
 * Fetch materials by IDs
 * @param ids Array of material IDs
 * @returns Promise with material data or error
 */
export async function fetchMaterialsByIds(ids: number[]): Promise<MaterialApiResponse> {
  try {
    if (!ids.length) {
      return { data: [], error: null };
    }
    
    // Fetch materials with matching IDs
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .in('id', ids);
    
    if (error) {
      console.error('Error fetching materials by IDs:', error);
      return { data: null, error };
    }
    
    // Map the data from database format to app format
    const mappedData = data.map(item => adaptDbMaterialToApp(item as DbMaterial));
    
    return { data: mappedData, error: null };
  } catch (error) {
    console.error('Error in fetchMaterialsByIds:', error);
    return { data: null, error: error as Error };
  }
}
