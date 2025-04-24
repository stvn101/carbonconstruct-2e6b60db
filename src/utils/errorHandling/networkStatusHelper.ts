import { toast } from "sonner";

// Keep track of shown error toasts to prevent duplicates
const shownErrorToasts = new Set<string>();

/**
 * Check if the device is offline
 */
export const isOffline = (): boolean => {
  return typeof navigator !== 'undefined' && !navigator.onLine;
};

/**
 * Clear specific error toasts
 */
export const clearErrorToasts = (toastIds: string[]): void => {
  toastIds.forEach(id => {
    toast.dismiss(id);
    shownErrorToasts.delete(id);
  });
};

/**
 * Add network status listeners with debounce to prevent flashing
 */
export const addNetworkListeners = (
  onOffline: () => void = () => {
    // Don't show toast if we've already shown one recently
    if (!shownErrorToasts.has("global-offline-status")) {
      toast.error("You're offline. Some features may be unavailable.", {
        id: "global-offline-status",
        duration: 0 // Keep showing until back online
      });
      
      shownErrorToasts.add("global-offline-status");
    }
  },
  onOnline: () => void = () => {
    toast.success("You're back online!", {
      id: "global-online-status",
      duration: 3000
    });
    // Clear the offline toast status when back online
    shownErrorToasts.delete("global-offline-status");
    toast.dismiss("global-offline-status");
  }
): (() => void) => {
  if (typeof window === 'undefined') return () => {};
  
  let offlineDebounceTimer: NodeJS.Timeout | null = null;
  let onlineDebounceTimer: NodeJS.Timeout | null = null;
  let offlineDetectionCount = 0;
  
  // Debounced handlers to prevent flashing on quick connectivity changes
  const handleOffline = () => {
    if (onlineDebounceTimer) {
      clearTimeout(onlineDebounceTimer);
      onlineDebounceTimer = null;
    }
    
    // Track consecutive offline detections
    offlineDetectionCount += 1;
    
    // Only trigger offline mode after multiple consecutive detections
    if (offlineDetectionCount >= 2) {
      // Small delay to prevent flashing
      if (!offlineDebounceTimer) {
        offlineDebounceTimer = setTimeout(() => {
          offlineDebounceTimer = null;
          onOffline();
        }, 2500); // Increased to 2.5 seconds for more stability
      }
    }
  };
  
  const handleOnline = () => {
    // Reset offline detection counter
    offlineDetectionCount = 0;
    
    if (offlineDebounceTimer) {
      clearTimeout(offlineDebounceTimer);
      offlineDebounceTimer = null;
    }
    
    // Small delay to ensure connection is stable
    if (!onlineDebounceTimer) {
      onlineDebounceTimer = setTimeout(() => {
        onlineDebounceTimer = null;
        onOnline();
      }, 2500); // Increased to 2.5 seconds for more stability
    }
  };
  
  // Set up listeners
  window.addEventListener('offline', handleOffline);
  window.addEventListener('online', handleOnline);
  
  // Perform more reliable connectivity check
  const healthCheckInterval = setInterval(() => {
    if (navigator.onLine) {
      // If we think we're online, do a quick fetch test with a shorter timeout
      fetch('/favicon.ico', { 
        method: 'HEAD', 
        cache: 'no-store',
        signal: AbortSignal.timeout(3000)  // 3-second timeout is reasonable for a small favicon
      })
        .then(() => {
          // If successful and we previously thought we were offline,
          // trigger the online handler
          if (offlineDetectionCount > 0) {
            offlineDetectionCount = 0;
            handleOnline();
          }
        })
        .catch(() => {
          // If fetch fails despite navigator.onLine being true,
          // we may have partial connectivity issues
          handleOffline();
        });
    }
  }, 30000); // Check every 30 seconds
  
  // Return cleanup function
  return () => {
    if (offlineDebounceTimer) clearTimeout(offlineDebounceTimer);
    if (onlineDebounceTimer) clearTimeout(onlineDebounceTimer);
    clearInterval(healthCheckInterval);
    window.removeEventListener('offline', handleOffline);
    window.removeEventListener('online', handleOnline);
    
    // Clear toasts on unmount to prevent stuck messages
    toast.dismiss('global-online-status');
    toast.dismiss('global-offline-status');
  };
};
