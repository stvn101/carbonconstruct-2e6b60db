
import { useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { SavedProject } from '@/types/project';
import { Dispatch, SetStateAction } from 'react';

/**
 * Hook to handle the initial effect and clean up
 */
export const useInitialEffect = (
  user: User | null,
  hasInitialized: boolean,
  setProjects: Dispatch<SetStateAction<SavedProject[]>>,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setHasInitialized: (initialized: boolean) => void,
  startDataInitialization: () => void
) => {
  // Effect for initial load and handling user changes
  useEffect(() => {
    let isMounted = true;
    
    const startInitialization = () => {
      if (isMounted && user && !hasInitialized) {
        startDataInitialization();
      } else if (isMounted && !user) {
        // Reset state when user logs out
        setProjects([]);
        setIsLoading(false);
        setHasInitialized(false);
      }
    };
    
    // Delay initial load slightly to allow auth to settle
    const initTimer = setTimeout(startInitialization, 1000);

    return () => {
      isMounted = false;
      clearTimeout(initTimer);
    };
  }, [user, hasInitialized, setProjects, setIsLoading, setHasInitialized, startDataInitialization]);
};
