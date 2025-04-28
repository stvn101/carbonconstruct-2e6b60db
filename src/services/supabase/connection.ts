
/**
 * Supabase connection utilities
 */
import { checkNetworkStatus } from '@/utils/errorHandling/networkChecker';

// Basic check if Supabase is accessible with retry logic
export const checkSupabaseConnectionWithRetry = async (
  attempts: number = 3, 
  delayMs: number = 500
): Promise<boolean> => {
  // First check if we're online at all
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return false;
  }
  
  const isNetworkAvailable = await checkNetworkStatus();
  if (!isNetworkAvailable) {
    return false;
  }
  
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
        // Use AbortController for timeout
        signal: AbortSignal.timeout(3000) // 3 second timeout
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
