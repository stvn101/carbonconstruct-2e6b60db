/**
 * In-memory cache service for storing and retrieving material data.
 * This service also handles periodic cache refresh and connection change events.
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { supabase } from '@/integrations/supabase/client';
import { withTimeout } from '@/utils/timeoutUtils';

// Cache expiration time (24 hours)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;
// Cache refresh interval (24 hours)
const CACHE_REFRESH_INTERVAL = 24 * 60 * 60 * 1000;
// Connection timeout for database requests
const CONNECTION_TIMEOUT = 15000;

// Helper function to ensure recyclability is a valid value
function validateRecyclability(value: string | null | undefined): "High" | "Medium" | "Low" {
  if (value === "High" || value === "Medium" || value === "Low") {
    return value;
  }
  // Default to Medium if the value is not one of the expected values
  return "Medium";
}

class MaterialCacheService {
  private cache: ExtendedMaterialData[] = [];
  public lastUpdated: Date | null = null;
  private isSyncing = false;
  private refreshInterval: number | null = null;

  constructor() {
    this.initializeCache();
    window.addEventListener('online', this.handleConnectionChange);
    window.addEventListener('offline', this.handleConnectionChange);
  }

  /**
   * Initializes the cache with data from local storage or fetches it from the database.
   */
  private async initializeCache() {
    try {
      const cachedData = localStorage.getItem('materialsCache');
      const cachedTimestamp = localStorage.getItem('materialsCacheTimestamp');

      if (cachedData && cachedTimestamp) {
        this.cache = JSON.parse(cachedData);
        this.lastUpdated = new Date(cachedTimestamp);
        console.log('Materials cache loaded from local storage');
        
        // Check if cache is expired
        const now = new Date();
        if (now.getTime() - new Date(cachedTimestamp).getTime() > CACHE_EXPIRATION) {
          console.log('Cache is expired, refreshing...');
          this.syncMaterialsCache();
        }
      } else {
        await this.syncMaterialsCache();
      }

      // Set up periodic cache refresh
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
      }
      this.refreshInterval = window.setInterval(() => this.syncMaterialsCache(), CACHE_REFRESH_INTERVAL);
    } catch (error) {
      console.error('Error initializing materials cache:', error);
    }
  }

  /**
   * Fetches material data from the database and updates the cache.
   */
  public async syncMaterialsCache() {
    if (this.isSyncing) {
      console.log('Materials cache sync already in progress');
      return;
    }

    this.isSyncing = true;
    try {
      console.log('Syncing materials cache with database');
      
      // First create the Supabase query
      const query = supabase.from('materials').select('*').order('id').limit(5000);
      
      // SOLUTION #1: Using standard promise handling pattern
      // This explicitly casts the query to Promise<any> to ensure .catch is available
      const { data, error } = await Promise.resolve(query)
        .then(response => response)
        .catch(error => {
          throw error;
        });
      
      /* SOLUTION #2: Alternative approach using async/await with try/catch
      let data, error;
      try {
        const response = await query;
        data = response.data;
        error = response.error;
      } catch (e) {
        throw new Error(`Error fetching materials: ${e instanceof Error ? e.message : String(e)}`);
      }
      */
      
      /* SOLUTION #3: Using Promise constructor with proper typing
      const response = await new Promise<{data: any[], error: any}>((resolve, reject) => {
        query
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
      
      const { data, error } = response;
      */
      
      if (error) {
        throw new Error(`Error fetching materials: ${error.message}`);
      }

      if (data && data.length > 0) {
        // Map the data to ensure types match our ExtendedMaterialData interface
        const mappedData: ExtendedMaterialData[] = data.map(item => ({
          name: item.name || '',
          factor: item.factor || 0,
          unit: item.unit || 'kg',
          region: item.region || '',
          tags: item.tags || [],
          sustainabilityScore: item.sustainabilityscore,
          recyclability: validateRecyclability(item.recyclability),
          alternativeTo: item.alternativeto,
          notes: item.notes,
          category: item.category
        }));
        
        this.cache = mappedData;
        this.lastUpdated = new Date();
        localStorage.setItem('materialsCache', JSON.stringify(mappedData));
        localStorage.setItem('materialsCacheTimestamp', this.lastUpdated.toISOString());
        console.log(`Materials cache synced with database: ${mappedData.length} items`);
        return mappedData;
      } else {
        console.warn('No materials returned from database');
      }
    } catch (error) {
      console.error('Error syncing materials cache:', error?.message || error);
      throw error;
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Retrieves all materials from the cache.
   * @returns An array of ExtendedMaterialData objects.
   */
  public getMaterials() {
    return this.cache;
  }

  /**
   * Get the number of materials in cache
   * @returns The number of materials in the cache
   */
  public getMaterialsCount() {
    return this.cache?.length || 0;
  }

  /**
   * Clears the cache
   */
  public clearCache() {
    this.cache = [];
    localStorage.removeItem('materialsCache');
    localStorage.removeItem('materialsCacheTimestamp');
    console.log('Materials cache cleared');
  }

  /**
   * Retrieves a material from the cache by its name.
   * @param name The name of the material to retrieve.
   * @returns The ExtendedMaterialData object if found, otherwise undefined.
   */
  public getMaterialByName(name: string) {
    return this.cache.find(material => material.name === name);
  }

  /**
   * Handles changes in the network connection status.
   * @param e The event object.
   */
  private handleConnectionChange = (e: Event) => {
    if (navigator.onLine) {
      console.log('Connection restored, syncing materials cache');
      this.syncMaterialsCache().catch(err => {
        console.warn('Failed to sync cache after connection restored:', err);
      });
    } else {
      console.log('Connection lost, using cached materials');
    }
  };
}

const materialCacheService = new MaterialCacheService();

// Export these functions for use in other modules
export async function cacheMaterials(materials: ExtendedMaterialData[]) {
  try {
    materialCacheService.clearCache(); // Clear first
    // Create a new mechanism to replace the cache
    const result = await materialCacheService.syncMaterialsCache();
    materialCacheService.lastUpdated = new Date();
    return !!result;
  } catch (error) {
    console.error('Error caching materials:', error);
    throw error;
  }
}

export async function getCachedMaterials() {
  return materialCacheService.getMaterials();
}

export async function clearMaterialsCache() {
  try {
    materialCacheService.clearCache();
    return true;
  } catch (error) {
    console.error('Failed to clear cache:', error);
    return false;
  }
}

export async function getCacheMetadata() {
  return {
    lastUpdated: materialCacheService.lastUpdated,
    count: materialCacheService.getMaterialsCount()
  };
}

export default materialCacheService;
