
/**
 * Fallback service for offline operations
 * Provides functionality for when the app is disconnected from Supabase
 */

export { checkSupabaseConnection, checkSupabaseConnectionWithRetry } from './connection';

// Simple offline fallback for data that should be cached
export const getFallbackData = (key: string): any => {
  try {
    const data = localStorage.getItem(`fallback_${key}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to retrieve fallback data:', error);
    return null;
  }
};

// Save data for offline use
export const saveFallbackData = (key: string, data: any): boolean => {
  try {
    localStorage.setItem(`fallback_${key}`, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save fallback data:', error);
    return false;
  }
};

// Clear cached data
export const clearFallbackData = (key: string): boolean => {
  try {
    localStorage.removeItem(`fallback_${key}`);
    return true;
  } catch (error) {
    console.error('Failed to clear fallback data:', error);
    return false;
  }
};

/**
 * Database operation handler with fallback support
 */
export const performDbOperation = async <T>(
  operation: () => Promise<T>,
  operationName: string,
  options: {
    fallbackData?: T;
    silentFail?: boolean;
  } = {}
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    console.error(`Error in ${operationName}:`, error);
    
    // If fallback data is provided, return it when operation fails
    if (options.fallbackData !== undefined) {
      return options.fallbackData;
    }
    
    // Re-throw the error if not set to silent fail
    if (!options.silentFail) {
      throw error;
    }
    
    throw new Error(`Operation ${operationName} failed`);
  }
};
