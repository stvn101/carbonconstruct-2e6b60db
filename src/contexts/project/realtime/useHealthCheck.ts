
import { useEffect } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { isOffline } from '@/utils/errorHandling';

/**
 * Hook that provides health checks for realtime subscriptions
 * with optimized reconnection strategy to prevent excessive 
 * realtime.list_changes queries
 */
export const useHealthCheck = (
  userId: string | undefined,
  channelRef: React.MutableRefObject<RealtimeChannel | null>,
  mountedRef: React.MutableRefObject<boolean>,
  reconnectTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>,
  isSubscribingRef: React.MutableRefObject<boolean>,
  subscribeToProjects: () => any
) => {
  // Set up health check monitoring
  useEffect(() => {
    if (!userId) return;
    
    // Create initial subscription
    if (mountedRef.current && !channelRef.current && !isSubscribingRef.current) {
      subscribeToProjects();
    }
    
    // Set up periodic health checks
    const healthCheckInterval = setInterval(() => {
      if (!mountedRef.current) return;
      
      // Skip health check if offline
      if (isOffline()) {
        console.log('Network offline, skipping realtime health check');
        return;
      }
      
      // Check if channel needs to be reestablished
      if (!isSubscribingRef.current && !channelRef.current) {
        console.log('No active realtime channel found, attempting to subscribe');
        subscribeToProjects();
      }
    }, 60000); // Health check every minute (reduced frequency to limit database load)
    
    return () => {
      clearInterval(healthCheckInterval);
    };
  }, [userId, mountedRef, channelRef, isSubscribingRef, subscribeToProjects]);
  
  // Add network reconnection handler
  useEffect(() => {
    if (!userId) return;
    
    const handleOnline = () => {
      console.log('Network online, checking realtime connection');
      if (mountedRef.current && !channelRef.current && !isSubscribingRef.current) {
        console.log('Reestablishing realtime connection after network reconnect');
        subscribeToProjects();
      }
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [userId, mountedRef, channelRef, isSubscribingRef, subscribeToProjects]);
};
