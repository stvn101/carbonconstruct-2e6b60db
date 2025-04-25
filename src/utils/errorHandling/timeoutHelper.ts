

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
 * Helper to identify if an error is network-related
 */
export const isNetworkError = (error: unknown): boolean => {
  if (!error) return false;
  
  const errorString = String(error);
  return (
    errorString.includes('Failed to fetch') ||
    errorString.includes('Network Error') ||
    errorString.includes('NetworkError') ||
    errorString.includes('timeout') ||
    errorString.includes('ETIMEDOUT') ||
    errorString.includes('ECONNREFUSED') ||
    errorString.includes('ECONNRESET') ||
    errorString.includes('EAI_AGAIN') ||
    errorString.includes('network')
  );
};

/**
 * More conservative retry utility with exponential backoff and jitter
 * 
 * @param operation Function to execute and potentially retry
 * @param maxRetries Maximum number of retry attempts
 * @param initialDelay Initial delay in ms
 * @param options Additional options
 * @returns Result of the operation
 */
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 2, // Reduced from 3 to 2
  initialDelay: number = 4000, // Increased from 3000
  options: {
    onRetry?: (attempt: number) => void;
    shouldRetry?: (error: unknown) => boolean;
    maxDelay?: number;
    factor?: number;
  } = {}
): Promise<T> => {
  const { 
    onRetry, 
    shouldRetry = isNetworkError,
    maxDelay = 60000,   // Cap at 1 minute
    factor = 1.5        // More conservative than 2
  } = options;
  
  let attempt = 0;
  
  while (true) {
    try {
      return await operation();
    } catch (error) {
      attempt++;
      
      // If we've reached max retries, or if we shouldn't retry this error type, throw
      if (attempt >= maxRetries || !shouldRetry(error)) {
        throw error;
      }
      
      // Calculate delay with jitter
      const baseDelay = Math.min(
        initialDelay * Math.pow(factor, attempt - 1),
        maxDelay
      );
      
      // Add jitter (±25%) to prevent thundering herd problem
      const jitterFactor = 0.25 * (Math.random() * 2 - 1);
      const delay = Math.floor(baseDelay * (1 + jitterFactor));
      
      if (onRetry) {
        onRetry(attempt);
      }
      
      // Check if we're offline before retrying
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('Network offline');
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};
