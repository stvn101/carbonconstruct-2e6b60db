import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { v4 as uuidv4 } from 'uuid';

// Cache constants
const DB_NAME = 'carbon-construct-cache';
const DB_VERSION = 2; // Increase version to update schema for better indexing
const MATERIALS_STORE = 'materials';
const METADATA_STORE = 'metadata';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_KEY = 'materials-cache-v2';

// Additional index stores for faster lookups
const NAME_INDEX_STORE = 'name_index';
const REGION_INDEX_STORE = 'region_index';
const CATEGORY_INDEX_STORE = 'category_index';
const TAG_INDEX_STORE = 'tag_index';

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
 * Initialize the IndexedDB database with optimized indexes for performance
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
      
      // Create materials store with multiple indexes for faster queries
      if (!db.objectStoreNames.contains(MATERIALS_STORE)) {
        const materialsStore = db.createObjectStore(MATERIALS_STORE, { keyPath: 'name' });
        
        // Create indexes for common query patterns
        materialsStore.createIndex('name', 'name', { unique: true });
        materialsStore.createIndex('region', 'region', { unique: false });
        materialsStore.createIndex('category', 'category', { unique: false });
        materialsStore.createIndex('factor', 'factor', { unique: false });
        materialsStore.createIndex('tags', 'tags', { unique: false, multiEntry: true });
        materialsStore.createIndex('sustainabilityScore', 'sustainabilityScore', { unique: false });
      } else {
        // Make sure all needed indexes exist when upgrading
        const materialsStore = event.currentTarget?.transaction?.objectStore(MATERIALS_STORE);
        if (materialsStore) {
          if (!materialsStore.indexNames.contains('category')) {
            materialsStore.createIndex('category', 'category', { unique: false });
          }
          if (!materialsStore.indexNames.contains('factor')) {
            materialsStore.createIndex('factor', 'factor', { unique: false });
          }
          if (!materialsStore.indexNames.contains('sustainabilityScore')) {
            materialsStore.createIndex('sustainabilityScore', 'sustainabilityScore', { unique: false });
          }
        }
      }
      
      // Create name index store for faster prefix searches
      if (!db.objectStoreNames.contains(NAME_INDEX_STORE)) {
        const nameIndexStore = db.createObjectStore(NAME_INDEX_STORE, { keyPath: 'prefix' });
        nameIndexStore.createIndex('prefix', 'prefix', { unique: true });
      }
      
      // Create region index store
      if (!db.objectStoreNames.contains(REGION_INDEX_STORE)) {
        const regionIndexStore = db.createObjectStore(REGION_INDEX_STORE, { keyPath: 'region' });
        regionIndexStore.createIndex('region', 'region', { unique: true });
      }
      
      // Create category index store
      if (!db.objectStoreNames.contains(CATEGORY_INDEX_STORE)) {
        const categoryIndexStore = db.createObjectStore(CATEGORY_INDEX_STORE, { keyPath: 'category' });
        categoryIndexStore.createIndex('category', 'category', { unique: true });
      }
      
      // Create tag index store
      if (!db.objectStoreNames.contains(TAG_INDEX_STORE)) {
        const tagIndexStore = db.createObjectStore(TAG_INDEX_STORE, { keyPath: 'tag' });
        tagIndexStore.createIndex('tag', 'tag', { unique: true });
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
 * Create prefix indexes for efficient prefix search
 */
async function createPrefixIndexes(materials: ExtendedMaterialData[]): Promise<void> {
  try {
    const db = await getDb();
    const tx = db.transaction([NAME_INDEX_STORE], 'readwrite');
    const nameIndexStore = tx.objectStore(NAME_INDEX_STORE);
    
    // Clear existing indexes
    nameIndexStore.clear();
    
    // Map to hold unique prefixes and their associated materials
    const prefixMap = new Map<string, Set<string>>();
    
    materials.forEach(material => {
      if (!material.name) return;
      
      const name = material.name.toLowerCase();
      // Create prefixes of different lengths for efficient autocomplete
      for (let i = 1; i <= Math.min(name.length, 5); i++) {
        const prefix = name.substring(0, i);
        if (!prefixMap.has(prefix)) {
          prefixMap.set(prefix, new Set());
        }
        prefixMap.get(prefix)?.add(material.name);
      }
    });
    
    // Store all prefixes
    prefixMap.forEach((materialNames, prefix) => {
      nameIndexStore.add({
        prefix,
        materialNames: Array.from(materialNames)
      });
    });
    
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(new Error('Failed to create prefix indexes'));
    });
  } catch (error) {
    console.error('Error creating prefix indexes:', error);
  }
}

