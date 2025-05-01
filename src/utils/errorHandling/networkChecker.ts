
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
    // First, try a simple favicon fetch which is very lightweight
    const response = await fetch('/favicon.ico', { 
      method: 'HEAD',
      cache: 'no-store',
      signal: AbortSignal.timeout(2000) // Short timeout to fail fast
    });
    
    if (response.ok) {
      // Update cache with success
      lastHealthCheckResult = true;
      lastHealthCheckTimestamp = now;
      return true;
    }
  } catch (error) {
    // Continue to fallback checks
  }
  
  // Try Google's favicon as a reliable fallback
  try {
    const response = await fetch('https://www.google.com/favicon.ico', { 
      method: 'HEAD',
      cache: 'no-store',
      signal: AbortSignal.timeout(3000)
    });
    
    if (response.ok) {
      // Update cache with success
      lastHealthCheckResult = true;
      lastHealthCheckTimestamp = now;
      return true;
    }
  } catch (error) {
    // Final fallback will be attempted
  }
  
  // Use navigator.onLine as final fallback
  const isOnline = navigator.onLine;
  
  // Update cache with result
  lastHealthCheckResult = isOnline;
  lastHealthCheckTimestamp = now;
  
  return isOnline;
};
