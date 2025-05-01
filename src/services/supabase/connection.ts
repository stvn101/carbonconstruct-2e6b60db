
/**
 * Supabase connection utilities with improved reliability
 */
import { checkNetworkStatus } from '@/utils/errorHandling/networkChecker';

// Improved check with better error handling and multiple endpoints
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Try multiple endpoints for better reliability
    const endpoints = [
      'https://api.supabase.co/status',
      'https://jaqzoyouuzhchuyzafii.supabase.co/rest/v1/' // Use project-specific endpoint as fallback
    ];
    
    for (const endpoint of endpoints) {
      try {
        // Use fetch with shorter timeout for faster feedback
        const response = await fetch(endpoint, {
          method: 'HEAD',
          cache: 'no-store',
          mode: 'cors',
          signal: AbortSignal.timeout(2500) // Shorter 2.5 second timeout
        });
        
        if (response.ok) {
          return true;
        }
      } catch (endpointError) {
        console.log(`Failed to connect to ${endpoint}:`, endpointError);
        // Continue to next endpoint
      }
    }
    
    // All endpoints failed
    return false;
  } catch (error) {
    console.error(`Connection check failed:`, error);
    return false;
  }
};

// Improved retry logic with better backoff strategy
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
        // Wait between retry attempts with progressive backoff
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(1.5, i)));
      }

      const isConnected = await checkSupabaseConnection();
      if (isConnected) {
        return true;
      }
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

// Add a simple connection ping that doesn't use AbortSignal for wider compatibility
export const pingSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Simple ping with basic fetch - more compatible with all browsers
    const response = await fetch('https://jaqzoyouuzhchuyzafii.supabase.co/rest/v1/', {
      method: 'HEAD',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphcXpveW91dXpoY2h1eXphZmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MTQyNjgsImV4cCI6MjA1OTM5MDI2OH0.NRKgoHt0rISen_jzkJpztRwmc4DFMeQDAinCu3eCDRE'
      },
      cache: 'no-store'
    });
    
    return response.ok;
  } catch (error) {
    console.error('Simple ping failed:', error);
    return false;
  }
};
