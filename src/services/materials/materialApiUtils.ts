
/**
 * Utility functions for material API operations
 */
import { supabase } from '@/integrations/supabase/client';
import { isOffline } from '@/utils/errorHandling';
import { toast } from 'sonner';
import { retryWithBackoff } from '@/utils/errorHandling/retryUtils';
import { SupabaseMaterial, CONNECTION_TIMEOUT } from './materialTypes';

/**
 * Fetch materials from the Supabase API with retry capability
 */
export async function fetchMaterialsFromApi(): Promise<SupabaseMaterial[]> {
  if (isOffline()) {
    console.log('Offline mode detected, skipping API request');
    throw new Error('Network offline');
  }
  
  try {
    console.log('Fetching materials from API');
    const { data, error } = await retryWithBackoff(
      async () => supabase.from('materials').select('*').order('name'),
      2,
      2000,
      {
        onRetry: (attempt) => {
          console.log(`Retry attempt ${attempt} for materials fetch`);
        },
        shouldRetry: (err) => !isOffline(),
        maxDelay: CONNECTION_TIMEOUT
      }
    );
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('No materials returned from API');
      throw new Error('No materials found');
    }
    
    return data;
  } catch (err) {
    console.error('Error fetching materials from API:', err);
    throw err;
  }
}

/**
 * Fetch material categories from Supabase
 */
export async function fetchCategoriesFromApi(): Promise<string[]> {
  if (isOffline()) {
    console.log('Offline, skipping categories API request');
    throw new Error('Network offline');
  }
  
  try {
    console.log('Fetching categories from API');
    // Since we're using the category column from the database,
    // we need to query that column directly
    const { data, error } = await retryWithBackoff(
      async () => supabase.from('materials').select('category').not('category', 'is', null),
      2,
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
    
    console.log('No categories found');
    throw new Error('No categories found');
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

/**
 * Display appropriate toast messages based on error type
 */
export function handleMaterialApiError(error: unknown, context: string): void {
  if (isOffline()) {
    toast.info("You're offline. Using fallback material data.", {
      id: "offline-materials",
      duration: 3000
    });
    return;
  }
  
  if (error instanceof Error && error.message === 'No materials found') {
    toast.warning("No materials found in database. Using default materials.", {
      id: "no-materials",
      duration: 3000
    });
    return;
  }
  
  toast.error(`Failed to ${context}. Using fallback data.`, {
    id: "materials-error",
    duration: 3000
  });
}
