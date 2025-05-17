
/**
 * Core material fetch service with improved caching and fallbacks
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { cacheMaterials, getCachedMaterials } from '@/services/materials/cache';
import { processDataInBatches } from '../materialDataProcessor';
import { isOffline } from '@/utils/errorHandling/networkChecker';
import { fetchMaterialsFromApi, fetchMaterialCategoriesFromApi } from '../api/materialApiClient';
import { getFallbackMaterials, getDefaultCategories } from '../fallback/materialFallbackProvider';
import { handleMaterialApiError } from '../notifications/materialNotifications';
import { toast } from 'sonner';
import { MATERIAL_FACTORS } from '@/lib/carbonFactors';
import { ApiRequestOptions } from '../api/materialApiTypes';

// Keep track of current fetch to prevent duplicate requests
let currentFetchPromise: Promise<ExtendedMaterialData[]> | null = null;
let lastFetchTime = 0;
const FETCH_COOLDOWN = 1000; // 1 second cooldown between fetch attempts
const MAX_RETRIES = 3; // Maximum number of retries for loading materials
const QUERY_LIMIT = 500; // Limit number of materials to fetch at once

/**
 * Unified material fetch with simplified caching, retry logic, and fallbacks
 */
export async function fetchMaterials(forceRefresh = false): Promise<ExtendedMaterialData[]> {
  console.log('fetchMaterials called with forceRefresh:', forceRefresh);
  
  // Prevent rapid repeated fetch calls but allow forced refreshes
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
        return getComprehensiveFallbackMaterials();
      }
      
      // Try to fetch from API
      try {
        console.log('Fetching materials from API');
        
        // Fetch with pagination to avoid large queries
        const apiResponse = await fetchMaterialsWithPagination();
        
        // Sanity check for data
        if (!apiResponse.data || !Array.isArray(apiResponse.data) || apiResponse.data.length === 0) {
          console.warn('API returned empty or invalid material data');
          throw new Error('Invalid material data returned from API');
        }
        
        // Process the data - no need for additional processing since our adapter already did that
        console.log('Processing data from API:', apiResponse.data.length, 'rows');
        
        // Cache the materials for future use
        cacheMaterials(apiResponse.data)
          .then(() => console.log('Materials cached successfully'))
          .catch(err => console.warn('Failed to cache materials:', err));
        
        return apiResponse.data;
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
        
        return getComprehensiveFallbackMaterials();
      }
    } catch (err) {
      console.error('Error loading materials:', err);
      handleMaterialApiError(err, 'load materials');
      return getComprehensiveFallbackMaterials();
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
 * Fetch materials with pagination to handle large datasets
 */
async function fetchMaterialsWithPagination() {
  let allData: ExtendedMaterialData[] = [];
  let currentOffset = 0;
  let hasMore = true;
  
  while (hasMore) {
    // Use optimized query with only needed columns and limit/offset
    const options: ApiRequestOptions = {
      limit: QUERY_LIMIT,
      offset: currentOffset,
      columns: 'id,material,description,co2e_min,co2e_max,co2e_avg,sustainability_score,applicable_standards,ncc_requirements,sustainability_notes'
    };
    
    try {
      const response = await fetchMaterialsFromApi(options);
      
      if (response.data && response.data.length > 0) {
        allData = [...allData, ...response.data];
        currentOffset += QUERY_LIMIT;
        
        // Stop if we received fewer items than the limit
        if (response.data.length < QUERY_LIMIT) {
          hasMore = false;
        }
        
        // Safety check to avoid too many requests
        if (currentOffset >= 2000) {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
    } catch (error) {
      console.error('Error in pagination fetch:', error);
      // Break the loop on error
      hasMore = false;
      throw error;
    }
  }
  
  return { data: allData, error: null };
}

/**
 * Get comprehensive fallback materials using all available sources
 */
function getComprehensiveFallbackMaterials(): ExtendedMaterialData[] {
  try {
    // Get base fallback materials
    const baseMaterials = getFallbackMaterials();
    
    // Also generate materials from MATERIAL_FACTORS
    const factorMaterials = Object.entries(MATERIAL_FACTORS).map(([key, value]) => {
      return {
        id: `factor-${key}`,
        name: value.name || key,
        factor: value.factor,
        carbon_footprint_kgco2e_kg: value.factor,
        carbon_footprint_kgco2e_tonne: value.factor * 1000,
        unit: value.unit || 'kg',
        region: 'Australia',
        tags: ['construction'],
        sustainabilityScore: Math.floor(Math.random() * 20) + 60, // More variation: 60-80
        recyclability: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as 'High' | 'Medium' | 'Low',
        alternativeTo: key.includes('recycled') || key.includes('low-carbon') ? key.replace(/recycled |low-carbon /, '') : undefined,
        notes: '',
        category: determineCategoryFromName(key)
      };
    });
    
    // Combine both sources, removing duplicates by name
    const materialMap = new Map<string, ExtendedMaterialData>();
    
    // Add base materials first
    baseMaterials.forEach(material => {
      if (material && material.name) {
        materialMap.set(material.name.toLowerCase(), material);
      }
    });
    
    // Add factor materials if not already present
    factorMaterials.forEach(material => {
      if (material && material.name && !materialMap.has(material.name.toLowerCase())) {
        materialMap.set(material.name.toLowerCase(), material);
      }
    });
    
    // Convert back to array
    const combinedMaterials = Array.from(materialMap.values());
    console.log(`Combined ${combinedMaterials.length} fallback materials from multiple sources`);
    
    return combinedMaterials;
  } catch (error) {
    console.error('Error creating comprehensive fallback materials:', error);
    return getFallbackMaterials();
  }
}

/**
 * Determine category from material name for better organization
 */
function determineCategoryFromName(name: string): string {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('concrete')) return 'Concrete';
  if (lowerName.includes('steel') || lowerName.includes('metal') || lowerName.includes('iron')) return 'Metals';
  if (lowerName.includes('wood') || lowerName.includes('timber')) return 'Wood';
  if (lowerName.includes('glass')) return 'Glass';
  if (lowerName.includes('brick') || lowerName.includes('tile')) return 'Ceramics';
  if (lowerName.includes('insulation')) return 'Insulation';
  if (lowerName.includes('plastic')) return 'Plastics';
  if (lowerName.includes('rock') || lowerName.includes('stone') || lowerName.includes('aggregate')) return 'Aggregates';
  return 'Other';
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
    const categoriesResponse = await fetchMaterialCategoriesFromApi();
    
    // Log categories retrieved
    console.log('Categories fetched:', categoriesResponse.data?.length || 0);
    
    if (!categoriesResponse.data || categoriesResponse.data.length === 0) {
      console.warn('API returned empty categories, using defaults');
      return getDefaultCategories();
    }
    
    return categoriesResponse.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return some sensible default categories on error
    return getDefaultCategories();
  }
}

// Initialize materials prefetch
(function initializeMaterialPrefetch() {
  let retryCount = 0;
  
  function attemptPrefetch() {
    console.log(`Starting background materials prefetch (attempt ${retryCount + 1})`);
    fetchMaterials(false)
      .then(materials => {
        console.log(`Background prefetch complete: ${materials.length} materials loaded`);
      })
      .catch(err => {
        console.warn('Background prefetch failed:', err);
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          const delay = Math.min(2000 * Math.pow(2, retryCount), 30000); // Exponential backoff with max 30s
          console.log(`Will retry in ${delay}ms`);
          setTimeout(attemptPrefetch, delay);
        }
      });
  }
  
  // Start with a short delay
  setTimeout(attemptPrefetch, 500);
})();
