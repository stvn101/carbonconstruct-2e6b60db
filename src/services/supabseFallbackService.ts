
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import errorTrackingService from '@/services/error/errorTrackingService';
import { withTimeout } from '@/utils/errorHandling';

/**
 * Enhanced Supabase service with better error handling,
 * fallback mechanisms, and offline support
 */

// Maximum retry attempts for operations
const MAX_RETRIES = 3;
// Timeout for operations in milliseconds
const OPERATION_TIMEOUT = 10000;

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
    if (!silentFail) {
      toast.error("You're offline. Please connect to the internet to access your data.");
    }
    console.warn(`Can't perform ${operationName} while offline`);
    
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw new Error(`Cannot perform ${operationName} while offline`);
  }
  
  while (attempts < retries) {
    try {
      // Add timeout to prevent operations from hanging
      const result = await withTimeout(operation(), timeout);
      return result;
    } catch (error) {
      attempts++;
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Log the retry attempt
      console.warn(`Operation ${operationName} failed (attempt ${attempts}/${retries}):`, error);
      
      if (attempts >= retries) {
        break;
      }
      
      // Implement exponential backoff
      const backoffDelay = Math.min(1000 * Math.pow(2, attempts), 8000);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
  
  // All retries failed
  if (!silentFail) {
    toast.error(`Failed to ${operationName}. Please try again later.`);
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
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    // Use a lightweight query to test connection
    // We need to explicitly execute the query to get a Promise
    const queryPromise = async () => {
      const response = await supabase
        .from('projects')
        .select('count(*)', { count: 'exact' })
        .limit(1);
      
      return response;
    };
    
    // Now we can use our withTimeout function since queryPromise returns a proper Promise
    const response = await withTimeout(queryPromise(), 5000);
    
    if (response.error) {
      console.error('Supabase health check failed:', response.error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Supabase health check error:', error);
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
