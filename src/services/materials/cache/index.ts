
/**
 * Material Cache Service - Public API
 */

// Re-export types and interfaces
export * from './cacheConstants';

// Re-export API functions
export {
  cacheMaterials,
  getCachedMaterials,
  clearMaterialsCache,
  getCacheMetadata
} from './materialCacheAPI';

// Export core functionality for internal use
export { default as materialCacheService } from './materialCacheCore';

/**
 * Prefetches materials and stores them in the cache
 * @param forceRefresh If true, bypasses existing cache and refreshes from source
 */
export async function prefetchMaterials(forceRefresh = false): Promise<boolean> {
  try {
    // Skip if we're already refreshing
    if (window._materialRefreshInProgress) {
      console.log('Material prefetch already in progress, skipping');
      return false;
    }
    
    window._materialRefreshInProgress = true;
    
    console.log(`Prefetching materials (force=${forceRefresh})`);
    
    try {
      // Check if we need to refresh
      if (!forceRefresh) {
        const { getCacheMetadata } = await import('./materialCacheAPI');
        const metadata = await getCacheMetadata();
        
        if (
          metadata.lastUpdated && 
          metadata.itemCount && 
          metadata.itemCount > 0 && 
          Date.now() - metadata.lastUpdated.getTime() < 3600000 // 1 hour
        ) {
          console.log('Using cached materials (cache is fresh)');
          return true;
        }
      }
      
      // Import fetch service dynamically to avoid circular dependencies
      const { fetchMaterials } = await import('../fetch/materialFetchService');
      
      // Fetch fresh materials
      await fetchMaterials(true);
      
      console.log('Material prefetch successful');
      return true;
    } catch (error) {
      console.error('Error prefetching materials:', error);
      return false;
    } finally {
      window._materialRefreshInProgress = false;
    }
  } catch (error) {
    console.error('Unexpected error in prefetchMaterials:', error);
    return false;
  }
}

// Add to window type
declare global {
  interface Window {
    _materialRefreshInProgress?: boolean;
  }
}
