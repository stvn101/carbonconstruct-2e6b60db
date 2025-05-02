// Health check cache duration (30 seconds - balanced approach)
export const HEALTH_CHECK_CACHE_DURATION = 30000;
// Last health check result and timestamp
let lastHealthCheckResult = true;
let lastHealthCheckTimestamp = 0;

/**
 * Check if the device is offline based on browser API with improved reliability
 */
export const isOffline = (): boolean => {
  console.log('Checking if offline, navigator.onLine:', navigator.onLine);
  // Primarily rely on the browser's online status
  const browserSaysOffline = typeof navigator !== 'undefined' && !navigator.onLine;
  
  // If browser definitively says we're offline, trust it
  if (browserSaysOffline) {
    console.log('Browser says we are offline, returning true');
    return true;
  }
  
  // Otherwise check our cached health check (if we recently had a failed health check)
  // but only if the cache is still fresh
  const now = Date.now();
  if (now - lastHealthCheckTimestamp < HEALTH_CHECK_CACHE_DURATION) {
    // If our recent health check failed, we should still be considered offline
    if (!lastHealthCheckResult) {
      console.log('Recent health check failed, considering offline');
      return true;
    }
  }
  
  // Default to online for best user experience
  return false;
};

/**
 * Performs a network health check with improved reliability and less aggressive caching
 */
export const checkNetworkStatus = async (): Promise<boolean> => {
  console.log('Running network status check');
  // If browser says we're offline, trust it
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    console.log('Browser says we are offline');
    lastHealthCheckResult = false;
    lastHealthCheckTimestamp = Date.now();
    return false;
  }
  
  // Use cached result if recent enough to reduce unnecessary checks
  const now = Date.now();
  if (now - lastHealthCheckTimestamp < HEALTH_CHECK_CACHE_DURATION) {
    console.log('Using cached health check result:', lastHealthCheckResult);
    return lastHealthCheckResult;
  }
  
  try {
    console.log('Performing actual connectivity check');
    // Simplified check with a short timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    // Try to fetch a small resource from the same origin
    const response = await fetch('/favicon.ico', { 
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Update cache with success
    lastHealthCheckResult = response.ok;
    lastHealthCheckTimestamp = now;
    console.log('Health check result:', response.ok);
    
    return response.ok;
  } catch (error) {
    console.warn('Health check failed, falling back to navigator.onLine:', navigator.onLine);
    // If that fails, use navigator.onLine as fallback
    lastHealthCheckResult = navigator.onLine;
    lastHealthCheckTimestamp = now;
    
    return navigator.onLine;
  }
}
