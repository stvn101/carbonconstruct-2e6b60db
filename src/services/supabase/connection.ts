
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import errorTrackingService from '@/services/error/errorTrackingService';
import { showErrorToast, showSuccessToast } from '@/utils/errorHandling/networkStatusHelper';

// Configuration constants (adjusted values)
export const MAX_RETRIES = 3; // Keep at 3 but use better backoff
export const OPERATION_TIMEOUT = 30000; // Increased from 20s to 30s
export const HEALTHCHECK_TIMEOUT = 15000; // Increased from 10s to 15s

// Health check cache to prevent excessive checks
const HEALTHCHECK_CACHE_TTL = 20000; // Increased from 10s to 20s
let lastHealthCheckResult = false;
let lastHealthCheckTime = 0;

// Track connection notification states
const CONNECTION_NOTIFICATIONS = {
  failure: false,
  success: false,
  timestamp: 0,
  id: ''
};

/**
 * Checks if the Supabase connection is working
 * Uses improved caching to reduce unnecessary checks
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  const now = Date.now();
  
  // Use cached result if recent enough
  if (now - lastHealthCheckTime < HEALTHCHECK_CACHE_TTL) {
    return lastHealthCheckResult;
  }
  
  try {
    // Perform a lightweight query to check connection
    // Use a timeout to prevent hanging
    const response = await withTimeout(async () => {
      try {
        // Changed to use count head query for faster response
        // This avoids loading actual data and is more efficient
        const { count, error } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true });
          
        return { data: count, error };
      } catch (innerError) {
        console.error('Inner Supabase health check error:', innerError);
        return { data: null, error: innerError };
      }
    }, HEALTHCHECK_TIMEOUT);
    
    // Update cache
    const isConnected = !response.error;
    lastHealthCheckResult = isConnected;
    lastHealthCheckTime = now;
    
    // Show success message if we were previously disconnected
    if (isConnected && !lastHealthCheckResult && CONNECTION_NOTIFICATIONS.failure) {
      showSuccessToast('Database connection restored!', 'supabase-connection-restored');
      
      // Reset notification state
      CONNECTION_NOTIFICATIONS.failure = false;
      CONNECTION_NOTIFICATIONS.success = true;
      CONNECTION_NOTIFICATIONS.timestamp = now;
      
      // Auto-reset the success state after a delay
      setTimeout(() => {
        CONNECTION_NOTIFICATIONS.success = false;
      }, 60000);
    }
    
    return isConnected;
  } catch (error) {
    console.error('Supabase health check error:', error);
    
    // Update cache
    lastHealthCheckResult = false;
    lastHealthCheckTime = now;
    
    // Show error message if enough time has passed
    if (!CONNECTION_NOTIFICATIONS.failure || now - CONNECTION_NOTIFICATIONS.timestamp > 60000) {
      showErrorToast(
        'Unable to connect to the database. Some features may be unavailable.',
        'supabase-connection-error',
        { duration: 8000 }
      );
      
      CONNECTION_NOTIFICATIONS.failure = true;
      CONNECTION_NOTIFICATIONS.success = false;
      CONNECTION_NOTIFICATIONS.timestamp = now;
      CONNECTION_NOTIFICATIONS.id = 'supabase-connection-error';
      
      // Log to error tracking service
      errorTrackingService.captureException(
        error instanceof Error ? error : new Error('Supabase connection failed'),
        { context: 'checkSupabaseConnection' }
      );
    }
    
    return false;
  }
};

/**
 * Wraps a promise with a timeout
 * @param promise The function that returns a promise
 * @param ms Timeout in milliseconds
 * @returns The promise result or a timeout error
 */
export const withTimeout = async <T>(
  promiseFn: () => Promise<T>, 
  ms: number
): Promise<T> => {
  const timeoutError = new Error(`Operation timed out after ${ms}ms`);
  
  return new Promise<T>((resolve, reject) => {
    // Set up timeout to reject after specified milliseconds
    const timeoutId = setTimeout(() => {
      reject(timeoutError);
    }, ms);
    
    // Execute the promise function
    promiseFn()
      .then(result => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
};

/**
 * Calculate backoff delay with jitter to prevent thundering herd
 */
export const calculateBackoffDelay = (attempt: number, baseDelay: number = 1000, maxDelay: number = 15000): number => {
  // Base delay with exponential factor (1.5 instead of 2 for more gradual increase)
  const factor = 1.5;
  
  // Calculate exponential delay
  const delay = Math.min(baseDelay * Math.pow(factor, attempt - 1), maxDelay);
  
  // Add jitter (±15%) to prevent thundering herd problem
  const jitter = delay * 0.15 * (Math.random() * 2 - 1);
  
  return Math.floor(delay + jitter);
};

/**
 * Check Supabase connection with retries
 * @param maxRetries Maximum number of retry attempts
 * @param timeout Timeout in milliseconds for each attempt
 * @returns Promise that resolves to boolean indicating connection status
 */
export const checkSupabaseConnectionWithRetry = async (
  maxRetries: number = 2, 
  timeout: number = HEALTHCHECK_TIMEOUT
): Promise<boolean> => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // For retries, use increased timeout
      return await withTimeout(() => checkSupabaseConnection(), timeout);
    } catch (err) {
      console.warn(`Connection check failed (attempt ${attempt + 1}/${maxRetries})`, err);
      
      // If this is the last attempt, return false
      if (attempt === maxRetries - 1) {
        return false;
      }
      
      // Wait before retrying
      const delay = calculateBackoffDelay(attempt + 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return false;
};
