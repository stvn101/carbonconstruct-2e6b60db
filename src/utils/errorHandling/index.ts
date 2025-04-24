
export * from './networkErrorHandler';
export * from './networkStatusHelper';
export * from './timeoutHelper';

import { toast } from "sonner";
import errorTrackingService from "@/services/error/errorTrackingService";
import { handleNetworkError } from './networkErrorHandler';

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
    
    const toastId = "database-resource-error";
    
    toast.error("Database resource limit reached. Some features may be unavailable.", {
      id: toastId,
      duration: 10000,
    });
  }
};

/**
 * Clear all error toasts
 */
export const clearAllErrorToasts = (): void => {
  toast.dismiss();
};
