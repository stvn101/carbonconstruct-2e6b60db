
/**
 * Network status checker utility
 */

/**
 * Check if the browser is currently offline
 */
export function isOffline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine === false;
}

/**
 * Check if an error is related to network connectivity
 */
export function isNetworkError(error: unknown): boolean {
  if (!error) return false;
  
  const errorMessage = error instanceof Error 
    ? error.message.toLowerCase() 
    : String(error).toLowerCase();
    
  return (
    errorMessage.includes('network') ||
    errorMessage.includes('offline') ||
    errorMessage.includes('internet') ||
    errorMessage.includes('connection') ||
    errorMessage.includes('unreachable') ||
    errorMessage.includes('timeout') ||
    errorMessage.includes('failed to fetch')
  );
}

/**
 * Check the current network status
 */
export async function checkNetworkStatus(): Promise<boolean> {
  // First check navigator.onLine as a quick check
  if (!navigator.onLine) {
    return false;
  }
  
  // Try to fetch a small resource to verify connectivity
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    // Use an image or favicon that should load quickly
    const response = await fetch('/favicon.ico', { 
      method: 'HEAD',
      signal: controller.signal,
      cache: 'no-cache'
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn('Network check failed:', error);
    return false;
  }
}

/**
 * Add network status listeners
 */
export function addNetworkListeners(
  onOffline: () => void,
  onOnline: () => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {}; // No-op for SSR
  }
  
  window.addEventListener('offline', onOffline);
  window.addEventListener('online', onOnline);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('offline', onOffline);
    window.removeEventListener('online', onOnline);
  };
}
