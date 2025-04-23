
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
    useNotificationSubscription(handleNewNotification);
  }, [handleNewNotification]);

  return { unreadNotifications, fetchUnreadNotificationCount };
};
