
/**
 * Material Cache Core Service
 * Provides core functionality for material caching
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { CACHE_KEYS, DEFAULT_CACHE_TTL, CACHE_STALE_THRESHOLD } from './cacheConstants';
import { openDB } from 'idb';

// Database configuration
const DB_NAME = 'materialCacheDB';
const DB_VERSION = 1;
const MATERIALS_STORE = 'materials';
const METADATA_STORE = 'metadata';

/**
 * Opens the IndexedDB database for material cache
 */
async function openDatabase() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create stores if they don't exist
      if (!db.objectStoreNames.contains(MATERIALS_STORE)) {
        db.createObjectStore(MATERIALS_STORE, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(METADATA_STORE)) {
        db.createObjectStore(METADATA_STORE, { keyPath: 'key' });
      }
    }
  });
}

/**
 * Stores materials in the cache
 * @param materials Array of materials to cache
 */
export async function storeMaterialsInCache(materials: ExtendedMaterialData[]): Promise<void> {
  if (!materials || materials.length === 0) {
    console.warn('Attempting to cache empty materials array');
    return;
  }
  
  try {
    const db = await openDatabase();
    const tx = db.transaction([MATERIALS_STORE, METADATA_STORE], 'readwrite');
    
    // Clear existing materials
    await tx.objectStore(MATERIALS_STORE).clear();
    
    // Store each material
    for (const material of materials) {
      // Ensure material has an ID
      const materialWithId = {
        ...material,
        id: material.id || `unknown-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      };
      
      await tx.objectStore(MATERIALS_STORE).put(materialWithId);
    }
    
    // Update metadata
    await tx.objectStore(METADATA_STORE).put({
      key: CACHE_KEYS.TIMESTAMP,
      value: new Date().toISOString()
    });
    
    await tx.objectStore(METADATA_STORE).put({
      key: CACHE_KEYS.COUNT,
      value: materials.length
    });
    
    await tx.objectStore(METADATA_STORE).put({
      key: CACHE_KEYS.VERSION,
      value: '1.0.0'
    });
    
    await tx.done;
    console.log(`Successfully cached ${materials.length} materials`);
  } catch (error) {
    console.error('Error storing materials in cache:', error);
    throw error;
  }
}

/**
 * Retrieves materials from the cache
 */
export async function getMaterialsFromCache(): Promise<ExtendedMaterialData[] | null> {
  try {
    const db = await openDatabase();
    
    // Get cache timestamp
    const metadataStore = db.transaction(METADATA_STORE).objectStore(METADATA_STORE);
    const timestamp = await metadataStore.get(CACHE_KEYS.TIMESTAMP);
    
    // Check if cache is valid
    if (!timestamp || !timestamp.value) {
      console.log('No timestamp found in cache');
      return null;
    }
    
    const lastUpdated = new Date(timestamp.value);
    const now = new Date();
    
    // Check if cache is expired
    if (now.getTime() - lastUpdated.getTime() > DEFAULT_CACHE_TTL) {
      console.log('Cache is expired');
      return null;
    }
    
    // Get materials from cache
    const materials = await db.getAll(MATERIALS_STORE);
    if (!materials || materials.length === 0) {
      console.log('No materials found in cache');
      return null;
    }
    
    console.log(`Retrieved ${materials.length} materials from cache`);
    return materials;
  } catch (error) {
    console.error('Error getting materials from cache:', error);
    return null;
  }
}

/**
 * Clears the materials cache
 */
export async function clearMaterialsCache(): Promise<void> {
  try {
    const db = await openDatabase();
    const tx = db.transaction([MATERIALS_STORE, METADATA_STORE], 'readwrite');
    
    await tx.objectStore(MATERIALS_STORE).clear();
    await tx.objectStore(METADATA_STORE).clear();
    
    await tx.done;
    console.log('Materials cache cleared successfully');
  } catch (error) {
    console.error('Error clearing materials cache:', error);
    throw error;
  }
}

/**
 * Gets metadata about the cache
 */
export async function getCacheMetadata() {
  try {
    const db = await openDatabase();
    const metadataStore = db.transaction(METADATA_STORE).objectStore(METADATA_STORE);
    
    // Get metadata values
    const timestampRecord = await metadataStore.get(CACHE_KEYS.TIMESTAMP);
    const countRecord = await metadataStore.get(CACHE_KEYS.COUNT);
    const versionRecord = await metadataStore.get(CACHE_KEYS.VERSION);
    
    // Parse timestamp
    let lastUpdated = null;
    let status: 'fresh' | 'stale' | 'unknown' = 'unknown';
    let ageInMinutes = null;
    
    if (timestampRecord && timestampRecord.value) {
      lastUpdated = new Date(timestampRecord.value);
      const now = new Date();
      const ageInMs = now.getTime() - lastUpdated.getTime();
      ageInMinutes = Math.floor(ageInMs / (1000 * 60));
      
      // Determine freshness
      status = ageInMs < CACHE_STALE_THRESHOLD ? 'fresh' : 'stale';
    }
    
    return {
      lastUpdated,
      itemCount: countRecord ? countRecord.value : null,
      version: versionRecord ? versionRecord.value : null,
      status,
      ageInMinutes
    };
  } catch (error) {
    console.error('Error getting cache metadata:', error);
    return {
      lastUpdated: null,
      itemCount: null,
      version: null,
      status: 'unknown',
      ageInMinutes: null
    };
  }
}

// Default export
export default {
  storeMaterialsInCache,
  getMaterialsFromCache,
  clearMaterialsCache,
  getCacheMetadata
};
