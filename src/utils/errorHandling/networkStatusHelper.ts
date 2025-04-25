
import { toast } from "sonner";

// Keep track of shown error toasts to prevent duplicates
const shownErrorToasts = new Set<string>();
// Toast cooldowns to prevent spam
const toastCooldowns: Record<string, number> = {};
// Minimum time between similar toasts (increased to 20 seconds)
const TOAST_COOLDOWN = 20000;
// Health check cache duration (increased to 30 seconds)
const HEALTH_CHECK_CACHE_DURATION = 30000;
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
 * This is the central source of truth for all network status checks
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
    const timeoutId = setTimeout(() => controller.abort(), 8000); // Extended timeout
    
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
 * Clear all error toasts
 */
export const clearAllErrorToasts = (): void => {
  toast.dismiss();
  shownErrorToasts.clear();
  Object.keys(toastCooldowns).forEach(key => delete toastCooldowns[key]);
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
  // Skip if message is empty (used to dismiss toasts)
  if (!message) {
    toast.dismiss(id);
    return;
  }

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
    toast.dismiss("global-offline-status");
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
    // This prevents momentary network blips from triggering offline mode
    if (offlineDetectionCount >= 3) {
      // Increased delay to prevent flashing (5s instead of 3.5s)
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
    // This prevents false "back online" messages
    const isReallyOnline = await checkNetworkStatus();
    
    if (!isReallyOnline) {
      // If health check failed, we're not really online
      return;
    }
    
    // Increased delay to ensure connection is stable (5s instead of 3.5s)
    if (!onlineDebounceTimer) {
      onlineDebounceTimer = setTimeout(() => {
        onlineDebounceTimer = null;
        onOnline();
      }, 5000);
    }
  };
  
  // Set up listeners for standard browser events
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  // Set up listener for custom app:offline event
  window.addEventListener('app:offline', handleOffline);
  
  // Add better health checking with higher interval (60s instead of 45s)
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
    toast.dismiss('global-online-status');
    toast.dismiss('global-offline-status');
  };
};

// Export everything for central access
export {
  TOAST_COOLDOWN,
  HEALTH_CHECK_CACHE_DURATION
};
