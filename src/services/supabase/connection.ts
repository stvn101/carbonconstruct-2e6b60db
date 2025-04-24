
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import errorTrackingService from '@/services/error/errorTrackingService';

// Maximum retry attempts for operations
export const MAX_RETRIES = 2;
// Timeout for operations in milliseconds
export const OPERATION_TIMEOUT = 8000;
// Healthcheck timeout in milliseconds
export const HEALTHCHECK_TIMEOUT = 5000;

// Cache successful health check result for a short time
let lastHealthCheckResult = false;
let lastHealthCheckTime = 0;
const HEALTHCHECK_CACHE_TTL = 10000;

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
    
    const response = await withTimeout(queryPromise(), HEALTHCHECK_TIMEOUT);
    
    const isConnected = !response.error;
    
    lastHealthCheckResult = isConnected;
    lastHealthCheckTime = now;
    
    return isConnected;
  } catch (error) {
    console.error('Supabase health check error:', error);
    
    lastHealthCheckResult = false;
    lastHealthCheckTime = now;
    
    return false;
  }
};

export const withTimeout = async <T>(promise: Promise<T>, ms: number): Promise<T> => {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms);
  });
  
  return Promise.race([promise, timeoutPromise]);
};
