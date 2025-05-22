/**
 * Connection recovery utilities
 * Provides functions to recover from connection issues and retry operations
 */

/**
 * Attempts to recover a lost connection with configurable retry logic
 * 
 * @param retries Maximum number of retries
 * @param delay Delay between retries in ms
 * @param operation Optional operation to perform when connection is recovered
 * @returns Promise that resolves to the operation result or connection status
 */
export const recoverConnection = async <T>(
  retries: number = 3,
  delay: number = 2000,
  operation?: () => Promise<T>
): Promise<T | boolean> => {
  let attempts = 0;
  
  while (attempts < retries) {
    try {
      // If an operation was provided, try to run it
      if (operation) {
        return await operation();
      }
      
      // Otherwise, just check connection
      const response = await fetch('/api/health-check', { 
        method: 'HEAD',
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (response.ok) {
        console.log('Connection recovered');
        return true;
      }
    } catch (error) {
      console.warn(`Connection recovery attempt ${attempts + 1}/${retries} failed`);
    }
    
    attempts++;
    
    if (attempts < retries) {
      const currentDelay = delay * Math.pow(1.5, attempts - 1); // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, currentDelay));
    }
  }
  
  console.error('Failed to recover connection after', retries, 'attempts');
  return false;
};

/**
 * Retry an operation with recovery logic in case of connection issues
 * 
 * @param operation Function to retry
 * @param retries Maximum number of retries
 * @param delay Initial delay between retries in ms
 * @param onRetry Callback for retry attempts
 * @returns Promise with the operation result
 */
export const retryWithRecovery = async <T>(
  operation: () => Promise<T>,
  retries: number = 3,
  delay: number = 2000,
  onRetry?: (attempt: number, currentDelay: number) => void
): Promise<T | null> => {
  let attempts = 0;
  
  while (true) {
    try {
      return await operation();
    } catch (error) {
      attempts++;
      
      if (attempts >= retries) {
        throw error;
      }
      
      const currentDelay = delay * Math.pow(1.5, attempts - 1); // Exponential backoff
      
      if (onRetry) {
        onRetry(attempts, currentDelay);
      }
      
      // Try to recover connection before retry
      await recoverConnection(1, currentDelay / 2);
      
      await new Promise(resolve => setTimeout(resolve, currentDelay));
    }
  }
};
