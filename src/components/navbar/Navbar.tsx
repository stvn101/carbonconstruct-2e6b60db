
// Refactored for clarity and separation of concerns
import { useState } from "react";
import NavbarMainSection from "./NavbarMainSection";
import NavbarContainer from "@/components/navbar/NavbarContainer";
import MobileMenu from "@/components/navbar/MobileMenu";
import { useAuth } from '@/contexts/auth';
import { useUserNavLinks } from "@/hooks/useUserNavLinks";

// Newly extracted hooks for clarity
import { useIsDarkMode } from "@/hooks/navbar/useIsDarkMode";
import { useMobileMenu } from "@/hooks/navbar/useMobileMenu";
import { useNavbarHeight } from "@/hooks/navbar/useNavbarHeight";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { profile } = useAuth();
  const { navLinks } = useUserNavLinks();
  const isDarkMode = useIsDarkMode();

  useNavbarHeight("64px");
  useMobileMenu(isMenuOpen, setIsMenuOpen);

  return (
    <NavbarContainer
      isDarkMode={isDarkMode}
      isPremiumUser={profile?.subscription_tier === 'premium'}
    >
      <div className="container mx-auto px-4 md:px-6">
        <NavbarMainSection isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <div className="mobile-menu-container">
          <MobileMenu
            isOpen={isMenuOpen}
            navLinks={navLinks}
            onClose={() => setIsMenuOpen(false)}
          />
        </div>
      </div>
    </NavbarContainer>
  );
};

export default Navbar;
