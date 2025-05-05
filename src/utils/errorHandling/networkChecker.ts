
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
