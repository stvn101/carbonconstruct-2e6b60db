
/**
 * Utilities for recovering from connection issues and network errors
 */

// Import necessary utilities
import { checkNetworkStatus } from './networkChecker';
import { showErrorToast, showSuccessToast } from './toastHelpers';
import { CONNECTION_TOAST_STATE, resetToastState } from './connectionToast';

// Progressive backoff timing for reconnection attempts
const RECONNECT_INTERVALS = [2000, 5000, 10000, 30000]; // 2s, 5s, 10s, 30s

/**
 * Attempt to recover connection with progressive backoff
 * @param onSuccess Callback fired when connection is restored
 * @param onFailure Callback fired when connection recovery fails
 * @param maxAttempts Maximum number of recovery attempts
 * @returns Cleanup function to cancel recovery attempts
 */
export const attemptConnectionRecovery = (
  onSuccess: () => void,
  onFailure?: (attemptCount: number) => void,
  maxAttempts: number = RECONNECT_INTERVALS.length
): () => void => {
  let attemptCount = 0;
  let timeoutIds: number[] = [];
  let isCancelled = false;

  const attemptReconnect = async () => {
    if (isCancelled || attemptCount >= maxAttempts) return;
    
    try {
      // Check if we're back online
      const isOnline = await checkNetworkStatus();
      
      if (isOnline) {
        // Connection restored
        if (!CONNECTION_TOAST_STATE.success) {
          showSuccessToast("Connection restored!", "connection-recovery");
          resetToastState();
        }
        
        onSuccess();
        return;
      }
    } catch (error) {
      // Network check itself failed, consider still offline
    }
    
    // Connection still not available
    attemptCount++;
    
    // Notify of continued failure if callback provided
    if (onFailure) {
      onFailure(attemptCount);
    }
    
    // Schedule next attempt if we haven't reached max
    if (attemptCount < maxAttempts) {
      const nextInterval = RECONNECT_INTERVALS[attemptCount] || RECONNECT_INTERVALS[RECONNECT_INTERVALS.length - 1];
      const nextTimeoutId = window.setTimeout(attemptReconnect, nextInterval);
      timeoutIds.push(nextTimeoutId);
    } else if (!CONNECTION_TOAST_STATE.failure) {
      // We've exhausted all attempts - show a persistent toast
      showErrorToast(
        "Unable to restore connection. Please check your internet and try again.",
        "connection-recovery-failed",
        { persistent: true }
      );
    }
  };
  
  // Start the first attempt
  const initialTimeoutId = window.setTimeout(attemptReconnect, RECONNECT_INTERVALS[0]);
  timeoutIds.push(initialTimeoutId);
  
  // Return cleanup function
  return () => {
    isCancelled = true;
    timeoutIds.forEach((id) => window.clearTimeout(id));
  };
};

/**
 * Check connection status and run appropriate callback
 * @param onOnline Function to run if online
 * @param onOffline Function to run if offline
 * @returns Promise resolving to boolean indicating online status
 */
export const checkConnectionAndRun = async (
  onOnline: () => void | Promise<void>,
  onOffline: () => void | Promise<void>
): Promise<boolean> => {
  try {
    const isOnline = await checkNetworkStatus();
    
    if (isOnline) {
      await onOnline();
      return true;
    } else {
      await onOffline();
      return false;
    }
  } catch (error) {
    // If the check fails, assume we're offline
    await onOffline();
    return false;
  }
};

/**
 * Retry an operation with connection recovery
 * @param operationKey A unique key for this operation (for toast management)
 * @param operation The async operation to perform
 * @param options Configuration options
 * @returns Result of the operation
 */
export const recoverConnection = async <T>(
  operationKey: string,
  operation: () => Promise<T>,
  options?: {
    maxAttempts?: number;
    onSuccess?: () => void;
    onFailure?: (error: Error) => void;
  }
): Promise<T> => {
  const { maxAttempts = 3, onSuccess, onFailure } = options || {};
  
  try {
    // First attempt
    return await operation();
  } catch (error) {
    // Check if we're offline
    const isOnline = await checkNetworkStatus();
    
    if (!isOnline) {
      // We're offline, start recovery process
      return new Promise((resolve, reject) => {
        const cleanup = attemptConnectionRecovery(
          // On successful recovery
          async () => {
            if (onSuccess) onSuccess();
            
            try {
              // Retry the operation
              const result = await operation();
              resolve(result);
            } catch (retryError) {
              reject(retryError);
            }
          },
          // On failure
          (attemptCount) => {
            if (attemptCount >= maxAttempts) {
              if (onFailure) {
                onFailure(new Error(`Failed to recover connection after ${maxAttempts} attempts`));
              }
              reject(new Error(`Operation failed: Unable to establish connection`));
            }
          },
          maxAttempts
        );
      });
    }
    
    // If we're online but operation failed for other reasons, rethrow
    throw error;
  }
};

/**
 * Retry an operation with recovery for connection issues
 * Similar to retryWithBackoff but with connection recovery
 * @param operation Function to retry
 * @param options Configuration options
 * @returns Result of the operation
 */
export const retryWithRecovery = async <T>(
  operation: () => Promise<T>,
  options?: {
    maxAttempts?: number;
    baseDelay?: number;
    onRetry?: (attempt: number) => void;
    onSuccess?: () => void;
    onFailure?: (error: Error) => void;
  }
): Promise<T> => {
  const { 
    maxAttempts = 3, 
    baseDelay = 2000, 
    onRetry, 
    onSuccess, 
    onFailure 
  } = options || {};
  
  let attempt = 0;
  let lastError: Error;
  
  while (attempt < maxAttempts) {
    try {
      if (attempt > 0 && onRetry) {
        onRetry(attempt);
      }
      
      const result = await operation();
      
      if (onSuccess) onSuccess();
      
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Check if we're offline
      const isOnline = await checkNetworkStatus();
      
      if (!isOnline) {
        // If we're offline, try to recover connection
        await new Promise<void>((resolve) => {
          const cleanup = attemptConnectionRecovery(
            () => resolve(),
            undefined,
            1 // Just one attempt before continuing with normal retries
          );
          
          // Set a timeout for this recovery attempt
          const timeoutId = setTimeout(() => {
            cleanup();
            resolve();
          }, baseDelay);
        });
      } else {
        // If we're online but operation failed, wait before retry
        await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(1.5, attempt)));
      }
      
      attempt += 1;
    }
  }
  
  // All attempts failed
  if (onFailure) onFailure(lastError);
  
  throw lastError;
};
