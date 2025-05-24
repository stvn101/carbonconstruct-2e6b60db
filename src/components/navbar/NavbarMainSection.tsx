
import NavbarLogo from "@/components/navbar/NavbarLogo";
import NavbarDesktopItems from "./NavbarDesktopItems";
import NavbarMobileToggle from "./NavbarMobileToggle";
import NavbarLinks from "@/components/navbar/NavbarLinks";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserNavLinks } from "@/hooks/useUserNavLinks";

interface NavbarMainSectionProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  pageTitle?: string;
}

const NavbarMainSection = ({ isMenuOpen, setIsMenuOpen, pageTitle = "CarbonConstruct" }: NavbarMainSectionProps) => {
  const isMobile = useIsMobile();
  const { navLinks } = useUserNavLinks();

  return (
    <div className="flex items-center justify-between h-[56px] w-full mx-auto px-6">
      {/* Logo on the left with consistent margin */}
      <div className="flex items-center">
        <NavbarLogo />
        
        {/* Page title - visible on desktop */}
        <h1 className="ml-4 hidden md:block text-lg font-medium text-foreground">
          {pageTitle}
        </h1>
      </div>
      
      {/* Navigation and sign-in for desktop with proper alignment */}
      <div className="hidden md:flex items-center space-x-2 flex-1 justify-end">
        <div className="flex items-center">
          <NavbarDesktopItems navLinks={navLinks} />
        </div>
        <div className="pl-6">
          <NavbarLinks />
        </div>
      </div>
      
      {/* Navigation and toggle for mobile */}
      <div className="md:hidden flex items-center">
        {/* Mobile page title */}
        <h1 className="text-base font-medium text-foreground mr-4">
          {pageTitle}
        </h1>
        <NavbarLinks />
        <NavbarMobileToggle isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </div>
    </div>
  );
};

export default NavbarMainSection;
