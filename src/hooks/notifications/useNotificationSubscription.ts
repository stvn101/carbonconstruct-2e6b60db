
import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { isOffline } from '@/utils/errorHandling';
import type { RealtimeChannel } from '@supabase/supabase-js';

export const useNotificationSubscription = (onNewNotification: () => void) => {
  const { user } = useAuth();
  const channelRef = useRef<RealtimeChannel | null>(null);
  const lastNotificationTimeRef = useRef<number>(0);
  const currentRouteRef = useRef<string | null>(null);
  const MIN_NOTIFICATION_INTERVAL = 8000; // Increased to 8 seconds to prevent flickering
  const subscriptionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Track whether this is the materials page to apply special rules
  useEffect(() => {
    // Update the current route ref
    currentRouteRef.current = window.location.pathname;
    
    return () => {
      // Clean up when component unmounts
      currentRouteRef.current = null;
    };
  }, []);
  
  // Attempt to detect if the page is constantly reloading
  const setupSubscription = useCallback(() => {
    if (!user || isOffline()) return;

    try {
      // Clear any existing subscription
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      
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
            
            // Check if we're on the materials page or sustainable building page
            const isMaterialsPage = currentRouteRef.current?.includes('material');
            const isSustainablePage = currentRouteRef.current?.includes('sustainable');
            
            // Special handling for materials and sustainable building pages - more aggressive throttling
            if (isMaterialsPage || isSustainablePage) {
              // Filter payment notifications on these pages
              if (payload.new && typeof payload.new === 'object' && 'type' in payload.new) {
                const notificationType = String(payload.new.type || '');
                if (notificationType.toLowerCase().includes('payment')) {
                  console.log('Suppressing payment notification on special page');
                  return; // Don't trigger notification callback
                }
              }
              
              // More aggressive throttling on these pages
              const now = Date.now();
              if (now - lastNotificationTimeRef.current > MIN_NOTIFICATION_INTERVAL * 2) {
                lastNotificationTimeRef.current = now;
                onNewNotification();
              }
              return;
            }
            
            // Regular throttle notification callbacks to prevent UI flicker
            const now = Date.now();
            if (now - lastNotificationTimeRef.current > MIN_NOTIFICATION_INTERVAL) {
              lastNotificationTimeRef.current = now;
              onNewNotification();
            }
          }
        )
        .subscribe((status) => {
          console.log('Notification subscription status:', status);
        });
    } catch (error) {
      console.error('Error setting up notification subscription:', error);
    }
  }, [user, onNewNotification]);
  
  useEffect(() => {
    // If we previously had a timeout, clear it
    if (subscriptionTimeoutRef.current) {
      clearTimeout(subscriptionTimeoutRef.current);
    }
    
    // Set up the subscription after a short delay to avoid tight loops
    subscriptionTimeoutRef.current = setTimeout(() => {
      setupSubscription();
    }, 1000);
    
    // Return cleanup function
    return () => {
      if (subscriptionTimeoutRef.current) {
        clearTimeout(subscriptionTimeoutRef.current);
      }
      
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user, setupSubscription]);
  
  return;
};
