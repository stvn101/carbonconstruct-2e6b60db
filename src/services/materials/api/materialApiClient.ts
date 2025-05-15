
/**
 * Client for interacting with the materials API
 */
import { supabase } from '@/integrations/supabase/client';
import { isOffline } from '@/utils/errorHandling/networkChecker';
import { retryWithBackoff } from '@/utils/errorHandling/retryUtils';
import { SupabaseMaterial, CONNECTION_TIMEOUT } from '../materialTypes';
import { ApiRequestOptions, MaterialApiResponse, CategoriesApiResponse } from './materialApiTypes';

/**
 * Fetch materials from the Supabase API with retry capability
 */
export async function fetchMaterialsFromApi(options: ApiRequestOptions = {}): Promise<SupabaseMaterial[]> {
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
    // Use the materials_view that's connected to our private schema
    let query = supabase
      .from('materials_view')
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
      query = query.eq('category', options.category);
    }
      
    // Apply region filter if specified
    if (options.region) {
      query = query.eq('region', options.region);
    }
      
    // Always order by name for consistency
    query = query.order('name');
    
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
      let directQuery = supabase.from('materials_view').select(options.columns || '*');
      if (options.limit) directQuery = directQuery.limit(options.limit);
      if (options.offset !== undefined) directQuery = directQuery.range(options.offset, options.offset + (options.limit || 1000) - 1);
      if (options.category) directQuery = directQuery.eq('category', options.category);
      if (options.region) directQuery = directQuery.eq('region', options.region);
      directQuery = directQuery.order('name');
      
      const directResult = await directQuery;
      
      if (directResult.error) {
        console.error('Direct query error:', directResult.error);
        throw directResult.error;
      }
      
      if (!directResult.data || directResult.data.length === 0) {
        console.error('Direct query returned no materials');
        // Return an empty array instead of trying to cast
        return [];
      }
      
      console.log('Direct query successful:', directResult.data.length, 'materials');
      
      // Make sure we have valid material objects before returning
      const safeData = Array.isArray(directResult.data) ? directResult.data : [];
      const validMaterials: SupabaseMaterial[] = [];
      
      for (const item of safeData) {
        if (!item) continue;
        
        // Explicit null check and type guard before accessing properties
        if (typeof item === 'object') {
          const id = item.id;
          const name = item.name;
          const carbon_footprint_kgco2e_kg = item.carbon_footprint_kgco2e_kg;
          const carbon_footprint_kgco2e_tonne = item.carbon_footprint_kgco2e_tonne;
          const category = item.category;
          
          // Only include materials that have all required fields
          if (id && name && carbon_footprint_kgco2e_kg !== undefined && 
              carbon_footprint_kgco2e_tonne !== undefined && category) {
            validMaterials.push({
              id,
              name,
              carbon_footprint_kgco2e_kg,
              carbon_footprint_kgco2e_tonne,
              category,
              factor: item.factor,
              unit: item.unit,
              region: item.region,
              tags: item.tags,
              sustainabilityscore: item.sustainabilityscore,
              recyclability: item.recyclability,
              alternativeto: item.alternativeto,
              notes: item.notes
            });
          }
        }
      }
      
      return validMaterials;
    }
    
    console.log('Supabase API returned', data.length, 'materials');
    
    // Make sure we have valid material objects before returning
    const safeData = Array.isArray(data) ? data : [];
    const validMaterials: SupabaseMaterial[] = [];
    
    for (const item of safeData) {
      if (!item) continue;
      
      // Explicit null check and type guard before accessing properties
      if (typeof item === 'object') {
        const id = item.id;
        const name = item.name;
        const carbon_footprint_kgco2e_kg = item.carbon_footprint_kgco2e_kg;
        const carbon_footprint_kgco2e_tonne = item.carbon_footprint_kgco2e_tonne;
        const category = item.category;
        
        // Only include materials that have all required fields
        if (id && name && carbon_footprint_kgco2e_kg !== undefined && 
            carbon_footprint_kgco2e_tonne !== undefined && category) {
          validMaterials.push({
            id,
            name,
            carbon_footprint_kgco2e_kg,
            carbon_footprint_kgco2e_tonne,
            category,
            factor: item.factor,
            unit: item.unit,
            region: item.region,
            tags: item.tags,
            sustainabilityscore: item.sustainabilityscore,
            recyclability: item.recyclability,
            alternativeto: item.alternativeto,
            notes: item.notes
          });
        }
      }
    }
    
    return validMaterials;
    
  } catch (err) {
    console.error('Error fetching materials from API:', err);
    throw err;
  }
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
        .map(item => item?.category)
        .filter((category): category is string => typeof category === 'string');
      
      console.log('Categories fetched:', categories);
      return categories;
    }
    
    // Fallback to direct query
    console.log('No categories found, trying direct query');
    const directResult = await supabase.rpc('get_material_categories');
      
    if (directResult.data && Array.isArray(directResult.data)) {
      const categories = directResult.data
        .filter(item => item !== null && typeof item === 'object')
        .map(item => item?.category)
        .filter((category): category is string => typeof category === 'string');
      
      console.log('Categories fetched (direct):', categories);
      return categories;
    }
    
    console.log('No categories found');
    return []; // Return empty array instead of throwing
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}
