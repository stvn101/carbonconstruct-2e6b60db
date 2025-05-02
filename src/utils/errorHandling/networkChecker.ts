
// Health check cache duration (30 seconds - balanced approach)
export const HEALTH_CHECK_CACHE_DURATION = 30000;
// Last health check result and timestamp
let lastHealthCheckResult = true;
let lastHealthCheckTimestamp = 0;

/**
 * Check if the device is offline based on browser API
 */
export const isOffline = (): boolean => {
  console.log('Checking if offline, navigator.onLine:', navigator.onLine);
  return typeof navigator !== 'undefined' && !navigator.onLine;
};

/**
 * Performs a network health check with improved reliability and less aggressive caching
 */
export const checkNetworkStatus = async (): Promise<boolean> => {
  console.log('Running network status check');
  // If browser says we're offline, trust it
  if (isOffline()) {
    console.log('Browser says we are offline');
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
