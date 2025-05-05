
/**
 * Utility functions for retrying operations
 */

interface RetryOptions {
  onRetry?: (attempt: number) => void;
  shouldRetry?: (error: any) => boolean;
  maxDelay?: number;
}

/**
 * Calculate backoff delay using exponential strategy with jitter
 * @param attempt Current attempt number (starting from 0)
 * @param baseDelay Base delay in milliseconds
 * @param maxDelay Maximum delay in milliseconds
 * @returns Delay in milliseconds
 */
export function calculateBackoffDelay(
  attempt: number,
  baseDelay = 1000,
  maxDelay = 30000
): number {
  // Exponential backoff: baseDelay * 2^attempt
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  
  // Add jitter: random value between 0 and 1000ms
  const jitter = Math.random() * 1000;
  
  // Constrain to maxDelay
  return Math.min(exponentialDelay + jitter, maxDelay);
}

/**
 * Retry an operation with exponential backoff
 * @param operation Operation to retry
 * @param maxRetries Maximum number of retries
 * @param baseDelay Base delay in milliseconds
 * @param options Additional options for retry behavior
 * @returns Result of the operation
 */
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000,
  options: RetryOptions = {}
): Promise<T> {
  const { onRetry, shouldRetry, maxDelay = 30000 } = options;
  
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // First attempt (attempt = 0) or retry
      return await operation();
    } catch (error) {
      lastError = error;
      
      // If this was the last attempt, don't retry
      if (attempt === maxRetries) {
        break;
      }
      
      // Check if we should retry based on the error
      if (shouldRetry && !shouldRetry(error)) {
        break;
      }
      
      // Calculate delay for this attempt
      const delay = calculateBackoffDelay(attempt, baseDelay, maxDelay);
      
      // Notify about retry
      if (onRetry) {
        onRetry(attempt + 1);
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  // If we got here, all attempts failed
  throw lastError;
}

/**
 * Create a promise that resolves after a specified timeout
 * @param ms Milliseconds to wait
 * @returns Promise that resolves after timeout
 */
export function timeout(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
