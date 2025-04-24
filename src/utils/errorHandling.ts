/**
 * Utility functions for handling errors in a more consistent way
 */

import { toast } from "sonner";
import errorTrackingService from "@/services/error/errorTrackingService";

// Keep track of shown error toasts to prevent duplicates
const shownErrorToasts = new Set<string>();

/**
 * Handles API fetch errors with better user feedback
 */
export const handleFetchError = (error: unknown, context: string): Error => {
  // Network connectivity errors
  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    console.error(`Network error in ${context}:`, error);
    
    const toastId = `network-error-${context}`;
    
    // Prevent showing duplicate toasts
    if (!shownErrorToasts.has(toastId)) {
      // Check if error is due to insufficient resources
      if (error.message.includes('INSUFFICIENT_RESOURCES')) {
        toast.error("Database resource limit reached. Some features may be unavailable.", {
          id: `resource-error-${context}`,
          duration: 10000,
        });
      } else {
        toast.error("Network connection issue. Please check your internet connection.", {
          id: toastId,
          duration: 5000,
        });
      }
      
      // Track that we've shown this toast
      shownErrorToasts.add(toastId);
      
      // Remove from tracking after a reasonable time
      setTimeout(() => {
        shownErrorToasts.delete(toastId);
      }, 10000);
    }
    
    return new Error(`Network connectivity error in ${context}`);
  }
  
  // General error handling
  const actualError = error instanceof Error ? error : new Error(`Unknown error in ${context}`);
  
  // Log the error for tracking
  errorTrackingService.captureException(actualError, { context });
  
  return actualError;
};

/**
 * Check if the device is offline
 */
export const isOffline = (): boolean => {
  return typeof navigator !== 'undefined' && !navigator.onLine;
};

/**
 * Add network status listeners with debounce to prevent flashing
 */
export const addNetworkListeners = (
  onOffline: () => void = () => {
    toast.error("You're offline. Some features may be unavailable.", {
      id: "global-offline-status",
      duration: 0 // Keep showing until back online
    });
  },
  onOnline: () => void = () => {
    toast.success("You're back online!", {
      id: "global-online-status",
      duration: 3000
    });
  }
): (() => void) => {
  if (typeof window === 'undefined') return () => {};
  
  let offlineDebounceTimer: NodeJS.Timeout | null = null;
  let onlineDebounceTimer: NodeJS.Timeout | null = null;
  
  // Debounced handlers to prevent flashing on quick connectivity changes
  const handleOffline = () => {
    if (onlineDebounceTimer) {
      clearTimeout(onlineDebounceTimer);
      onlineDebounceTimer = null;
    }
    
    // Small delay to prevent flashing
    if (!offlineDebounceTimer) {
      offlineDebounceTimer = setTimeout(() => {
        offlineDebounceTimer = null;
        onOffline();
      }, 1000);
    }
  };
  
  const handleOnline = () => {
    if (offlineDebounceTimer) {
      clearTimeout(offlineDebounceTimer);
      offlineDebounceTimer = null;
    }
    
    // Small delay to ensure connection is stable
    if (!onlineDebounceTimer) {
      onlineDebounceTimer = setTimeout(() => {
        onlineDebounceTimer = null;
        onOnline();
      }, 1500);
    }
  };
  
  window.addEventListener('offline', handleOffline);
  window.addEventListener('online', handleOnline);
  
  // Return cleanup function
  return () => {
    if (offlineDebounceTimer) clearTimeout(offlineDebounceTimer);
    if (onlineDebounceTimer) clearTimeout(onlineDebounceTimer);
    window.removeEventListener('offline', handleOffline);
    window.removeEventListener('online', handleOnline);
  };
};

/**
 * Creates a timeout promise that rejects after specified milliseconds
 */
export const timeoutPromise = (ms: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms);
  });
};

/**
 * Execute a promise with timeout
 */
export const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    timeoutPromise(ms)
  ]);
};

/**
 * Utility to handle database resource limitations
 */
export const handleDatabaseResourceError = (error: unknown, context: string): void => {
  if (error instanceof Error && 
      (error.message.includes('INSUFFICIENT_RESOURCES') || 
       (error.toString().includes('INSUFFICIENT_RESOURCES')))) {
    
    const toastId = "database-resource-error";
    
    // Prevent duplicate toasts
    if (!shownErrorToasts.has(toastId)) {
      toast.error("Database resource limit reached. Some features may be unavailable.", {
        id: toastId,
        duration: 10000,
      });
      
      // Track that we've shown this toast
      shownErrorToasts.add(toastId);
      
      // Remove from tracking after a reasonable time
      setTimeout(() => {
        shownErrorToasts.delete(toastId);
      }, 15000);
    }
  }
};

/**
 * Clear all error toasts
 */
export const clearErrorToasts = () => {
  toast.dismiss();
  shownErrorToasts.clear();
};
