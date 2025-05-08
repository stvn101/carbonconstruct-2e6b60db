/**
 * Material loading strategies with fallbacks and error handling
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { fetchMaterials } from '@/services/materialService';
import { toast } from 'sonner';
import { createComprehensiveFallbackMaterials } from './comprehensiveFallbacks';

/**
 * Attempts to load materials with timeout and fallback handling
 */
export const loadMaterialsWithFallback = async (
  forceRefresh: boolean,
  currentMaterials: ExtendedMaterialData[]
): Promise<ExtendedMaterialData[]> => {
  console.log('Loading materials with forceRefresh:', forceRefresh);
  
  // Set up a loading timeout for user feedback
  const loadingTimeout = setTimeout(() => {
    // If still loading after timeout, show a toast but continue the fetch
    toast.info("Materials are taking longer than expected to load. You can continue using the app while we finish loading.", {
      id: "materials-loading-timeout",
      duration: 5000,
    });
  }, 3000);
  
  try {
    // Try to load materials from the service
    const fetchPromise = fetchMaterials(forceRefresh);
    
    // Add a timeout for the fetch operation
    const timeoutPromise = new Promise<ExtendedMaterialData[]>((resolve) => {
      setTimeout(() => {
        console.log('Materials fetch timed out, using fallback');
        // If we already have materials, keep them
        if (currentMaterials.length > 0) {
          resolve(currentMaterials);
        } else {
          // Otherwise, use comprehensive fallback materials
          resolve(createComprehensiveFallbackMaterials());
        }
      }, 15000); // 15 second timeout
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
    
    return fetchedMaterials;
  } catch (error) {
    // Clear the loading timeout in case of error
    clearTimeout(loadingTimeout);
    console.error('Error in loadMaterialsWithFallback:', error);
    throw error; // Let the caller handle the error
  }
};

/**
 * Determines if materials should be updated based on comparison
 */
export const shouldUpdateMaterials = (
  fetchedMaterials: ExtendedMaterialData[] | null | undefined,
  currentMaterials: ExtendedMaterialData[]
): boolean => {
  if (!fetchedMaterials || !Array.isArray(fetchedMaterials)) {
    return false;
  }
  
  return fetchedMaterials.length > 0 && 
         (currentMaterials.length === 0 || fetchedMaterials.length > currentMaterials.length);
};
