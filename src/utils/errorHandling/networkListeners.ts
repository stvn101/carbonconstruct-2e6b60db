
import { showErrorToast, showSuccessToast } from './toastHelpers';
import { checkNetworkStatus } from './networkChecker';

/**
 * Add network status listeners with improved stability
 */
export const addNetworkListeners = (
  onOffline: () => void = () => {
    showErrorToast(
      "You're offline. Some features may be unavailable.", 
      "global-offline-status", 
      { persistent: true }
    );
  },
  onOnline: () => void = () => {
    showSuccessToast("You're back online!", "global-online-status");
    showErrorToast("", "global-offline-status"); // Dismiss offline toast
  }
): (() => void) => {
  if (typeof window === 'undefined') return () => {};
  
  let offlineDebounceTimer: NodeJS.Timeout | null = null;
  let onlineDebounceTimer: NodeJS.Timeout | null = null;
  let offlineDetectionCount = 0;
  let healthCheckTimer: NodeJS.Timeout | null = null;
  
  // Debounced handlers with increased timers for improved stability
  const handleOffline = () => {
    if (onlineDebounceTimer) {
      clearTimeout(onlineDebounceTimer);
      onlineDebounceTimer = null;
    }
    
    // Track consecutive offline detections
    offlineDetectionCount += 1;
    
    // Only trigger offline mode after multiple consecutive detections
    if (offlineDetectionCount >= 3) {
      if (!offlineDebounceTimer) {
        offlineDebounceTimer = setTimeout(() => {
          offlineDebounceTimer = null;
          onOffline();
        }, 5000);
      }
    }
  };
  
  const handleOnline = async () => {
    // Reset offline detection counter
    offlineDetectionCount = 0;
    
    if (offlineDebounceTimer) {
      clearTimeout(offlineDebounceTimer);
      offlineDebounceTimer = null;
    }
    
    // Verify with a real health check before showing online status
    const isReallyOnline = await checkNetworkStatus();
    
    if (!isReallyOnline) {
      return;
    }
    
    if (!onlineDebounceTimer) {
      onlineDebounceTimer = setTimeout(() => {
        onlineDebounceTimer = null;
        onOnline();
      }, 5000);
    }
  };
  
  // Set up listeners
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  window.addEventListener('app:offline', handleOffline);
  
  // Add health checking with 60s interval
  healthCheckTimer = setInterval(async () => {
    if (navigator.onLine) {
      const isHealthy = await checkNetworkStatus();
      
      if (!isHealthy && navigator.onLine) {
        offlineDetectionCount += 1;
        if (offlineDetectionCount >= 2) {
          handleOffline();
        }
      } else if (isHealthy && !navigator.onLine) {
        handleOnline();
      }
    }
  }, 60000);
  
  // Return cleanup function
  return () => {
    if (offlineDebounceTimer) clearTimeout(offlineDebounceTimer);
    if (onlineDebounceTimer) clearTimeout(onlineDebounceTimer);
    if (healthCheckTimer) clearInterval(healthCheckTimer);
    window.removeEventListener('offline', handleOffline);
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('app:offline', handleOffline);
    
    // Clear any lingering toasts on unmount
    showErrorToast("", 'global-online-status');
    showErrorToast("", 'global-offline-status');
  };
};
