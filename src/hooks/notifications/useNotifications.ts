
import { useCallback } from 'react';
import { useUnreadCount } from './useUnreadCount';
import { useNotificationSubscription } from './useNotificationSubscription';

export const useNotifications = () => {
  const { unreadNotifications, fetchUnreadNotificationCount } = useUnreadCount();
  
  const handleNewNotification = useCallback(() => {
    fetchUnreadNotificationCount();
  }, [fetchUnreadNotificationCount]);

  useNotificationSubscription(handleNewNotification);

  return { unreadNotifications, fetchUnreadNotificationCount };
};

