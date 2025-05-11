
/**
 * Core material cache service
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { supabase } from '@/integrations/supabase/client';
import { mapDatabaseMaterials } from './materialDataMapping';
import { CONNECTION_TIMEOUT, CACHE_EXPIRATION, CACHE_REFRESH_INTERVAL } from './cacheConstants';

class MaterialCacheService {
  private cache: ExtendedMaterialData[] = [];
  public lastUpdated: Date | null = null;
  private isSyncing = false;
  private refreshInterval: number | null = null;
  private retryTimeout: number | null = null;
  private retryCount = 0;
  private MAX_RETRIES = 3;
  private isInitialized = false;

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
        try {
          this.cache = JSON.parse(cachedData);
          this.lastUpdated = new Date(cachedTimestamp);
          console.log('Materials cache loaded from local storage:', this.cache.length, 'items');
          this.isInitialized = true;
          
          // Check if cache is expired
          const now = new Date();
          if (now.getTime() - new Date(cachedTimestamp).getTime() > CACHE_EXPIRATION) {
            console.log('Cache is expired, refreshing...');
            this.syncMaterialsCache();
          }
        } catch (parseError) {
          console.error('Error parsing cached materials:', parseError);
          localStorage.removeItem('materialsCache');
          localStorage.removeItem('materialsCacheTimestamp');
          await this.syncMaterialsCache();
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
      
      // Schedule a retry if initialization fails
      if (this.retryCount < this.MAX_RETRIES) {
        this.retryCount++;
        console.log(`Scheduling cache initialization retry ${this.retryCount}/${this.MAX_RETRIES}...`);
        
        if (this.retryTimeout) {
          clearTimeout(this.retryTimeout);
        }
        
        this.retryTimeout = window.setTimeout(() => {
          this.initializeCache();
        }, 5000 * Math.pow(2, this.retryCount - 1)); // Exponential backoff
      }
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
      
      // Check if supabase is available
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }
      
      // Build optimized query - only select needed columns
      const query = supabase
        .from('materials')
        .select('id,name,factor,carbon_footprint_kgco2e_kg,unit,region,tags,sustainabilityscore,recyclability,alternativeto,notes,category')
        .order('id')
        .limit(1000); // Limit to reasonable batch size
      
      // Use standard promise handling pattern
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
        this.isInitialized = true;
        
        // Save to localStorage with error handling and chunk if necessary
        try {
          const jsonString = JSON.stringify(mappedData);
          localStorage.setItem('materialsCache', jsonString);
          localStorage.setItem('materialsCacheTimestamp', this.lastUpdated.toISOString());
        } catch (storageError) {
          console.warn('Failed to save materials to localStorage:', storageError);
          // Could be quota exceeded - try to clear some space and store fewer items
          try {
            localStorage.removeItem('materialsCache');
            // Store only the first 500 items if the full set is too large
            const reducedData = mappedData.slice(0, 500);
            localStorage.setItem('materialsCache', JSON.stringify(reducedData));
            localStorage.setItem('materialsCacheTimestamp', this.lastUpdated.toISOString());
            console.warn('Stored reduced set of materials due to storage limitations');
          } catch (retryError) {
            console.error('Failed to store materials after clearing cache:', retryError);
          }
        }
        
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
    if (!this.isInitialized) {
      console.warn('Cache is not yet initialized when requesting materials');
    }
    
    if (!this.cache || this.cache.length === 0) {
      console.warn('Cache is empty when requesting materials');
    }
    
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
