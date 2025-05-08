
/**
 * Create a handler for subscription status changes with improved error handling
 * and recovery mechanisms to address realtime performance issues
 */
export const createSubscriptionHandler = (
  retryCount: React.MutableRefObject<number>,
  maxRetries: number,
  mountedRef: React.MutableRefObject<boolean>,
  isSubscribingRef: React.MutableRefObject<boolean>,
  reconnectTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>,
  subscribeToProjects: () => any
) => {
  return (status: string) => {
    if (!mountedRef.current) return;
    
    console.log(`Realtime subscription status: ${status}`);
    
    if (status === 'SUBSCRIBED') {
      // Reset retry count on successful subscription
      retryCount.current = 0;
      console.log('Successfully subscribed to realtime changes');
    }
    
    if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
      console.error(`Realtime subscription error: ${status}`);
      
      if (retryCount.current < maxRetries && mountedRef.current) {
        // Calculate exponential backoff delay
        const backoffDelay = Math.min(1000 * (2 ** retryCount.current), 30000);
        
        console.log(`Attempting to reconnect in ${backoffDelay}ms (attempt ${retryCount.current + 1}/${maxRetries})`);
        
        // Clear any existing timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        
        // Set up new reconnection attempt
        reconnectTimeoutRef.current = setTimeout(() => {
          if (mountedRef.current && !isSubscribingRef.current) {
            retryCount.current += 1;
            isSubscribingRef.current = false; // Reset subscribing state
            subscribeToProjects();
          }
        }, backoffDelay);
      } else if (retryCount.current >= maxRetries) {
        console.warn(`Max retry attempts (${maxRetries}) reached. Stopping reconnection attempts.`);
      }
    }
  };
};
