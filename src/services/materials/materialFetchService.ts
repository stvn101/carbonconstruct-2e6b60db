
/**
 * Service for fetching materials data with caching and fallbacks
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { cacheMaterials, getCachedMaterials } from './materialCacheService';
import { processDataInBatches } from './materialDataProcessor';
import { isOffline } from '@/utils/errorHandling';
import { fetchMaterialsFromApi, fetchCategoriesFromApi, handleMaterialApiError } from './materialApiUtils';
import { getFallbackMaterials, getDefaultCategories } from './materialFallbackService';

/**
 * Fetch all materials with improved caching and fallbacks
 */
export async function fetchMaterials(forceRefresh = false): Promise<ExtendedMaterialData[]> {
  console.log('fetchMaterials called with forceRefresh:', forceRefresh);
  try {
    // First try to get materials from cache unless forceRefresh is true
    if (!forceRefresh) {
      const cachedMaterials = await getCachedMaterials();
      if (cachedMaterials && cachedMaterials.length > 0) {
        console.log('Using cached materials:', cachedMaterials.length);
        return cachedMaterials;
      }
    }
    
    // If offline, use fallback without trying network request
    if (isOffline()) {
      console.log('Offline mode detected, using fallback materials');
      handleMaterialApiError(new Error('Network offline'), 'load materials');
      return getFallbackMaterials();
    }
    
    // Try to fetch from API
    try {
      const data = await fetchMaterialsFromApi();
      
      // Process the data
      console.log('Processing data from API:', data.length, 'rows');
      const processedData = processDataInBatches(data);
      
      // Cache the materials for future use
      cacheMaterials(processedData)
        .then(() => console.log('Materials cached successfully'))
        .catch(err => console.warn('Failed to cache materials:', err));
      
      return processedData;
    } catch (err) {
      console.error('API fetch error:', err);
      handleMaterialApiError(err, 'load materials from database');
      return getFallbackMaterials();
    }
  } catch (err) {
    console.error('Error loading materials:', err);
    handleMaterialApiError(err, 'load materials');
    return getFallbackMaterials();
  }
}

/**
 * Fetch material categories with improved fallbacks
 * Now using the secure database function
 */
export async function fetchMaterialCategories(): Promise<string[]> {
  // First check if we're offline
  if (isOffline()) {
    console.log('Offline, returning default categories');
    return getDefaultCategories();
  }
  
  try {
    return await fetchCategoriesFromApi();
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return some sensible default categories on error
    return getDefaultCategories();
  }
}
