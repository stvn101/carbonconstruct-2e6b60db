
/**
 * Manages connection-related toast notifications to prevent duplication
 */

// Track connection notification state
export const CONNECTION_TOAST_STATE = {
  failure: false,
  success: false,
  timestamp: 0,
  id: '',
};

/**
 * Resets the connection toast state after a specified delay
 */
export const resetToastState = (type: 'failure' | 'success', delayMs: number = 20000): void => {
  setTimeout(() => {
    CONNECTION_TOAST_STATE[type] = false;
  }, delayMs);
};

/**
 * Updates the connection toast state
 */
export const updateToastState = (type: 'failure' | 'success', id: string): void => {
  CONNECTION_TOAST_STATE[type] = true;
  CONNECTION_TOAST_STATE.timestamp = Date.now();
  CONNECTION_TOAST_STATE.id = id;
  
  resetToastState(type);
};

/**
 * Checks if a connection toast should be throttled based on time since last toast
 */
export const shouldThrottleToast = (minIntervalMs: number = 30000): boolean => {
  const now = Date.now();
  return CONNECTION_TOAST_STATE.failure && 
         (now - CONNECTION_TOAST_STATE.timestamp < minIntervalMs);
};