/**
 * Create category indexes for faster filtering
 */
async function createCategoryIndexes(materials: ExtendedMaterialData[]): Promise<void> {
  try {
    const db = await getDb();
    const tx = db.transaction([CATEGORY_INDEX_STORE], 'readwrite');
    const categoryIndexStore = tx.objectStore(CATEGORY_INDEX_STORE);
    
    // Clear existing indexes
    categoryIndexStore.clear();
    
    // Map to hold unique categories and their associated materials
    const categoryMap = new Map<string, Set<string>>();
    
    materials.forEach(material => {
      if (!material.category) return;
      
      if (!categoryMap.has(material.category)) {
        categoryMap.set(material.category, new Set());
      }
      categoryMap.get(material.category)?.add(material.name);
    });
    
    // Store all categories
    categoryMap.forEach((materialNames, category) => {
      categoryIndexStore.add({
        category,
        materialNames: Array.from(materialNames),
        count: materialNames.size
      });
    });
    
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(new Error('Failed to create category indexes'));
    });
  } catch (error) {
    console.error('Error creating category indexes:', error);
  }
}

/**
 * Create region indexes for faster filtering
 */
async function createRegionIndexes(materials: ExtendedMaterialData[]): Promise<void> {
  try {
    const db = await getDb();
    const tx = db.transaction([REGION_INDEX_STORE], 'readwrite');
    const regionIndexStore = tx.objectStore(REGION_INDEX_STORE);
    
    // Clear existing indexes
    regionIndexStore.clear();
    
    // Map to hold unique regions and their associated materials
    const regionMap = new Map<string, Set<string>>();
    
    materials.forEach(material => {
      if (!material.region) return;
      
      // Handle comma-separated regions
      const regions = material.region.split(', ');
      regions.forEach(region => {
        if (!region) return;
        
        if (!regionMap.has(region)) {
          regionMap.set(region, new Set());
        }
        regionMap.get(region)?.add(material.name);
      });
    });
    
    // Store all regions
    regionMap.forEach((materialNames, region) => {
      regionIndexStore.add({
        region,
        materialNames: Array.from(materialNames),
        count: materialNames.size
      });
    });
    
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(new Error('Failed to create region indexes'));
    });
  } catch (error) {
    console.error('Error creating region indexes:', error);
  }
}

/**
 * Create tag indexes for faster filtering
 */
async function createTagIndexes(materials: ExtendedMaterialData[]): Promise<void> {
  try {
    const db = await getDb();
    const tx = db.transaction([TAG_INDEX_STORE], 'readwrite');
    const tagIndexStore = tx.objectStore(TAG_INDEX_STORE);
    
    // Clear existing indexes
    tagIndexStore.clear();
    
    // Map to hold unique tags and their associated materials
    const tagMap = new Map<string, Set<string>>();
    
    materials.forEach(material => {
      if (!material.tags || !Array.isArray(material.tags)) return;
      
      material.tags.forEach(tag => {
        if (!tag) return;
        
        if (!tagMap.has(tag)) {
          tagMap.set(tag, new Set());
        }
        tagMap.get(tag)?.add(material.name);
      });
    });
    
    // Store all tags
    tagMap.forEach((materialNames, tag) => {
      tagIndexStore.add({
        tag,
        materialNames: Array.from(materialNames),
        count: materialNames.size
      });
    });
    
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(new Error('Failed to create tag indexes'));
    });
  } catch (error) {
    console.error('Error creating tag indexes:', error);
  }
}

