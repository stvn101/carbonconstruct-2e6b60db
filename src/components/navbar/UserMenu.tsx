
import { Link } from "react-router-dom";
import { User } from "@supabase/supabase-js";
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
import { Badge } from "@/components/ui/badge";
import { 
  User as UserIcon, 
  LogOut, 
  Calculator, 
  LayoutDashboard, 
  FileText, 
  Database,
  UserCircle,
  FolderPlus,
  Star,
  Settings,
  CreditCard,
  BarChart
} from "lucide-react";
import { UserProfile } from "@/types/auth";

interface UserMenuProps {
  user: User;
  profile: UserProfile | null;
  isPremiumUser: boolean;
  isMobile: boolean;
  onLogout: () => Promise<void>;
}

const UserMenu = ({ user, profile, isPremiumUser, isMobile, onLogout }: UserMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2">
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
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
          onClick={onLogout}
          className="flex cursor-pointer items-center text-red-600 focus:text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
