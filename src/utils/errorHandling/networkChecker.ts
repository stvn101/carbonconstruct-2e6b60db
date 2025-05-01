
// Health check cache duration (15 seconds - reduced from 30s for more frequent checks)
export const HEALTH_CHECK_CACHE_DURATION = 15000;
// Last health check result and timestamp
let lastHealthCheckResult = true;
let lastHealthCheckTimestamp = 0;

/**
 * Check if the device is offline based on browser API
 */
export const isOffline = (): boolean => {
  return typeof navigator !== 'undefined' && !navigator.onLine;
};

/**
 * Performs a network health check with improved reliability and caching
 * Uses multiple fallback URLs to ensure connectivity can be verified
 */
export const checkNetworkStatus = async (): Promise<boolean> => {
  // If browser says we're offline, trust it
  if (isOffline()) {
    return false;
  }
  
  // Use cached result if recent enough to reduce unnecessary checks
  const now = Date.now();
  if (now - lastHealthCheckTimestamp < HEALTH_CHECK_CACHE_DURATION) {
    return lastHealthCheckResult;
  }
  
  try {
    // Try multiple endpoints for better reliability
    const endpoints = [
      '/favicon.ico', // Local favicon
      'https://www.google.com/favicon.ico', // Google's favicon (very reliable)
      'https://jaqzoyouuzhchuyzafii.supabase.co/rest/v1/' // Supabase endpoint
    ];
    
    // Try each endpoint until one succeeds
    for (const url of endpoints) {
      try {
        // Use a reasonable timeout that won't block the UI for too long
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(url, { 
          method: 'HEAD',
          cache: 'no-store',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          // Update cache with success
          lastHealthCheckResult = true;
          lastHealthCheckTimestamp = now;
          return true;
        }
      } catch (endpointError) {
        // Individual endpoint error, try the next one
        console.log(`Health check endpoint ${url} failed:`, endpointError);
      }
    }
    
    // All endpoints failed
    // Update cache - we're offline or having connectivity issues
    lastHealthCheckResult = false;
    lastHealthCheckTimestamp = now;
    
    // Let network status listeners know about the issue
    if (typeof window !== 'undefined') {
      const offlineEvent = new Event('app:offline');
      window.dispatchEvent(offlineEvent);
    }
    
    return false;
  } catch (error) {
    // Handle unexpected errors
    console.error('Network check failed with error:', error);
    
    // Update cache - assume offline on error
    lastHealthCheckResult = false;
    lastHealthCheckTimestamp = now;
    
    return false;
  }
};
