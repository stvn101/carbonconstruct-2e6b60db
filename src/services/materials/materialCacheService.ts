
/**
 * Simple material cache service using localStorage
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

// Cache constants
const CACHE_KEY = 'materials-cache-v1';
const METADATA_KEY = 'materials-cache-metadata';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Cache metadata interface
interface CacheMetadata {
  lastUpdated: number;
  count: number;
}

/**
 * Store materials in cache
 */
export async function cacheMaterials(materials: ExtendedMaterialData[]): Promise<void> {
  try {
    // Store materials
    localStorage.setItem(CACHE_KEY, JSON.stringify(materials));
    
    // Update metadata
    const metadata: CacheMetadata = {
      lastUpdated: Date.now(),
      count: materials.length
    };
    
    localStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
  } catch (error) {
    console.error('Error caching materials:', error);
    // Fall back gracefully - app will still work with API calls
  }
}

/**
 * Get cached materials
 */
export async function getCachedMaterials(): Promise<ExtendedMaterialData[] | null> {
  try {
    // Check if metadata exists
    const metadataStr = localStorage.getItem(METADATA_KEY);
    if (!metadataStr) {
      return null;
    }
    
    const metadata: CacheMetadata = JSON.parse(metadataStr);
    
    // Check if cache is expired
    if ((Date.now() - metadata.lastUpdated) > CACHE_TTL) {
      console.log('Cache expired');
      return null;
    }
    
    // Get materials from cache
    const materialsStr = localStorage.getItem(CACHE_KEY);
    if (!materialsStr) {
      return null;
    }
    
    return JSON.parse(materialsStr);
  } catch (error) {
    console.error('Failed to get cached materials:', error);
    return null;
  }
}

/**
 * Clear the materials cache
 */
export async function clearMaterialsCache(): Promise<void> {
  try {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(METADATA_KEY);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

/**
 * Get cache metadata
 */
export async function getCacheMetadata(): Promise<CacheMetadata | null> {
  try {
    const metadataStr = localStorage.getItem(METADATA_KEY);
    if (!metadataStr) {
      return null;
    }
    
    return JSON.parse(metadataStr);
  } catch (error) {
    console.error('Failed to get cache metadata:', error);
    return null;
  }
}
