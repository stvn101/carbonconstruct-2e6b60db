
import { toast } from "sonner";

// Keep track of shown error toasts to prevent duplicates
const shownErrorToasts = new Set<string>();
// Toast cooldowns to prevent spam
const toastCooldowns: Record<string, number> = {};
// Minimum time between similar toasts (10 seconds - increased from 5s)
const TOAST_COOLDOWN = 10000;
// Health check cache duration (20 seconds - increased from previous)
const HEALTH_CHECK_CACHE_DURATION = 20000;
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
 * Performs a network health check with improved reliability
 * Uses caching to avoid excessive checks
 */
export const checkNetworkStatus = async (): Promise<boolean> => {
  // If browser says we're offline, trust it
  if (isOffline()) {
    return false;
  }
  
  // Use cached result if recent enough
  const now = Date.now();
  if (now - lastHealthCheckTimestamp < HEALTH_CHECK_CACHE_DURATION) {
    return lastHealthCheckResult;
  }
  
  try {
    // Use fetch with a short timeout to check connectivity
    // Use favicon.ico as it's likely to be cached and a small file
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
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
    
    return false;
  }
};

/**
 * Clear specific error toasts with improved cleanup
 */
export const clearErrorToasts = (toastIds: string[]): void => {
  toastIds.forEach(id => {
    toast.dismiss(id);
    shownErrorToasts.delete(id);
    delete toastCooldowns[id];
  });
};

/**
 * Show an error toast with deduplication and cooldown
 */
export const showErrorToast = (
  message: string, 
  id: string, 
  options: { 
    duration?: number,
    persistent?: boolean 
  } = {}
): void => {
  const now = Date.now();
  
  // Skip if we've shown this recently
  if (shownErrorToasts.has(id) && 
      toastCooldowns[id] && 
      now - toastCooldowns[id] < TOAST_COOLDOWN) {
    return;
  }
  
  // Show the toast
  toast.error(message, {
    id,
    duration: options.persistent ? 0 : (options.duration || 5000)
  });
  
  // Track that we've shown this toast
  shownErrorToasts.add(id);
  toastCooldowns[id] = now;
  
  // Auto-cleanup for non-persistent toasts
  if (!options.persistent) {
    setTimeout(() => {
      shownErrorToasts.delete(id);
    }, TOAST_COOLDOWN + 5000);
  }
};

/**
 * Show a success toast with deduplication
 */
export const showSuccessToast = (
  message: string, 
  id: string, 
  duration: number = 3000
): void => {
  const now = Date.now();
  
  // Skip if we've shown this recently
  if (shownErrorToasts.has(id) && 
      toastCooldowns[id] && 
      now - toastCooldowns[id] < TOAST_COOLDOWN) {
    return;
  }
  
  toast.success(message, {
    id,
    duration
  });
  
  // Track that we've shown this toast
  shownErrorToasts.add(id);
  toastCooldowns[id] = now;
  
  // Auto-cleanup
  setTimeout(() => {
    shownErrorToasts.delete(id);
  }, TOAST_COOLDOWN);
};

/**
 * Add network status listeners with improved debouncing to prevent flashing
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
    toast.dismiss("global-offline-status");
  }
): (() => void) => {
  if (typeof window === 'undefined') return () => {};
  
  let offlineDebounceTimer: NodeJS.Timeout | null = null;
  let onlineDebounceTimer: NodeJS.Timeout | null = null;
  let offlineDetectionCount = 0;
  let healthCheckTimer: NodeJS.Timeout | null = null;
  
  // Debounced handlers with increased timers to prevent flashing
  const handleOffline = () => {
    if (onlineDebounceTimer) {
      clearTimeout(onlineDebounceTimer);
      onlineDebounceTimer = null;
    }
    
    // Track consecutive offline detections
    offlineDetectionCount += 1;
    
    // Only trigger offline mode after multiple consecutive detections
    if (offlineDetectionCount >= 2) {
      // Increased delay to prevent flashing (3.5s instead of 2s)
      if (!offlineDebounceTimer) {
        offlineDebounceTimer = setTimeout(() => {
          offlineDebounceTimer = null;
          onOffline();
        }, 3500);
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
    // This prevents false "back online" messages
    const isReallyOnline = await checkNetworkStatus();
    
    if (!isReallyOnline) {
      // If health check failed, we're not really online
      return;
    }
    
    // Increased delay to ensure connection is stable (3.5s instead of 2s)
    if (!onlineDebounceTimer) {
      onlineDebounceTimer = setTimeout(() => {
        onlineDebounceTimer = null;
        onOnline();
      }, 3500);
    }
  };
  
  // Set up listeners
  window.addEventListener('offline', handleOffline);
  window.addEventListener('online', handleOnline);
  
  // Add better health checking with higher interval (45s instead of 30s)
  // to reduce battery impact on mobile
  healthCheckTimer = setInterval(async () => {
    if (navigator.onLine) {
      // Only do a health check if we think we're online
      const isHealthy = await checkNetworkStatus();
      
      if (!isHealthy && navigator.onLine) {
        // Browser thinks we're online but health check failed
        // This catches partial connectivity issues
        offlineDetectionCount += 1;
        if (offlineDetectionCount >= 2) {
          handleOffline();
        }
      } else if (isHealthy && !navigator.onLine) {
        // Browser thinks we're offline but health check succeeded
        // This is unusual but can happen
        handleOnline();
      }
    }
  }, 45000);
  
  // Return cleanup function
  return () => {
    if (offlineDebounceTimer) clearTimeout(offlineDebounceTimer);
    if (onlineDebounceTimer) clearTimeout(onlineDebounceTimer);
    if (healthCheckTimer) clearInterval(healthCheckTimer);
    window.removeEventListener('offline', handleOffline);
    window.removeEventListener('online', handleOnline);
    
    // Clear any lingering toasts on unmount
    toast.dismiss('global-online-status');
    toast.dismiss('global-offline-status');
  };
};

/**
 * Clear all error toasts
 */
export const clearAllErrorToasts = (): void => {
  toast.dismiss();
  shownErrorToasts.clear();
  Object.keys(toastCooldowns).forEach(key => delete toastCooldowns[key]);
};
