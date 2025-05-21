
/**
 * Cache system constants
 */

// Maximum batch size for batch processing
export const MAX_BATCH_SIZE = 500;

// Default cache TTL: 24 hours
export const DEFAULT_CACHE_TTL = 24 * 60 * 60 * 1000;

// Cache keys
export const CACHE_KEYS = {
  MATERIALS: 'carbonConstruct:materialsCache',
  TIMESTAMP: 'carbonConstruct:materialsCacheTimestamp',
  COUNT: 'carbonConstruct:materialsCacheCount'
};

export default {
  MAX_BATCH_SIZE,
  DEFAULT_CACHE_TTL,
  CACHE_KEYS
};
