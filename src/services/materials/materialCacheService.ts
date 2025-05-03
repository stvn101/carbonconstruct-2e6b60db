
/**
 * In-memory cache service for storing and retrieving material data.
 * This service also handles periodic cache refresh and connection change events.
 */
import { SupabaseMaterial } from './materialTypes';
import { supabase } from '@/integrations/supabase/client';
import { CONNECTION_TIMEOUT, MAX_RETRIES } from './materialTypes';

// Export these functions for use in other modules
export async function cacheMaterials(materials) {
  try {
    return await materialCacheService.syncMaterialsCache();
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
    // Clear local cache
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
    // Use getMaterialsCount() method instead of directly accessing the private cache property
    count: materialCacheService.getMaterialsCount()
  };
}

class MaterialCacheService {
  // These properties should follow a consistent visibility pattern
  private cache = [];
  public lastUpdated = null;
  private isSyncing = false;

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
      } else {
        await this.syncMaterialsCache();
      }

      // Set up periodic cache refresh
      setInterval(() => this.syncMaterialsCache(), 24 * 60 * 60 * 1000); // Refresh daily
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
      // Remove the timeout method that's causing the error
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('id')
        .limit(5000);

      if (error) {
        throw new Error(`Error fetching materials: ${error.message}`);
      }

      if (data) {
        this.cache = data;
        this.lastUpdated = new Date();
        localStorage.setItem('materialsCache', JSON.stringify(data));
        localStorage.setItem('materialsCacheTimestamp', this.lastUpdated.toISOString());
        console.log('Materials cache synced with database');
      }
    } catch (error) {
      console.error('Error syncing materials cache:', error?.message || error);
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Retrieves all materials from the cache.
   * @returns An array of SupabaseMaterial objects.
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
   * Retrieves a material from the cache by its ID.
   * @param id The ID of the material to retrieve.
   * @returns The SupabaseMaterial object if found, otherwise undefined.
   */
  public getMaterialById(id) {
    return this.cache.find(material => material.id === id);
  }

  /**
   * Handles changes in the network connection status.
   * @param e The event object.
   */
  private handleConnectionChange = (e) => {
    if (navigator.onLine) {
      // Do something when online
      console.log('Connection restored, syncing materials cache');
      this.syncMaterialsCache();
      // Any other online connection logic
    } else {
      // Do something when offline
      console.log('Connection lost, using cached materials');
      // Any other offline connection logic
    }
  };
}

const materialCacheService = new MaterialCacheService();

export default materialCacheService;
