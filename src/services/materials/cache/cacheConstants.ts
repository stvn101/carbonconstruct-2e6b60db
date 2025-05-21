
/**
 * Constants for material caching
 * Centralizing cache configuration for easier maintenance
 */

// Cache keys
export const CACHE_KEYS = {
  TIMESTAMP: 'materials-last-updated',
  COUNT: 'materials-count',
  VERSION: 'materials-cache-version'
};

// Cache configuration
export const DEFAULT_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
export const CACHE_STALE_THRESHOLD = 30 * 60 * 1000; // 30 minutes in milliseconds
export const CACHE_REFRESH_INTERVAL = 60 * 60 * 1000; // 1 hour in milliseconds
export const BACKGROUND_FETCH_DELAY = 1000; // 1 second delay for background fetch

// Cache status types
export type CacheStatus = 'fresh' | 'stale' | 'unknown';

export default {
  CACHE_KEYS,
  DEFAULT_CACHE_TTL,
  CACHE_STALE_THRESHOLD,
  CACHE_REFRESH_INTERVAL,
  BACKGROUND_FETCH_DELAY
};
