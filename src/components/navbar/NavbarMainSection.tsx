
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
    <div className="flex items-center justify-between h-[56px] max-w-[1400px] mx-auto w-full px-4">
      {/* Logo on the left */}
      <div className="flex items-center">
        <NavbarLogo />
      </div>
      
      {/* Navigation and sign-in for desktop */}
      <div className="hidden md:flex items-center justify-end space-x-6 flex-1">
        <div className="flex-grow text-right mr-6">
          <NavbarDesktopItems navLinks={navLinks} />
        </div>
        <NavbarLinks />
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
