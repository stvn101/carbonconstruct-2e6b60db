
import { Dispatch, SetStateAction, useCallback } from 'react';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { fetchMaterialsFromApi } from '@/services/materials/api/materialApiClient';
import { adaptSupabaseMaterialsToExtended } from './utils/typeAdapters';

export const useRefreshCache = (
  setMaterials: Dispatch<SetStateAction<ExtendedMaterialData[]>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setError: Dispatch<SetStateAction<Error | null>>
) => {
  // Refresh cache function that forcibly updates the materials
  const refreshCache = useCallback(async (): Promise<void> => {
    setLoading(true);
    
    try {
      console.log('Forcing refresh of materials cache');
      
      // Clear localStorage cache to force a fresh fetch
      localStorage.removeItem('materialsCache');
      localStorage.removeItem('materialsCacheTimestamp');
      
      // Fetch fresh data with force refresh flag
      const materials = await fetchMaterialsFromApi({ 
        forceRefresh: true,
        timeout: 30000 // Increased timeout for a full refresh
      });
      
      if (materials && Array.isArray(materials) && materials.length > 0) {
        // Convert SupabaseMaterial[] to ExtendedMaterialData[] 
        const adaptedMaterials = adaptSupabaseMaterialsToExtended(materials);
        setMaterials(adaptedMaterials);
        
        // Update localStorage with fresh data
        try {
          localStorage.setItem('materialsCache', JSON.stringify(adaptedMaterials));
          localStorage.setItem('materialsCacheTimestamp', new Date().toISOString());
        } catch (storageError) {
          console.warn('Failed to save refreshed materials to localStorage:', storageError);
        }
        
        setError(null);
      } else {
        throw new Error('No materials returned during refresh');
      }
    } catch (err) {
      console.error('Error refreshing materials cache:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, [setMaterials, setLoading, setError]);

  return refreshCache;
};
