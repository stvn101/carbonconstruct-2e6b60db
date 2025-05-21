
/**
 * Main entry point for material services
 */
export * from './fetch';
export * from './cache';
export * from './materialDataProcessor';
export * from './fallback/materialFallbackProvider';

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
