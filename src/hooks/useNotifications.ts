import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/auth';
import { toast } from "sonner";

export const useNotifications = () => {
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUnreadNotificationCount();
      
      // Set up real-time subscription for notifications
      const channel = supabase
        .channel('public:notifications')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, () => {
          // Increment the unread count
          setUnreadNotifications(prev => prev + 1);
          toast.info("You have a new notification");
        })
        .on('postgres_changes', { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, () => {
          // Refetch the unread count on any update
          fetchUnreadNotificationCount();
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setUnreadNotifications(0);
    }
  }, [user]);
  
  const fetchUnreadNotificationCount = async () => {
    if (!user) return;
    
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);
        
      if (error) throw error;
      
      setUnreadNotifications(count || 0);
    } catch (error) {
      console.error('Error fetching unread notification count:', error);
    }
  };

  return { unreadNotifications, fetchUnreadNotificationCount };
};
