
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/auth';
import { toast } from "sonner";

export const useNotificationSubscription = (onNewNotification: () => void) => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const channel = supabase
        .channel('notifications-subscription')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, () => {
          onNewNotification();
          toast.info("You have a new notification");
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, onNewNotification]);
};

