
/**
 * Supabase connection utilities with improved reliability
 */
import { checkNetworkStatus, isOffline } from '@/utils/errorHandling/networkChecker';

// Simplified connection check with improved reliability
export const checkSupabaseConnection = async (): Promise<boolean> => {
  // If device is offline, don't even try
  if (isOffline()) {
    return false;
  }
  
  try {
    // Use fetch with reasonable timeout for better reliability
    const response = await fetch('https://jaqzoyouuzhchuyzafii.supabase.co/rest/v1/', {
      method: 'HEAD',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphcXpveW91dXpoY2h1eXphZmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MTQyNjgsImV4cCI6MjA1OTM5MDI2OH0.NRKgoHt0rISen_jzkJpztRwmc4DFMeQDAinCu3eCDRE'
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(5000)
    });
    
    return response.ok;
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return false;
  }
};

// Simple connection check for when AbortSignal isn't available
export const pingSupabaseConnection = async (): Promise<boolean> => {
  if (isOffline()) {
    return false;
  }
  
  try {
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
    return false;
  }
};

// Streamlined retry function
export const checkSupabaseConnectionWithRetry = async (
  attempts: number = 2, 
  delayMs: number = 1000
): Promise<boolean> => {
  // First check if we have network connectivity at all
  if (isOffline()) {
    return false;
  }
  
  for (let i = 0; i < attempts; i++) {
    if (i > 0) {
      // Wait between retry attempts
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    const isConnected = await checkSupabaseConnection();
    if (isConnected) {
      return true;
    }
  }
  
  return false;
};
