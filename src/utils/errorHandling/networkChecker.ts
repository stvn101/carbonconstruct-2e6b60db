
// Health check cache duration (30 seconds - balanced approach)
export const HEALTH_CHECK_CACHE_DURATION = 30000;
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
 * Performs a network health check with improved reliability and less aggressive caching
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
    
    return response.ok;
  } catch (error) {
    // If that fails, use navigator.onLine as fallback
    lastHealthCheckResult = navigator.onLine;
    lastHealthCheckTimestamp = now;
    
    return navigator.onLine;
  }
};
