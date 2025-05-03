
import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ErrorTrackingService from '@/services/errorTrackingService';

export const useNotifications = () => {
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const MAX_RETRIES = 3;
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchTimeRef = useRef<number>(0);
  const MIN_FETCH_INTERVAL = 2000; // minimum 2 seconds between fetches
  
  const fetchUnreadNotificationCount = useCallback(async () => {
    const now = Date.now();
    
    // Prevent rapid refetching by enforcing a minimum interval
    if (now - lastFetchTimeRef.current < MIN_FETCH_INTERVAL) {
      return;
    }
    
    lastFetchTimeRef.current = now;
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if supabase is available
      if (!supabase) {
        console.warn('Supabase client not initialized');
        setUnreadNotifications(0);
        setIsLoading(false);
        return;
      }

      if (!supabase.auth) {
        console.warn('Supabase auth not available');
        setUnreadNotifications(0);
        setIsLoading(false);
        return;
      }
      
      // Only make the API call if we have an active session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.warn('Error getting session:', sessionError.message);
        setUnreadNotifications(0);
        setIsLoading(false);
        return;
      }
      
      if (!sessionData?.session) {
        // No active session
        setUnreadNotifications(0);
        setIsLoading(false);
        return;
      }

      const userId = sessionData.session.user?.id;
      if (!userId) {
        setUnreadNotifications(0);
        setIsLoading(false);
        return;
      }

      const { count, error: countError } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('read', false);

      if (countError) {
        // Don't throw, just log and set the error state
        console.error('Error fetching unread notifications:', countError);
        setError(countError.message);
        setUnreadNotifications(0);
      } else {
        setUnreadNotifications(count || 0);
        // Reset retry count on success
        if (retryCount > 0) setRetryCount(0); 
      }
    } catch (err) {
      console.error('Failed to fetch unread notifications:', err);
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      ErrorTrackingService.captureException(
        err instanceof Error ? err : new Error(String(err)), 
        { component: 'useNotifications' }
      );
      setUnreadNotifications(0);
    } finally {
      setIsLoading(false);
    }
  }, [retryCount]);

  // Debounced fetch function
  const debouncedFetch = useCallback(() => {
    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      fetchUnreadNotificationCount();
    }, 500); // 500ms debounce
  }, [fetchUnreadNotificationCount]);

  // Handle retry logic
  useEffect(() => {
    if (error && retryCount < MAX_RETRIES) {
      const timer = setTimeout(() => {
        console.log(`Retrying notification fetch (${retryCount + 1}/${MAX_RETRIES})...`);
        setRetryCount(prev => prev + 1);
        fetchUnreadNotificationCount();
      }, Math.pow(2, retryCount) * 1000); // Exponential backoff
      
      return () => clearTimeout(timer);
    }
  }, [error, retryCount, fetchUnreadNotificationCount, MAX_RETRIES]);

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
            // Use debounced fetch to prevent rapid updates
            debouncedFetch();
          })
        .subscribe();

      // Cleanup subscription on unmount
      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
        subscription.unsubscribe();
      };
    } catch (err) {
      console.error('Error setting up notification subscription:', err);
      ErrorTrackingService.captureException(
        err instanceof Error ? err : new Error(String(err)), 
        { component: 'useNotifications subscription' }
      );
    }
  }, [fetchUnreadNotificationCount, debouncedFetch]);

  return { 
    unreadNotifications, 
    isLoading, 
    error, 
    fetchUnreadNotificationCount,
    retryCount
  };
};
