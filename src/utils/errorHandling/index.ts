
// Export all error handling utilities from this central file
export * from './networkListeners';
export * from './toastHelpers';
export * from './networkErrorHandler';

// Explicitly handle the duplicate isNetworkError functions
// Export from timeoutHelper with a renamed export
export { isNetworkError as isNetworkTimeoutError } from './timeoutHelper'; 

// Export all other functions from timeoutHelper except the conflicting one
export { timeoutPromise, withTimeout, retryWithBackoff } from './timeoutHelper';

// Export everything from networkChecker (including its isNetworkError)
export * from './networkChecker';

// Utility to combine errors with timeout handling
export const withNetworkErrorHandling = async <T>(
  promise: Promise<T>, 
  timeoutMs: number = 15000,
  maxRetries: number = 2
): Promise<T> => {
  try {
    // First try with timeout
    // Use the explicitly imported withTimeout function
    return await withTimeout(promise, timeoutMs);
  } catch (error) {
    // Check if it's a network error
    const { isNetworkError } = await import('./networkChecker');
    if (isNetworkError(error)) {
      // Retry with backoff for network errors
      const { retryWithBackoff } = await import('./timeoutHelper');
      return retryWithBackoff(() => promise, maxRetries);
    }
    // If not a network error, rethrow
    throw error;
  }
};
