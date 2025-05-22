
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
    <div className="flex items-center justify-between h-[56px]">
      <div className="flex items-center">
        <NavbarLogo />
        {/* Added spacing between logo and nav items */}
        <div className="hidden md:flex items-center ml-6 lg:ml-10 space-x-1 lg:space-x-4">
          <NavbarDesktopItems navLinks={navLinks} />
        </div>
      </div>
      <div className="md:hidden flex items-center">
        <NavbarLinks />
        <NavbarMobileToggle isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </div>
      {/* Show NavbarLinks on desktop in the right section */}
      <div className="hidden md:flex items-center">
        <NavbarLinks />
      </div>
    </div>
  );
};

export default NavbarMainSection;
