
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useNotifications = () => {
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchUnreadNotificationCount = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if supabase is available
      if (!supabase || !supabase.auth) {
        console.warn('Supabase client not fully initialized');
        setUnreadNotifications(0);
        setIsLoading(false);
        return;
      }
      
      // Only make the API call if we have an active session
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.warn('Error getting session:', sessionError.message);
        setUnreadNotifications(0);
        setIsLoading(false);
        return;
      }
      
      if (!data?.session) {
        // No active session
        setUnreadNotifications(0);
        setIsLoading(false);
        return;
      }

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', data.session.user.id)
        .eq('read', false);

      if (error) {
        console.error('Error fetching unread notifications:', error);
        setError(error.message);
        return;
      }

      setUnreadNotifications(count || 0);
    } catch (err) {
      console.error('Failed to fetch unread notifications:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setUnreadNotifications(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Setup notification subscription
  useEffect(() => {
    // Initial fetch
    fetchUnreadNotificationCount();

    // Set up real-time subscription if supabase is available
    if (!supabase || !supabase.channel) {
      console.warn('Supabase realtime not available');
      return;
    }
    
    try {
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
    } catch (err) {
      console.error('Error setting up notification subscription:', err);
    }
  }, [fetchUnreadNotificationCount]);

  return { 
    unreadNotifications, 
    isLoading, 
    error, 
    fetchUnreadNotificationCount 
  };
};
