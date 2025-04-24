
import { toast } from 'sonner';
import errorTrackingService from '@/services/error/errorTrackingService';
import { checkSupabaseConnection, OPERATION_TIMEOUT, MAX_RETRIES, withTimeout } from './connection';
import OfflineStorage from './offlineStorage';

// Track shown connection toasts to prevent duplicates
const CONNECTION_TOAST_SHOWN = {
  failure: false,
  success: false,
  timestamp: 0,
  id: '',
};

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
  
  let attempts = 0;
  let lastError: Error | null = null;
  
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    // Clear any stale error toasts
    toast.dismiss("db-operation-failed");
    
    if (!silentFail && !CONNECTION_TOAST_SHOWN.failure) {
      const toastId = "offline-db-operation";
      toast.error("You're offline. Please connect to the internet to access your data.", {
        id: toastId,
        duration: 0 // Keep showing until back online
      });
      CONNECTION_TOAST_SHOWN.failure = true;
      CONNECTION_TOAST_SHOWN.timestamp = Date.now();
      CONNECTION_TOAST_SHOWN.id = toastId;
      
      setTimeout(() => {
        CONNECTION_TOAST_SHOWN.failure = false;
      }, 10000);
    }
    
    console.warn(`Can't perform ${operationName} while offline`);
    
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw new Error(`Cannot perform ${operationName} while offline`);
  }
  
  // Use exponential backoff with jitter for more resilient retries
  const backoff = (attempt: number) => {
    const base = Math.min(1000 * Math.pow(2, attempt), 8000);
    const jitter = Math.random() * 1000; // Add random jitter to prevent thundering herd
    return base + jitter;
  };
  
  while (attempts < retries) {
    try {
      const result = await withTimeout(operation(), timeout);
      
      // If previous failure was shown and we're now successful
      if (CONNECTION_TOAST_SHOWN.failure && !CONNECTION_TOAST_SHOWN.success) {
        // Clear any previous error toasts
        toast.dismiss("db-operation-failed");
        toast.dismiss(CONNECTION_TOAST_SHOWN.id);
        
        toast.success("Connection restored successfully!", { 
          id: "connection-restored", 
          duration: 3000 
        });
        CONNECTION_TOAST_SHOWN.success = true;
        CONNECTION_TOAST_SHOWN.failure = false;
        
        setTimeout(() => {
          CONNECTION_TOAST_SHOWN.success = false;
        }, 10000);
      }
      
      return result;
    } catch (error) {
      attempts++;
      lastError = error instanceof Error ? error : new Error(String(error));
      
      console.warn(`Operation ${operationName} failed (attempt ${attempts}/${retries}):`, error);
      
      if (attempts >= retries) {
        break;
      }
      
      // Wait longer between retries with exponential backoff
      await new Promise(resolve => setTimeout(resolve, backoff(attempts)));
    }
  }
  
  // Only show toast if not in silent mode and no recent toast has been shown
  if (!silentFail) {
    const now = Date.now();
    const toastId = `db-operation-failed-${operationName}`;
    
    // Prevent duplicate toasts within short period
    if (!CONNECTION_TOAST_SHOWN.failure || 
        now - CONNECTION_TOAST_SHOWN.timestamp > 10000 ||
        CONNECTION_TOAST_SHOWN.id !== toastId) {
        
      // Clear any previous error toasts first
      toast.dismiss("db-operation-failed");
      toast.dismiss(CONNECTION_TOAST_SHOWN.id);
      
      toast.error(`Failed to ${operationName}. Please check your connection and try again later.`, {
        id: toastId,
        duration: 5000,
      });
      
      CONNECTION_TOAST_SHOWN.failure = true;
      CONNECTION_TOAST_SHOWN.timestamp = now;
      CONNECTION_TOAST_SHOWN.id = toastId;
      
      setTimeout(() => {
        CONNECTION_TOAST_SHOWN.failure = false;
      }, 15000);
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

// Re-export everything needed from the service
export { checkSupabaseConnection, OfflineStorage };
