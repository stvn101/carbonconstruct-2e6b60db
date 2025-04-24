
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import errorTrackingService from '@/services/error/errorTrackingService';
import { withTimeout } from '@/utils/errorHandling';

/**
 * Enhanced Supabase service with better error handling,
 * fallback mechanisms, and offline support
 */

// Maximum retry attempts for operations
const MAX_RETRIES = 2; // Reduced from 3 to 2 to prevent excessive retries
// Timeout for operations in milliseconds
const OPERATION_TIMEOUT = 8000; // Reduced from 10000 to 8000 for faster feedback
// Healthcheck timeout in milliseconds
const HEALTHCHECK_TIMEOUT = 5000;

// Track shown connection toasts to prevent duplicates
const CONNECTION_TOAST_SHOWN = {
  failure: false,
  success: false,
  timestamp: 0,
};

// Cache successful health check result for a short time to prevent excessive checks
let lastHealthCheckResult = false;
let lastHealthCheckTime = 0;
const HEALTHCHECK_CACHE_TTL = 10000; // 10 seconds

/**
 * Performs a database operation with automatic retries,
 * timeout, and appropriate error handling
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
  
  let attempts = 0;
  let lastError: Error | null = null;
  
  // Check for offline status
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    if (!silentFail && !CONNECTION_TOAST_SHOWN.failure) {
      toast.error("You're offline. Please connect to the internet to access your data.", {
        id: "offline-db-operation"
      });
      CONNECTION_TOAST_SHOWN.failure = true;
      CONNECTION_TOAST_SHOWN.timestamp = Date.now();
      
      // Reset the toast flag after a reasonable time
      setTimeout(() => {
        CONNECTION_TOAST_SHOWN.failure = false;
      }, 10000); // 10 seconds
    }
    
    console.warn(`Can't perform ${operationName} while offline`);
    
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw new Error(`Cannot perform ${operationName} while offline`);
  }
  
  // Use an exponential backoff strategy
  const backoff = (attempt: number) => Math.min(1000 * Math.pow(1.5, attempt), 5000);
  
  while (attempts < retries) {
    try {
      // Add timeout to prevent operations from hanging
      const result = await withTimeout(operation(), timeout);
      
      // Show success toast if we previously showed a failure
      if (CONNECTION_TOAST_SHOWN.failure && !CONNECTION_TOAST_SHOWN.success) {
        toast.success("Connection restored successfully!", { 
          id: "connection-restored", 
          duration: 3000 
        });
        CONNECTION_TOAST_SHOWN.success = true;
        CONNECTION_TOAST_SHOWN.failure = false;
        
        // Reset the success toast flag after a reasonable time
        setTimeout(() => {
          CONNECTION_TOAST_SHOWN.success = false;
        }, 10000);
      }
      
      return result;
    } catch (error) {
      attempts++;
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Log the retry attempt
      console.warn(`Operation ${operationName} failed (attempt ${attempts}/${retries}):`, error);
      
      if (attempts >= retries) {
        break;
      }
      
      // Wait before trying again
      await new Promise(resolve => setTimeout(resolve, backoff(attempts)));
    }
  }
  
  // All retries failed
  if (!silentFail && !CONNECTION_TOAST_SHOWN.failure) {
    toast.error(`Failed to ${operationName}. Please check your connection and try again later.`, {
      id: `db-operation-failed-${operationName}`,
      duration: 5000, // Don't keep error toast forever
    });
    
    CONNECTION_TOAST_SHOWN.failure = true;
    CONNECTION_TOAST_SHOWN.timestamp = Date.now();
    
    // Reset the toast flag after a reasonable time
    setTimeout(() => {
      CONNECTION_TOAST_SHOWN.failure = false;
    }, 10000);
  }
  
  // Track the error
  errorTrackingService.captureException(
    lastError || new Error(`Unknown error in ${operationName}`),
    { context: operationName, attempts }
  );
  
  // Return fallback data if provided
  if (fallbackData !== undefined) {
    return fallbackData;
  }
  
  // Otherwise throw the last error
  throw lastError || new Error(`Failed to ${operationName} after ${retries} attempts`);
};

/**
 * Performs health check on Supabase connection
 * with caching to prevent excessive checks
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  // Use cached result if within TTL
  const now = Date.now();
  if (now - lastHealthCheckTime < HEALTHCHECK_CACHE_TTL) {
    return lastHealthCheckResult;
  }
  
  try {
    // Use a lightweight query to test connection with timeout
    const queryPromise = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('count(*)', { count: 'exact', head: true })
          .limit(0);
        
        return { data, error };
      } catch (innerError) {
        console.error('Inner Supabase health check error:', innerError);
        return { data: null, error: innerError };
      }
    };
    
    const response = await withTimeout(queryPromise(), HEALTHCHECK_TIMEOUT);
    
    const isConnected = !response.error;
    
    // Cache the result
    lastHealthCheckResult = isConnected;
    lastHealthCheckTime = now;
    
    return isConnected;
  } catch (error) {
    console.error('Supabase health check error:', error);
    
    // Cache the failed result but for a shorter time
    lastHealthCheckResult = false;
    lastHealthCheckTime = now;
    
    return false;
  }
};

/**
 * Helper to run database operations with graceful offline handling
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
