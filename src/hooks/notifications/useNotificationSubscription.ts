
import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export const useNotificationSubscription = (onNewNotification: () => void) => {
  const { user } = useAuth();
  const channelRef = useRef<RealtimeChannel | null>(null);
  
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
          onNewNotification();
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
