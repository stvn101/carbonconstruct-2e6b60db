/**
 * Creates a timeout promise that rejects after specified milliseconds
 */
export const timeoutPromise = (ms: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms);
  });
};

/**
 * Execute a promise with timeout
 */
export const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    timeoutPromise(ms)
  ]);
};

/**
 * Retry an operation with exponential backoff
 */
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000,
  options: { 
    onRetry?: (attempt: number) => void,
    shouldRetry?: (error: any) => boolean 
  } = {}
): Promise<T> => {
  const { onRetry, shouldRetry = () => true } = options;
  
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // For the first attempt, just try
      if (attempt === 0) {
        return await operation();
      }
      
      // For subsequent attempts, wait with exponential backoff
      const delay = initialDelay * Math.pow(2, attempt - 1) * (0.9 + Math.random() * 0.2); // Add jitter
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Notify if there's a listener
      if (onRetry) {
        onRetry(attempt);
      }
      
      // Try again
      return await operation();
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // If we shouldn't retry this specific error, throw immediately
      if (!shouldRetry(error)) {
        throw lastError;
      }
      
      // If this was the last attempt, throw
      if (attempt === maxRetries - 1) {
        throw new Error(`Operation failed after ${maxRetries} attempts: ${lastError.message}`);
      }
      
      // Otherwise continue the loop
      console.warn(`Operation failed (attempt ${attempt + 1}/${maxRetries}), retrying...`, error);
    }
  }
  
  // This shouldn't happen due to the throw above, but TypeScript requires it
  throw new Error('Unexpected end of retry loop');
};
