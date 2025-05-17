
/**
 * Client for interacting with the materials API
 */
import { supabase } from '@/integrations/supabase/client';
import { isOffline } from '@/utils/errorHandling/networkChecker';
import { retryWithBackoff } from '@/utils/errorHandling/retryUtils';
import { CONNECTION_TIMEOUT } from '../materialTypes';
import { ApiRequestOptions, MaterialApiResponse, CategoriesApiResponse, MaterialMapResult } from './materialApiTypes';
import { DbMaterial, adaptDbMaterialToApp } from '../adapters/materialDbAdapter';

/**
 * Fetch materials from the Supabase API with retry capability
 */
export async function fetchMaterialsFromApi(options: ApiRequestOptions = {}): Promise<any[]> {
  if (isOffline()) {
    console.log('Offline mode detected, skipping API request');
    throw new Error('Network offline');
  }
  
  try {
    console.log('Fetching materials from API with options:', options);
    
    // Check if supabase client is initialized
    if (!supabase) {
      console.error('Supabase client is not initialized');
      throw new Error('Database connection not available');
    }
    
    // Build optimized query with the provided options
    // Use the new materials table in the public schema
    let query = supabase
      .from('materials')
      .select(options.columns || '*');
      
    // Apply limit if specified
    if (options.limit) {
      query = query.limit(options.limit);
    }
      
    // Apply offset if specified
    if (options.offset !== undefined) {
      query = query.range(options.offset, options.offset + (options.limit || 1000) - 1);
    }
      
    // Apply category filter if specified
    if (options.category) {
      query = query.eq('applicable_standards', options.category);
    }
      
    // Always order by material name for consistency
    query = query.order('material');
    
    // Use standard promise handling pattern
    const { data, error } = await retryWithBackoff(
      async () => query,
      options.maxRetries || 2,
      2000,
      {
        onRetry: options.onRetry || ((attempt) => {
          console.log(`Retry attempt ${attempt} for materials fetch`);
        }),
        shouldRetry: (err) => !isOffline(),
        maxDelay: options.timeout || CONNECTION_TIMEOUT
      }
    );
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('No materials returned from API');
      
      // Fallback to direct query without retry - sometimes the retry mechanism itself can fail
      console.log('Attempting direct materials query without retry mechanism');
      
      // Build the same query but without retry
      let directQuery = supabase.from('materials').select(options.columns || '*');
      if (options.limit) directQuery = directQuery.limit(options.limit);
      if (options.offset !== undefined) directQuery = directQuery.range(options.offset, options.offset + (options.limit || 1000) - 1);
      if (options.category) directQuery = directQuery.eq('applicable_standards', options.category);
      directQuery = directQuery.order('material');
      
      const directResult = await directQuery;
      
      if (directResult.error) {
        console.error('Direct query error:', directResult.error);
        throw directResult.error;
      }
      
      if (!directResult.data || directResult.data.length === 0) {
        console.error('Direct query returned no materials');
        return [];
      }
      
      console.log('Direct query successful:', directResult.data.length, 'materials');
      
      // Process the materials to ensure they're valid
      const { validMaterials, invalidCount } = mapMaterialsData(directResult.data);
      
      if (invalidCount > 0) {
        console.warn(`Filtered out ${invalidCount} invalid materials from direct query`);
      }
      
      return validMaterials.map(material => adaptDbMaterialToApp(material));
    }
    
    console.log('Supabase API returned', data.length, 'materials');
    
    // Process the materials to ensure they're valid
    const { validMaterials, invalidCount } = mapMaterialsData(data);
    
    if (invalidCount > 0) {
      console.warn(`Filtered out ${invalidCount} invalid materials from API response`);
    }
    
    return validMaterials.map(material => adaptDbMaterialToApp(material));
    
  } catch (err) {
    console.error('Error fetching materials from API:', err);
    throw err;
  }
}

/**
 * Type guard to check if an object is a valid material
 */
function isValidMaterial(item: any): item is DbMaterial {
  return (
    item !== null &&
    typeof item === 'object' &&
    'id' in item &&
    'material' in item
  );
}

/**
 * Maps array of materials ensuring they match the expected structure
 */
function mapMaterialsData(data: any[]): MaterialMapResult {
  if (!Array.isArray(data)) {
    console.warn('Invalid data format received:', data);
    return { validMaterials: [], invalidCount: 0 };
  }
  
  const validMaterials: DbMaterial[] = [];
  let invalidCount = 0;
  
  for (const rawItem of data) {
    // Skip if the item is null or undefined
    if (!rawItem) {
      invalidCount++;
      continue;
    }
    
    // Use our type guard to ensure the item is a valid material
    if (isValidMaterial(rawItem)) {
      validMaterials.push(rawItem as DbMaterial);
    } else {
      console.warn('Invalid material object found in results, skipping:', rawItem);
      invalidCount++;
    }
  }
  
  return { validMaterials, invalidCount };
}

/**
 * Fetch material categories from Supabase
 */
export async function fetchCategoriesFromApi(options: ApiRequestOptions = {}): Promise<string[]> {
  if (isOffline()) {
    console.log('Offline, skipping categories API request');
    throw new Error('Network offline');
  }
  
  try {
    console.log('Fetching categories from API');
    
    // Check if supabase client is initialized
    if (!supabase) {
      console.error('Supabase client is not initialized');
      throw new Error('Database connection not available');
    }
    
    // Use the dedicated function we created for categories
    const { data, error } = await retryWithBackoff(
      async () => supabase.rpc('get_material_categories'),
      options.maxRetries || 2,
      2000
    );
    
    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
    
    // Extract categories safely
    if (data && Array.isArray(data)) {
      const categories = data
        .filter(item => item !== null && typeof item === 'object')
        .map(item => {
          // Use optional chaining to safely access the category property
          return item?.category;
        })
        .filter((category): category is string => typeof category === 'string');
      
      console.log('Categories fetched:', categories);
      return categories;
    }
    
    // Fallback to direct query
    console.log('No categories found, trying direct query');
    
    // Query distinct applicable standards from materials table
    const directResult = await supabase
      .from('materials')
      .select('applicable_standards')
      .not('applicable_standards', 'is', null)
      .order('applicable_standards');
      
    if (directResult.data && Array.isArray(directResult.data)) {
      const categories = directResult.data
        .map(item => item.applicable_standards)
        .filter((category): category is string => 
          typeof category === 'string' && category.trim() !== '');
      
      console.log('Categories fetched (direct):', categories);
      return Array.from(new Set(categories)); // Remove duplicates
    }
    
    console.log('No categories found');
    return []; // Return empty array instead of throwing
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}
