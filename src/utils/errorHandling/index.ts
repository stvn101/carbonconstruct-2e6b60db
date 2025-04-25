
// Export all error handling utilities from this central file
export * from './networkStatusHelper';
export * from './networkErrorHandler';
export * from './timeoutHelper';

// Re-export all used functions to maintain the public API
import { 
  showErrorToast, 
  showSuccessToast,
  clearErrorToasts,
  isOffline,
  checkNetworkStatus,
  addNetworkListeners,
  clearAllErrorToasts
} from './networkStatusHelper';
import { handleNetworkError, handleDatabaseResourceError } from './networkErrorHandler';
import { 
  timeoutPromise, 
  withTimeout,
  retryWithBackoff,
  isNetworkError
} from './timeoutHelper';

export {
  showErrorToast,
  showSuccessToast,
  clearErrorToasts,
  clearAllErrorToasts,
  isOffline,
  checkNetworkStatus,
  addNetworkListeners,
  timeoutPromise,
  withTimeout,
  retryWithBackoff,
  isNetworkError,
  handleNetworkError,
  handleDatabaseResourceError
};
