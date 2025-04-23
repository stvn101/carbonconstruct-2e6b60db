
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export const useNotificationSubscription = (onNewNotification: () => void) => {
  const { user } = useAuth();
  
  if (!user) return () => {}; // Return no-op if not authenticated
  
  // Set up subscription
  const channel = supabase
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
  
  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
};
