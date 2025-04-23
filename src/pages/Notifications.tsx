
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { NotificationCard } from "@/components/notifications/NotificationCard";
import { EmptyNotifications } from "@/components/notifications/EmptyNotifications";
import { NotificationsHeader } from "@/components/notifications/NotificationsHeader";
import { formatDate, getNotificationColor } from "@/utils/notificationUtils";
import type { Notification } from "@/types/notifications";

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      const channel = supabase
        .channel('notifications-page')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          setNotifications(current => [payload.new as Notification, ...current]);
          toast.info(`New notification: ${(payload.new as Notification).title}`);
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('id, title, message, type, read, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setNotifications(data as Notification[]);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };
  
  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user?.id)
        .eq('id', id);
        
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error("Failed to update notification");
    }
  };
  
  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user?.id)
        .eq('id', id);
        
      if (error) throw error;
      
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      toast.success("Notification deleted");
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error("Failed to delete notification");
    }
  };
  
  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user?.id)
        .eq('read', false);
        
      if (error) throw error;
      
      setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error("Failed to update notifications");
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col bg-carbon-50 dark:bg-carbon-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Helmet>
        <title>Notifications | CarbonConstruct</title>
        <meta 
          name="description" 
          content="View and manage your notifications."
        />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto max-w-3xl">
          <NotificationsHeader 
            hasUnreadNotifications={notifications.some(n => !n.read)}
            onMarkAllAsRead={markAllAsRead}
          />
          
          {isLoading ? (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-carbon-600"></div>
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  formatDate={formatDate}
                  getNotificationColor={getNotificationColor}
                />
              ))}
            </div>
          ) : (
            <EmptyNotifications />
          )}
        </div>
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default Notifications;
