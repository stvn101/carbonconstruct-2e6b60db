
import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/auth';
import { isOffline } from '@/utils/errorHandling';

export const useUnreadCount = () => {
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { user } = useAuth();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchTimeRef = useRef<number>(0);
  const isMountedRef = useRef(true);
  const fetchAttemptsRef = useRef(0);
  const MIN_FETCH_INTERVAL = 10000; // Increased to 10 seconds to prevent excessive requests
  
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
    
    // Check if offline
    if (isOffline()) {
      console.log('Offline - skipping notification count fetch');
      return;
    }
    
    // Check if we're on the materials page or sustainable building page - apply different throttling
    const isMaterialsPage = currentRouteRef.current?.includes('material');
    const isSustainablePage = currentRouteRef.current?.includes('sustainable');
    
    if (isMaterialsPage || isSustainablePage) {
      // More aggressive throttling on these pages
      if (now - lastFetchTimeRef.current < MIN_FETCH_INTERVAL * 3) {
        return;
      }
    }
    
    lastFetchTimeRef.current = now;
    fetchAttemptsRef.current++;
    
    try {
      // Add a timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Fetch timeout')), 5000);
      });
      
      const fetchPromise = supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);
        
      // Race between fetch and timeout
      const { count, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;
      
      if (error) throw error;
      
      // Only update if the component is still mounted
      if (isMountedRef.current) {
        setUnreadNotifications(count || 0);
        fetchAttemptsRef.current = 0; // Reset counter on success
      }
    } catch (error) {
      console.error('Error fetching unread notification count:', error);
      
      // If we've tried too many times, just set to 0 to avoid UI spinners
      if (fetchAttemptsRef.current > 3 && isMountedRef.current) {
        setUnreadNotifications(0);
      }
    }
  }, [user]);

  // Set up debounced fetch with reduced frequency
  useEffect(() => {
    // Initial fetch
    fetchUnreadNotificationCount();
    
    // Set up periodic refresh with larger interval
    const intervalId = setInterval(() => {
      fetchUnreadNotificationCount();
    }, MIN_FETCH_INTERVAL * 2); // Double the minimum interval for polling
    
    return () => {
      clearInterval(intervalId);
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
      
      // Use a larger debounce on materials and sustainable building pages
      const isMaterialsPage = currentRouteRef.current?.includes('material');
      const isSustainablePage = currentRouteRef.current?.includes('sustainable');
      const debounceTime = (isMaterialsPage || isSustainablePage) ? 2500 : 1500;
      
      debounceTimerRef.current = setTimeout(() => {
        fetchUnreadNotificationCount();
      }, debounceTime);
    }, [fetchUnreadNotificationCount])
  };
};
