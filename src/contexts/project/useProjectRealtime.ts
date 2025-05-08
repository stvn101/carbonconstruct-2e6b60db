
import { useCallback, useRef, useEffect } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { SavedProject } from '@/types/project';
import { Dispatch, SetStateAction } from 'react';
import { isOffline } from '@/utils/errorHandling';
import ErrorTrackingService from '@/services/error/errorTrackingService';
import { createProjectChannel, removeChannel } from './realtime/channelUtils';
import { createSubscriptionHandler } from './realtime/subscriptionHandler';
import { useHealthCheck } from './realtime/useHealthCheck';

/**
 * Hook to manage realtime project updates with optimized performance
 * to address issues with realtime.list_changes
 */
export const useProjectRealtime = (
  userId: string | undefined, 
  setProjects: Dispatch<SetStateAction<SavedProject[]>>
) => {
  const retryCount = useRef(0);
  const maxRetries = 3;
  const channelRef = useRef<RealtimeChannel | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSubscribingRef = useRef(false);
  const mountedRef = useRef(true);
  
  // Clean up on unmount
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      removeChannel(channelRef.current);
      channelRef.current = null;
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, []);
  
  // Main subscription function
  const subscribeToProjects = useCallback(() => {
    // Don't subscribe if no user or already subscribing
    if (!userId || isSubscribingRef.current) return null;
    
    // Don't subscribe if offline
    if (isOffline()) {
      console.log('Offline detected, skipping realtime subscription');
      return null;
    }
    
    // Don't retry too many times
    if (retryCount.current >= maxRetries) {
      console.warn(`Not attempting realtime subscription after ${maxRetries} failed attempts`);
      return null;
    }

    isSubscribingRef.current = true;
    
    try {
      // Clean up any existing channel
      removeChannel(channelRef.current);
      channelRef.current = null;
      
      // Create subscription status handler
      const handleSubscriptionStatus = createSubscriptionHandler(
        retryCount,
        maxRetries,
        mountedRef,
        isSubscribingRef,
        reconnectTimeoutRef,
        subscribeToProjects
      );
      
      // Create a new channel
      const projectChannel = createProjectChannel(
        userId,
        setProjects,
        handleSubscriptionStatus
      );
      
      channelRef.current = projectChannel;
      isSubscribingRef.current = false;
      return projectChannel;
    } catch (error) {
      console.error('Error setting up realtime subscription:', error);
      ErrorTrackingService.captureException(
        error instanceof Error ? error : new Error(String(error)),
        { component: 'useProjectRealtime', action: 'subscribe' }
      );
      retryCount.current += 1;
      isSubscribingRef.current = false;
      return null;
    }
  }, [userId, setProjects, maxRetries]);

  // Set up health check
  useHealthCheck(
    userId,
    channelRef,
    mountedRef,
    reconnectTimeoutRef,
    isSubscribingRef,
    subscribeToProjects
  );

  return { subscribeToProjects };
};
