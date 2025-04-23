
import { useCallback, useEffect } from 'react';
import { useUnreadCount } from './useUnreadCount';
import { useNotificationSubscription } from './useNotificationSubscription';

export const useNotifications = () => {
  const { unreadNotifications, fetchUnreadNotificationCount } = useUnreadCount();
  
  // Use memoized callback to prevent re-renders
  const handleNewNotification = useCallback(() => {
    fetchUnreadNotificationCount();
  }, [fetchUnreadNotificationCount]);

  // Set up notification subscription once
  useEffect(() => {
    const unsubscribe = useNotificationSubscription(handleNewNotification);
    
    // Clean up subscription when component unmounts
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [handleNewNotification]);

  return { unreadNotifications, fetchUnreadNotificationCount };
};