/**
 * Store materials in cache with optimized indexing for performance
 */
export async function cacheMaterials(materials: ExtendedMaterialData[]): Promise<void> {
  try {
    const db = await getDb();
    const tx = db.transaction([MATERIALS_STORE, METADATA_STORE], 'readwrite');
    const materialsStore = tx.objectStore(MATERIALS_STORE);
    const metadataStore = tx.objectStore(METADATA_STORE);
    
    // Clear existing materials
    materialsStore.clear();
    
    // Add all new materials with chunking for better performance
    const chunkSize = 50;
    for (let i = 0; i < materials.length; i += chunkSize) {
      const chunk = materials.slice(i, i + chunkSize);
      chunk.forEach(material => {
        materialsStore.add(material);
      });
      
      // Allow other operations to proceed during large inserts
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    // Update metadata
    const metadata: CacheMetadata = {
      id: CACHE_KEY,
      lastUpdated: Date.now(),
      version: uuidv4(),
      count: materials.length
    };
    
    metadataStore.put(metadata);
    
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        // Create all indexes in the background after materials are stored
        Promise.all([
          createPrefixIndexes(materials),
          createCategoryIndexes(materials),
          createRegionIndexes(materials),
          createTagIndexes(materials)
        ]).catch(err => console.error('Error creating indexes:', err));
        
        resolve();
      };
      tx.onerror = (event) => {
        console.error('Transaction error:', event);
        reject(new Error('Failed to cache materials'));
      };
    });
  } catch (error) {
    console.error('Error caching materials:', error);
    // Fall back gracefully - app will still work with API calls
  }
}

/**
 * Get cached materials with optimized query pattern
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
      request.onsuccess = () => {
        // Performance optimization for frequent reads
        if (window.requestIdleCallback) {
          window.requestIdleCallback(() => {
            // Update access time without changing version
            updateCacheAccessTime();
          });
        } else {
          // Fallback for browsers without requestIdleCallback
          setTimeout(() => updateCacheAccessTime(), 1000);
        }
        
        resolve(request.result);
      };
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
 * Update cache access time without changing data
 */
async function updateCacheAccessTime(): Promise<void> {
  try {
    const db = await getDb();
    const tx = db.transaction([METADATA_STORE], 'readwrite');
    const metadataStore = tx.objectStore(METADATA_STORE);
    
    const requestGet = metadataStore.get(CACHE_KEY);
    requestGet.onsuccess = () => {
      const metadata = requestGet.result;
      if (metadata) {
        metadata.lastAccessed = Date.now();
        metadataStore.put(metadata);
      }
    };
  } catch (error) {
    // Silently fail as this is a non-critical operation
    console.debug('Failed to update cache access time:', error);
  }
}

/**
 * Clear the materials cache
 */
