
// Export all error handling utilities from this central file
export * from './networkStatusHelper';
export * from './networkErrorHandler';
export * from './timeoutHelper';

// This is the main public API for the error handling system
import { toast } from "sonner";
import errorTrackingService from "@/services/error/errorTrackingService";
import { handleNetworkError } from './networkErrorHandler';
import { 
  showErrorToast, 
  showSuccessToast,
  clearErrorToasts,
  isOffline,
  checkNetworkStatus,
  addNetworkListeners,
  clearAllErrorToasts
} from './networkStatusHelper';
import { 
  timeoutPromise, 
  withTimeout,
  retryWithBackoff,
  isNetworkError
} from './timeoutHelper';

/**
 * Handles API fetch errors with better user feedback
 */
export const handleFetchError = (error: unknown, context: string): Error => {
  return handleNetworkError(error, context);
};

/**
 * Utility to handle database resource limitations
 */
export const handleDatabaseResourceError = (error: unknown, context: string): void => {
  if (error instanceof Error && 
      (error.message.includes('INSUFFICIENT_RESOURCES') || 
       (error.toString().includes('INSUFFICIENT_RESOURCES')))) {
    
    showErrorToast(
      "Database resource limit reached. Some features may be unavailable.", 
      "database-resource-error",
      { duration: 10000 }
    );
  }
};

// Re-export all used functions to maintain the public API
export {
  showErrorToast,
  showSuccessToast,
  clearErrorToasts,
  clearAllErrorToasts,
  isOffline,
  checkNetworkStatus,
  addNetworkListeners,
  timeoutPromise,
  withTimeout,
  retryWithBackoff,
  isNetworkError
};
