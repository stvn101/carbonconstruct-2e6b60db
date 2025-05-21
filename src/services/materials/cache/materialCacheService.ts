
/**
 * Material Cache Service
 * Provides caching functionality for material data using IndexedDB
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { createDatabaseMaterialId } from '../materialAdapter';
import { mapDatabaseMaterials } from './materialDataMapping';
import { CACHE_KEYS, DEFAULT_CACHE_TTL } from './cacheConstants';
import { openDB, IDBPDatabase } from 'idb';

// Cache metadata type 
export interface MaterialCacheMetadata {
  lastUpdated: Date | null;
  itemCount: number | null;
}

// Database name and version
const DB_NAME = 'carbonConstructMaterialsCache';
const DB_VERSION = 1;
const MATERIALS_STORE = 'materials';
const METADATA_STORE = 'metadata';

// Function to open the IndexedDB database
async function openDatabase(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create the materials object store if it doesn't exist
      if (!db.objectStoreNames.contains(MATERIALS_STORE)) {
        db.createObjectStore(MATERIALS_STORE, { keyPath: 'id' });
      }
      
      // Create metadata store if it doesn't exist
      if (!db.objectStoreNames.contains(METADATA_STORE)) {
        db.createObjectStore(METADATA_STORE, { keyPath: 'key' });
      }
    },
  });
}

/**
 * Stores materials in the cache with proper IDs
 * @param materials Array of materials to cache
 * @returns Boolean indicating success
 */
export async function cacheMaterials(materials: ExtendedMaterialData[]): Promise<boolean> {
  if (!materials || !Array.isArray(materials)) {
    console.error('Invalid materials data provided to cache');
    return false;
  }
  
  try {
    console.log(`Caching ${materials.length} materials`);
    
    // Open the database
    const db = await openDatabase();
    
    // Start a transaction
    const tx = db.transaction([MATERIALS_STORE, METADATA_STORE], 'readwrite');
    const materialsStore = tx.objectStore(MATERIALS_STORE);
    const metadataStore = tx.objectStore(METADATA_STORE);
    
    // Clear existing data first
    await materialsStore.clear();
    
    // Format materials correctly with proper IDs before storing
    const normalizedMaterials = materials.map(material => {
      const id = material.id || `unknown-${Date.now()}-${Math.random()}`;
      // Ensure ID is properly formatted for database materials
      return {
        ...material,
        id: id.toString()
      };
    });
    
    // Store each material
    for (const material of normalizedMaterials) {
      await materialsStore.put(material);
    }
    
    // Update metadata
    await metadataStore.put({
      key: CACHE_KEYS.TIMESTAMP,
      value: new Date().toISOString()
    });
    
    await metadataStore.put({
      key: CACHE_KEYS.COUNT,
      value: materials.length
    });
    
    // Complete the transaction
    await tx.done;
    
    console.log(`Successfully cached ${materials.length} materials`);
    return true;
  } catch (error) {
    console.error('Error caching materials:', error);
    return false;
  }
}

/**
 * Retrieves materials from the cache
 * @returns Array of cached materials or null if cache is empty/invalid
 */
export async function getCachedMaterials(): Promise<ExtendedMaterialData[] | null> {
  try {
    // Open the database
    const db = await openDatabase();
    
    // Get all materials
    const materials = await db.getAll(MATERIALS_STORE);
    
    // Check if cache is empty
    if (!materials || materials.length === 0) {
      console.log('No materials found in cache');
      return null;
    }
    
    // Check if cache is expired
    const metadataStore = db.transaction(METADATA_STORE).objectStore(METADATA_STORE);
    const timestamp = await metadataStore.get(CACHE_KEYS.TIMESTAMP);
    
    if (timestamp && timestamp.value) {
      const cacheDate = new Date(timestamp.value);
      const now = new Date();
      
      // Check if cache is older than TTL
      if (now.getTime() - cacheDate.getTime() > DEFAULT_CACHE_TTL) {
        console.log('Material cache is expired');
        return null;
      }
    }
    
    // Map database materials to the expected format
    return materials.map(material => ({
      ...material,
      // Ensure database materials have correct formatting for IDs when retrieved
      id: material.id
    }));
  } catch (error) {
    console.error('Error retrieving cached materials:', error);
    return null;
  }
}

/**
 * Clears the materials cache
 */
export async function clearMaterialsCache(): Promise<boolean> {
  try {
    const db = await openDatabase();
    const tx = db.transaction([MATERIALS_STORE, METADATA_STORE], 'readwrite');
    
    await tx.objectStore(MATERIALS_STORE).clear();
    await tx.objectStore(METADATA_STORE).clear();
    
    await tx.done;
    console.log('Materials cache cleared');
    return true;
  } catch (error) {
    console.error('Error clearing materials cache:', error);
    return false;
  }
}

/**
 * Prefetches materials data in the background and stores in cache
 * @param forceRefresh Force a refresh even if cache exists
 */
export async function prefetchMaterials(forceRefresh = false): Promise<ExtendedMaterialData[]> {
  try {
    // Check if we already have cached data and it's not a forced refresh
    if (!forceRefresh) {
      const cachedMaterials = await getCachedMaterials();
      if (cachedMaterials && cachedMaterials.length > 0) {
        console.log(`Using ${cachedMaterials.length} cached materials`);
        return cachedMaterials;
      }
    }
    
    console.log('Prefetching materials data');
    
    // Dynamic import to avoid circular dependencies
    const { fetchMaterials } = await import('../fetch/materialFetchService');
    
    // Fetch fresh materials
    const materials = await fetchMaterials();
    
    // Cache the fetched materials
    if (materials && materials.length > 0) {
      await cacheMaterials(materials);
    }
    
    return materials;
  } catch (error) {
    console.error('Error prefetching materials:', error);
    throw error;
  }
}

/**
 * Gets metadata about the cache
 */
export async function getCacheMetadata(): Promise<MaterialCacheMetadata> {
  try {
    const db = await openDatabase();
    const metadataStore = db.transaction(METADATA_STORE).objectStore(METADATA_STORE);
    
    const timestamp = await metadataStore.get(CACHE_KEYS.TIMESTAMP);
    const count = await metadataStore.get(CACHE_KEYS.COUNT);
    
    return {
      lastUpdated: timestamp ? new Date(timestamp.value) : null,
      itemCount: count ? count.value : null
    };
  } catch (error) {
    console.error('Error getting cache metadata:', error);
    return {
      lastUpdated: null,
      itemCount: null
    };
  }
}
