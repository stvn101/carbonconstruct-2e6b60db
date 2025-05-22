
/**
 * Timeout and retry utilities for promise-based operations
 */

/**
 * Check if an error is a timeout or network related error
 */
export function isNetworkError(error: unknown): boolean {
  if (!error) return false;

  const errorString = String(error).toLowerCase();
  return (
    errorString.includes('timeout') ||
    errorString.includes('network') ||
    errorString.includes('failed to fetch') ||
    errorString.includes('aborted')
  );
}

/**
 * Creates a promise that rejects after a specified timeout
 */
export function timeoutPromise<T = void>(ms: number, message: string = 'Operation timed out'): Promise<T> {
  return new Promise<T>((_, reject) => {
    const id = setTimeout(() => {
      reject(new Error(message));
    }, ms);
    
    // Ensure timeout is cleared if the promise instance is explicitly garbage collected
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => clearTimeout(id));
    }
  });
}

/**
 * Wraps a promise with a timeout
 */
export async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  try {
    // Use Promise.race to compete between the actual promise and a timeout
    const result = await Promise.race([
      promise,
      timeoutPromise<T>(ms, `Operation timed out after ${ms}ms`)
    ]);
    
    // Return original promise resolution
    return result;
    
  } catch (error) {
    // Enhance error message for debugging
    if (String(error).includes('timed out')) {
      throw new Error(`Network request timed out after ${ms}ms`);
    }
    throw error;
  }
}

/**
 * Retry a promise with exponential backoff
 */
export async function retryWithBackoff<T>(
  promiseFn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelayMs: number = 1000,
  onRetry?: (attempt: number, delay: number) => void
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // First attempt immediately, then use backoff for retries
      if (attempt > 0) {
        // Calculate delay with exponential backoff and some randomization
        const delay = Math.min(
          baseDelayMs * Math.pow(2, attempt - 1) * (0.75 + Math.random() * 0.5),
          30000 // Cap at 30 seconds
        );
        
        // Notify about retry if callback provided
        if (onRetry) {
          onRetry(attempt, delay);
        }
        
        // Wait before next retry
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      // Try the operation
      return await promiseFn();
      
    } catch (error) {
      // Store the error for potential re-throw
      lastError = error;
      
      // Only retry network errors, rethrow others immediately
      if (!isNetworkError(error)) {
        throw error;
      }
      
      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        throw new Error(`Operation failed after ${maxRetries} retries: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
  
  // This should never be reached due to throw in the loop
  throw lastError || new Error('Unknown retry error');
}
