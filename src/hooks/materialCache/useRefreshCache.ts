
/**
 * Hook for refreshing material cache
 */
import { useCallback, useState } from 'react';
import { clearMaterialsCache, fetchMaterials } from '@/services/materialService';
import { toast } from 'sonner';

// Add debounce utility to prevent multiple refresh attempts
const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function(this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export const useRefreshCache = (
  setMaterials: (materials: any[]) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: Error | null) => void
) => {
  const [refreshAttempts, setRefreshAttempts] = useState(0);
  const MAX_REFRESH_ATTEMPTS = 3;
  
  // Refresh cache handler - fixed debounced function to properly return Promise<void>
  const refreshCache = useCallback(async () => {
    if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
      toast.error("Too many refresh attempts. Please try again later.");
      return;
    }
    
    try {
      setLoading(true);
      toast.info("Refreshing material data...");
      
      setRefreshAttempts(prev => prev + 1);
      await clearMaterialsCache();
      const fetchedMaterials = await fetchMaterials(true);
      
      // Ensure we have valid materials before setting them
      if (Array.isArray(fetchedMaterials) && fetchedMaterials.length > 0) {
        setMaterials(fetchedMaterials);
        setError(null);
        toast.success("Material data refreshed successfully!");
      } else {
        throw new Error("Received invalid material data");
      }
    } catch (err) {
      console.error('Failed to refresh cache:', err);
      toast.error("Failed to refresh material data. Using cached data.");
      
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error(String(err)));
      }
    } finally {
      setLoading(false);
    }
  }, [refreshAttempts, setError, setLoading, setMaterials]);

  // Return the non-debounced version to fix the TypeScript error
  return refreshCache;
};
