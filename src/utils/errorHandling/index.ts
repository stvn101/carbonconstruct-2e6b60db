
// Import withTimeout for local use in this file
import { withTimeout as localWithTimeout } from './timeoutHelper';

// Import isNetworkError directly for local use to avoid scope issues
import { isNetworkError } from './networkChecker';

// Export all error handling utilities from this central file
export * from './toastHelpers';
export * from './networkErrorHandler';

// Explicitly handle the duplicate isNetworkError functions
// Export from timeoutHelper with a renamed export
export { isNetworkError as isNetworkTimeoutError } from './timeoutHelper'; 

// Export all other functions from timeoutHelper except the conflicting one
export { timeoutPromise, withTimeout, retryWithBackoff } from './timeoutHelper';

// Export everything from networkChecker (including its isNetworkError)
export * from './networkChecker';

// Export functions from networkListeners without addNetworkListeners (which would cause ambiguity)
export { triggerConnectionRecovery } from './networkListeners';

// Export addNetworkListeners explicitly from networkChecker to avoid ambiguity
export { addNetworkListeners } from './networkChecker';

// Utility to combine errors with timeout handling
export const withNetworkErrorHandling = async <T>(
  promise: Promise<T>, 
  timeoutMs: number = 15000,
  maxRetries: number = 2
): Promise<T> => {
  try {
    // First try with timeout
    // Use the locally imported withTimeout function
    return await localWithTimeout(promise, timeoutMs);
  } catch (error) {
    // Check if it's a network error
    if (isNetworkError(error)) {
      // Retry with backoff for network errors
      const { retryWithBackoff } = await import('./timeoutHelper');
      return retryWithBackoff(() => promise, maxRetries);
    }
    // If not a network error, rethrow
    throw error;
  }
};
