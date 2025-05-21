
/**
 * Materials System Initialization
 * Bootstraps the materials system and ensures data is available
 */
import { prefetchMaterials, cacheMaterials } from './cache';

let isInitialized = false;
let initPromise: Promise<void> | null = null;

/**
 * Initialize the materials system
 * This should be called early in the application lifecycle
 * @param options Initialization options
 */
export async function initializeMaterialsSystem(options: {
  forceRefresh?: boolean;
  preloadCache?: boolean;
} = {}): Promise<void> {
  
  // Only initialize once
  if (isInitialized) {
    return;
  }
  
  // Use existing initialization promise if in progress
  if (initPromise) {
    return initPromise;
  }
  
  console.log('Initializing materials system');
  
  // Create a promise for the initialization process
  initPromise = (async () => {
    try {
      if (options.preloadCache || options.forceRefresh) {
        // Prefetch materials to populate cache
        await prefetchMaterials(options.forceRefresh);
      }
      
      isInitialized = true;
      console.log('Materials system initialized successfully');
    } catch (error) {
      console.error('Failed to initialize materials system:', error);
      // Don't mark as initialized so it can be retried
    } finally {
      // Clear the promise reference
      initPromise = null;
    }
  })();
  
  return initPromise;
}

// Auto-initialize on import (in background, non-blocking)
setTimeout(() => {
  initializeMaterialsSystem({ preloadCache: true })
    .catch(err => console.warn('Background materials initialization failed:', err));
}, 1000);
