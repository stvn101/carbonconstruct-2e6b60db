
/**
 * Utility for checking network connectivity status
 */

/**
 * Check if the application is currently offline
 * @returns boolean indicating whether the app is offline
 */
export function isOffline(): boolean {
  // Check navigator.onLine first (most browsers)
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return true;
  }
  
  // For environments where navigator.onLine might not be reliable,
  // we could expand this with more sophisticated checks
  return false;
}

/**
 * Check if the application can connect to the network
 * @returns Promise<boolean> indicating whether the app has internet connectivity
 */
export async function checkNetworkStatus(): Promise<boolean> {
  // First check basic browser API
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return false;
  }
  
  // Then try to fetch a small resource from a reliable CDN
  // Using a timeout to prevent hanging if network is unstable
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('https://www.cloudflare.com/cdn-cgi/trace', {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return true;
  } catch (error) {
    console.warn('Network check failed:', error);
    return false;
  }
}

/**
 * Determine if an error is related to network connectivity issues
 */
export function isNetworkError(error: Error): boolean {
  if (!error) return false;
  
  const message = error.message ? error.message.toLowerCase() : '';
  return message.includes('network') || 
         message.includes('failed to fetch') ||
         message.includes('offline') ||
         message.includes('connection') ||
         message.includes('timed out') ||
         message.includes('unreachable');
}

/**
 * Register callbacks for online/offline events
 * @param onOffline Callback when going offline
 * @param onOnline Callback when going online
 * @returns Cleanup function to remove event listeners
 */
export function registerNetworkListeners(
  onOffline: () => void,
  onOnline: () => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }
  
  window.addEventListener('offline', onOffline);
  window.addEventListener('online', onOnline);
  
  return () => {
    window.removeEventListener('offline', onOffline);
    window.removeEventListener('online', onOnline);
  };
}

/**
 * Add debug utility to monitor online/offline status
 * This should only be used during development
 */
export function monitorNetworkStatus(): () => void {
  if (process.env.NODE_ENV !== 'development') {
    return () => {};
  }
  
  const handleOffline = () => {
    console.log('Network status: OFFLINE');
  };
  
  const handleOnline = () => {
    console.log('Network status: ONLINE');
  };
  
  return registerNetworkListeners(handleOffline, handleOnline);
}
