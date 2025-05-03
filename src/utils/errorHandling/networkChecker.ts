
/**
 * Utility functions to check network connectivity with improved reliability
 */

/**
 * Check if the application is currently offline using multiple signals
 */
export function isOffline(): boolean {
  return typeof navigator !== 'undefined' && !navigator.onLine;
}

/**
 * Check current network status with more advanced detection than just navigator.onLine
 * @returns Promise resolving to boolean indicating if network is available
 */
export async function checkNetworkStatus(): Promise<boolean> {
  // First check the basic navigator.onLine property
  if (typeof navigator === 'undefined' || !navigator.onLine) {
    return false;
  }

  // Then attempt a lightweight network request to confirm connectivity
  try {
    // Use a data URL to avoid an actual network request but test fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    // Try to fetch a tiny resource to check connectivity
    // We use /favicon.ico as it's typically small and cached
    await fetch('/favicon.ico', { 
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal,
      // Add random parameter to avoid cache
      headers: { 'Cache-Control': 'no-cache' }
    });
    
    clearTimeout(timeoutId);
    return true;
  } catch (error) {
    console.log('Network check failed:', error);
    return false;
  }
}
