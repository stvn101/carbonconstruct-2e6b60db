
/**
 * Utility for retrying operations with exponential backoff and jitter
 */

/**
 * Calculates a backoff delay with jitter for retry operations
 */
export const calculateBackoffDelay = (attempt: number, options: {
  baseDelay?: number;
  factor?: number;
  maxDelay?: number;
  jitterFactor?: number;
} = {}): number => {
  const {
    baseDelay = 2000,
    factor = 1.5,
    maxDelay = 15000,
    jitterFactor = 0.15
  } = options;
  
  const delay = Math.min(baseDelay * Math.pow(factor, attempt - 1), maxDelay);
  const jitter = delay * jitterFactor * (Math.random() * 2 - 1);
  
  return Math.floor(delay + jitter);
};

/**
 * Retries an operation with exponential backoff and configurable options
 * @param operation Function to retry
 * @param maxAttempts Maximum number of retry attempts
 * @param initialDelayMs Initial delay between retries in milliseconds
 * @param options Additional retry configuration
 */
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  initialDelayMs: number = 2000,
  options: {
    onRetry?: (attempt: number) => void;
    shouldRetry?: (error: unknown) => boolean;
    maxDelay?: number;
    factor?: number;
    jitterFactor?: number;
  } = {}
): Promise<T> => {
  const {
    onRetry,
    shouldRetry = () => true,
    maxDelay = 15000,
    factor = 1.5,
    jitterFactor = 0.15
  } = options;
  
  let attempts = 0;
  let lastError: unknown = null;
  
  while (attempts < maxAttempts) {
    try {
      return await operation();
    } catch (error) {
      attempts++;
      lastError = error;
      
      if (attempts >= maxAttempts || !shouldRetry(error)) {
        break;
      }
      
      if (onRetry) {
        onRetry(attempts);
      }
      
      const backoffDelay = calculateBackoffDelay(attempts, {
        baseDelay: initialDelayMs,
        factor,
        maxDelay,
        jitterFactor
      });
      
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }
  
  throw lastError;
};
