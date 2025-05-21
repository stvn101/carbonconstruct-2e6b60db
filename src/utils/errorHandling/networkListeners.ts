
import { showErrorToast, showSuccessToast } from './toastHelpers';
import { checkNetworkStatus, isNetworkError } from './networkChecker';
import { pingSupabaseConnection } from '@/services/supabase/connection';

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
  
  // Debounced handlers with increased thresholds to prevent flapping
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
        }, 3000); // Increased to 3s to avoid incorrect offline detections
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
    
    // Further verify with a Supabase ping
    const canReachSupabase = await pingSupabaseConnection();
    
    if (!canReachSupabase) {
      return;
    }
    
    if (!onlineDebounceTimer) {
      onlineDebounceTimer = setTimeout(() => {
        onlineDebounceTimer = null;
        onOnline();
      }, 2000); // Debounce online events to avoid flapping
    }
  };
  
  // Set up listeners
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  // Add health checking with reduced frequency (45s interval)
  healthCheckTimer = setInterval(async () => {
    if (navigator.onLine) {
      const isHealthy = await checkNetworkStatus();
      
      if (!isHealthy && navigator.onLine) {
        offlineDetectionCount += 1;
        if (offlineDetectionCount >= 3) { // Require more confirmations
          handleOffline();
        }
      } else if (isHealthy && !navigator.onLine) {
        handleOnline();
      }
    } else {
      // If navigator says we're offline, occasionally check if that's actually true
      const attemptRecovery = Math.random() < 0.2; // 20% chance to check
      if (attemptRecovery) {
        const isActuallyOnline = await checkNetworkStatus();
        if (isActuallyOnline) {
          handleOnline();
        }
      }
    }
  }, 45000); // Check less often (45s) to reduce unnecessary network traffic
  
  // Return cleanup function
  return () => {
    if (offlineDebounceTimer) clearTimeout(offlineDebounceTimer);
    if (onlineDebounceTimer) clearTimeout(onlineDebounceTimer);
    if (healthCheckTimer) clearInterval(healthCheckTimer);
    window.removeEventListener('offline', handleOffline);
    window.removeEventListener('online', handleOnline);
    
    // Clear any lingering toasts on unmount
    showErrorToast("", 'global-online-status');
    showErrorToast("", 'global-offline-status');
  };
};

// Simpler recovery function
export const triggerConnectionRecovery = async (): Promise<boolean> => {
  // Just check basic connectivity
  return navigator.onLine && await checkNetworkStatus();
};
