
/**
 * Optimized fetch utility with retry logic, request throttling and caching
 * for improved scalability when handling 50-100 users
 */

type RequestOptions = {
  retries?: number;
  retryDelay?: number;
  timeout?: number;
  cache?: RequestCache;
  priority?: 'high' | 'low' | 'auto';
  signal?: AbortSignal;
};

// Global request tracking for throttling
const activeRequests: Record<string, number> = {};
const MAX_CONCURRENT_REQUESTS = 10; // Adjust based on testing

/**
 * Optimized fetch with retry, throttling and improved error handling
 */
export async function optimizedFetch<T>(
  url: string,
  options: RequestInit & RequestOptions = {}
): Promise<T> {
  // Extract custom options
  const {
    retries = 3,
    retryDelay = 1000,
    timeout = 30000,
    cache = 'default',
    priority = 'auto',
    signal,
    ...fetchOptions
  } = options;

  // Create a request key for throttling
  const requestKey = `${fetchOptions.method || 'GET'}-${url}`;
  
  // Apply request throttling
  if (!activeRequests[requestKey]) {
    activeRequests[requestKey] = 0;
  }
  
  // Check if we need to throttle
  if (Object.values(activeRequests).reduce((sum, val) => sum + val, 0) >= MAX_CONCURRENT_REQUESTS) {
    console.log(`Throttling request to ${url} due to concurrent request limit`);
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  }
  
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort(`Request timeout after ${timeout}ms`);
  }, timeout);
  
  // Combine user signal with our timeout signal
  const abortSignal = signal
    ? AbortSignal.any([signal, controller.signal])
    : controller.signal;

  // Track active request
  activeRequests[requestKey] += 1;
  
  try {
    // Attempt the fetch with all options
    const response = await fetch(url, {
      ...fetchOptions,
      signal: abortSignal,
      cache,
      priority,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the response based on content type
    if (response.headers.get('content-type')?.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text() as unknown as T;
    }
  } catch (error) {
    // Handle retries for appropriate errors
    if (
      retries > 0 &&
      error instanceof Error &&
      (error.name === 'AbortError' || error.message.includes('fetch'))
    ) {
      // Apply exponential backoff
      const delay = retryDelay * Math.pow(1.5, options.retries! - retries);
      console.log(`Retrying request to ${url} after ${delay}ms (${retries} retries left)`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return optimizedFetch<T>(url, {
        ...options,
        retries: retries - 1,
        retryDelay,
      });
    }
    
    throw error;
  } finally {
    clearTimeout(timeoutId);
    activeRequests[requestKey] -= 1;
  }
}

/**
 * Request throttling utility to prevent API rate limits
 */
export const requestThrottle = (() => {
  const queue: Array<() => Promise<any>> = [];
  const queuePromises: Array<Promise<any>> = [];
  let isProcessing = false;
  
  // Process the queue with controlled concurrency
  const processQueue = async (concurrency = 5) => {
    if (isProcessing) return;
    isProcessing = true;
    
    while (queue.length > 0) {
      const batch = queue.splice(0, concurrency);
      const batchPromises = batch.map(fn => {
        try {
          return fn();
        } catch (error) {
          console.error("Error in throttled request:", error);
          return Promise.reject(error);
        }
      });
      
      // Wait for batch to complete before processing next batch
      await Promise.allSettled(batchPromises);
      // Apply a small delay between batches
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    isProcessing = false;
  };
  
  return {
    add: <T>(fn: () => Promise<T>): Promise<T> => {
      return new Promise((resolve, reject) => {
        const wrappedFn = async () => {
          try {
            const result = await fn();
            resolve(result);
            return result;
          } catch (error) {
            reject(error);
            throw error;
          }
        };
        
        queue.push(wrappedFn);
        processQueue();
      });
    },
    clear: () => {
      queue.length = 0;
    }
  };
})();

/**
 * Enhanced cache control for persistent data
 */
export const enhancedCache = {
  set: (key: string, data: any, ttlMs: number = 3600000) => {
    try {
      const item = {
        data,
        expiry: Date.now() + ttlMs
      };
      localStorage.setItem(`cache-${key}`, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('Cache storage error:', error);
      return false;
    }
  },
  
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(`cache-${key}`);
      if (!item) return null;
      
      const parsed = JSON.parse(item);
      if (parsed.expiry < Date.now()) {
        localStorage.removeItem(`cache-${key}`);
        return null;
      }
      
      return parsed.data as T;
    } catch (error) {
      console.error('Cache retrieval error:', error);
      return null;
    }
  },
  
  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(`cache-${key}`);
      return true;
    } catch (error) {
      console.error('Cache removal error:', error);
      return false;
    }
  },
  
  clear: (prefix?: string): void => {
    try {
      if (prefix) {
        // Clear only items with matching prefix
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(`cache-${prefix}`)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      } else {
        // Clear all cache items
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('cache-')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      }
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }
};
