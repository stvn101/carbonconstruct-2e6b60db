/**
 * Core material fetch service with improved caching and fallbacks
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { cacheMaterials, getCachedMaterials } from '@/services/materials/cache';
import { processDataInBatches } from '../materialDataProcessor';
import { isOffline } from '@/utils/errorHandling/networkChecker';
import { fetchMaterialsFromApi, fetchCategoriesFromApi } from '../api/materialApiClient';
import { getFallbackMaterials, getDefaultCategories } from '../fallback/materialFallbackProvider';
import { handleMaterialApiError } from '../notifications/materialNotifications';
import { toast } from 'sonner';

// Keep track of current fetch to prevent duplicate requests
let currentFetchPromise: Promise<ExtendedMaterialData[]> | null = null;
let lastFetchTime = 0;
const FETCH_COOLDOWN = 3000; // 3 seconds cooldown between fetch attempts

/**
 * Fetch all materials with improved caching and fallbacks
 */
export async function fetchMaterials(forceRefresh = false): Promise<ExtendedMaterialData[]> {
  console.log('fetchMaterials called with forceRefresh:', forceRefresh);
  
  // Prevent rapid repeated fetch calls
  const now = Date.now();
  if (now - lastFetchTime < FETCH_COOLDOWN && !forceRefresh) {
    console.log('Fetch called too frequently, using existing promise or cache');
    
    // Return existing promise if there's already a fetch in progress
    if (currentFetchPromise) {
      console.log('Using existing fetch promise');
      return currentFetchPromise;
    }
  }
  
  // Update last fetch time
  lastFetchTime = now;
  
  const fetchOperation = async () => {
    try {
      // First try to get materials from cache unless forceRefresh is true
      if (!forceRefresh) {
        const cachedMaterials = await getCachedMaterials();
        if (cachedMaterials && cachedMaterials.length > 0) {
          console.log('Using cached materials:', cachedMaterials.length);
          return cachedMaterials;
        } else {
          console.log('No cached materials found or cache is empty');
        }
      } else {
        console.log('Force refresh requested, bypassing cache');
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
        
        // Sanity check for data
        if (!data || !Array.isArray(data) || data.length === 0) {
          console.warn('API returned empty or invalid material data');
          throw new Error('Invalid material data returned from API');
        }
        
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
        
        // Try to get data from cache as fallback even though we bypassed it earlier
        // This handles the case where forceRefresh was true but API call failed
        if (forceRefresh) {
          console.log('API fetch failed on forced refresh, trying cache as fallback');
          const cachedMaterials = await getCachedMaterials();
          if (cachedMaterials && cachedMaterials.length > 0) {
            toast.info('Using cached material data after refresh failure');
            return cachedMaterials;
          }
        }
        
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
    const categories = await Promise.race([
      fetchCategoriesFromApi(),
      timeoutPromise
    ]);
    
    // Log categories retrieved
    console.log('Categories fetched:', categories?.length || 0);
    
    if (!categories || categories.length === 0) {
      console.warn('API returned empty categories, using defaults');
      return getDefaultCategories();
    }
    
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return some sensible default categories on error
    return getDefaultCategories();
  }
}

// Add immediate prefetch on module load
try {
  setTimeout(() => {
    console.log('Starting initial background materials prefetch');
    fetchMaterials(false).catch(err => {
      console.warn('Initial prefetch failed:', err);
    });
  }, 100);
} catch (err) {
  console.error('Error in initial prefetch:', err);
}
