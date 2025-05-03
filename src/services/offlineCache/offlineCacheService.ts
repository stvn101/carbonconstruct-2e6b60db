
import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';

// Initialize separate stores for different data types
const projectStore = localforage.createInstance({
  name: 'CarbonConstructApp',
  storeName: 'projects'
});

const materialsStore = localforage.createInstance({
  name: 'CarbonConstructApp',
  storeName: 'materials'
});

const pendingActionsStore = localforage.createInstance({
  name: 'CarbonConstructApp',
  storeName: 'pendingActions'
});

// Type definitions for offline sync
export type SyncAction = {
  id: string;
  timestamp: number;
  type: 'create' | 'update' | 'delete';
  entity: 'project' | 'material' | 'setting';
  data: any;
  syncStatus: 'pending' | 'processing' | 'failed';
  retryCount: number;
};

// Interface for cacheable data
export interface CacheableData {
  id: string;
  [key: string]: any;
}

// Basic CRUD operations for any store
async function getItem<T>(store: LocalForage, key: string): Promise<T | null> {
  try {
    return await store.getItem<T>(key);
  } catch (error) {
    console.error(`Cache error getting item ${key}:`, error);
    return null;
  }
}

async function setItem<T>(store: LocalForage, key: string, data: T): Promise<T | null> {
  try {
    await store.setItem(key, data);
    return data;
  } catch (error) {
    console.error(`Cache error setting item ${key}:`, error);
    return null;
  }
}

async function removeItem(store: LocalForage, key: string): Promise<boolean> {
  try {
    await store.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Cache error removing item ${key}:`, error);
    return false;
  }
}

// Get all items from a store
async function getAllItems<T>(store: LocalForage): Promise<T[]> {
  const items: T[] = [];
  try {
    await store.iterate<T, void>((value) => {
      items.push(value);
    });
    return items;
  } catch (error) {
    console.error('Cache error getting all items:', error);
    return [];
  }
}

// Project specific functions
export const projectCache = {
  async getProject<T>(id: string): Promise<T | null> {
    return getItem<T>(projectStore, id);
  },
  
  async saveProject<T extends CacheableData>(project: T): Promise<T | null> {
    return setItem<T>(projectStore, project.id, project);
  },
  
  async removeProject(id: string): Promise<boolean> {
    return removeItem(projectStore, id);
  },
  
  async getAllProjects<T>(): Promise<T[]> {
    return getAllItems<T>(projectStore);
  }
};

// Materials specific functions
export const materialsCache = {
  async getMaterial<T>(id: string): Promise<T | null> {
    return getItem<T>(materialsStore, id);
  },
  
  async saveMaterial<T extends CacheableData>(material: T): Promise<T | null> {
    return setItem<T>(materialsStore, material.id, material);
  },
  
  async removeMaterial(id: string): Promise<boolean> {
    return removeItem(materialsStore, id);
  },
  
  async getAllMaterials<T>(): Promise<T[]> {
    return getAllItems<T>(materialsStore);
  }
};

// Sync queue management
export const syncQueue = {
  async addPendingAction(action: Omit<SyncAction, 'id' | 'timestamp' | 'syncStatus' | 'retryCount'>): Promise<SyncAction> {
    const syncAction: SyncAction = {
      ...action,
      id: uuidv4(),
      timestamp: Date.now(),
      syncStatus: 'pending',
      retryCount: 0
    };
    
    await setItem(pendingActionsStore, syncAction.id, syncAction);
    return syncAction;
  },
  
  async getPendingActions(): Promise<SyncAction[]> {
    return getAllItems<SyncAction>(pendingActionsStore);
  },
  
  async markActionAsProcessing(id: string): Promise<void> {
    const action = await getItem<SyncAction>(pendingActionsStore, id);
    if (action) {
      await setItem(pendingActionsStore, id, {
        ...action,
        syncStatus: 'processing'
      });
    }
  },
  
  async markActionAsFailed(id: string): Promise<void> {
    const action = await getItem<SyncAction>(pendingActionsStore, id);
    if (action) {
      await setItem(pendingActionsStore, id, {
        ...action,
        syncStatus: 'failed',
        retryCount: action.retryCount + 1
      });
    }
  },
  
  async removeAction(id: string): Promise<void> {
    await removeItem(pendingActionsStore, id);
  }
};

// Sync service to handle synchronization with backend
export const syncService = {
  async synchronize(): Promise<{success: boolean, syncedCount: number, failedCount: number}> {
    if (!navigator.onLine) {
      return { success: false, syncedCount: 0, failedCount: 0 };
    }
    
    const pendingActions = await syncQueue.getPendingActions();
    let syncedCount = 0;
    let failedCount = 0;
    
    for (const action of pendingActions) {
      try {
        await syncQueue.markActionAsProcessing(action.id);
        
        // Here we would call the appropriate API based on action type
        // For example:
        // if (action.type === 'create' && action.entity === 'project') {
        //   await projectService.createProject(action.data);
        // }
        
        // For demonstration purposes, we'll just simulate API call
        console.log(`Syncing action: ${action.type} ${action.entity}`, action.data);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
        
        await syncQueue.removeAction(action.id);
        syncedCount++;
      } catch (error) {
        console.error('Sync error:', error);
        await syncQueue.markActionAsFailed(action.id);
        failedCount++;
      }
    }
    
    return {
      success: failedCount === 0,
      syncedCount,
      failedCount
    };
  },
  
  async scheduleSync(immediate = false): Promise<void> {
    if (immediate) {
      await this.synchronize();
    } else {
      // Schedule sync for later - like when online status changes
      setTimeout(() => this.synchronize(), 1000);
    }
  }
};

// Initialize offline caching system
export async function initOfflineCache(): Promise<void> {
  try {
    // Set up online/offline event listeners
    window.addEventListener('online', () => {
      console.log('Back online, syncing data...');
      syncService.scheduleSync(true);
    });
    
    // Clear expired cache entries
    // This could be expanded to implement TTL for cache entries
  } catch (error) {
    console.error('Error initializing offline cache:', error);
  }
}
