
import { toast } from "sonner";
import { CONNECTION_TOAST_STATE } from "./connectionToast";

// Retry backoff timing in milliseconds
const RETRY_DELAYS = [1000, 2000, 5000, 10000];
const MAX_RETRIES = 3;

interface RetryConfig {
  onRetry?: (attempt: number) => void;
  onSuccess?: () => void;
  onFailure?: (error: Error) => void;
  maxRetries?: number;
}

/**
 * Attempts to recover a failed operation with exponential backoff
 */
export const retryWithRecovery = async <T>(
  operation: () => Promise<T>,
  config?: RetryConfig
): Promise<T | null> => {
  const {
    onRetry,
    onSuccess,
    onFailure,
    maxRetries = MAX_RETRIES,
  } = config || {};
  
  let attempt = 0;
  
  while (attempt <= maxRetries) {
    try {
      // Wait with exponential backoff before retrying
      if (attempt > 0) {
        const delay = RETRY_DELAYS[Math.min(attempt - 1, RETRY_DELAYS.length - 1)];
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Notify of retry attempt
        if (onRetry) {
          onRetry(attempt);
        }
      }
      
      // Attempt the operation
      const result = await operation();
      
      // If successful and we had shown a connection error before,
      // show a success toast
      if (attempt > 0 && CONNECTION_TOAST_STATE.failure) {
        toast.success("Connection restored", {
          description: "Your connection has been restored."
        });
        CONNECTION_TOAST_STATE.failure = false;
        CONNECTION_TOAST_STATE.success = true;
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      return result;
    } catch (error) {
      attempt++;
      
      // If we've exhausted all retries, give up
      if (attempt > maxRetries) {
        if (onFailure) {
          onFailure(error instanceof Error ? error : new Error(String(error)));
        }
        return null;
      }
    }
  }
  
  return null;
};

/**
 * Utility to trigger connection recovery for specific contexts
 */
export const recoverConnection = async (
  context: string,
  operation: () => Promise<any>,
  config?: Omit<RetryConfig, 'onRetry'>
): Promise<any> => {
  // Show a toast during the first retry
  const enhancedConfig: RetryConfig = {
    ...config,
    onRetry: (attempt) => {
      if (attempt === 1 && !CONNECTION_TOAST_STATE.failure) {
        // Only show the toast once
        const toastId = `connection-recovery-${context}`;
        toast.warning("Attempting to reconnect...", {
          id: toastId,
          duration: 0 // Persist until connection recovers
        });
        
        // Update the toast state
        CONNECTION_TOAST_STATE.failure = true;
        CONNECTION_TOAST_STATE.id = toastId;
      }
    },
    onSuccess: () => {
      // Dismiss the connection recovery toast
      if (CONNECTION_TOAST_STATE.id) {
        toast.dismiss(CONNECTION_TOAST_STATE.id);
      }
      // Call the original onSuccess if provided
      if (config?.onSuccess) {
        config.onSuccess();
      }
    }
  };
  
  return retryWithRecovery(operation, enhancedConfig);
};
