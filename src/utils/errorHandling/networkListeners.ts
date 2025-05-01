
import { showErrorToast, showSuccessToast } from './toastHelpers';
import { checkNetworkStatus } from './networkChecker';
import { pingSupabaseConnection } from '@/services/supabase/connection';

/**
 * Add network status listeners with improved stability and automatic recovery
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
  let recoveryAttempts = 0;
  let isRecoveryInProgress = false;
  
  // Handles automatic recovery attempts when offline
  const startRecoveryAttempts = () => {
    if (isRecoveryInProgress) return;
    isRecoveryInProgress = true;
    
    const attemptRecovery = async () => {
      if (!isRecoveryInProgress) return;
      
      const isNetworkAvailable = await checkNetworkStatus();
      if (isNetworkAvailable) {
        // Try to ping Supabase as well
        const canReachSupabase = await pingSupabaseConnection();
        
        if (canReachSupabase) {
          // We're back online!
          isRecoveryInProgress = false;
          recoveryAttempts = 0;
          handleOnline();
          return;
        }
      }
      
      // Still offline, schedule another attempt with exponential backoff
      recoveryAttempts++;
      const delay = Math.min(2000 * Math.pow(1.5, recoveryAttempts), 30000);
      
      setTimeout(attemptRecovery, delay);
    };
    
    // Start first recovery attempt
    attemptRecovery();
  };
  
  // Debounced handlers with increased timers for improved stability
  const handleOffline = () => {
    if (onlineDebounceTimer) {
      clearTimeout(onlineDebounceTimer);
      onlineDebounceTimer = null;
    }
    
    // Track consecutive offline detections
    offlineDetectionCount += 1;
    
    // Only trigger offline mode after multiple consecutive detections
    if (offlineDetectionCount >= 2) {
      if (!offlineDebounceTimer) {
        offlineDebounceTimer = setTimeout(() => {
          offlineDebounceTimer = null;
          onOffline();
          // Start recovery attempts
          startRecoveryAttempts();
        }, 2000); // Reduced to respond faster
      }
    }
  };
  
  const handleOnline = async () => {
    // Reset offline detection counter
    offlineDetectionCount = 0;
    isRecoveryInProgress = false;
    
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
      // We're online but can't reach Supabase - start recovery process
      startRecoveryAttempts();
      return;
    }
    
    if (!onlineDebounceTimer) {
      onlineDebounceTimer = setTimeout(() => {
        onlineDebounceTimer = null;
        onOnline();
      }, 1000); // Respond faster when back online
    }
  };
  
  // Set up listeners
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  window.addEventListener('app:offline', handleOffline);
  
  // Add health checking with 30s interval
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
    } else {
      // If navigator says we're offline, occasionally check if that's actually true
      const attemptRecovery = Math.random() < 0.3; // 30% chance to check
      if (attemptRecovery) {
        const isActuallyOnline = await checkNetworkStatus();
        if (isActuallyOnline) {
          handleOnline();
        }
      }
    }
  }, 30000); // Check every 30 seconds
  
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
    
    isRecoveryInProgress = false;
  };
};

// Export helper to manually trigger recovery
export const triggerConnectionRecovery = async (): Promise<boolean> => {
  try {
    // First check general network connectivity
    const isNetworkAvailable = await checkNetworkStatus();
    if (!isNetworkAvailable) {
      return false;
    }
    
    // Then check Supabase specifically
    const canReachSupabase = await pingSupabaseConnection();
    return canReachSupabase;
  } catch (error) {
    console.error('Error during connection recovery:', error);
    return false;
  }
};
