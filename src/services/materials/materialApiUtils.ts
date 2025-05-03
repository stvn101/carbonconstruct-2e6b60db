
import { supabase } from '@/integrations/supabase/client';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { handleNetworkError } from '@/utils/errorHandling/networkErrorHandler';
import { showErrorToast } from '@/utils/errorHandling/toastHelpers';
import { withTimeout } from '@/utils/errorHandling/timeoutHelper';

const API_TIMEOUT = 15000; // 15 seconds timeout

/**
 * Fetch materials from the Supabase API with error handling and timeouts
 */
export async function fetchMaterialsFromApi(): Promise<ExtendedMaterialData[]> {
  try {
    // Use a timeout to prevent hanging requests
    const { data, error } = await withTimeout(
      supabase
        .from('materials')
        .select('*')
        .order('name', { ascending: true }),
      API_TIMEOUT
    );

    if (error) throw error;
    if (!data) return [];

    return data as ExtendedMaterialData[];
  } catch (error) {
    throw handleNetworkError(error, 'fetch-materials');
  }
}

/**
 * Fetch material categories from the API
 */
export async function fetchCategoriesFromApi(): Promise<string[]> {
  try {
    const { data, error } = await withTimeout(
      supabase
        .from('materials')
        .select('category')
        .not('category', 'is', null)
        .order('category', { ascending: true }),
      API_TIMEOUT
    );

    if (error) throw error;
    if (!data) return [];

    // Extract unique categories
    const categories = Array.from(new Set(
      data
        .map(item => item.category)
        .filter(Boolean) // Remove null/undefined values
    ));

    return categories;
  } catch (error) {
    throw handleNetworkError(error, 'fetch-categories');
  }
}

/**
 * Handle material API errors with user-friendly messaging
 */
export function handleMaterialApiError(error: unknown, context: string): void {
  console.error(`Material error in ${context}:`, error);
  
  const errorMessage = error instanceof Error 
    ? error.message
    : 'Unknown error occurred';
    
  if (errorMessage.toLowerCase().includes('network') || 
      errorMessage.toLowerCase().includes('offline') ||
      errorMessage.toLowerCase().includes('fetch')) {
    showErrorToast(
      "Network issue detected. Using cached materials if available.",
      "material-network-error",
      { duration: 5000 }
    );
  } else {
    showErrorToast(
      `Failed to ${context}. Using fallback data.`,
      "material-api-error",
      { duration: 5000 }
    );
  }
}
