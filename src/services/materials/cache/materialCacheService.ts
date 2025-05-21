
/**
 * Material Cache Service
 * Provides functionality for caching and retrieving material data
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { processDataInBatches } from '../materialDataProcessor';
import { mapDatabaseMaterials } from './materialDataMapping';
import { fetchMaterials } from '../fetch/materialFetchService';
import { MATERIAL_CACHE_TTL } from '../types';

// Local storage keys
const MATERIALS_CACHE_KEY = 'carbonConstruct:materialsCache';
const MATERIALS_CACHE_TIMESTAMP_KEY = 'carbonConstruct:materialsCacheTimestamp';
const MATERIALS_CACHE_COUNT_KEY = 'carbonConstruct:materialsCacheCount';

export interface MaterialCacheMetadata {
  lastUpdated: string; // ISO date string
  count: number;
}

/**
 * Get cached materials data
 * @returns Promise with material data or null if cache is empty/expired
 */
export async function getCachedMaterials(): Promise<ExtendedMaterialData[] | null> {
  try {
    const cacheTimestampStr = localStorage.getItem(MATERIALS_CACHE_TIMESTAMP_KEY);
    
    if (!cacheTimestampStr) {
      return null; // No cache timestamp found
    }
    
    const cacheTimestamp = Number(cacheTimestampStr);
    const now = Date.now();
    
    // Check if cache is expired
    if (now - cacheTimestamp > MATERIAL_CACHE_TTL) {
      console.log('Materials cache expired, will be refreshed');
      return null;
    }
    
    // Get cache data
    const cachedDataStr = localStorage.getItem(MATERIALS_CACHE_KEY);
    if (!cachedDataStr) {
      return null; // No cache data found
    }
    
    try {
      // Parse and validate cached data
      const cachedData = JSON.parse(cachedDataStr);
      
      if (!Array.isArray(cachedData) || cachedData.length === 0) {
        console.warn('Invalid or empty materials cache');
        return null;
      }
      
      console.log(`Retrieved ${cachedData.length} materials from cache`);
      return cachedData;
    } catch (parseError) {
      console.error('Error parsing materials cache:', parseError);
      return null;
    }
  } catch (error) {
    console.error('Error accessing materials cache:', error);
    return null;
  }
}

/**
 * Cache materials data
 * @param materials Material data to cache
 * @returns Promise indicating cache success
 */
export async function cacheMaterials(materials: ExtendedMaterialData[]): Promise<boolean> {
  if (!materials || !Array.isArray(materials) || materials.length === 0) {
    console.warn('Attempted to cache invalid or empty materials data');
    return false;
  }
  
  try {
    // Store cache data
    localStorage.setItem(MATERIALS_CACHE_KEY, JSON.stringify(materials));
    localStorage.setItem(MATERIALS_CACHE_TIMESTAMP_KEY, Date.now().toString());
    localStorage.setItem(MATERIALS_CACHE_COUNT_KEY, materials.length.toString());
    
    console.log(`Cached ${materials.length} materials successfully`);
    return true;
  } catch (error) {
    console.error('Error caching materials data:', error);
    
    // Check if error is due to storage limit
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('Storage quota exceeded, clearing cache and trying with smaller batch');
      
      // Clear existing cache
      await clearMaterialsCache();
      
      // Try to cache a smaller subset (newest 100 materials)
      if (materials.length > 100) {
        const reducedMaterials = materials.slice(0, 100);
        try {
          localStorage.setItem(MATERIALS_CACHE_KEY, JSON.stringify(reducedMaterials));
          localStorage.setItem(MATERIALS_CACHE_TIMESTAMP_KEY, Date.now().toString());
          localStorage.setItem(MATERIALS_CACHE_COUNT_KEY, '100');
          
          console.log('Cached reduced set of 100 materials');
          return true;
        } catch (reducedError) {
          console.error('Error caching reduced materials set:', reducedError);
        }
      }
    }
    
    return false;
  }
}

/**
 * Clear the materials cache
 * @returns Promise indicating clear success
 */
export async function clearMaterialsCache(): Promise<boolean> {
  try {
    localStorage.removeItem(MATERIALS_CACHE_KEY);
    localStorage.removeItem(MATERIALS_CACHE_TIMESTAMP_KEY);
    localStorage.removeItem(MATERIALS_CACHE_COUNT_KEY);
    
    console.log('Materials cache cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing materials cache:', error);
    return false;
  }
}

/**
 * Prefetch materials data and cache it
 * @param forceRefresh Force refresh from API
 * @returns Promise with material data
 */
export async function prefetchMaterials(forceRefresh = false): Promise<ExtendedMaterialData[]> {
  console.log('Prefetching materials data');
  
  try {
    if (!forceRefresh) {
      // Try to get from cache first
      const cached = await getCachedMaterials();
      if (cached && cached.length > 0) {
        console.log(`Using ${cached.length} cached materials`);
        return cached;
      }
    }
    
    // Fetch from API
    console.log('Fetching fresh materials data');
    const materials = await fetchMaterials(forceRefresh);
    
    // Cache the fetched data
    await cacheMaterials(materials);
    
    return materials;
  } catch (error) {
    console.error('Error prefetching materials:', error);
    return [];
  }
}

/**
 * Get metadata about the current cache state
 * @returns Cache metadata
 */
export async function getCacheMetadata(): Promise<MaterialCacheMetadata> {
  try {
    const timestampStr = localStorage.getItem(MATERIALS_CACHE_TIMESTAMP_KEY);
    const countStr = localStorage.getItem(MATERIALS_CACHE_COUNT_KEY);
    
    return {
      lastUpdated: timestampStr ? new Date(Number(timestampStr)).toISOString() : null,
      count: countStr ? Number(countStr) : null
    };
  } catch (error) {
    console.error('Error getting cache metadata:', error);
    return { lastUpdated: null, count: null };
  }
}
