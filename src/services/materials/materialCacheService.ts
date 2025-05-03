
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

// Cache key for storing materials data
const MATERIALS_CACHE_KEY = 'carbon-construct-materials-cache';
const MATERIALS_META_KEY = 'carbon-construct-materials-meta';
const CACHE_VERSION = '1.0.0';

/**
 * Cache interface for the materials cache metadata
 */
interface MaterialsCacheMeta {
  timestamp: number;
  version: string;
  count: number;
  categories: string[];
}

/**
 * Get cached materials if they exist and aren't stale
 */
export async function getCachedMaterials(): Promise<ExtendedMaterialData[] | null> {
  try {
    const metaJson = localStorage.getItem(MATERIALS_META_KEY);
    if (!metaJson) return null;
    
    const meta = JSON.parse(metaJson) as MaterialsCacheMeta;
    
    // Check if cache version is current
    if (meta.version !== CACHE_VERSION) {
      console.log('Cache version mismatch, clearing cache');
      await clearMaterialsCache();
      return null;
    }
    
    // Check if cache is stale (older than 24 hours)
    const now = Date.now();
    const cacheAge = now - meta.timestamp;
    const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
    
    if (cacheAge > CACHE_TTL) {
      console.log('Cache is stale, clearing');
      await clearMaterialsCache();
      return null;
    }
    
    // Get the materials data from cache
    const materialsJson = localStorage.getItem(MATERIALS_CACHE_KEY);
    if (!materialsJson) return null;
    
    return JSON.parse(materialsJson) as ExtendedMaterialData[];
  } catch (error) {
    console.error('Error reading materials cache:', error);
    return null;
  }
}

/**
 * Cache materials data for faster access
 */
export async function cacheMaterials(materials: ExtendedMaterialData[]): Promise<void> {
  try {
    // Extract categories from materials
    const categories = Array.from(new Set(
      materials
        .filter(m => m.category)
        .map(m => m.category as string)
        .filter(Boolean)
    ));
    
    // Store the metadata
    const meta: MaterialsCacheMeta = {
      timestamp: Date.now(),
      version: CACHE_VERSION,
      count: materials.length,
      categories
    };
    
    // Store the data with error handling for large datasets
    try {
      localStorage.setItem(MATERIALS_CACHE_KEY, JSON.stringify(materials));
      localStorage.setItem(MATERIALS_META_KEY, JSON.stringify(meta));
      console.log(`Cached ${materials.length} materials`);
    } catch (e) {
      console.error('Failed to cache materials, storage may be full:', e);
      // If we hit quota limits, clear and try to store a subset
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        await clearMaterialsCache();
        // Try to store a smaller subset (half the size)
        const reducedSet = materials.slice(0, Math.floor(materials.length / 2));
        localStorage.setItem(MATERIALS_CACHE_KEY, JSON.stringify(reducedSet));
        
        // Update the metadata
        meta.count = reducedSet.length;
        localStorage.setItem(MATERIALS_META_KEY, JSON.stringify(meta));
        console.log(`Cached reduced set of ${reducedSet.length} materials due to storage limits`);
      }
    }
  } catch (error) {
    console.error('Error caching materials:', error);
  }
}

/**
 * Clear the materials cache
 */
export async function clearMaterialsCache(): Promise<void> {
  try {
    localStorage.removeItem(MATERIALS_CACHE_KEY);
    localStorage.removeItem(MATERIALS_META_KEY);
    console.log('Materials cache cleared');
  } catch (error) {
    console.error('Error clearing materials cache:', error);
  }
}

/**
 * Get cache metadata to display last updated time, etc.
 */
export function getCacheMetadata(): { lastUpdated: Date | null; count: number } {
  try {
    const metaJson = localStorage.getItem(MATERIALS_META_KEY);
    if (!metaJson) {
      return { lastUpdated: null, count: 0 };
    }
    
    const meta = JSON.parse(metaJson) as MaterialsCacheMeta;
    return {
      lastUpdated: new Date(meta.timestamp),
      count: meta.count
    };
  } catch (error) {
    console.error('Error reading cache metadata:', error);
    return { lastUpdated: null, count: 0 };
  }
}
