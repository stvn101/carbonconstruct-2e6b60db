
/**
 * Utility functions for handling errors in a more consistent way
 */

import { toast } from "sonner";
import errorTrackingService from "@/services/errorTrackingService";

/**
 * Handles API fetch errors with better user feedback
 */
export const handleFetchError = (error: unknown, context: string): Error => {
  // Network connectivity errors
  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    console.error(`Network error in ${context}:`, error);
    toast.error("Network connection issue. Please check your internet connection.", {
      id: `network-error-${context}`,
      duration: 5000,
    });
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
 * Add network status listeners
 */
export const addNetworkListeners = (
  onOffline: () => void = () => toast.error("You're offline. Some features may be unavailable."),
  onOnline: () => void = () => toast.success("You're back online!")
): () => void => {
  if (typeof window === 'undefined') return () => {};
  
  window.addEventListener('offline', onOffline);
  window.addEventListener('online', onOnline);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('offline', onOffline);
    window.removeEventListener('online', onOnline);
  };
};
