
/**
 * Material Cache Service
 * Provides caching, loading, and prefetching mechanisms for materials data
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { toast } from 'sonner';

// Cache constants
const CACHE_KEY = 'carbon-construct-materials-cache';
const CACHE_METADATA_KEY = 'carbon-construct-materials-cache-meta';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Cache metadata interface
export interface MaterialCacheMetadata {
  timestamp: number;
  count: number;
  version: string;
  lastUpdated: string;
}

/**
 * Cache materials data in localStorage
 */
export async function cacheMaterials(materials: ExtendedMaterialData[]): Promise<boolean> {
  if (!materials || materials.length === 0) {
    console.warn('Attempted to cache empty materials array');
    return false;
  }
  
  try {
    // Store the actual materials data
    localStorage.setItem(CACHE_KEY, JSON.stringify(materials));
    
    // Store metadata about the cache
    const metadata: MaterialCacheMetadata = {
      timestamp: Date.now(),
      count: materials.length,
      version: '1.1',
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(CACHE_METADATA_KEY, JSON.stringify(metadata));
    
    console.log(`Cached ${materials.length} materials successfully`);
    return true;
  } catch (error) {
    console.error('Error caching materials:', error);
    
    // Check if it's a storage quota error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      toast.error('Storage limit reached. Some materials data may not be available offline.');
      return false;
    }
    
    return false;
  }
}

/**
 * Get cached materials data from localStorage
 */
export async function getCachedMaterials(): Promise<ExtendedMaterialData[] | null> {
  try {
    // Check if cache exists and is still valid
    const metadataStr = localStorage.getItem(CACHE_METADATA_KEY);
    if (!metadataStr) return null;
    
    const metadata = JSON.parse(metadataStr) as MaterialCacheMetadata;
    
    // Check if cache has expired
    if (Date.now() - metadata.timestamp > CACHE_TTL) {
      console.log('Materials cache has expired');
      return null;
    }
    
    // If cache is still valid, get the materials data
    const cachedDataStr = localStorage.getItem(CACHE_KEY);
    if (!cachedDataStr) return null;
    
    const materials = JSON.parse(cachedDataStr) as ExtendedMaterialData[];
    console.log(`Retrieved ${materials.length} materials from cache`);
    return materials;
  } catch (error) {
    console.error('Error retrieving cached materials:', error);
    return null;
  }
}

/**
 * Clear the materials cache
 */
export async function clearMaterialsCache(): Promise<void> {
  try {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_METADATA_KEY);
    console.log('Materials cache cleared');
  } catch (error) {
    console.error('Error clearing materials cache:', error);
  }
}

/**
 * Get metadata about the cached materials
 */
export async function getCacheMetadata(): Promise<MaterialCacheMetadata | null> {
  try {
    const metadataStr = localStorage.getItem(CACHE_METADATA_KEY);
    if (!metadataStr) return null;
    
    return JSON.parse(metadataStr) as MaterialCacheMetadata;
  } catch (error) {
    console.error('Error retrieving cache metadata:', error);
    return null;
  }
}

/**
 * Check if the materials cache needs to be refreshed
 */
export function isCacheStale(metadata: MaterialCacheMetadata | null): boolean {
  if (!metadata) return true;
  return Date.now() - metadata.timestamp > CACHE_TTL;
}

/**
 * Prefetch materials in the background to ensure they're available when needed
 */
export async function prefetchMaterials(): Promise<void> {
  try {
    // First check if cache is already fresh
    const metadata = await getCacheMetadata();
    if (!isCacheStale(metadata)) {
      console.log('Materials cache is fresh, skipping prefetch');
      return;
    }
    
    console.log('Starting background prefetch of materials');
    
    // Import dynamically to avoid circular dependencies
    const { fetchMaterials } = await import('../fetch/materialFetchService');
    
    // Fetch materials and update cache
    const materials = await fetchMaterials(false);
    if (materials && materials.length > 0) {
      await cacheMaterials(materials);
      console.log(`Background prefetch complete: ${materials.length} materials loaded`);
    }
  } catch (error) {
    console.warn('Background prefetch failed:', error);
  }
}

// Start prefetching materials as soon as this module is imported
setTimeout(prefetchMaterials, 2000);
