
/**
 * Material cache service for browser caching of material data
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { CACHE_KEY_MATERIALS, CACHE_KEY_TIMESTAMP, CACHE_DURATION } from './cacheConstants';

/**
 * Cache materials in localStorage
 */
export async function cacheMaterials(materials: ExtendedMaterialData[]): Promise<void> {
  if (!materials || !Array.isArray(materials)) {
    console.warn('Tried to cache invalid materials data', materials);
    return;
  }
  
  try {
    localStorage.setItem(CACHE_KEY_MATERIALS, JSON.stringify(materials));
    localStorage.setItem(CACHE_KEY_TIMESTAMP, String(Date.now()));
    
    console.log(`Cached ${materials.length} materials in localStorage`);
  } catch (error) {
    console.error('Failed to cache materials:', error);
    // If localStorage fails (e.g., quota exceeded), try to clear old cache and try again
    try {
      localStorage.removeItem(CACHE_KEY_MATERIALS);
      localStorage.removeItem(CACHE_KEY_TIMESTAMP);
      localStorage.setItem(CACHE_KEY_MATERIALS, JSON.stringify(materials));
      localStorage.setItem(CACHE_KEY_TIMESTAMP, String(Date.now()));
    } catch (retryError) {
      console.error('Failed to cache materials even after clearing cache:', retryError);
    }
  }
}

/**
 * Get cached materials from localStorage
 */
export async function getCachedMaterials(): Promise<ExtendedMaterialData[] | null> {
  try {
    const timestamp = localStorage.getItem(CACHE_KEY_TIMESTAMP);
    const now = Date.now();
    
    // Check if cache is expired
    if (!timestamp || now - parseInt(timestamp, 10) > CACHE_DURATION) {
      console.log('Materials cache is expired or missing');
      return null;
    }
    
    const materials = localStorage.getItem(CACHE_KEY_MATERIALS);
    if (!materials) {
      console.log('No materials found in cache');
      return null;
    }
    
    const parsedMaterials = JSON.parse(materials) as ExtendedMaterialData[];
    console.log(`Retrieved ${parsedMaterials.length} materials from cache`);
    return parsedMaterials;
  } catch (error) {
    console.error('Failed to retrieve cached materials:', error);
    return null;
  }
}

/**
 * Clear the materials cache
 */
export function clearMaterialsCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY_MATERIALS);
    localStorage.removeItem(CACHE_KEY_TIMESTAMP);
    console.log('Materials cache cleared');
  } catch (error) {
    console.error('Failed to clear materials cache:', error);
  }
}

/**
 * Get cache metadata
 */
export function getCacheMetadata(): { lastUpdated: Date | null; itemCount: number | null } {
  try {
    const timestamp = localStorage.getItem(CACHE_KEY_TIMESTAMP);
    const materials = localStorage.getItem(CACHE_KEY_MATERIALS);
    
    if (!timestamp || !materials) {
      return { lastUpdated: null, itemCount: null };
    }
    
    const lastUpdated = new Date(parseInt(timestamp, 10));
    const parsedMaterials = JSON.parse(materials) as ExtendedMaterialData[];
    
    return {
      lastUpdated,
      itemCount: parsedMaterials?.length || 0
    };
  } catch (error) {
    console.error('Failed to get cache metadata:', error);
    return { lastUpdated: null, itemCount: null };
  }
}
