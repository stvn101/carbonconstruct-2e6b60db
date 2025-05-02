
/**
 * Enhanced material cache service with improved scalability
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { performDbOperation } from '@/services/supabase';

// Cache constants
const CACHE_KEY = 'materials-cache-v1';
const METADATA_KEY = 'materials-cache-metadata';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Cache metadata interface
interface CacheMetadata {
  lastUpdated: number;
  count: number;
  size?: number;
  checksum?: string;  // For verifying data integrity
}

// Calculate a simple checksum for data validation
const calculateChecksum = (data: any[]): string => {
  try {
    // Simple implementation - in production use a proper hash function
    return data
      .map(item => JSON.stringify(item))
      .reduce((acc, str) => acc + str.length, 0)
      .toString(16);
  } catch (err) {
    console.warn('Failed to calculate checksum', err);
    return '';
  }
};

/**
 * Store materials in cache with enhanced handling and validation
 */
export async function cacheMaterials(materials: ExtendedMaterialData[]): Promise<void> {
  if (!materials || materials.length === 0) {
    console.warn('Attempted to cache empty materials array');
    return;
  }
  
  try {
    // Generate materialsByCategory for faster lookup
    const materialsByCategory: Record<string, ExtendedMaterialData[]> = {};
    materials.forEach(material => {
      if (!material) return;
      
      const category = material.category || 'uncategorized';
      if (!materialsByCategory[category]) {
        materialsByCategory[category] = [];
      }
      materialsByCategory[category].push(material);
    });
    
    // Calculate checksum for data validation
    const checksum = calculateChecksum(materials);
    
    // Calculate approximate size
    const serializedData = JSON.stringify(materials);
    const approximateSize = new Blob([serializedData]).size;
    
    // Check if we might exceed storage limits
    if (approximateSize > 4.5 * 1024 * 1024) { // 4.5MB to stay under 5MB limit
      console.warn(`Cache size (${(approximateSize/1024/1024).toFixed(2)}MB) approaching localStorage limits`);
      
      // Store only the most essential data
      const essentialData = materials.map(m => ({
        name: m.name,
        factor: m.factor,
        unit: m.unit,
        region: m.region,
        category: m.category
      }));
      
      localStorage.setItem(CACHE_KEY, JSON.stringify(essentialData));
      
      // Update metadata
      const metadata: CacheMetadata = {
        lastUpdated: Date.now(),
        count: essentialData.length,
        size: new Blob([JSON.stringify(essentialData)]).size,
        checksum: calculateChecksum(essentialData)
      };
      
      localStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
      console.log(`Cached ${essentialData.length} materials in limited form due to size constraints`);
    } else {
      // Store full data and category index
      localStorage.setItem(CACHE_KEY, serializedData);
      localStorage.setItem(`${CACHE_KEY}-by-category`, JSON.stringify(materialsByCategory));
      
      // Update metadata
      const metadata: CacheMetadata = {
        lastUpdated: Date.now(),
        count: materials.length,
        size: approximateSize,
        checksum
      };
      
      localStorage.setItem(METADATA_KEY, JSON.stringify(metadata));
      console.log(`Cached ${materials.length} materials (${(approximateSize/1024).toFixed(2)}KB)`);
    }
  } catch (error) {
    console.error('Error caching materials:', error);
    // Attempt to store reduced dataset on error
    try {
      const reducedData = materials.slice(0, 100).map(m => ({
        name: m.name,
        factor: m.factor,
        unit: m.unit
      }));
      localStorage.setItem(`${CACHE_KEY}-reduced`, JSON.stringify(reducedData));
    } catch (fallbackError) {
      console.error('Critical cache failure:', fallbackError);
    }
  }
}

/**
 * Get cached materials with enhanced error handling and validation
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
    
    const materials = JSON.parse(materialsStr);
    
    // Validate data integrity if checksum exists
    if (metadata.checksum) {
      const currentChecksum = calculateChecksum(materials);
      if (currentChecksum !== metadata.checksum) {
        console.warn('Cache checksum verification failed, data may be corrupted');
        clearMaterialsCache();
        return null;
      }
    }
    
    return materials;
  } catch (error) {
    console.error('Failed to get cached materials:', error);
    
    // Attempt to load from reduced cache in case of failure
    try {
      const reducedStr = localStorage.getItem(`${CACHE_KEY}-reduced`);
      if (reducedStr) {
        console.info('Using reduced materials cache due to main cache failure');
        return JSON.parse(reducedStr);
      }
    } catch (fallbackError) {
      // Silent fail for fallback attempt
    }
    
    return null;
  }
}

/**
 * Clear the materials cache
 */
export async function clearMaterialsCache(): Promise<void> {
  try {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(`${CACHE_KEY}-by-category`);
    localStorage.removeItem(`${CACHE_KEY}-reduced`);
    localStorage.removeItem(METADATA_KEY);
    console.log('Materials cache cleared successfully');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

/**
 * Get cache metadata with usage statistics
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

/**
 * Get materials by category for faster access
 */
export async function getMaterialsByCategory(category: string): Promise<ExtendedMaterialData[] | null> {
  try {
    const byCategoryStr = localStorage.getItem(`${CACHE_KEY}-by-category`);
    if (!byCategoryStr) {
      return null;
    }
    
    const byCategory = JSON.parse(byCategoryStr);
    return byCategory[category] || [];
  } catch (error) {
    console.error(`Failed to get materials for category ${category}:`, error);
    return null;
  }
}

/**
 * Preload commonly used categories for better UX
 */
export async function preloadCommonCategories(): Promise<void> {
  try {
    // Preload the most commonly used categories from Supabase
    const commonCategories = ['Concrete', 'Wood', 'Steel', 'Insulation'];
    
    const operations = commonCategories.map(category => 
      performDbOperation(
        async () => {
          // Query for specific category with limit
          const { data } = await supabase
            .from('materials')
            .select('*')
            .eq('category', category)
            .limit(25);
          
          if (data && data.length > 0) {
            // Store in category-specific cache
            localStorage.setItem(
              `${CACHE_KEY}-category-${category}`, 
              JSON.stringify(data)
            );
          }
          
          return data;
        },
        `preload-materials-${category}`,
        { silentFail: true, fallbackData: [] }
      )
    );
    
    await Promise.allSettled(operations);
    console.log('Preloaded common material categories successfully');
  } catch (error) {
    console.warn('Failed to preload material categories:', error);
  }
}
