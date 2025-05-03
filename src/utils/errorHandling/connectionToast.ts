
/**
 * Connection toast state management
 * Used to prevent multiple connection error toasts from showing
 */

export const CONNECTION_TOAST_STATE = {
  failure: false,
  success: false,
  id: ""
};

/**
 * Update the connection toast state
 */
export const updateToastState = (
  state: 'failure' | 'success',
  id: string
) => {
  if (state === 'failure') {
    CONNECTION_TOAST_STATE.failure = true;
    CONNECTION_TOAST_STATE.id = id;
  } else {
    CONNECTION_TOAST_STATE.success = true;
  }
};

/**
 * Reset the connection toast state
 */
export const resetToastState = () => {
  CONNECTION_TOAST_STATE.failure = false;
  CONNECTION_TOAST_STATE.success = false;
  CONNECTION_TOAST_STATE.id = "";
};

/**
 * Throttle toasts to prevent too many from appearing
 */
export const shouldThrottleToast = (() => {
  let lastToastTime = 0;
  const MIN_TOAST_INTERVAL = 5000; // 5 seconds
  
  return () => {
    const now = Date.now();
    if (now - lastToastTime < MIN_TOAST_INTERVAL) {
      return true;
    }
    lastToastTime = now;
    return false;
  };
})();
