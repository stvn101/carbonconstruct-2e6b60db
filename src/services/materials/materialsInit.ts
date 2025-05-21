
/**
 * Materials System Initialization
 * Manages the initialization and startup of the material data system
 */
import { prefetchMaterials } from './cache/materialCacheService';
import { withNetworkErrorHandling } from '@/utils/errorHandling';

// Initialization state
let initialized = false;

/**
 * Initialize the materials system
 */
export async function initializeMaterialsSystem(): Promise<boolean> {
  if (initialized) {
    console.log('Materials system already initialized');
    return true;
  }
  
  try {
    console.log('Initializing materials system...');
    
    // Start prefetching materials with network error handling
    await withNetworkErrorHandling(
      prefetchMaterials(),
      30000, // 30 second timeout
      2 // Max 2 retries
    );
    
    initialized = true;
    console.log('Materials system successfully initialized');
    return true;
  } catch (error) {
    console.error('Failed to initialize materials system:', error);
    return false;
  }
}

// Auto-initialize when imported (non-blocking)
setTimeout(() => {
  initializeMaterialsSystem().catch(err => {
    console.warn('Background materials initialization failed:', err);
    // Non-critical failure, app can still function with fallbacks
  });
}, 1500);
