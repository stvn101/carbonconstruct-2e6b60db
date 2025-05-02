
/**
 * MaterialCache - Service for efficient material data caching using IndexedDB
 * Provides a persistent cache layer between the application and Supabase
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { v4 as uuidv4 } from 'uuid';

// Cache constants
const DB_NAME = 'carbon-construct-cache';
const DB_VERSION = 1;
const MATERIALS_STORE = 'materials';
const METADATA_STORE = 'metadata';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_KEY = 'materials-cache-v1';

// Cache metadata interface
interface CacheMetadata {
  id: string;
  lastUpdated: number;
  version: string;
  count: number;
}

// Initialize database connection
let dbPromise: Promise<IDBDatabase> | null = null;

/**
 * Initialize the IndexedDB database
 */
async function initDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      console.warn('IndexedDB not supported - falling back to in-memory cache');
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB error:', event);
      reject(new Error('Failed to open IndexedDB'));
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create materials store with index on name
      if (!db.objectStoreNames.contains(MATERIALS_STORE)) {
        const materialsStore = db.createObjectStore(MATERIALS_STORE, { keyPath: 'name' });
        materialsStore.createIndex('name', 'name', { unique: true });
        materialsStore.createIndex('region', 'region', { unique: false });
        materialsStore.createIndex('tags', 'tags', { unique: false, multiEntry: true });
      }
      
      // Create metadata store
      if (!db.objectStoreNames.contains(METADATA_STORE)) {
        db.createObjectStore(METADATA_STORE, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      
      // Handle connection errors
      db.onerror = (event) => {
        console.error('Database error:', event);
      };
      
      resolve(db);
    };
  });
}

/**
 * Get database connection
 */
async function getDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = initDatabase();
  }
  
  try {
    return await dbPromise;
  } catch (error) {
    console.error('Failed to get database connection:', error);
    throw error;
  }
}

/**
 * Store materials in cache
 */
export async function cacheMaterials(materials: ExtendedMaterialData[]): Promise<void> {
  try {
    const db = await getDb();
    const tx = db.transaction([MATERIALS_STORE, METADATA_STORE], 'readwrite');
    const materialsStore = tx.objectStore(MATERIALS_STORE);
    const metadataStore = tx.objectStore(METADATA_STORE);
    
    // Clear existing materials
    materialsStore.clear();
    
    // Add all new materials
    materials.forEach(material => {
      materialsStore.add(material);
    });
    
    // Update metadata
    const metadata: CacheMetadata = {
      id: CACHE_KEY,
      lastUpdated: Date.now(),
      version: uuidv4(),
      count: materials.length
    };
    
    metadataStore.put(metadata);
    
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(new Error('Failed to cache materials'));
    });
  } catch (error) {
    console.error('Error caching materials:', error);
    // Fall back gracefully - app will still work with API calls
  }
}

/**
 * Get cached materials
 */
export async function getCachedMaterials(): Promise<ExtendedMaterialData[] | null> {
  try {
    const db = await getDb();
    const metadataTx = db.transaction(METADATA_STORE, 'readonly');
    const metadataStore = metadataTx.objectStore(METADATA_STORE);
    
    // Check if cache is still valid
    const metadata = await new Promise<CacheMetadata | undefined>((resolve, reject) => {
      const request = metadataStore.get(CACHE_KEY);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to get cache metadata'));
    });
    
    if (!metadata || (Date.now() - metadata.lastUpdated) > CACHE_TTL) {
      console.log('Cache expired or not found');
      return null;
    }
    
    // Get all materials from cache
    const materialsTx = db.transaction(MATERIALS_STORE, 'readonly');
    const materialsStore = materialsTx.objectStore(MATERIALS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = materialsStore.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.error('Error retrieving cached materials:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Failed to get cached materials:', error);
    return null; // Fall back to API
  }
}

/**
 * Clear the materials cache
 */
export async function clearMaterialsCache(): Promise<void> {
  try {
    const db = await getDb();
    const tx = db.transaction([MATERIALS_STORE, METADATA_STORE], 'readwrite');
    
    tx.objectStore(MATERIALS_STORE).clear();
    tx.objectStore(METADATA_STORE).delete(CACHE_KEY);
    
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(new Error('Failed to clear cache'));
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

/**
 * Get cache metadata
 */
export async function getCacheMetadata(): Promise<CacheMetadata | null> {
  try {
    const db = await getDb();
    const tx = db.transaction(METADATA_STORE, 'readonly');
    const store = tx.objectStore(METADATA_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.get(CACHE_KEY);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => {
        console.error('Error retrieving cache metadata:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Failed to get cache metadata:', error);
    return null;
  }
}
