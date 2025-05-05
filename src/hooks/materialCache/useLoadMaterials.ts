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
    // Add diagnostic logging
    console.log('loadMaterials called with:', {
      forceRefresh,
      currentMaterialsCount: materials?.length || 0
    });
    
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
      
      // Log what we got
      console.log('Materials fetch completed:', {
        gotMaterials: !!fetchedMaterials,
        count: fetchedMaterials?.length || 0
      });
      
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
        
        // Show a toast to let the user know we're using fallbacks
        toast.info("Using fallback material data. Try refreshing later.", {
          id: "using-fallback-materials",
          duration: 4000,
        });
      } else {
        console.log('Keeping existing materials:', materials.length);
      }
    } catch (err) {
      console.error('Error loading materials:', err);
      
      // Set error for UI feedback
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error(String(err)));
      }
      
      // Fallback to static materials only if we don't have any materials yet
      if (materials.length === 0) {
        console.log('Error occurred, using fallback materials');
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
      console.log('Creating fallback materials from MATERIAL_FACTORS');
      
      if (!MATERIAL_FACTORS || Object.keys(MATERIAL_FACTORS).length === 0) {
        console.warn('MATERIAL_FACTORS is empty or undefined, using hard-coded defaults');
        return getHardCodedFallbackMaterials();
      }
      
      return Object.entries(MATERIAL_FACTORS).map(([key, value]) => ({
        name: value.name || key,
        factor: value.factor || 0,
        unit: value.unit || 'kg',
        region: 'Australia',
        tags: ['construction'],
        sustainabilityScore: 70,
        recyclability: 'Medium' as 'High' | 'Medium' | 'Low',
        alternativeTo: undefined,
        notes: '',
        category: key.includes('concrete') ? 'Concrete' : 
                 key.includes('steel') ? 'Metals' :
                 key.includes('timber') || key.includes('wood') ? 'Wood' :
                 key.includes('glass') ? 'Glass' : 'Other'
      }));
    } catch (staticError) {
      console.error('Error creating static materials:', staticError);
      return getHardCodedFallbackMaterials();
    }
  };
  
  // Absolute minimum fallback with hard-coded materials
  const getHardCodedFallbackMaterials = () => {
    console.log('Using hard-coded fallback materials');
    return [
      {
        name: "Concrete",
        factor: 0.159,
        unit: "kg",
        region: "Australia",
        tags: ["construction"],
        sustainabilityScore: 70,
        recyclability: "Medium" as "High" | "Medium" | "Low",
        category: "Concrete"
      },
      {
        name: "Steel",
        factor: 1.77,
        unit: "kg",
        region: "Australia",
        tags: ["construction"],
        sustainabilityScore: 65,
        recyclability: "High" as "High" | "Medium" | "Low",
        category: "Metals"
      },
      {
        name: "Timber",
        factor: 0.42,
        unit: "kg",
        region: "Australia",
        tags: ["construction"],
        sustainabilityScore: 85,
        recyclability: "High" as "High" | "Medium" | "Low",
        category: "Wood"
      },
      {
        name: "Glass",
        factor: 0.85,
        unit: "kg",
        region: "Australia",
        tags: ["construction"],
        sustainabilityScore: 75,
        recyclability: "High" as "High" | "Medium" | "Low",
        category: "Glass"
      },
      {
        name: "Aluminium",
        factor: 8.24,
        unit: "kg",
        region: "Australia",
        tags: ["construction"],
        sustainabilityScore: 60,
        recyclability: "High" as "High" | "Medium" | "Low",
        category: "Metals"
      },
      {
        name: "Brick",
        factor: 0.24,
        unit: "kg",
        region: "Australia",
        tags: ["construction"],
        sustainabilityScore: 80,
        recyclability: "Medium" as "High" | "Medium" | "Low",
        category: "Ceramics"
      },
      {
        name: "Insulation",
        factor: 1.86,
        unit: "kg",
        region: "Australia",
        tags: ["construction"],
        sustainabilityScore: 75,
        recyclability: "Low" as "High" | "Medium" | "Low",
        category: "Insulation"
      },
      {
        name: "Low-Carbon Concrete",
        factor: 0.110,
        unit: "kg",
        region: "Australia",
        tags: ["sustainable", "construction"],
        sustainabilityScore: 85,
        recyclability: "Medium" as "High" | "Medium" | "Low",
        alternativeTo: "Concrete",
        category: "Concrete"
      },
      {
        name: "Recycled Steel",
        factor: 0.98,
        unit: "kg",
        region: "Australia",
        tags: ["recycled", "construction"],
        sustainabilityScore: 82,
        recyclability: "High" as "High" | "Medium" | "Low",
        alternativeTo: "Steel",
        category: "Metals"
      }
    ];
  };

  return loadMaterials;
};
