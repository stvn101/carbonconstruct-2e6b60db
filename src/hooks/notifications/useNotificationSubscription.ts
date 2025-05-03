
import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export const useNotificationSubscription = (onNewNotification: () => void) => {
  const { user } = useAuth();
  const channelRef = useRef<RealtimeChannel | null>(null);
  const lastNotificationTimeRef = useRef<number>(0);
  const currentRouteRef = useRef<string | null>(null);
  const MIN_NOTIFICATION_INTERVAL = 5000; // Increase to 5 seconds to prevent flickering
  
  // Track whether this is the materials page to apply special rules
  useEffect(() => {
    // Update the current route ref
    currentRouteRef.current = window.location.pathname;
    
    return () => {
      // Clean up when component unmounts
      currentRouteRef.current = null;
    };
  }, []);
  
  useEffect(() => {
    if (!user) return;
    
    // Set up subscription
    channelRef.current = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New notification received:', payload);
          
          // Check if we're on the materials page
          const isMaterialsPage = currentRouteRef.current?.includes('material');
          
          // Special handling for materials page - more aggressive throttling
          if (isMaterialsPage) {
            // Filter payment notifications on materials page
            if (payload.new && typeof payload.new === 'object' && 'type' in payload.new) {
              const notificationType = String(payload.new.type || '');
              if (notificationType.toLowerCase().includes('payment')) {
                console.log('Suppressing payment notification on materials page');
                return; // Don't trigger notification callback
              }
            }
          }
          
          // Throttle notification callbacks to prevent UI flicker
          const now = Date.now();
          if (now - lastNotificationTimeRef.current > MIN_NOTIFICATION_INTERVAL) {
            lastNotificationTimeRef.current = now;
            onNewNotification();
          }
        }
      )
      .subscribe();
    
    // Return cleanup function
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user, onNewNotification]);
  
  return;
};
