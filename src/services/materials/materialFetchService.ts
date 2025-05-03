
/**
 * Service for fetching materials data with caching and fallbacks
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { cacheMaterials, getCachedMaterials } from '@/services/materials/materialCacheService';
import { processDataInBatches } from './materialDataProcessor';
import { isOffline } from '@/utils/errorHandling/networkChecker';
import { fetchMaterialsFromApi, fetchCategoriesFromApi, handleMaterialApiError } from './materialApiUtils';
import { getFallbackMaterials, getDefaultCategories } from './materialFallbackService';
import { toast } from 'sonner';

// Keep track of current fetch to prevent duplicate requests
let currentFetchPromise: Promise<ExtendedMaterialData[]> | null = null;

/**
 * Fetch all materials with improved caching and fallbacks
 */
export async function fetchMaterials(forceRefresh = false): Promise<ExtendedMaterialData[]> {
  console.log('fetchMaterials called with forceRefresh:', forceRefresh);
  
  // Return existing promise if there's already a fetch in progress
  if (currentFetchPromise && !forceRefresh) {
    console.log('Using existing fetch promise');
    return currentFetchPromise;
  }
  
  const fetchOperation = async () => {
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
      
      // Try to fetch from API with timeout
      try {
        console.log('Fetching materials from API');
        
        // Create a timeout promise
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('API request timed out')), 15000);
        });
        
        // Race the API fetch against the timeout
        const data = await Promise.race([
          fetchMaterialsFromApi(),
          timeoutPromise
        ]);
        
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
    } finally {
      // Clear current promise reference when done
      currentFetchPromise = null;
    }
  };
  
  // Set the current promise and return it
  currentFetchPromise = fetchOperation();
  return currentFetchPromise;
}

/**
 * Fetch material categories with improved fallbacks
 */
export async function fetchMaterialCategories(): Promise<string[]> {
  // First check if we're offline
  if (isOffline()) {
    console.log('Offline, returning default categories');
    return getDefaultCategories();
  }
  
  try {
    // Create a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Categories request timed out')), 8000);
    });
    
    // Race the categories fetch against the timeout
    return await Promise.race([
      fetchCategoriesFromApi(),
      timeoutPromise
    ]);
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return some sensible default categories on error
    return getDefaultCategories();
  }
}

// Start prefetching materials immediately when this module is imported
(function initializeMaterialCache() {
  setTimeout(() => {
    console.log('Starting background prefetch of materials');
    fetchMaterials(false)
      .then(materials => console.log(`Background prefetch complete: ${materials.length} materials loaded`))
      .catch(err => console.warn('Background prefetch failed:', err));
  }, 1000);
})();
