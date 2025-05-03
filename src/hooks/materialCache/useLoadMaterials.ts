/**
 * Hook for loading material data with fallbacks
 */
import { useCallback } from 'react';
import { fetchMaterials } from '@/services/materialService';
import { MATERIAL_FACTORS } from '@/lib/materials';
import { toast } from 'sonner';

export const useLoadMaterials = (
  setMaterials: (materials: any[]) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: Error | null) => void,
  materials: any[]
) => {
  
  // Main materials loading function - simplified with better error handling
  const loadMaterials = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      
      // Set up a loading timeout
      const loadingTimeout = setTimeout(() => {
        // If still loading after timeout, show a toast but continue the fetch
        toast.info("Materials are taking longer than expected to load. You can continue using the app while we finish loading.", {
          id: "materials-loading-timeout",
          duration: 5000,
        });
      }, 3000);
      
      // Try to load materials from the service
      console.log('Loading materials with forceRefresh:', forceRefresh);
      const fetchPromise = fetchMaterials(forceRefresh);
      
      // Add a timeout for the fetch operation
      const timeoutPromise = new Promise<any[]>((resolve) => {
        setTimeout(() => {
          console.log('Materials fetch timed out, using fallback');
          // If we already have materials, keep them
          if (materials.length > 0) {
            resolve(materials);
          } else {
            // Otherwise, use basic fallback materials
            resolve(createFallbackMaterials());
          }
        }, 10000); // 10 second timeout
      });
      
      // Race between the fetch and the timeout
      const fetchedMaterials = await Promise.race([fetchPromise, timeoutPromise]);
      
      // Clear the loading timeout
      clearTimeout(loadingTimeout);
      
      // Only update if we have materials (otherwise keep what we have)
      if (fetchedMaterials && Array.isArray(fetchedMaterials) && fetchedMaterials.length > 0) {
        console.log('Setting materials from fetch:', fetchedMaterials.length);
        setMaterials(fetchedMaterials);
        setError(null);
      } else if (materials.length === 0) {
        // If we don't have any materials yet, use static fallback
        console.log('Using static fallback materials');
        const fallbackMaterials = createFallbackMaterials();
        setMaterials(fallbackMaterials);
      }
    } catch (err) {
      console.error('Error loading materials:', err);
      
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error(String(err)));
      }
      
      // Fallback to static materials only if we don't have any materials yet
      if (materials.length === 0) {
        const fallbackMaterials = createFallbackMaterials();
        setMaterials(fallbackMaterials);
      }
    } finally {
      setLoading(false);
    }
  }, [materials, setError, setLoading, setMaterials]);

  // Helper function to create fallback materials
  const createFallbackMaterials = () => {
    try {
      return Object.entries(MATERIAL_FACTORS).map(([key, value]) => ({
        name: value.name || key,
        factor: value.factor || 0,
        unit: value.unit || 'kg',
        region: 'Australia',
        tags: ['construction'],
        sustainabilityScore: 70,
        recyclability: 'Medium' as 'High' | 'Medium' | 'Low',
        alternativeTo: undefined,
        notes: ''
      }));
    } catch (staticError) {
      console.error('Error creating static materials:', staticError);
      // Absolute minimum fallback
      return [
        {
          name: "Concrete",
          factor: 0.159,
          unit: "kg",
          region: "Australia",
          tags: ["construction"],
          sustainabilityScore: 70,
          recyclability: "Medium" as "High" | "Medium" | "Low"
        },
        {
          name: "Steel",
          factor: 1.77,
          unit: "kg",
          region: "Australia",
          tags: ["construction"],
          sustainabilityScore: 65,
          recyclability: "High" as "High" | "Medium" | "Low"
        }
      ];
    }
  };

  return loadMaterials;
};
