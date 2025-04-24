
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import errorTrackingService from '@/services/error/errorTrackingService';

// Maximum retry attempts for operations
export const MAX_RETRIES = 3;
// Increased timeout for operations in milliseconds (from 15000 to 20000 for more stability)
export const OPERATION_TIMEOUT = 20000;
// Healthcheck timeout in milliseconds (increased from 8000 to 10000)
export const HEALTHCHECK_TIMEOUT = 10000;

// Cache successful health check result for a short time
let lastHealthCheckResult = false;
let lastHealthCheckTime = 0;
const HEALTHCHECK_CACHE_TTL = 10000;

/**
 * Checks if the Supabase connection is working
 * Uses caching to reduce unnecessary checks
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  const now = Date.now();
  if (now - lastHealthCheckTime < HEALTHCHECK_CACHE_TTL) {
    return lastHealthCheckResult;
  }
  
  try {
    const queryPromise = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('count(*)', { count: 'exact', head: true })
          .limit(0);
        
        return { data, error };
      } catch (innerError) {
        console.error('Inner Supabase health check error:', innerError);
        return { data: null, error: innerError };
      }
    };
    
    // Add a small delay before the health check to avoid race conditions
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const response = await withTimeout(queryPromise(), HEALTHCHECK_TIMEOUT);
    
    const isConnected = !response.error;
    
    lastHealthCheckResult = isConnected;
    lastHealthCheckTime = now;
    
    if (isConnected && !lastHealthCheckResult) {
      console.info('Supabase connection restored');
    }
    
    return isConnected;
  } catch (error) {
    console.error('Supabase health check error:', error);
    
    lastHealthCheckResult = false;
    lastHealthCheckTime = now;
    
    return false;
  }
};

/**
 * Wraps a promise with a timeout
 * @param promise The promise to wrap
 * @param ms Timeout in milliseconds
 * @returns The promise result or a timeout error
 */
export const withTimeout = async <T>(promise: Promise<T>, ms: number): Promise<T> => {
  const timeoutPromise = new Promise<never>((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);
  });
  
  return Promise.race([promise, timeoutPromise]);
};

/**
 * Performs a health check and returns an AbortController that can be used to cancel
 * requests if the connection is not available
 */
export const getAbortControllerWithHealthCheck = async (): Promise<AbortController> => {
  const controller = new AbortController();
  
  try {
    const isConnected = await checkSupabaseConnection();
    if (!isConnected) {
      controller.abort('Connection unavailable');
    }
  } catch (error) {
    console.error('Health check failed during abort controller creation', error);
  }
  
  return controller;
};

/**
 * Retryable version of checkSupabaseConnection that tries multiple times
 * before giving up
 */
export const checkSupabaseConnectionWithRetry = async (
  maxRetries = 2, 
  initialDelay = 1000
): Promise<boolean> => {
  let attempts = 0;
  let currentDelay = initialDelay;
  
  while (attempts <= maxRetries) {
    try {
      const isConnected = await checkSupabaseConnection();
      if (isConnected) return true;
    } catch (error) {
      console.warn(`Connection check attempt ${attempts + 1} failed:`, error);
    }
    
    attempts++;
    if (attempts <= maxRetries) {
      await new Promise(resolve => setTimeout(resolve, currentDelay));
      currentDelay *= 2; // Exponential backoff
    }
  }
  
  return false;
};
