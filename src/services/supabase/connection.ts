
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
const calculateBackoffDelay = (attempt: number, baseDelay: number = 1000, maxDelay: number = 30000): number => {
  // More conservative exponential backoff (base * 1.5^attempt instead of 2^attempt)
  // This gives a gentler curve: 1s, 1.5s, 2.25s, 3.37s, 5.06s, etc.
  const delay = Math.min(baseDelay * Math.pow(1.5, attempt), maxDelay);
  
  // Add jitter to prevent thundering herd problem (±15%)
  const jitter = delay * 0.15 * (Math.random() * 2 - 1);
  
  return Math.floor(delay + jitter);
};

/**
 * Retryable version of checkSupabaseConnection
 */
export const checkSupabaseConnectionWithRetry = async (
  maxRetries = 2, 
  initialDelay = 2000 // Increased from 1s to 2s
): Promise<boolean> => {
  let attempts = 0;
  
  while (attempts <= maxRetries) {
    try {
      const isConnected = await checkSupabaseConnection();
      if (isConnected) return true;
    } catch (error) {
      console.warn(`Connection check attempt ${attempts + 1} failed:`, error);
    }
    
    attempts++;
    if (attempts <= maxRetries) {
      // Wait before next attempt using improved backoff
      await new Promise(resolve => setTimeout(resolve, calculateBackoffDelay(attempts - 1, initialDelay)));
    }
  }
  
  return false;
};

/**
 * Gets an AbortController for Supabase operations
 * Performs a health check first and aborts if unhealthy
 */
export const getAbortControllerWithHealthCheck = async (
  timeout: number = OPERATION_TIMEOUT
): Promise<AbortController> => {
  const controller = new AbortController();
  
  // Add timeout signal to abort after specified time
  setTimeout(() => {
    if (!controller.signal.aborted) {
      controller.abort(new DOMException('Timeout', 'TimeoutError'));
    }
  }, timeout);
  
  try {
    // Only check connection if we don't have a recent health check
    const now = Date.now();
    if (now - lastHealthCheckTime > HEALTHCHECK_CACHE_TTL) {
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        controller.abort(new DOMException('Connection unavailable', 'NetworkError'));
      }
    } else if (!lastHealthCheckResult) {
      controller.abort(new DOMException('Connection unavailable', 'NetworkError'));
    }
  } catch (error) {
    console.error('Health check failed during abort controller creation', error);
    controller.abort(new DOMException('Health check failed', 'NetworkError'));
  }
  
  return controller;
};
