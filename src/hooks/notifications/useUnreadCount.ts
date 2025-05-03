
import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/auth';

export const useUnreadCount = () => {
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { user } = useAuth();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchTimeRef = useRef<number>(0);
  const MIN_FETCH_INTERVAL = 2000; // minimum 2 seconds between fetches

  const fetchUnreadNotificationCount = useCallback(async () => {
    if (!user) {
      setUnreadNotifications(0);
      return;
    }
    
    const now = Date.now();
    
    // Prevent frequent refetching
    if (now - lastFetchTimeRef.current < MIN_FETCH_INTERVAL) {
      return;
    }
    
    lastFetchTimeRef.current = now;
    
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);
        
      if (error) throw error;
      
      setUnreadNotifications(count || 0);
    } catch (error) {
      console.error('Error fetching unread notification count:', error);
    }
  }, [user]);

  // Set up debounced fetch
  useEffect(() => {
    fetchUnreadNotificationCount();
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [fetchUnreadNotificationCount]);

  return { 
    unreadNotifications, 
    fetchUnreadNotificationCount: useCallback(() => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = setTimeout(() => {
        fetchUnreadNotificationCount();
      }, 500);
    }, [fetchUnreadNotificationCount])
  };
};
