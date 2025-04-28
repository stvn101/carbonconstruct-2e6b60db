
/**
 * Fallback service for offline operations
 * Provides functionality for when the app is disconnected from Supabase
 */

// Check connection status with retry logic
export const checkSupabaseConnectionWithRetry = async (
  attempts: number = 3, 
  delayMs: number = 500
): Promise<boolean> => {
  for (let i = 0; i < attempts; i++) {
    try {
      if (i > 0) {
        // Wait between retry attempts
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(1.5, i)));
      }

      // Use fetch to check if we can reach the Supabase API
      // This is a lightweight check without requiring credentials
      const response = await fetch('https://api.supabase.co/status', {
        method: 'HEAD',
        cache: 'no-store',
        mode: 'cors',
        signal: AbortSignal.timeout(3000) // Abort after 3 seconds
      });
      
      return response.ok;
    } catch (error) {
      console.error(`Connection check attempt ${i+1} failed:`, error);
      
      // On last attempt, give up
      if (i === attempts - 1) {
        return false;
      }
    }
  }
  
  return false;
};

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
