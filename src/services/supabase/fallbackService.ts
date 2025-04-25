
import { toast } from 'sonner';
import errorTrackingService from '@/services/error/errorTrackingService';
import { 
  checkSupabaseConnection, 
  OPERATION_TIMEOUT, 
  MAX_RETRIES, 
  withTimeout,
  calculateBackoffDelay
} from './connection';
import OfflineStorage from './offlineStorage';
import { showErrorToast, showSuccessToast, isOffline } from '@/utils/errorHandling/networkStatusHelper';

// Track connection notification state
const CONNECTION_TOAST_SHOWN = {
  failure: false,
  success: false,
  timestamp: 0,
  id: '',
};

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
    retries = MAX_RETRIES,
    timeout = OPERATION_TIMEOUT,
    fallbackData,
    silentFail = false
  } = options;
  
  // Check network connectivity first
  if (isOffline()) {
    // Clear any stale error toasts
    toast.dismiss("db-operation-failed");
    
    // Show offline toast if not already shown and not in silent mode
    if (!silentFail && !CONNECTION_TOAST_SHOWN.failure) {
      const toastId = "offline-db-operation";
      
      showErrorToast(
        "You're offline. Please connect to the internet to access your data.", 
        toastId, 
        { persistent: true }
      );
      
      CONNECTION_TOAST_SHOWN.failure = true;
      CONNECTION_TOAST_SHOWN.timestamp = Date.now();
      CONNECTION_TOAST_SHOWN.id = toastId;
      
      // Auto-reset after delay
      setTimeout(() => {
        CONNECTION_TOAST_SHOWN.failure = false;
      }, 20000); // Extended from 10s to 20s
    }
    
    console.warn(`Can't perform ${operationName} while offline`);
    
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw new Error(`Cannot perform ${operationName} while offline`);
  }
  
  let attempts = 0;
  let lastError: Error | null = null;
  
  // Improved retry loop with better backoff and error handling
  while (attempts < retries) {
    try {
      // Wrap the operation with a timeout
      const result = await withTimeout(() => operation(), timeout);
      
      // If previous failure was shown and we're now successful
      if (CONNECTION_TOAST_SHOWN.failure && !CONNECTION_TOAST_SHOWN.success) {
        // Clear any previous error toasts
        toast.dismiss("db-operation-failed");
        toast.dismiss(CONNECTION_TOAST_SHOWN.id);
        
        showSuccessToast("Connection restored successfully!", "connection-restored");
        
        CONNECTION_TOAST_SHOWN.success = true;
        CONNECTION_TOAST_SHOWN.failure = false;
        
        setTimeout(() => {
          CONNECTION_TOAST_SHOWN.success = false;
        }, 20000); // Extended from 10s to 20s
      }
      
      return result;
    } catch (error) {
      attempts++;
      lastError = error instanceof Error ? error : new Error(String(error));
      
      console.warn(`Operation ${operationName} failed (attempt ${attempts}/${retries}):`, error);
      
      if (attempts >= retries) {
        break;
      }
      
      // Check if we're offline after an error to fail faster
      if (isOffline()) {
        console.warn(`Network went offline during ${operationName}. Aborting retries.`);
        break;
      }
      
      // Wait before retry with improved backoff calculation
      const backoffDelay = calculateBackoffDelay(attempts);
      console.info(`Retrying ${operationName} in ${backoffDelay}ms...`);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
  
  // Only show toast if not in silent mode and no recent toast has been shown
  if (!silentFail) {
    const now = Date.now();
    const toastId = `db-operation-failed-${operationName}`;
    
    // Prevent duplicate toasts within short period (extended from 10s to 30s)
    if (!CONNECTION_TOAST_SHOWN.failure || 
        now - CONNECTION_TOAST_SHOWN.timestamp > 30000 ||
        CONNECTION_TOAST_SHOWN.id !== toastId) {
        
      // Clear any previous error toasts first
      toast.dismiss("db-operation-failed");
      toast.dismiss(CONNECTION_TOAST_SHOWN.id);
      
      showErrorToast(
        `Failed to ${operationName}. Please check your connection and try again later.`,
        toastId,
        { duration: 8000 }
      );
      
      CONNECTION_TOAST_SHOWN.failure = true;
      CONNECTION_TOAST_SHOWN.timestamp = now;
      CONNECTION_TOAST_SHOWN.id = toastId;
      
      // Auto-reset after delay
      setTimeout(() => {
        CONNECTION_TOAST_SHOWN.failure = false;
      }, 30000); // Extended from 15s to 30s
    }
  }
  
  // Track error for debugging
  errorTrackingService.captureException(
    lastError || new Error(`Unknown error in ${operationName}`),
    { context: operationName, attempts }
  );
  
  // Return fallback data if provided
  if (fallbackData !== undefined) {
    return fallbackData;
  }
  
  throw lastError || new Error(`Failed to ${operationName} after ${retries} attempts`);
};

/**
 * Wrapper for database operations with offline fallback
 */
export const withOfflineFallback = async <T>(
  operation: () => Promise<T>,
  operationName: string,
  fallbackData: T
): Promise<T> => {
  return performDbOperation(operation, operationName, {
    fallbackData,
    silentFail: true
  });
};

// Helper function for calculating backoff delay with jitter
export const calculateBackoffDelay = (attempt: number): number => {
  // Base delay starts at 2 seconds (increased from previous value)
  const baseDelay = 2000;
  // More conservative exponential factor (1.5 instead of 2)
  // This makes retry delays: 2s, 3s, 4.5s, 6.75s, etc.
  // Instead of: 2s, 4s, 8s, 16s, etc.
  const factor = 1.5;
  // Maximum delay capped at 15 seconds
  const maxDelay = 15000;
  
  // Calculate exponential delay
  const delay = Math.min(baseDelay * Math.pow(factor, attempt - 1), maxDelay);
  
  // Add jitter (±15%) to prevent thundering herd problem
  const jitter = delay * 0.15 * (Math.random() * 2 - 1);
  
  return Math.floor(delay + jitter);
};

// Re-export for convenience
export { 
  checkSupabaseConnection, 
  OfflineStorage,
  isOffline 
};
