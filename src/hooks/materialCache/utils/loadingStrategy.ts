import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { fetchMaterialsFromApi } from '@/services/materials/api/materialApiClient';
import { createBasicFallbackMaterials } from './basicFallbacks';

/**
 * Determines if materials should be updated based on comparison
 * @param newMaterials - New materials from API
 * @param currentMaterials - Current materials in state
 * @returns boolean - Whether to update materials
 */
export const shouldUpdateMaterials = (
  newMaterials: ExtendedMaterialData[], 
  currentMaterials: ExtendedMaterialData[]
): boolean => {
  // Always update if we don't have any materials yet
  if (!currentMaterials || currentMaterials.length === 0) {
    return true;
  }
  
  // Check if we have more materials than before
  if (newMaterials.length > currentMaterials.length) {
    console.log('More materials available, updating');
    return true;
  }
  
  // If same count, check if the data is fresher (different first element)
  if (newMaterials.length === currentMaterials.length && newMaterials.length > 0) {
    // Use simple sample comparison (first item id)
    const firstNewItem = newMaterials[0];
    const firstCurrentItem = currentMaterials[0];
    
    if (firstNewItem?.id !== firstCurrentItem?.id) {
      console.log('Materials data changed, updating');
      return true;
    }
  }
  
  return false;
};

/**
 * Load materials with fallback strategy
 * @param forceRefresh - Whether to force refresh from API
 * @param currentMaterials - Current materials for comparison
 * @returns Promise<ExtendedMaterialData[]>
 */
export const loadMaterialsWithFallback = async (
  forceRefresh: boolean, 
  currentMaterials: ExtendedMaterialData[]
): Promise<ExtendedMaterialData[]> => {
  try {
    // Try to load from localStorage first if not forcing refresh
    if (!forceRefresh) {
      const cachedData = localStorage.getItem('materialsCache');
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          console.log('Found cached materials:', parsedData.length);
          
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            // Check if cache needs refresh due to age
            const timestamp = localStorage.getItem('materialsCacheTimestamp');
            if (timestamp) {
              const cacheTime = new Date(timestamp).getTime();
              const now = new Date().getTime();
              const hoursSinceCached = (now - cacheTime) / (1000 * 60 * 60);
              
              if (hoursSinceCached < 24) {
                console.log('Using cached materials, cache is recent');
                return parsedData;
              }
              console.log('Cache is stale, fetching fresh data');
            }
          }
        } catch (parseError) {
          console.error('Error parsing cached materials:', parseError);
        }
      }
    } else {
      console.log('Force refresh requested, skipping cache');
    }
    
    // Cache not found or forced refresh, try API
    const apiMaterials = await fetchMaterialsFromApi({
      forceRefresh
    });
    
    if (Array.isArray(apiMaterials) && apiMaterials.length > 0) {
      console.log(`API returned ${apiMaterials.length} materials`);
      
      // Cache these results
      try {
        localStorage.setItem('materialsCache', JSON.stringify(apiMaterials));
        localStorage.setItem('materialsCacheTimestamp', new Date().toISOString());
      } catch (storageError) {
        console.warn('Failed to save materials to localStorage:', storageError);
      }
      
      return apiMaterials;
    }
    
    // If API fails, return current materials if we have any
    if (Array.isArray(currentMaterials) && currentMaterials.length > 0) {
      console.log('API request failed, keeping existing materials');
      return currentMaterials;
    }
    
    // If all else fails, return basic fallback data
    console.log('Using basic fallback materials');
    return createBasicFallbackMaterials();
  } catch (err) {
    console.error('Error in loadMaterialsWithFallback:', err);
    
    // If we have current materials, keep them
    if (Array.isArray(currentMaterials) && currentMaterials.length > 0) {
      return currentMaterials;
    }
    
    // Emergency fallback
    return createBasicFallbackMaterials();
  }
};
