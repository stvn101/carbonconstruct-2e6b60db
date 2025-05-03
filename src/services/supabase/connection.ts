
/**
 * Supabase connection utilities with improved reliability
 */
import { isOffline } from '@/utils/errorHandling/networkChecker';

// Simplified connection check with improved reliability and longer timeout
export const checkSupabaseConnection = async (): Promise<boolean> => {
  // If device is offline, don't even try
  if (isOffline()) {
    return false;
  }
  
  try {
    // Use fetch with longer timeout for better reliability
    const response = await fetch('https://jaqzoyouuzhchuyzafii.supabase.co/rest/v1/', {
      method: 'HEAD',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphcXpveW91dXpoY2h1eXphZmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MTQyNjgsImV4cCI6MjA1OTM5MDI2OH0.NRKgoHt0rISen_jzkJpztRwmc4DFMeQDAinCu3eCDRE'
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(8000)  // Increased timeout to 8 seconds for better reliability
    });
    
    return response.ok;
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return false;
  }
};

// Simple connection check without AbortSignal for broader compatibility
export const pingSupabaseConnection = async (): Promise<boolean> => {
  if (isOffline()) {
    return false;
  }
  
  try {
    // Simplified request with longer timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch('https://jaqzoyouuzhchuyzafii.supabase.co/rest/v1/', {
      method: 'HEAD',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphcXpveW91dXpoY2h1eXphZmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MTQyNjgsImV4cCI6MjA1OTM5MDI2OH0.NRKgoHt0rISen_jzkJpztRwmc4DFMeQDAinCu3eCDRE'
      },
      cache: 'no-store',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return false;
  }
};

// More conservative retry approach
export const checkSupabaseConnectionWithRetry = async (
  attempts: number = 2, 
  delayMs: number = 2000
): Promise<boolean> => {
  // First check if we have network connectivity at all
  if (isOffline()) {
    return false;
  }
  
  for (let i = 0; i < attempts; i++) {
    if (i > 0) {
      // Wait longer between retry attempts
      await new Promise(resolve => setTimeout(resolve, delayMs * (i + 1)));
    }

    const isConnected = await pingSupabaseConnection();
    if (isConnected) {
      return true;
    }
  }
  
  return false;
};
