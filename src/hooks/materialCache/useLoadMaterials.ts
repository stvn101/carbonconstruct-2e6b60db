/**
 * Hook for loading material data with fallbacks
 */
import { useCallback } from 'react';
import { fetchMaterials } from '@/services/materialService';
import { MATERIAL_FACTORS } from '@/lib/materials';

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
      
      // Try to load materials from the service
      console.log('Loading materials with forceRefresh:', forceRefresh);
      const fetchedMaterials = await fetchMaterials(forceRefresh);
      
      // Only update if we have materials (otherwise keep what we have)
      if (fetchedMaterials && Array.isArray(fetchedMaterials) && fetchedMaterials.length > 0) {
        console.log('Setting materials from fetch:', fetchedMaterials.length);
        setMaterials(fetchedMaterials);
        setError(null);
      } else if (materials.length === 0) {
        // If we don't have any materials yet, use static fallback
        console.log('Using static fallback materials');
        
        try {
          // Enhanced error handling for material factors
          if (!MATERIAL_FACTORS || typeof MATERIAL_FACTORS !== 'object') {
            throw new Error('MATERIAL_FACTORS not properly defined');
          }
          
          const staticMaterials = Object.entries(MATERIAL_FACTORS).map(([key, value]) => ({
            name: value.name || key,
            factor: value.factor || 0,
            unit: value.unit || 'kg',
            region: 'Australia', // Default region
            tags: ['construction'], // Default tags
            sustainabilityScore: 70,
            recyclability: 'Medium' as 'High' | 'Medium' | 'Low', // Example data
            alternativeTo: undefined,
            notes: ''
          }));
          
          if (staticMaterials.length > 0) {
            setMaterials(staticMaterials);
          } else {
            throw new Error('No static materials available');
          }
        } catch (staticError) {
          console.error('Error creating static materials:', staticError);
          // Create a minimum set of materials to prevent empty state
          setMaterials([
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
          ]);
          setError(new Error('Failed to load materials data'));
        }
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
        console.log('Using static fallback materials due to error');
        try {
          const staticMaterials = Object.entries(MATERIAL_FACTORS).map(([key, value]) => ({
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
          
          if (staticMaterials.length > 0) {
            setMaterials(staticMaterials);
          }
        } catch (staticError) {
          console.error('Error creating static materials:', staticError);
          // Create a minimum set of materials to prevent empty state
          setMaterials([
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
          ]);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [materials.length, setError, setLoading, setMaterials]);

  return loadMaterials;
};
