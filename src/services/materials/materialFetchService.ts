
/**
 * Service for fetching materials data with caching and fallbacks
 * Re-export from refactored module structure
 * This file maintains backward compatibility with existing imports
 */
export * from './fetch/materialFetchService';

// Start prefetching materials immediately when this module is imported
(function initializeMaterialCache() {
  setTimeout(() => {
    console.log('Starting background prefetch of materials');
    import('./fetch/materialFetchService')
      .then(({ fetchMaterials }) => fetchMaterials(false))
      .then(materials => console.log(`Background prefetch complete: ${materials.length} materials loaded`))
      .catch(err => console.warn('Background prefetch failed:', err));
  }, 1000);
})();
