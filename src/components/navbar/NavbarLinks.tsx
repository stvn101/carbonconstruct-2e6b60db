
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/auth';
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { toast } from "sonner";
import NotificationBell from "@/components/navbar/NotificationBell";
import UserMenu from "@/components/navbar/UserMenu";
import ErrorBoundaryWrapper from "@/components/error/ErrorBoundaryWrapper";
import ErrorTrackingService from "@/services/errorTrackingService";

const NavbarLinks = () => {
  const { user, profile, logout } = useAuth();
  const { isMobile } = useIsMobile();
  const { unreadNotifications, error: notificationError } = useNotifications();
  const navigate = useNavigate();
  
  // Log notification errors to error tracking service
  React.useEffect(() => {
    if (notificationError) {
      ErrorTrackingService.captureMessage(`Notification error: ${notificationError}`, {
        component: 'NavbarLinks',
        userId: user?.id
      });
    }
  }, [notificationError, user?.id]);
  
  const isPremiumUser = profile?.subscription_tier === 'premium';
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
      toast.success("You have been logged out successfully");
    } catch (error) {
      console.error('Logout error:', error);
      ErrorTrackingService.captureException(
        error instanceof Error ? error : new Error('Logout failed'),
        { component: 'NavbarLinks', action: 'logout' }
      );
      toast.error("Failed to log out. Please try again.");
    }
  };
  
  return (
    <div className="flex items-center space-x-1">
      <ErrorBoundaryWrapper feature="Navigation Links">
        {user ? (
          <div className="flex items-center gap-1">
            <ErrorBoundaryWrapper feature="Notification Bell">
              <NotificationBell unreadCount={unreadNotifications || 0} />
            </ErrorBoundaryWrapper>
            
            <ErrorBoundaryWrapper feature="User Menu">
              <UserMenu 
                profile={profile}
                isPremiumUser={!!isPremiumUser}
                isMobile={!!isMobile}
                user={user}
                onLogout={handleLogout}
              />
            </ErrorBoundaryWrapper>
          </div>
        ) : (
          <Button asChild variant="default" className="bg-carbon-600 hover:bg-carbon-700 text-white" size={isMobile ? "sm" : "default"}>
            <Link to="/auth">Sign In</Link>
          </Button>
        )}
      </ErrorBoundaryWrapper>
    </div>
  );
};

export default NavbarLinks;
