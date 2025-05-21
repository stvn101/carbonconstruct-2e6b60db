
/**
 * Sustainability Suggestion Cache
 * Provides caching for sustainability suggestions to reduce API calls
 */
import { SuggestionsResponse } from './types';

// Cache constants
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_KEY_PREFIX = 'sustainability-suggestions-';
const MAX_CACHE_SIZE = 10; // Maximum number of cached suggestions

/**
 * Creates a cache key for a specific set of inputs
 */
export function createCacheKey(
  materials: any[],
  transport: any[],
  energy: any[],
  options?: any
): string {
  // Create a simplified version of the inputs for the cache key
  const simplifiedMaterials = materials.map(m => ({
    type: m.type,
    quantity: m.quantity,
    factor: m.factor
  }));
  
  const simplifiedTransport = transport.map(t => ({
    type: t.type,
    distance: t.distance,
    weight: t.weight,
    factor: t.factor
  }));
  
  const simplifiedEnergy = energy.map(e => ({
    type: e.type,
    amount: e.amount,
    unit: e.unit,
    factor: e.factor
  }));
  
  // Create a stringified version of the inputs
  const inputString = JSON.stringify({
    materials: simplifiedMaterials,
    transport: simplifiedTransport,
    energy: simplifiedEnergy,
    options
  });
  
  // Create a simple hash of the input string
  const hash = hashString(inputString);
  
  return `${CACHE_KEY_PREFIX}${hash}`;
}

/**
 * Gets a cached suggestion by its cache key
 */
export function getCachedSuggestion(cacheKey: string): SuggestionsResponse | null {
  try {
    const cacheItemJson = localStorage.getItem(cacheKey);
    
    if (!cacheItemJson) {
      return null;
    }
    
    const cacheItem = JSON.parse(cacheItemJson);
    
    // Check if the cache item has expired
    if (Date.now() - cacheItem.timestamp > CACHE_EXPIRY_TIME) {
      // Remove expired cache item
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    // Update the timestamp to indicate the item was accessed
    cacheItem.timestamp = Date.now();
    localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    
    return cacheItem.data;
  } catch (error) {
    console.error('Error retrieving cached suggestion:', error);
    return null;
  }
}

/**
 * Sets a cached suggestion with its cache key
 */
export function setCachedSuggestion(cacheKey: string, data: SuggestionsResponse): void {
  try {
    // Check if we need to make room in the cache
    checkCacheSize();
    
    // Store the suggestion in cache
    const cacheItem = {
      timestamp: Date.now(),
      data
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    
    // Update the cache index
    updateCacheIndex(cacheKey);
  } catch (error) {
    console.error('Error caching suggestion:', error);
  }
}

/**
 * Checks the cache size and removes oldest items if necessary
 */
function checkCacheSize(): void {
  try {
    // Get the cache index
    const cacheIndex = getCacheIndex();
    
    // If the cache is too large, remove the oldest items
    if (cacheIndex.length >= MAX_CACHE_SIZE) {
      // Sort the index by timestamp (oldest first)
      cacheIndex.sort((a, b) => a.timestamp - b.timestamp);
      
      // Remove the oldest items until we're under the max size
      while (cacheIndex.length >= MAX_CACHE_SIZE) {
        const oldestItem = cacheIndex.shift();
        if (oldestItem) {
          localStorage.removeItem(oldestItem.key);
        }
      }
      
      // Save the updated cache index
      saveCacheIndex(cacheIndex);
    }
  } catch (error) {
    console.error('Error checking cache size:', error);
  }
}

/**
 * Updates the cache index with a new or updated cache key
 */
function updateCacheIndex(cacheKey: string): void {
  try {
    const cacheIndex = getCacheIndex();
    
    // Check if the key is already in the index
    const existingIndex = cacheIndex.findIndex(item => item.key === cacheKey);
    
    if (existingIndex >= 0) {
      // Update the timestamp
      cacheIndex[existingIndex].timestamp = Date.now();
    } else {
      // Add the new key to the index
      cacheIndex.push({
        key: cacheKey,
        timestamp: Date.now()
      });
    }
    
    // Save the updated cache index
    saveCacheIndex(cacheIndex);
  } catch (error) {
    console.error('Error updating cache index:', error);
  }
}

/**
 * Gets the cache index
 */
function getCacheIndex(): Array<{ key: string; timestamp: number }> {
  try {
    const indexJson = localStorage.getItem('sustainability-suggestions-index');
    return indexJson ? JSON.parse(indexJson) : [];
  } catch (error) {
    console.error('Error getting cache index:', error);
    return [];
  }
}

/**
 * Saves the cache index
 */
function saveCacheIndex(index: Array<{ key: string; timestamp: number }>): void {
  try {
    localStorage.setItem('sustainability-suggestions-index', JSON.stringify(index));
  } catch (error) {
    console.error('Error saving cache index:', error);
  }
}

/**
 * Creates a simple hash from a string
 */
function hashString(str: string): string {
  let hash = 0;
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return new Uint32Array([hash])[0].toString(36);
}

/**
 * Clears all cached suggestions
 */
export function clearSuggestionCache(): void {
  try {
    // Get all keys in localStorage
    const allKeys = Object.keys(localStorage);
    
    // Find and remove all suggestion cache items
    allKeys.forEach(key => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    
    // Reset the cache index
    localStorage.setItem('sustainability-suggestions-index', JSON.stringify([]));
  } catch (error) {
    console.error('Error clearing suggestion cache:', error);
  }
}
