
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isOffline } from '@/utils/errorHandling/networkChecker';
import { showErrorToast } from '@/utils/errorHandling/toastHelpers';
import { calculateBackoffDelay } from '@/utils/errorHandling/retryUtils';
import { CONNECTION_TOAST_STATE, updateToastState } from '@/utils/errorHandling/connectionToast';
import { connectionPool, executePooledQuery } from './db/connectionPool';

/**
 * Performs a database operation with advanced error handling, timeout management
 * and connection pooling optimized for 50+ concurrent users
 */
export const performDbOperation = async <T>(
  operation: () => Promise<T>,
  operationName: string,
  options: {
    retries?: number;
    timeout?: number;
    fallbackData?: T;
    silentFail?: boolean;
    abortSignal?: AbortSignal;
    criticalOperation?: boolean;
    cacheKey?: string;
  } = {}
): Promise<T> => {
  const {
    retries = 2,
    timeout = 40000,
    fallbackData,
    silentFail = false,
    abortSignal,
    criticalOperation = false,
    cacheKey
  } = options;
  
  // Check for abort signal
  if (abortSignal?.aborted) {
    throw new Error(`Operation ${operationName} aborted by user`);
  }
  
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
  
  // Use connection pool to manage concurrent database operations
  try {
    // Execute query with connection pooling
    return await executePooledQuery(() => {
      // Set up timeout protection
      const timeoutPromise = new Promise<never>((_, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error(`Operation ${operationName} timed out after ${timeout}ms`));
        }, timeout);
        
        // Clean up timeout if aborted
        abortSignal?.addEventListener('abort', () => {
          clearTimeout(timeoutId);
          reject(new Error(`Operation ${operationName} aborted by user`));
        });
      });
      
      // Race between operation and timeout
      return Promise.race([operation(), timeoutPromise]);
    }, operationName);
  } catch (error) {
    // Handle specific error scenarios
    console.error(`Error in DB operation ${operationName}:`, error);
    
    // Clear circuit breaker if it's causing problems
    if (criticalOperation && error instanceof Error && 
        error.message.includes('circuit is open')) {
      connectionPool.resetCircuitBreaker();
    }
    
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    
    throw error;
  }
};
