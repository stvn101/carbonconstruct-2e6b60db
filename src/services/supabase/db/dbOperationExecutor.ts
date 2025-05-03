
import { toast } from 'sonner';
import errorTrackingService from '@/services/error/errorTrackingService';
import { isOffline } from '@/utils/errorHandling/networkErrorHandler';
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
  
  while (attempts < retries) {
    try {
      const result = await operation();
      
      if (CONNECTION_TOAST_STATE.failure && !CONNECTION_TOAST_STATE.success) {
        toast.dismiss("db-operation-failed");
        toast.dismiss(CONNECTION_TOAST_STATE.id);
        
        showSuccessToast("Connection restored successfully!", "connection-restored");
        
        updateToastState('success', 'connection-restored');
      }
      
      return result;
    } catch (error) {
      attempts++;
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempts >= retries || isOffline()) {
        break;
      }
      
      const backoffDelay = calculateBackoffDelay(attempts);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
  
  if (!silentFail) {
    const now = Date.now();
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
