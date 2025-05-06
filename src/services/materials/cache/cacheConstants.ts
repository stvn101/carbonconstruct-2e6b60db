
/**
 * Constants for material cache configuration
 */

// Connection timeout in milliseconds (15 seconds)
export const CONNECTION_TIMEOUT = 15000;

// Cache expiration in milliseconds (24 hours)
export const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

// Cache refresh interval in milliseconds (1 hour for faster updates)
export const CACHE_REFRESH_INTERVAL = 60 * 60 * 1000;

// Local storage keys
export const CACHE_STORAGE_KEY = 'materialsCache';
export const CACHE_TIMESTAMP_KEY = 'materialsCacheTimestamp';

// Maximum batch size for data processing
export const MAX_BATCH_SIZE = 100;

// Add cache version to force refresh when structure changes
export const CACHE_VERSION = 'v1.0.1';
export const CACHE_VERSION_KEY = 'materialsCacheVersion';
