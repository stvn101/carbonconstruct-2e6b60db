
import NavbarLogo from "@/components/navbar/NavbarLogo";
import NavbarDesktopItems from "./NavbarDesktopItems";
import NavbarMobileToggle from "./NavbarMobileToggle";
import RegionSelector from "@/components/RegionSelector";
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
    <div className="flex items-center justify-between h-[56px]">
      <div className="flex items-center">
        <NavbarLogo />
      </div>
      <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
        <NavbarDesktopItems navLinks={navLinks} />
      </div>
      <div className="md:hidden flex items-center">
        <RegionSelector />
        <NavbarLinks />
        <NavbarMobileToggle isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </div>
    </div>
  );
};

export default NavbarMainSection;
