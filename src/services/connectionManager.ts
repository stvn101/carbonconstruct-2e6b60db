/**
 * Connection and request manager for improved scalability
 */
import { checkSupabaseConnection } from './supabase/connection';
import { showErrorToast, showSuccessToast } from '@/utils/errorHandling/toastHelpers';

// Maximum concurrent connections per endpoint
const MAX_CONCURRENT = 8;

// Active request counter
const activeRequests: Record<string, number> = {};
const requestQueue: Array<{ key: string, executor: () => Promise<any>, resolve: (value: any) => void, reject: (reason: any) => void }> = [];
let isProcessingQueue = false;

/**
 * Queue and process requests to limit concurrent connections
 */
export async function limitedRequest<T>(
  endpoint: string, 
  executor: () => Promise<T>,
  options: {
    priority?: 'high' | 'normal' | 'low';
    timeout?: number;
  } = {}
): Promise<T> {
  const { 
    priority = 'normal', 
    timeout = 30000 
  } = options;
  
  const key = endpoint.includes('?') 
    ? endpoint.split('?')[0] 
    : endpoint;
    
  if (!activeRequests[key]) {
    activeRequests[key] = 0;
  }
  
  // Create queue entry
  return new Promise<T>((resolve, reject) => {
    // Set timeout
    const timeoutId = setTimeout(() => {
      // Remove from queue if still waiting
      const queueIndex = requestQueue.findIndex(item => 
        item.resolve === resolve && item.key === key);
        
      if (queueIndex >= 0) {
        requestQueue.splice(queueIndex, 1);
      }
      
      reject(new Error(`Request to ${key} timed out after ${timeout}ms`));
    }, timeout);
    
    // Add to queue with priority
    const queueItem = { key, executor, resolve, reject };
    
    if (priority === 'high') {
      requestQueue.unshift(queueItem);
    } else if (priority === 'low') {
      requestQueue.push(queueItem);
    } else {
      // Find position after high priority items
      const lastHighPriorityIndex = requestQueue.findIndex(item => 
        item.key.startsWith('high:'));
        
      if (lastHighPriorityIndex >= 0) {
        requestQueue.splice(lastHighPriorityIndex + 1, 0, queueItem);
      } else {
        requestQueue.push(queueItem);
      }
    }
    
    // Process queue
    processRequestQueue().finally(() => {
      clearTimeout(timeoutId);
    });
  });
}

/**
 * Process queued requests with concurrency control
 */
async function processRequestQueue(): Promise<void> {
  if (isProcessingQueue) return;
  isProcessingQueue = true;
  
  try {
    // Calculate total active requests
    const totalActive = Object.values(activeRequests)
      .reduce((sum, count) => sum + count, 0);
      
    while (requestQueue.length > 0 && totalActive < MAX_CONCURRENT) {
      // Get next request based on available slots per endpoint
      const nextRequestIndex = requestQueue.findIndex(item => {
        const current = activeRequests[item.key] || 0;
        // Allow up to 3 concurrent requests per endpoint
        return current < 3;
      });
      
      if (nextRequestIndex === -1) break;
      
      const { key, executor, resolve, reject } = requestQueue.splice(nextRequestIndex, 1)[0];
      
      // Increment active count
      activeRequests[key] = (activeRequests[key] || 0) + 1;
      
      // Execute request
      executor()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          // Decrement active count
          activeRequests[key] = Math.max(0, (activeRequests[key] || 0) - 1);
          // Process more from queue if available
          processRequestQueue();
        });
    }
  } catch (error) {
    console.error("Error in request queue processing:", error);
  } finally {
    isProcessingQueue = false;
  }
}

// Connection status with backoff
let connectionErrors = 0;
let lastConnectionCheck = 0;
const CONNECTION_CHECK_INTERVAL = 10000; // 10 seconds

/**
 * Check connection status with intelligent backoff
 */
export async function checkConnection(): Promise<boolean> {
  const now = Date.now();
  
  // Apply increasing backoff for repeated checks
  if (now - lastConnectionCheck < CONNECTION_CHECK_INTERVAL * Math.pow(1.5, connectionErrors)) {
    return navigator.onLine;
  }
  
  lastConnectionCheck = now;
  
  try {
    const isConnected = await checkSupabaseConnection();
    
    if (isConnected) {
      // Reset error counter on success
      if (connectionErrors > 2) {
        showSuccessToast("Connection restored!", "connection-restored");
      }
      connectionErrors = 0;
      return true;
    } else {
      connectionErrors++;
      
      if (connectionErrors === 1) {
        showErrorToast(
          "Connection to server lost. Some features may be unavailable.",
          "connection-lost"
        );
      }
      return false;
    }
  } catch (error) {
    connectionErrors++;
    console.error("Error checking connection:", error);
    return false;
  }
}

/**
 * Reset connection state
 */
export function resetConnectionState(): void {
  connectionErrors = 0;
  lastConnectionCheck = 0;
  Object.keys(activeRequests).forEach(key => {
    activeRequests[key] = 0;
  });
}
