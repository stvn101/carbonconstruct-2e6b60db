
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { EXTENDED_MATERIALS } from '@/lib/materials';

const CACHE_KEY = 'materialsCache';
const CACHE_TIME_KEY = 'materialsCacheTime';
const CACHE_EXPIRY = 3600000; // 1 hour

/**
 * Store materials in cache
 * @param materials Materials to cache
 */
export async function cacheMaterials(materials: ExtendedMaterialData[]): Promise<void> {
  if (!materials || materials.length === 0) {
    console.warn("Attempted to cache empty materials array");
    return;
  }
  
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(materials));
    localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
    console.log(`Cached ${materials.length} materials`);
  } catch (err) {
    console.error("Error caching materials:", err);
  }
}

/**
 * Get cached materials if available and not expired
 */
export async function getCachedMaterials(): Promise<ExtendedMaterialData[] | null> {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cacheTimestamp = localStorage.getItem(CACHE_TIME_KEY);
    
    if (!cachedData || !cacheTimestamp) {
      return null;
    }
    
    const cacheTime = parseInt(cacheTimestamp, 10);
    
    // Check if cache is expired
    if (Date.now() - cacheTime > CACHE_EXPIRY) {
      console.log("Materials cache expired");
      return null;
    }
    
    const materials = JSON.parse(cachedData) as ExtendedMaterialData[];
    console.log(`Retrieved ${materials.length} materials from cache`);
    return materials;
  } catch (err) {
    console.error("Error retrieving cached materials:", err);
    return null;
  }
}

/**
 * Clear materials cache
 */
export function clearMaterialsCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIME_KEY);
    console.log("Materials cache cleared");
  } catch (err) {
    console.error("Error clearing materials cache:", err);
  }
}

/**
 * Get cache metadata
 */
export function getCacheMetadata() {
  try {
    const cacheTimestamp = localStorage.getItem(CACHE_TIME_KEY);
    const cachedData = localStorage.getItem(CACHE_KEY);
    
    let itemCount = null;
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        itemCount = Array.isArray(parsed) ? parsed.length : null;
      } catch (e) {
        console.warn("Error parsing cached materials", e);
      }
    }
    
    return {
      lastUpdated: cacheTimestamp ? new Date(parseInt(cacheTimestamp, 10)) : null,
      itemCount
    };
  } catch (err) {
    console.error("Error getting cache metadata:", err);
    return {
      lastUpdated: null,
      itemCount: null
    };
  }
}
