
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/auth';
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNotifications } from "@/hooks/useNotifications";
import { toast } from "sonner";
import NotificationBell from "@/components/navbar/NotificationBell";
import UserMenu from "@/components/navbar/UserMenu";
import { useEffect } from "react";

const NavbarLinks = () => {
  const { user, profile, logout } = useAuth();
  const { isMobile } = useIsMobile();
  const { unreadNotifications } = useNotifications();
  const navigate = useNavigate();
  
  const isPremiumUser = profile?.subscription_tier === 'premium';
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
      toast.success("You have been logged out successfully");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Failed to log out. Please try again.");
    }
  };
  
  return (
    <div className="flex items-center space-x-1">
      {user ? (
        <div className="flex items-center gap-1">
          <NotificationBell unreadCount={unreadNotifications} />
          <UserMenu 
            profile={profile}
            isPremiumUser={isPremiumUser}
            isMobile={isMobile}
            user={user}
            onLogout={handleLogout}
          />
        </div>
      ) : (
        <Button asChild variant="default" className="bg-carbon-600 hover:bg-carbon-700 text-white" size={isMobile ? "sm" : "default"}>
          <Link to="/auth">Sign In</Link>
        </Button>
      )}
    </div>
  );
};

export default NavbarLinks;
