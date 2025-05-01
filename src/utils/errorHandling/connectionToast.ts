
/**
 * Manages connection-related toast notifications to prevent duplication
 * and provide a better user experience with less notification fatigue
 */

// Track connection notification state
export const CONNECTION_TOAST_STATE = {
  failure: false,
  success: false,
  timestamp: 0,
  id: '',
  retries: 0, // Track retries to avoid excessive notifications
};

// Minimum time between connection toasts (increased to reduce notification spam)
const MIN_TOAST_INTERVAL = 45000; // 45 seconds

/**
 * Resets the connection toast state after a specified delay
 */
export const resetToastState = (type: 'failure' | 'success', delayMs: number = 30000): void => {
  setTimeout(() => {
    CONNECTION_TOAST_STATE[type] = false;
    // Reset retries on success
    if (type === 'success') {
      CONNECTION_TOAST_STATE.retries = 0;
    }
  }, delayMs);
};

/**
 * Updates the connection toast state with improved tracking
 */
export const updateToastState = (type: 'failure' | 'success', id: string): void => {
  CONNECTION_TOAST_STATE[type] = true;
  CONNECTION_TOAST_STATE.timestamp = Date.now();
  CONNECTION_TOAST_STATE.id = id;
  
  if (type === 'failure') {
    CONNECTION_TOAST_STATE.retries += 1;
  } else {
    CONNECTION_TOAST_STATE.retries = 0;
  }
  
  resetToastState(type);
};

/**
 * Checks if a connection toast should be throttled based on time since last toast
 * and the number of recent retries to prevent toast spam
 */
export const shouldThrottleToast = (): boolean => {
  const now = Date.now();
  
  // Apply progressive throttling based on recent failures
  const retryFactor = Math.min(CONNECTION_TOAST_STATE.retries, 3);
  const throttleDuration = MIN_TOAST_INTERVAL * Math.pow(1.5, retryFactor);
  
  return CONNECTION_TOAST_STATE.failure && 
         (now - CONNECTION_TOAST_STATE.timestamp < throttleDuration);
};

/**
 * Checks if we should show a reconnection success toast
 * Only shows if we've previously shown a disconnection toast
 */
export const shouldShowReconnectionToast = (): boolean => {
  return CONNECTION_TOAST_STATE.failure && !CONNECTION_TOAST_STATE.success;
};
