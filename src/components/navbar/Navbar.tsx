
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import NavbarLogo from "@/components/navbar/NavbarLogo";
import NavbarLinks from "@/components/navbar/NavbarLinks";
import NavbarMenu from "@/components/navbar/NavbarMenu";
import MobileMenu from "@/components/navbar/MobileMenu";
import NavbarContainer from "@/components/navbar/NavbarContainer";
import RegionSelector from "@/components/RegionSelector";
import { useAuth } from '@/contexts/auth';
import { useUserNavLinks } from "@/hooks/useUserNavLinks";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { profile } = useAuth();
  const { navLinks } = useUserNavLinks();
  
  // Dark mode detection
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === 'class' &&
          mutation.target === document.documentElement
        ) {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Set CSS variable for navbar height to use throughout the app
  useEffect(() => {
    document.documentElement.style.setProperty('--navbar-height', '64px');
  }, []);
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.mobile-menu-container') && !target.closest('.mobile-menu-button')) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <NavbarContainer 
      isDarkMode={isDarkMode} 
      isPremiumUser={profile?.subscription_tier === 'premium'}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-[56px]">
          <div className="flex items-center">
            <NavbarLogo />
          </div>

          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            <NavbarMenu navLinks={navLinks} />
            <div className="ml-2">
              <RegionSelector />
            </div>
            <NavbarLinks />
          </div>

          <div className="md:hidden flex items-center">
            <RegionSelector />
            <NavbarLinks />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
              className="ml-2 mobile-menu-button"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

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
