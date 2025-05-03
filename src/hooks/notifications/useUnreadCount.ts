
import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/auth';

export const useUnreadCount = () => {
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { user } = useAuth();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchTimeRef = useRef<number>(0);
  const isMountedRef = useRef(true);
  const MIN_FETCH_INTERVAL = 5000; // Increase to 5 seconds to prevent flickering
  
  // Route-based handling
  const currentRouteRef = useRef<string | null>(null);
  
  useEffect(() => {
    // Update the current route ref
    currentRouteRef.current = window.location.pathname;
    
    // Set up cleanup for component unmounting
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      currentRouteRef.current = null;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const fetchUnreadNotificationCount = useCallback(async () => {
    if (!user || !isMountedRef.current) {
      return;
    }
    
    const now = Date.now();
    
    // Prevent frequent refetching
    if (now - lastFetchTimeRef.current < MIN_FETCH_INTERVAL) {
      return;
    }
    
    // Check if we're on the materials page - apply different throttling
    const isMaterialsPage = currentRouteRef.current?.includes('material');
    if (isMaterialsPage) {
      // More aggressive throttling on materials page
      if (now - lastFetchTimeRef.current < MIN_FETCH_INTERVAL * 2) {
        return;
      }
    }
    
    lastFetchTimeRef.current = now;
    
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);
        
      if (error) throw error;
      
      // Only update if the component is still mounted
      if (isMountedRef.current) {
        setUnreadNotifications(count || 0);
      }
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
      
      // Use a larger debounce on materials page
      const isMaterialsPage = currentRouteRef.current?.includes('material');
      const debounceTime = isMaterialsPage ? 1500 : 1000;
      
      debounceTimerRef.current = setTimeout(() => {
        fetchUnreadNotificationCount();
      }, debounceTime);
    }, [fetchUnreadNotificationCount])
  };
};
