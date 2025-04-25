
// Health check cache duration (30 seconds)
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
 * Performs a network health check with improved reliability and caching
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
    // Use a more reliable health check approach with a longer timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    // Try to fetch a small file that's likely to be cached
    const response = await fetch('/favicon.ico', { 
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Update cache
    lastHealthCheckResult = response.ok;
    lastHealthCheckTimestamp = now;
    
    return response.ok;
  } catch (error) {
    // Update cache - we're offline or having connectivity issues
    lastHealthCheckResult = false;
    lastHealthCheckTimestamp = now;
    
    // Let network status listeners know about the issue
    if (typeof window !== 'undefined') {
      const offlineEvent = new Event('app:offline');
      window.dispatchEvent(offlineEvent);
    }
    
    return false;
  }
};
