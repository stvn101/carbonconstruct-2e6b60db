
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
    console.log('Fetching materials from API');
    
    // Check if supabase client is initialized
    if (!supabase) {
      console.error('Supabase client is not initialized');
      throw new Error('Database connection not available');
    }
    
    const { data, error } = await retryWithBackoff(
      async () => {
        console.log('Executing Supabase materials query');
        return supabase
          .from('materials')
          .select('*')
          .order('name');
      },
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
      const directResult = await supabase.from('materials').select('*');
      
      if (directResult.error) {
        console.error('Direct query error:', directResult.error);
        throw directResult.error;
      }
      
      if (!directResult.data || directResult.data.length === 0) {
        console.error('Direct query returned no materials');
        throw new Error('No materials found');
      }
      
      console.log('Direct query successful:', directResult.data.length, 'materials');
      return directResult.data;
    }
    
    console.log('Supabase API returned', data.length, 'materials');
    return data;
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
    
    // Since we're using the category column from the database,
    // we need to query that column directly
    const { data, error } = await retryWithBackoff(
      async () => supabase.from('materials').select('category').not('category', 'is', null),
      options.maxRetries || 2,
      2000
    );
    
    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
    
    // Extract unique categories
    if (data && data.length > 0) {
      const categories = [...new Set(data.map(item => item.category).filter(Boolean))].sort();
      console.log('Categories fetched:', categories);
      return categories;
    }
    
    // Fallback to direct query
    console.log('No categories found, trying direct query');
    const directResult = await supabase
      .from('materials')
      .select('category')
      .not('category', 'is', null);
      
    if (directResult.data && directResult.data.length > 0) {
      const categories = [...new Set(directResult.data.map(item => item.category).filter(Boolean))].sort();
      console.log('Categories fetched (direct):', categories);
      return categories;
    }
    
    console.log('No categories found');
    throw new Error('No categories found');
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}
