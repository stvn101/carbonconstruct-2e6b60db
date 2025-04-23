
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useNotifications = () => {
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  
  const fetchUnreadNotificationCount = useCallback(async () => {
    try {
      // Only make the API call if we have an active session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setUnreadNotifications(0);
        return;
      }

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', session.user.id)
        .eq('read', false);

      if (error) {
        console.error('Error fetching unread notifications:', error);
        return;
      }

      setUnreadNotifications(count || 0);
    } catch (err) {
      console.error('Failed to fetch unread notifications:', err);
      setUnreadNotifications(0);
    }
  }, []);

  // Setup notification subscription
  useEffect(() => {
    // Initial fetch
    fetchUnreadNotificationCount();

    // Set up real-time subscription
    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'notifications' 
        }, 
        () => {
          fetchUnreadNotificationCount();
        })
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUnreadNotificationCount]);

  return { unreadNotifications, fetchUnreadNotificationCount };
};
