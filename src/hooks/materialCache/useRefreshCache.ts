
/**
 * Hook for refreshing material cache
 */
import { useCallback, useState } from 'react';
import { clearMaterialsCache, fetchMaterials } from '@/services/materialService';
import { toast } from 'sonner';

export const useRefreshCache = (
  setMaterials: (materials: any[]) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: Error | null) => void
) => {
  const [refreshAttempts, setRefreshAttempts] = useState(0);
  const [refreshTimeout, setRefreshTimeout] = useState<NodeJS.Timeout | null>(null);
  const MAX_REFRESH_ATTEMPTS = 3;
  
  // Refresh cache handler with better timeout handling
  const refreshCache = useCallback(async () => {
    if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
      toast.error("Too many refresh attempts. Please try again later.");
      return;
    }
    
    // Clear any existing timeout
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }
    
    try {
      setLoading(true);
      toast.info("Refreshing material data...");
      
      setRefreshAttempts(prev => prev + 1);
      
      // Set a safety timeout to prevent infinite loading state
      const timeout = setTimeout(() => {
        setLoading(false);
        toast.error("Material refresh timed out. Please try again.");
      }, 30000); // 30 second timeout
      
      setRefreshTimeout(timeout);
      
      await clearMaterialsCache();
      const fetchedMaterials = await fetchMaterials(true);
      
      // Clear the timeout since we got a response
      clearTimeout(timeout);
      setRefreshTimeout(null);
      
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
      // Ensure loading is set to false
      setLoading(false);
      
      // Clear any timeout that might still be active
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
        setRefreshTimeout(null);
      }
    }
  }, [refreshAttempts, setError, setLoading, setMaterials, refreshTimeout]);

  return refreshCache;
};
