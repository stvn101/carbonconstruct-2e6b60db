
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { User, LogOut, Calculator, LayoutDashboard, FileText, Database } from "lucide-react";

const NavbarLinks = () => {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center space-x-2">
      {/* Main nav links - shown on larger screens */}
      <div className="hidden md:flex items-center space-x-2">
        <NavLink to="/" label="Home" />
        <NavLink to="/calculator" label="Calculator" />
        <NavLink to="/pricing" label="Pricing" />
        <NavLink to="/about" label="About" />
        <NavLink to="/contact" label="Contact" />
        
        {/* User dropdown when logged in */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden lg:inline">{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
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
              <DropdownMenuItem asChild>
                <Link to="/materials" className="flex cursor-pointer items-center">
                  <Database className="mr-2 h-4 w-4" />
                  Material Database
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/calculator" className="flex cursor-pointer items-center">
                  <Calculator className="mr-2 h-4 w-4" />
                  New Calculation
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={logout}
                className="flex cursor-pointer items-center text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild variant="default" className="bg-carbon-600 hover:bg-carbon-700 text-white">
            <Link to="/auth">Sign In</Link>
          </Button>
        )}
      </div>
      
      {/* Mobile menu - shows just the account icon */}
      <div className="md:hidden">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
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
              <DropdownMenuItem asChild>
                <Link to="/materials" className="flex cursor-pointer items-center">
                  <Database className="mr-2 h-4 w-4" />
                  Material Database
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/calculator" className="flex cursor-pointer items-center">
                  <Calculator className="mr-2 h-4 w-4" />
                  New Calculation
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={logout}
                className="flex cursor-pointer items-center text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild size="sm" className="bg-carbon-600 hover:bg-carbon-700 text-white">
            <Link to="/auth">Sign In</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
}

const NavLink = ({ to, label }: NavLinkProps) => (
  <Link
    to={to}
    className="text-sm font-medium transition-colors hover:text-carbon-600 py-1 px-2 rounded hover:bg-carbon-50"
  >
    {label}
  </Link>
);

export default NavbarLinks;
