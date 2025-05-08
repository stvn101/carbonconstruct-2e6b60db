
/**
 * Hook for loading material data with fallbacks
 * Refactored to be more maintainable and modular
 */
import { useCallback } from 'react';
import { toast } from 'sonner';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { loadMaterialsWithFallback, shouldUpdateMaterials } from './utils/loadingStrategy';
import { createComprehensiveFallbackMaterials } from './utils/comprehensiveFallbacks';

export const useLoadMaterials = (
  setMaterials: (materials: ExtendedMaterialData[]) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: Error | null) => void,
  materials: ExtendedMaterialData[]
) => {
  // Main materials loading function - improved with better error handling and retry logic
  const loadMaterials = useCallback(async (forceRefresh = false) => {
    // Add diagnostic logging
    console.log('loadMaterials called with:', {
      forceRefresh,
      currentMaterialsCount: materials?.length || 0
    });
    
    try {
      setLoading(true);
      
      // Attempt to load materials with fallback handling
      const fetchedMaterials = await loadMaterialsWithFallback(forceRefresh, materials);
      
      // Only update if we have materials and they're more than what we already have
      if (fetchedMaterials && Array.isArray(fetchedMaterials)) {
        if (shouldUpdateMaterials(fetchedMaterials, materials)) {
          console.log('Setting materials from fetch:', fetchedMaterials.length);
          setMaterials(fetchedMaterials);
          setError(null);
        } else if (materials.length === 0) {
          // If we don't have any materials yet, use comprehensive fallback
          console.log('Using comprehensive fallback materials');
          const fallbackMaterials = createComprehensiveFallbackMaterials();
          setMaterials(fallbackMaterials);
          
          // Show a toast to let the user know we're using fallbacks
          toast.info("Using fallback material data. Try refreshing later.", {
            id: "using-fallback-materials",
            duration: 4000,
          });
        } else {
          console.log('Keeping existing materials:', materials.length);
        }
      } else if (materials.length === 0) {
        // If we don't have any materials yet, use comprehensive fallback
        console.log('No materials returned, using comprehensive fallback materials');
        const fallbackMaterials = createComprehensiveFallbackMaterials();
        setMaterials(fallbackMaterials);
      }
    } catch (err) {
      console.error('Error loading materials:', err);
      
      // Set error for UI feedback
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error(String(err)));
      }
      
      // Fallback to comprehensive materials only if we don't have any materials yet
      if (materials.length === 0) {
        console.log('Error occurred, using comprehensive fallback materials');
        const fallbackMaterials = createComprehensiveFallbackMaterials();
        setMaterials(fallbackMaterials);
      }
    } finally {
      setLoading(false);
    }
  }, [materials, setError, setLoading, setMaterials]);

  return loadMaterials;
};
