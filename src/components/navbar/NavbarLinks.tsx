import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNotifications } from "@/hooks/useNotifications";
import { 
  User, 
  LogOut, 
  Calculator, 
  Bell,
  UserCircle,
  FolderPlus,
  Star
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import UserMenu from "@/components/navbar/UserMenu";

const NavbarLinks = () => {
  const { user, profile, logout } = useAuth();
  const isMobile = useIsMobile();
  const { unreadNotifications } = useNotifications();
  const navigate = useNavigate();
  
  const isPremiumUser = profile?.subscription_tier === 'premium';
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Failed to log out. Please try again.");
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      {user ? (
        <div className="flex items-center gap-2">
          {/* Notification icon */}
          <Link to="/notifications" className="relative">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 bg-red-500 text-white"
                >
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </Badge>
              )}
            </Button>
          </Link>
          
          {/* User menu dropdown */}
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
