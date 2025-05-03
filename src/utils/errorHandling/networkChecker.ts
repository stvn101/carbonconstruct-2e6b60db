
/**
 * Utility for checking network status with improved error handling
 */

// Enhanced network status check with multiple signals
export const isOffline = (): boolean => {
  // First check the navigator.onLine property
  const navigatorOffline = typeof navigator !== 'undefined' && navigator.onLine === false;
  
  // Log for debugging
  console.info('Checking if offline, navigator.onLine:', navigator.onLine);
  
  return navigatorOffline;
};

// Function to check if a fetch request has timed out
export const hasTimedOut = (error: any): boolean => {
  if (!error) return false;
  
  const errorMessage = error.message || error.toString();
  return (
    errorMessage.includes('timeout') || 
    errorMessage.includes('timed out') ||
    errorMessage.includes('abort')
  );
};

// Function to check if an error is a network error
export const isNetworkError = (error: any): boolean => {
  if (!error) return false;
  
  const errorMessage = error.message || error.toString();
  return (
    errorMessage.includes('Failed to fetch') ||
    errorMessage.includes('Network request failed') ||
    errorMessage.includes('Network Error') ||
    errorMessage.includes('NetworkError') ||
    errorMessage.includes('ETIMEDOUT')
  );
};

// Helper to create a timeout promise
export const createTimeoutPromise = <T>(ms: number): Promise<T> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms);
  });
};

// Fetch with timeout
export const fetchWithTimeout = <T>(fetchPromise: Promise<T>, timeoutMs = 10000): Promise<T> => {
  return Promise.race([
    fetchPromise,
    createTimeoutPromise<T>(timeoutMs)
  ]);
};

// Test connection to a specific URL - implementation of checkNetworkStatus
export const checkNetworkStatus = async (): Promise<boolean> => {
  try {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    
    if (!isOnline) {
      return false;
    }
    
    // Attempt a lightweight connection test
    const result = await testConnection();
    return result;
  } catch (error) {
    console.error('Network check failed:', error);
    return false;
  }
};

// Test connection to a specific URL
export const testConnection = async (url: string = 'https://jaqzoyouuzhchuyzafii.supabase.co/rest/v1/', 
                                   timeoutMs = 5000): Promise<boolean> => {
  try {
    await fetchWithTimeout(
      fetch(url, { 
        method: 'HEAD',
        headers: { 
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphcXpveW91dXpoY2h1eXphZmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MTQyNjgsImV4cCI6MjA1OTM5MDI2OH0.NRKgoHt0rISen_jzkJpztRwmc4DFMeQDAinCu3eCDRE' 
        }
      }),
      timeoutMs
    );
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};