export async function clearMaterialsCache(): Promise<void> {
  try {
    const db = await getDb();
    const tx = db.transaction([
      MATERIALS_STORE, 
      METADATA_STORE, 
      NAME_INDEX_STORE, 
      CATEGORY_INDEX_STORE,
      REGION_INDEX_STORE,
      TAG_INDEX_STORE
    ], 'readwrite');
    
    // Clear all stores
    tx.objectStore(MATERIALS_STORE).clear();
    tx.objectStore(METADATA_STORE).delete(CACHE_KEY);
    tx.objectStore(NAME_INDEX_STORE).clear();
    tx.objectStore(CATEGORY_INDEX_STORE).clear();
    tx.objectStore(REGION_INDEX_STORE).clear();
    tx.objectStore(TAG_INDEX_STORE).clear();
    
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(new Error('Failed to clear cache'));
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

/**
 * Get cache metadata with enhanced statistics
 */
export async function getCacheMetadata(): Promise<CacheMetadata & { 
  lastAccessed?: number;
  estimatedSize?: number;
  indexedFields?: string[];
} | null> {
  try {
    const db = await getDb();
    const tx = db.transaction(METADATA_STORE, 'readonly');
    const store = tx.objectStore(METADATA_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.get(CACHE_KEY);
      request.onsuccess = () => {
        const metadata = request.result;
        if (metadata) {
          // Get additional stats for cache management
          getStoreSizes().then(sizes => {
            resolve({
              ...metadata,
              estimatedSize: sizes.totalSize,
              indexedFields: [
                'name', 'region', 'category', 'tags', 
                'factor', 'sustainabilityScore'
              ]
            });
          }).catch(() => resolve(metadata));
        } else {
          resolve(null);
        }
      };
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

/**
 * Estimate store sizes for cache management
 */
async function getStoreSizes(): Promise<{
  materialSize: number;
  indexSize: number;
  totalSize: number;
}> {
  try {
    // This is a rough estimation
    const db = await getDb();
    const materialsTx = db.transaction(MATERIALS_STORE, 'readonly');
    const materialsStore = materialsTx.objectStore(MATERIALS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = materialsStore.getAll();
      request.onsuccess = () => {
        const materials = request.result;
        // Rough size estimation
        const jsonStr = JSON.stringify(materials);
        const materialSize = jsonStr.length * 2; // Unicode characters
        
        // Assume indexes are roughly 20% of the main data size
        const indexSize = materialSize * 0.2;
        
        resolve({
          materialSize,
          indexSize,
          totalSize: materialSize + indexSize
        });
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    return { materialSize: 0, indexSize: 0, totalSize: 0 };
  }
}

/**
 * Query cached materials by name prefix - optimized for autocomplete
 */
export async function queryCachedMaterialsByPrefix(
  prefix: string,
  limit: number = 10
): Promise<ExtendedMaterialData[] | null> {
  if (!prefix || prefix.length === 0) return null;
  
  try {
    const db = await getDb();
    const nameIndexTx = db.transaction(NAME_INDEX_STORE, 'readonly');
    const nameIndexStore = nameIndexTx.objectStore(NAME_INDEX_STORE);
    
    // Get material names that match the prefix
    const prefixLower = prefix.toLowerCase();
    const nameIndex = await new Promise<{prefix: string; materialNames: string[]} | undefined>((resolve, reject) => {
      // Try to find the exact prefix
      const request = nameIndexStore.get(prefixLower);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to query prefix index'));
    });
    
    if (!nameIndex || !nameIndex.materialNames || nameIndex.materialNames.length === 0) {
      return null;
    }
    
    // Limit the number of results for performance
    const limitedNames = nameIndex.materialNames.slice(0, limit);
    
    // Get the actual materials
    const materialsTx = db.transaction(MATERIALS_STORE, 'readonly');
    const materialsStore = materialsTx.objectStore(MATERIALS_STORE);
    
    const materials: ExtendedMaterialData[] = [];
    
    for (const name of limitedNames) {
      const material = await new Promise<ExtendedMaterialData | undefined>((resolve, reject) => {
        const request = materialsStore.get(name);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error(`Failed to get material: ${name}`));
      });
      
      if (material) {
        materials.push(material);
      }
    }
    
    return materials;
  } catch (error) {
    console.error('Failed to query cached materials by prefix:', error);
    return null;
  }
}

// For event handling:
interface TransactionEvent extends Event {
  transaction?: IDBTransaction;
}

// ... then in your event handler:
const handleTransactionComplete = (event: TransactionEvent) => {
  if (event.transaction) {
    // Now TypeScript knows event.transaction exists
  }
};

// For category operations, ensure ExtendedMaterialData has category:
const processMaterialCategories = (materials: ExtendedMaterialData[]) => {
  const categoriesMap: Record<string, number> = {};
  
  materials.forEach(material => {
    const category = material.category || 'Uncategorized';
    categoriesMap[category] = (categoriesMap[category] || 0) + 1;
  });
  
  return categoriesMap;
};
