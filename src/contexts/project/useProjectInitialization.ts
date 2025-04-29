
import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { SavedProject } from '@/types/project';
import { Dispatch, SetStateAction } from 'react';
import { useConnectionRetry } from './initialization/useConnectionRetry';
import { useNetworkReconnection } from './initialization/useNetworkReconnection';
import { useCleanupEffect } from './initialization/useCleanupEffect';
import { useInitializer } from './initialization/useInitializer';
import { useInitialEffect } from './initialization/useInitialEffect';

type UseProjectInitializationProps = {
  user: User | null;
  setProjects: Dispatch<SetStateAction<SavedProject[]>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setFetchError: Dispatch<SetStateAction<Error | null>>;
  subscribeToProjects: () => any;
  initializeData: () => Promise<void>;
};

export const useProjectInitialization = ({
  user,
  setProjects,
  setIsLoading,
  setFetchError,
  subscribeToProjects,
  initializeData
}: UseProjectInitializationProps) => {
  // State for tracking project channel
  const [projectChannel, setProjectChannel] = useState<any | null>(null);

  // Setup retry handling
  const {
    connectionRetries,
    initializationAttempts,
    incrementAttempts,
    resetConnectionRetries,
    incrementRetries
  } = useConnectionRetry(user, false, () => Promise.resolve());

  // Setup initializer with all dependencies
  const {
    hasInitialized,
    setHasInitialized,
    startDataInitialization
  } = useInitializer(
    user,
    setIsLoading,
    initializeData,
    subscribeToProjects,
    connectionRetries,
    initializationAttempts,
    incrementAttempts,
    resetConnectionRetries,
    incrementRetries,
    setProjectChannel
  );

  // Setup initial effect
  useInitialEffect(
    user,
    hasInitialized,
    setProjects,
    setIsLoading,
    setHasInitialized,
    startDataInitialization
  );

  // Setup network reconnection handler
  useNetworkReconnection(
    user,
    hasInitialized,
    startDataInitialization,
    resetConnectionRetries
  );

  // Setup cleanup effect
  useCleanupEffect(projectChannel);

  return {
    hasInitialized,
    startDataInitialization,
    projectChannel
  };
};
