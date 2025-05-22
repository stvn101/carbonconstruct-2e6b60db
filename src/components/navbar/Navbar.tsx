
// Refactored for clarity and separation of concerns
import { useState, useEffect } from "react";
import NavbarMainSection from "./NavbarMainSection";
import NavbarContainer from "@/components/navbar/NavbarContainer";
import MobileMenu from "@/components/navbar/MobileMenu";
import { useAuth } from '@/contexts/auth';
import { useUserNavLinks } from "@/hooks/useUserNavLinks";
import ErrorBoundary from "@/components/ErrorBoundary";

// Newly extracted hooks for clarity
import { useIsDarkMode } from "@/hooks/navbar/useIsDarkMode";
import { useMobileMenu } from "@/hooks/navbar/useMobileMenu";
import { useNavbarHeight } from "@/hooks/navbar/useNavbarHeight";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { profile } = useAuth();
  const { navLinks } = useUserNavLinks();
  const isDarkMode = useIsDarkMode();
  const [navbarInitialized, setNavbarInitialized] = useState(false);

  useNavbarHeight("64px");
  useMobileMenu(isMenuOpen, setIsMenuOpen);
  
  // Initialize navbar after a brief delay to avoid hydration issues
  useEffect(() => {
    const timer = setTimeout(() => {
      setNavbarInitialized(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  if (!navbarInitialized) {
    // Return minimal navbar during initialization to avoid hydration mismatches
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/90 border-b border-border h-16">
        <div className="container mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-carbon-600 to-carbon-400"></div>
        </div>
      </nav>
    );
  }

  return (
    <ErrorBoundary feature="Navigation">
      <NavbarContainer
        isPremiumUser={profile?.subscription_tier === 'premium'}
        isDarkMode={isDarkMode}
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
    </ErrorBoundary>
  );
};

export default Navbar;
