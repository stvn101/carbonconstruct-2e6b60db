
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
import { 
  User, 
  LogOut, 
  Calculator, 
  LayoutDashboard, 
  FileText, 
  Database,
  Bell,
  UserCircle,
  FolderPlus,
  Star,
  Settings,
  CreditCard,
  BarChart
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const NavbarLinks = () => {
  const { user, profile, logout } = useAuth();
  const isMobile = useIsMobile();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const navigate = useNavigate();
  
  // Check if premium user
  const isPremiumUser = profile?.subscription_tier === 'premium';
  
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
  
  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to auth page after successful logout
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Failed to log out. Please try again.");
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      {/* User dropdown when logged in */}
      {user ? (
        <div className="flex items-center gap-2">
          {/* Notification icon - available for all users */}
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {!isMobile && (
                    <span className="hidden lg:inline max-w-[150px] truncate">
                      {profile?.full_name || user.email}
                    </span>
                  )}
                  {isPremiumUser && <Star className="h-3 w-3 text-yellow-500" />}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-background">
              <DropdownMenuLabel className="flex justify-between items-center">
                <span>Account</span>
                {isPremiumUser && (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">
                    Premium
                  </Badge>
                )}
              </DropdownMenuLabel>
              
              {/* Common items for all users */}
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex cursor-pointer items-center">
                    <UserCircle className="mr-2 h-4 w-4" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex cursor-pointer items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/projects" className="flex cursor-pointer items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    My Projects
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              {/* Free user items */}
              <DropdownMenuGroup className={isPremiumUser ? 'hidden' : 'block'}>
                <DropdownMenuItem asChild>
                  <Link to="/pricing" className="flex cursor-pointer items-center text-yellow-600 dark:text-yellow-400">
                    <Star className="mr-2 h-4 w-4" />
                    Upgrade to Premium
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              
              {/* Common actions */}
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to="/projects/new" className="flex cursor-pointer items-center">
                    <FolderPlus className="mr-2 h-4 w-4" />
                    New Project
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/calculator" className="flex cursor-pointer items-center">
                    <Calculator className="mr-2 h-4 w-4" />
                    New Calculation
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              
              {/* Premium-only features */}
              {isPremiumUser && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link to="/materials" className="flex cursor-pointer items-center">
                        <Database className="mr-2 h-4 w-4" />
                        Material Database
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/analytics" className="flex cursor-pointer items-center">
                        <BarChart className="mr-2 h-4 w-4" />
                        Advanced Analytics
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/subscription" className="flex cursor-pointer items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Manage Subscription
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </>
              )}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="flex cursor-pointer items-center text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
