import { toast } from 'sonner';
import errorTrackingService from '@/services/error/errorTrackingService';
import { showErrorToast } from './toastHelpers';

// Track last error time to prevent spam
const lastErrorTime: Record<string, number> = {};
const ERROR_COOLDOWN = 5000; // 5 seconds

/**
 * Enhanced network error handler with specific error type handling
 */
export const handleNetworkError = (error: unknown, context: string): Error => {
  const errorObj = error instanceof Error ? error : new Error(String(error));
  const now = Date.now();
  
  // Track error for monitoring
  errorTrackingService.captureException(errorObj, { context });
  
  // Handle network connectivity errors
  if (errorObj.message.includes('Failed to fetch') || errorObj.message.includes('NetworkError') || !navigator.onLine) {
    const errorId = `network-${context}`;
    
    if (!lastErrorTime[errorId] || now - lastErrorTime[errorId] > ERROR_COOLDOWN) {
      showErrorToast(
        "Network connection issue. Please check your internet connection.", 
        errorId,
        { duration: 5000 }
      );
      
      lastErrorTime[errorId] = now;
    }
    
    return new Error(`Network error in ${context}: ${errorObj.message}`);
  }
  
  // Handle timeout errors
  if (errorObj.message.includes('timeout') || errorObj.message.includes('timed out')) {
    const errorId = `timeout-${context}`;
    
    if (!lastErrorTime[errorId] || now - lastErrorTime[errorId] > ERROR_COOLDOWN) {
      showErrorToast(
        "Request timed out. Please try again when you have a better connection.", 
        errorId,
        { duration: 5000 }
      );
      
      lastErrorTime[errorId] = now;
    }
    
    return new Error(`Timeout in ${context}: ${errorObj.message}`);
  }
  
  // Handle database resource errors
  if (errorObj.message.includes('INSUFFICIENT_RESOURCES')) {
    const errorId = `db-resources-${context}`;
    
    if (!lastErrorTime[errorId] || now - lastErrorTime[errorId] > ERROR_COOLDOWN) {
      showErrorToast(
        "Server resources are currently limited. Some features may be unavailable.", 
        errorId,
        { duration: 8000 }
      );
      
      lastErrorTime[errorId] = now;
    }
    
    return new Error(`Database resource error in ${context}: ${errorObj.message}`);
  }
  
  // Handle generic errors (only show toasts for important contexts)
  if (['authentication', 'data-load', 'project-save'].includes(context)) {
    const errorId = `generic-${context}`;
    
    if (!lastErrorTime[errorId] || now - lastErrorTime[errorId] > ERROR_COOLDOWN) {
      showErrorToast(
        `An error occurred during ${context}. Please try again later.`,
        errorId,
        { duration: 5000 }
      );
      
      lastErrorTime[errorId] = now;
    }
  }
  
  // Return the error with context
  return new Error(`Error in ${context}: ${errorObj.message}`);
};

/**
 * Utility to handle database resource limitations
 */
export const handleDatabaseResourceError = (error: unknown, context: string): void => {
  if (error instanceof Error && 
      (error.message.includes('INSUFFICIENT_RESOURCES') || 
       (error.toString().includes('INSUFFICIENT_RESOURCES')))) {
    
    const errorId = `db-resources-${context}`;
    
    showErrorToast(
      "Database resource limit reached. Some features may be unavailable.", 
      errorId,
      { duration: 10000 }
    );
  }
};
