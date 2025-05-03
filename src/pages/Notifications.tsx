
import { useState, useEffect, useCallback } from "react";
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
import { isOffline } from "@/utils/errorHandling";
import type { Notification } from "@/types/notifications";
import PageLoading from "@/components/ui/page-loading";

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<Error | null>(null);
  const [fetchAttempts, setFetchAttempts] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setFetchError(null);
    
    try {
      // Check if offline first
      if (isOffline()) {
        throw new Error("You're offline. Please check your internet connection.");
      }
      
      // Add a timeout to prevent infinite loading
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Request timed out")), 10000);
      });
      
      const fetchPromise = supabase
        .from('notifications')
        .select('id, title, message, type, read, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      // Race between fetch and timeout
      const { data, error } = await Promise.race([
        fetchPromise,
        timeoutPromise
      ]) as any;
      
      if (error) throw error;
      
      setNotifications(data as Notification[]);
      setFetchAttempts(0); // Reset attempts on success
      
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setFetchError(error instanceof Error ? error : new Error("Failed to load notifications"));
      
      // Only show toast error after multiple attempts
      if (fetchAttempts > 1) {
        toast.error("Failed to load notifications. Please try again later.");
      }
      
      // If offline, show different message
      if (isOffline()) {
        toast.error("You're offline. Please check your connection.");
      }
      
      setFetchAttempts(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  }, [user, fetchAttempts]);
  
  useEffect(() => {
    fetchNotifications();
    
    // Only set up realtime if online
    if (user && !isOffline()) {
      const channel = supabase
        .channel('notifications-page')
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          // Check if it's a payment notification and we're not on materials page
          const newNotification = payload.new as Notification;
          if (newNotification) {
            setNotifications(current => [newNotification, ...current]);
            
            // Throttle toast notifications
            const notificationType = String(newNotification.type || '').toLowerCase();
            if (!notificationType.includes('payment')) {
              toast.info(`New notification: ${newNotification.title}`);
            }
          }
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, fetchNotifications]);

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
  
  const handleRetry = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

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
      
      <main className="flex-grow py-12 px-4 pt-24">
        <div className="container mx-auto max-w-3xl">
          <NotificationsHeader 
            hasUnreadNotifications={notifications.some(n => !n.read)}
            onMarkAllAsRead={markAllAsRead}
          />
          
          {isLoading ? (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-carbon-600"></div>
            </div>
          ) : fetchError ? (
            <div className="my-8 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 text-center">
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
                {fetchError.message || "Failed to load notifications"}
              </h3>
              <p className="text-red-600 dark:text-red-400 mb-4">
                Please check your connection and try again.
              </p>
              <button 
                onClick={handleRetry}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
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
