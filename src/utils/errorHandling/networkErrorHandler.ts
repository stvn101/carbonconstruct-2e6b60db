
import { toast } from 'sonner';
import { isNetworkError } from './isNetworkError';
import { showErrorToast } from './toastHelpers';

/**
 * Handles network errors with improved messaging
 */
export const handleNetworkError = (error: unknown, context: string): Error => {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  
  // Handle connection errors
  if (isNetworkError(errorObj)) {
    const errorId = `network-${context}`;
    showErrorToast(
      "Network connection issue. Please check your internet connection.", 
      errorId,
      { duration: 5000 }
    );
    return new Error(`Network error in ${context}: ${errorObj.message}`);
  }
  
  // Handle timeout errors
  if (errorObj.message.includes('timeout') || errorObj.message.includes('timed out')) {
    const errorId = `timeout-${context}`;
    showErrorToast(
      "Request timed out. Please try again later.", 
      errorId,
      { duration: 5000 }
    );
    return new Error(`Timeout in ${context}: ${errorObj.message}`);
  }
  
  // Handle generic errors
  const errorId = `error-${context}`;
  showErrorToast(
    `An error occurred. Please try again.`,
    errorId,
    { duration: 5000 }
  );
  
  return new Error(`Error in ${context}: ${errorObj.message}`);
};

/**
 * Check if the application is currently offline
 */
export const isOffline = (): boolean => {
  return typeof navigator !== 'undefined' && !navigator.onLine;
};

