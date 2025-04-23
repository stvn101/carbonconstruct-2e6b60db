
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/auth';

export const useUnreadCount = () => {
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { user } = useAuth();

  const fetchUnreadNotificationCount = useCallback(async () => {
    if (!user) {
      setUnreadNotifications(0);
      return;
    }
    
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

  return { unreadNotifications, fetchUnreadNotificationCount };
};

