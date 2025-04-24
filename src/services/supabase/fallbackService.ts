
import { toast } from 'sonner';
import errorTrackingService from '@/services/error/errorTrackingService';
import { checkSupabaseConnection, OPERATION_TIMEOUT, MAX_RETRIES, withTimeout } from './connection';
import OfflineStorage from './offlineStorage';

// Track shown connection toasts to prevent duplicates
const CONNECTION_TOAST_SHOWN = {
  failure: false,
  success: false,
  timestamp: 0,
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
    if (!silentFail && !CONNECTION_TOAST_SHOWN.failure) {
      toast.error("You're offline. Please connect to the internet to access your data.", {
        id: "offline-db-operation"
      });
      CONNECTION_TOAST_SHOWN.failure = true;
      CONNECTION_TOAST_SHOWN.timestamp = Date.now();
      
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
  
  const backoff = (attempt: number) => Math.min(1000 * Math.pow(1.5, attempt), 5000);
  
  while (attempts < retries) {
    try {
      const result = await withTimeout(operation(), timeout);
      
      if (CONNECTION_TOAST_SHOWN.failure && !CONNECTION_TOAST_SHOWN.success) {
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
      
      await new Promise(resolve => setTimeout(resolve, backoff(attempts)));
    }
  }
  
  if (!silentFail && !CONNECTION_TOAST_SHOWN.failure) {
    toast.error(`Failed to ${operationName}. Please check your connection and try again later.`, {
      id: `db-operation-failed-${operationName}`,
      duration: 5000,
    });
    
    CONNECTION_TOAST_SHOWN.failure = true;
    CONNECTION_TOAST_SHOWN.timestamp = Date.now();
    
    setTimeout(() => {
      CONNECTION_TOAST_SHOWN.failure = false;
    }, 10000);
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
