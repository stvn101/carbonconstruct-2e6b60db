
import { useEffect } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { pingSupabaseConnection, checkSupabaseConnectionWithRetry } from '@/services/supabase/connection';

/**
 * Hook to periodically check connection health and reconnect if needed
 */
export const useHealthCheck = (
  userId: string | undefined,
  channelRef: React.MutableRefObject<RealtimeChannel | null>,
  mountedRef: React.MutableRefObject<boolean>,
  reconnectTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>,
  isSubscribingRef: React.MutableRefObject<boolean>,
  subscribeToProjects: () => RealtimeChannel | null
) => {
  useEffect(() => {
    if (!userId || !mountedRef.current) return;
    
    const healthCheckInterval = setInterval(async () => {
      // Skip health check if we're already trying to subscribe or if unmounted
      if (isSubscribingRef.current || !mountedRef.current) return;
      
      try {
        const isConnected = await pingSupabaseConnection();
        
        // If we detected a disconnection, try to reconnect
        if (!isConnected && channelRef.current && mountedRef.current) {
          console.log('Health check failed, attempting to reconnect realtime subscription');
          
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          
          reconnectTimeoutRef.current = setTimeout(() => {
            if (!mountedRef.current) return;
            
            try {
              if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
              }
              channelRef.current = null;
              
              if (mountedRef.current) {
                const newChannel = subscribeToProjects();
                if (newChannel) {
                  console.log("Re-established realtime subscription after health check");
                }
              }
            } catch (err) {
              console.error("Error during channel reconnection:", err);
            }
          }, 2000);
        }
      } catch (err) {
        console.warn("Error during health check:", err);
      }
    }, 30000); // Check every 30 seconds
    
    return () => {
      clearInterval(healthCheckInterval);
    };
  }, [userId, channelRef, mountedRef, reconnectTimeoutRef, isSubscribingRef, subscribeToProjects]);
};
