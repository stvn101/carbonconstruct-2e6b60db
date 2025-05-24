
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
    <div className="flex items-center justify-between h-[64px] w-full mx-auto px-6">
      {/* Logo on the left - made 50% larger */}
      <div className="flex items-center">
        <div className="scale-150 origin-left">
          <NavbarLogo />
        </div>
      </div>
      
      {/* Navigation and sign-in for desktop with proper alignment */}
      <div className="hidden md:flex items-center space-x-6 flex-1 justify-end">
        <div className="flex items-center">
          <NavbarDesktopItems navLinks={navLinks} />
        </div>
        <div className="scale-150 origin-right">
          <NavbarLinks />
        </div>
      </div>
      
      {/* Navigation and toggle for mobile */}
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
