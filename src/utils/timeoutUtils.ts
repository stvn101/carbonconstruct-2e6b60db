
/**
 * Wraps a promise with a timeout
 * @param promise The promise to wrap
 * @param ms Timeout in milliseconds
 * @param errorMsg Custom error message
 * @returns Promise that rejects if the original promise doesn't resolve within the timeout
 */
export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  errorMsg = 'Operation timed out'
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(errorMsg));
    }, ms);
    
    // Clean up the timeout if the promise resolves or rejects
    promise.finally(() => clearTimeout(timeoutId));
  });
  
  return Promise.race([promise, timeoutPromise]);
}

/**
 * Creates a promise that resolves after the specified time
 * @param ms Time to wait in milliseconds
 * @returns Promise that resolves after the specified time
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a cancel token for aborting operations
 * @returns Object with abort function and AbortSignal
 */
export function createCancelToken() {
  const abortController = new AbortController();
  const signal = abortController.signal;
  
  return {
    abort: () => abortController.abort(),
    signal
  };
}

/**
 * Run an operation with retry and timeout
 * @param operation Function to execute
 * @param retries Number of retries
 * @param timeoutMs Timeout in milliseconds
 * @returns Result of the operation
 */
export async function withRetryAndTimeout<T>(
  operation: () => Promise<T>,
  retries = 3,
  timeoutMs = 10000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await withTimeout(operation(), timeoutMs);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      await delay(Math.pow(2, attempt) * 500); // Exponential backoff
    }
  }
  
  throw lastError || new Error('Operation failed after retries');
}
