
/**
 * Utility functions for handling errors in a more consistent way
 */

import { toast } from "sonner";
import errorTrackingService from "@/services/error/errorTrackingService";

// Keep track of shown error toasts to prevent duplicates
const shownErrorToasts = new Set<string>();
// Cooldown timers for specific types of toasts
const toastCooldowns: Record<string, number> = {};
// Global minimum delay between similar toasts (5 seconds)
const TOAST_COOLDOWN = 5000;

/**
 * Handles API fetch errors with better user feedback
 */
export const handleFetchError = (error: unknown, context: string): Error => {
  // Network connectivity errors
  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    console.error(`Network error in ${context}:`, error);
    
    const toastId = `network-error-${context}`;
    const now = Date.now();
    
    // Prevent showing duplicate toasts within cooldown period
    if (!shownErrorToasts.has(toastId) && 
        (!toastCooldowns[toastId] || now - toastCooldowns[toastId] > TOAST_COOLDOWN)) {
      
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
      
      // Track that we've shown this toast and update cooldown
      shownErrorToasts.add(toastId);
      toastCooldowns[toastId] = now;
      
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
        }, 2000); // Increased from 1000ms to 2000ms
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
      }, 2000); // Increased from 1500ms to 2000ms
    }
  };
  
  // Perform periodic checks to detect partial network issues
  const healthCheckInterval = setInterval(() => {
    if (navigator.onLine) {
      // If we think we're online, do a quick fetch test
      fetch('/favicon.ico', { method: 'HEAD', cache: 'no-store' })
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
  
  window.addEventListener('offline', handleOffline);
  window.addEventListener('online', handleOnline);
  
  // Return cleanup function
  return () => {
    if (offlineDebounceTimer) clearTimeout(offlineDebounceTimer);
    if (onlineDebounceTimer) clearTimeout(onlineDebounceTimer);
    clearInterval(healthCheckInterval);
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
