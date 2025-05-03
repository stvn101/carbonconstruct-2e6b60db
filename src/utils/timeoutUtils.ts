
/**
 * Utility for handling request timeouts consistently across the app
 */

// Create a timeout promise that rejects after the specified time
export const createTimeout = (ms: number, message: string = 'Operation timed out') => {
  return new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(message)), ms);
  });
};

// Race a promise against a timeout
export const withTimeout = async <T>(
  promise: Promise<T>, 
  ms: number, 
  timeoutMessage: string = 'Operation timed out',
  fallback?: T
): Promise<T> => {
  try {
    return await Promise.race([
      promise,
      createTimeout(ms, timeoutMessage)
    ]);
  } catch (error) {
    if (error instanceof Error && error.message === timeoutMessage) {
      console.warn(`Operation timed out after ${ms}ms: ${timeoutMessage}`);
      
      if (fallback !== undefined) {
        return fallback;
      }
    }
    throw error;
  }
};

// Execute a function with retry logic and timeout
export const executeWithRetry = async <T>(
  fn: () => Promise<T>,
  options: {
    retries?: number;
    timeout?: number;
    retryDelay?: number;
    timeoutMessage?: string;
    fallback?: T;
    onRetry?: (attempt: number, error: Error) => void;
  } = {}
): Promise<T> => {
  const {
    retries = 2,
    timeout = 10000,
    retryDelay = 1000,
    timeoutMessage = 'Operation timed out',
    fallback,
    onRetry
  } = options;
  
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // If not first attempt, wait before retrying
      if (attempt > 0) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        if (onRetry && lastError) {
          onRetry(attempt, lastError);
        }
      }
      
      // Execute with timeout
      return await withTimeout(fn(), timeout, timeoutMessage);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`Attempt ${attempt + 1}/${retries + 1} failed:`, error);
      
      // If this was the last retry, either return fallback or throw the error
      if (attempt === retries) {
        if (fallback !== undefined) {
          console.warn(`All ${retries + 1} attempts failed, using fallback`);
          return fallback;
        }
        throw lastError;
      }
    }
  }
  
  // This should never be reached due to the throw in the loop
  throw new Error('Unexpected error in executeWithRetry');
};
