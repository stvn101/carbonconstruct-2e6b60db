
import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export const useNotificationSubscription = (onNewNotification: () => void) => {
  const { user } = useAuth();
  const channelRef = useRef<RealtimeChannel | null>(null);
  const lastNotificationTimeRef = useRef<number>(0);
  const MIN_NOTIFICATION_INTERVAL = 2000; // 2 seconds minimum between notification triggers
  
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
