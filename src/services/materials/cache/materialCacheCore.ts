
/**
 * Core material cache service
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { supabase } from '@/integrations/supabase/client';
import { withTimeout } from '@/utils/timeoutUtils';
import { mapDatabaseMaterials } from './materialDataMapping';
import { CONNECTION_TIMEOUT, CACHE_EXPIRATION, CACHE_REFRESH_INTERVAL } from './cacheConstants';

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
      
      // Using standard promise handling pattern
      const { data, error } = await Promise.resolve(query)
        .then(response => response)
        .catch(error => {
          throw error;
        });
      
      if (error) {
        throw new Error(`Error fetching materials: ${error.message}`);
      }

      if (data && data.length > 0) {
        // Map the data to ensure types match our ExtendedMaterialData interface
        const mappedData = mapDatabaseMaterials(data);
        
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
export default materialCacheService;
