
import { toast } from 'sonner';
import errorTrackingService from '@/services/error/errorTrackingService';
import { isOffline } from '@/utils/errorHandling';
import { showErrorToast, showSuccessToast } from '@/utils/errorHandling/toastHelpers';
import { CONNECTION_TOAST_STATE, updateToastState, shouldThrottleToast } from '@/utils/errorHandling/connectionToast';
import { calculateBackoffDelay } from '@/utils/errorHandling/retryUtils';

/**
 * Enhanced database operation handler with better retry logic,
 * timeout management, and user feedback
 */
export const performDbOperation = async <T>(
  operation: () => Promise<T>,
  operationName: string,
  options: {
    retries?: number;
    timeout?: number;
    fallbackData?: T;
    silentFail?: boolean;
  } = {}
): Promise<T> => {
  const {
    retries = 2,
    timeout = 40000,
    fallbackData,
    silentFail = false
  } = options;
  
  // Check network connectivity first
  if (isOffline()) {
    // Clear any stale error toasts
    toast.dismiss("db-operation-failed");
    
    // Show offline toast if not already shown and not in silent mode
    if (!silentFail && !CONNECTION_TOAST_STATE.failure) {
      const toastId = "offline-db-operation";
      
      showErrorToast(
        "You're offline. Please connect to the internet to access your data.", 
        toastId, 
        { persistent: true }
      );
      
      updateToastState('failure', toastId);
    }
    
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw new Error(`Cannot perform ${operationName} while offline`);
  }
  
  let attempts = 0;
  let lastError: Error | null = null;
  
  // Create an AbortController to handle timeouts
  const controller = new AbortController();
  const signal = controller.signal;
  
  // Set up timeout
  const timeoutId = setTimeout(() => {
    controller.abort(`Operation ${operationName} timed out after ${timeout}ms`);
  }, timeout);
  
  try {
    while (attempts < retries) {
      try {
        // We wrap the operation in a Promise.race to respect both the timeout and
        // the actual operation
        const result = await Promise.race([
          operation(),
          new Promise<never>((_, reject) => {
            signal.addEventListener('abort', () => {
              reject(new Error(`Operation ${operationName} timed out after ${timeout}ms`));
            });
          })
        ]);
        
        // Operation succeeded, show success toast if we were previously in failure state
        if (CONNECTION_TOAST_STATE.failure && !CONNECTION_TOAST_STATE.success) {
          toast.dismiss("db-operation-failed");
          toast.dismiss(CONNECTION_TOAST_STATE.id);
          
          showSuccessToast("Connection restored successfully!", "connection-restored");
          
          updateToastState('success', 'connection-restored');
        }
        
        clearTimeout(timeoutId);
        return result;
      } catch (error) {
        attempts++;
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // If we've been aborted due to timeout, or we're offline, or we're out of retries, break
        if (signal.aborted || isOffline() || attempts >= retries) {
          break;
        }
        
        // Exponential backoff for retries
        const backoffDelay = calculateBackoffDelay(attempts);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
  } finally {
    // Always clean up the timeout to prevent memory leaks
    clearTimeout(timeoutId);
  }
  
  // If we got here, all retries failed
  if (!silentFail) {
    const toastId = `db-operation-failed-${operationName}`;
    
    if (!CONNECTION_TOAST_STATE.failure || 
        !shouldThrottleToast() ||
        CONNECTION_TOAST_STATE.id !== toastId) {
        
      toast.dismiss("db-operation-failed");
      toast.dismiss(CONNECTION_TOAST_STATE.id);
      
      showErrorToast(
        `Failed to ${operationName}. Please check your connection and try again later.`,
        toastId,
        { duration: 8000 }
      );
      
      updateToastState('failure', toastId);
    }
  }
  
  errorTrackingService.captureException(
    lastError || new Error(`Unknown error in ${operationName}`),
    { context: operationName, attempts }
  );
  
  if (fallbackData !== undefined) {
    return fallbackData;
  }
  
  throw lastError || new Error(`Failed to ${operationName} after ${retries} attempts`);
};
