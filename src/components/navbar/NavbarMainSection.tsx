
import NavbarLogo from "@/components/navbar/NavbarLogo";
import NavbarMobileToggle from "./NavbarMobileToggle";
import NavbarLinks from "@/components/navbar/NavbarLinks";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserNavLinks } from "@/hooks/useUserNavLinks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

interface NavbarMainSectionProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  pageTitle?: string;
}

const NavbarMainSection = ({ isMenuOpen, setIsMenuOpen }: NavbarMainSectionProps) => {
  const isMobile = useIsMobile();
  const { navLinks } = useUserNavLinks();

  return (
    <div className="flex items-center justify-between h-[64px] w-full mx-auto px-6">
      {/* Logo positioned far left */}
      <div className="flex items-center">
        <div className="scale-150 origin-left">
          <NavbarLogo />
        </div>
      </div>
      
      {/* Navigation dropdown for desktop - centered */}
      <div className="hidden md:flex items-center justify-center flex-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-gray-100 dark:bg-gray-800 border-green-600 text-foreground hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl"
            >
              Navigation <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-56 bg-gray-100 dark:bg-gray-800 border-green-600 rounded-xl" 
            align="center"
          >
            {navLinks.map((link) => (
              <DropdownMenuItem key={link.path} asChild>
                <Link 
                  to={link.path}
                  className="flex items-center gap-2 px-3 py-2 text-foreground hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                >
                  {link.icon}
                  {link.title}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Sign-in positioned far right for desktop */}
      <div className="hidden md:flex items-center">
        <div className="scale-150 origin-right">
          <NavbarLinks />
        </div>
      </div>
      
      {/* Mobile layout */}
      <div className="md:hidden flex items-center space-x-3">
        <div className="scale-125">
          <NavbarLinks />
        </div>
        <NavbarMobileToggle isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </div>
    </div>
  );
};

export default NavbarMainSection;
