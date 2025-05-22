
import NavbarLogo from "@/components/navbar/NavbarLogo";
import NavbarDesktopItems from "./NavbarDesktopItems";
import NavbarMobileToggle from "./NavbarMobileToggle";
import NavbarLinks from "@/components/navbar/NavbarLinks";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserNavLinks } from "@/hooks/useUserNavLinks";

interface NavbarMainSectionProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const NavbarMainSection = ({ isMenuOpen, setIsMenuOpen }: NavbarMainSectionProps) => {
  const isMobile = useIsMobile();
  const { navLinks } = useUserNavLinks();

  return (
    <div className="flex items-center justify-between h-[56px] max-w-[1400px] mx-auto w-full px-6">
      {/* Logo on the left with consistent margin */}
      <div className="flex items-center">
        <NavbarLogo />
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
        <NavbarLinks />
        <NavbarMobileToggle isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </div>
    </div>
  );
};

export default NavbarMainSection;
