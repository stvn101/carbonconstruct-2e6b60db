export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

export function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }
  return null;
}

/**
 * Create a simple in-memory cache with expiration
 * @param expirationSeconds Time in seconds before cache entries expire
 * @returns A cache object with get, set, and delete methods
 */
export function createCache<T>(expirationSeconds: number) {
  const cache: Record<string, { value: T; expiry: number }> = {};

  return {
    /**
     * Get a value from the cache
     * @param key The cache key
     * @returns The cached value or undefined if not found or expired
     */
    get(key: string): T | undefined {
      const item = cache[key];
      if (!item) return undefined;
      
      const now = Date.now();
      if (now > item.expiry) {
        delete cache[key];
        return undefined;
      }
      
      return item.value;
    },
    
    /**
     * Set a value in the cache
     * @param key The cache key
     * @param value The value to cache
     */
    set(key: string, value: T): void {
      const expiry = Date.now() + expirationSeconds * 1000;
      cache[key] = { value, expiry };
    },
    
    /**
     * Delete a value from the cache
     * @param key The cache key
     */
    delete(key: string): void {
      delete cache[key];
    },
    
    /**
     * Clear all entries from the cache
     */
    clear(): void {
      Object.keys(cache).forEach(key => {
        delete cache[key];
      });
    }
  };
}
