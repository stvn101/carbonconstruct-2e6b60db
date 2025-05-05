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
 */
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 2,
  initialDelay: number = 4000,
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
    maxDelay = 60000,
    factor = 1.5
  } = options;
  
  let attempt = 0;
  
  while (true) {
    try {
      return await operation();
    } catch (error) {
      attempt++;
      
      if (attempt >= maxRetries || !shouldRetry(error)) {
        throw error;
      }
      
      const baseDelay = Math.min(
        initialDelay * Math.pow(factor, attempt - 1),
        maxDelay
      );
      
      const jitterFactor = 0.25 * (Math.random() * 2 - 1);
      const delay = Math.floor(baseDelay * (1 + jitterFactor));
      
      if (onRetry) {
        onRetry(attempt);
      }
      
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw new Error('Network offline');
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};
