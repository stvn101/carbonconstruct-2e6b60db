
/**
 * Adds online/offline event listeners with proper cleanup
 */
export const addNetworkListeners = (
  handleOffline: () => void,
  handleOnline: () => void
): () => void => {
  // Add the event listeners
  window.addEventListener('offline', handleOffline);
  window.addEventListener('online', handleOnline);

  // Return a cleanup function
  return () => {
    window.removeEventListener('offline', handleOffline);
    window.removeEventListener('online', handleOnline);
  };
};

