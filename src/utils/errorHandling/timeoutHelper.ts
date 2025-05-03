
/**
 * Utility to create a promise that rejects after a timeout
 * @param ms Timeout in milliseconds
 * @returns Promise that rejects after the specified timeout
 */
export function createTimeout(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms);
  });
}

/**
 * Wraps a promise with a timeout
 * @param promise The promise to wrap with timeout
 * @param ms Timeout in milliseconds
 * @returns Promise that resolves with the original promise or rejects with timeout
 */
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    createTimeout(ms)
  ]);
}

/**
 * Retry a function with exponential backoff
 * @param fn Function that returns a promise
 * @param retries Maximum number of retries
 * @param initialDelay Initial delay in milliseconds
 * @param maxDelay Maximum delay in milliseconds
 * @returns Promise resolving to the result of the function
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  initialDelay: number = 500,
  maxDelay: number = 10000
): Promise<T> {
  let lastError: Error;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.warn(`Attempt ${attempt + 1}/${retries + 1} failed:`, error);
      lastError = error as Error;
      
      if (attempt === retries) {
        break;
      }
      
      // Calculate exponential backoff with jitter
      delay = Math.min(delay * 2, maxDelay);
      // Add random jitter between 0-30% of the delay to prevent all clients retrying at once
      const jitter = delay * 0.3 * Math.random();
      const delayWithJitter = delay + jitter;
      
      console.log(`Retrying in ${delayWithJitter.toFixed(0)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delayWithJitter));
    }
  }

  throw lastError!;
}
