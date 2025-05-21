
/**
 * Material Cache Core Service
 * Low-level implementation of material caching using IndexedDB
 */
import { openDB, IDBPDatabase } from 'idb';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { CACHE_KEYS } from './cacheConstants';

// Database constants
const DB_NAME = 'materials-cache-db';
const DB_VERSION = 1;
const MATERIALS_STORE = 'materials';
const METADATA_STORE = 'metadata';

// Cache management
let dbPromise: Promise<IDBPDatabase> | null = null;
let lastCachedMaterials: ExtendedMaterialData[] | null = null;

/**
 * Lazily initialize and connect to the IndexedDB database
 */
async function connectToDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create materials object store
        if (!db.objectStoreNames.contains(MATERIALS_STORE)) {
          const materialsStore = db.createObjectStore(MATERIALS_STORE, { keyPath: 'id' });
          materialsStore.createIndex('name', 'name');
          materialsStore.createIndex('category', 'category');
          materialsStore.createIndex('region', 'region');
        }
        
        // Create metadata object store
        if (!db.objectStoreNames.contains(METADATA_STORE)) {
          db.createObjectStore(METADATA_STORE);
        }
      },
      blocking() {
        // Handle blocking event (another tab is trying to upgrade)
        console.warn('Another tab is updating the materials database, this tab will reload');
        // Reload the page after a short delay
        setTimeout(() => window.location.reload(), 1000);
      }
    });
  }
  
  return dbPromise;
}

/**
 * Stores materials in the cache
 */
async function storeMaterialsInCache(materials: ExtendedMaterialData[]) {
  if (!materials || materials.length === 0) {
    console.warn('No materials provided for caching');
    return;
  }
  
  try {
    const db = await connectToDb();
    const tx = db.transaction([MATERIALS_STORE, METADATA_STORE], 'readwrite');
    const materialsStore = tx.objectStore(MATERIALS_STORE);
    const metadataStore = tx.objectStore(METADATA_STORE);
    
    // Clear existing materials
    await materialsStore.clear();
    
    // Store all materials
    for (const material of materials) {
      await materialsStore.put(material);
    }
    
    // Update metadata
    await metadataStore.put(new Date(), CACHE_KEYS.TIMESTAMP);
    await metadataStore.put(materials.length, CACHE_KEYS.COUNT);
    await metadataStore.put(DB_VERSION, CACHE_KEYS.VERSION);
    
    // Cache in memory
    lastCachedMaterials = [...materials];
    
    // Commit transaction
    await tx.done;
    
    return true;
  } catch (error) {
    console.error('Error storing materials in cache:', error);
    throw error;
  }
}

/**
 * Gets materials from the cache
 */
async function getMaterialsFromCache(): Promise<ExtendedMaterialData[]> {
  // If we have in-memory cache, use it
  if (lastCachedMaterials) {
    return lastCachedMaterials;
  }
  
  try {
    const db = await connectToDb();
    const tx = db.transaction(MATERIALS_STORE, 'readonly');
    const store = tx.objectStore(MATERIALS_STORE);
    
    const materials = await store.getAll();
    
    // Cache in memory for faster access next time
    lastCachedMaterials = [...materials];
    
    return materials;
  } catch (error) {
    console.error('Error getting materials from cache:', error);
    return [];
  }
}

/**
 * Clears the materials cache
 */
async function clearMaterialsCache() {
  try {
    // Clear in-memory cache
    lastCachedMaterials = null;
    
    const db = await connectToDb();
    const tx = db.transaction([MATERIALS_STORE, METADATA_STORE], 'readwrite');
    
    // Clear materials and metadata
    await tx.objectStore(MATERIALS_STORE).clear();
    await tx.objectStore(METADATA_STORE).clear();
    
    // Commit transaction
    await tx.done;
    
    return true;
  } catch (error) {
    console.error('Error clearing materials cache:', error);
    throw error;
  }
}

/**
 * Gets cache metadata
 */
async function getCacheMetadata() {
  try {
    const db = await connectToDb();
    const tx = db.transaction(METADATA_STORE, 'readonly');
    const store = tx.objectStore(METADATA_STORE);
    
    // Get metadata values
    const lastUpdated = await store.get(CACHE_KEYS.TIMESTAMP) as Date | undefined;
    const itemCount = await store.get(CACHE_KEYS.COUNT) as number | undefined;
    const version = await store.get(CACHE_KEYS.VERSION) as number | undefined;
    
    return {
      lastUpdated: lastUpdated || null,
      itemCount: itemCount || null,
      version: version || null
    };
  } catch (error) {
    console.error('Error getting cache metadata:', error);
    return {
      lastUpdated: null,
      itemCount: null,
      version: null
    };
  }
}

/**
 * Gets a material by ID from the cache
 */
async function getMaterialById(id: string): Promise<ExtendedMaterialData | null> {
  try {
    // Try in-memory cache first
    if (lastCachedMaterials) {
      const material = lastCachedMaterials.find(m => m.id === id);
      if (material) {
        return material;
      }
    }
    
    const db = await connectToDb();
    return db.get(MATERIALS_STORE, id);
  } catch (error) {
    console.error(`Error getting material ${id} from cache:`, error);
    return null;
  }
}

/**
 * Gets materials by category from the cache
 */
async function getMaterialsByCategory(category: string): Promise<ExtendedMaterialData[]> {
  try {
    // Try in-memory cache first
    if (lastCachedMaterials) {
      return lastCachedMaterials.filter(m => 
        m.category && m.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    const db = await connectToDb();
    const tx = db.transaction(MATERIALS_STORE, 'readonly');
    const index = tx.objectStore(MATERIALS_STORE).index('category');
    
    return index.getAll(category);
  } catch (error) {
    console.error(`Error getting materials for category ${category} from cache:`, error);
    return [];
  }
}

// Export the service
const materialCacheService = {
  storeMaterialsInCache,
  getMaterialsFromCache,
  clearMaterialsCache,
  getCacheMetadata,
  getMaterialById,
  getMaterialsByCategory
};

export default materialCacheService;
