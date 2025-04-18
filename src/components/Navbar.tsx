import NavbarLogo from "./navbar/NavbarLogo";
import { Link } from "react-router-dom";
import { useAuth } from '@/contexts/auth';
import NavbarLinks from "@/components/navbar/NavbarLinks";
import NavbarMenu from "@/components/navbar/NavbarMenu";
import { useUserNavLinks } from "@/hooks/useUserNavLinks";
import RegionSelector from "@/components/RegionSelector";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, profile } = useAuth();
  const { navLinks } = useUserNavLinks();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scrolling behavior
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav 
      className={`fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm transition-all duration-300 ${
        scrolled ? "shadow-sm border-b" : ""
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavbarLogo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavbarMenu navLinks={navLinks} />
            <RegionSelector />
            <NavbarLinks />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <RegionSelector />
            <NavbarLinks />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="ml-2"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-4 py-2 text-sm text-foreground/80 hover:text-foreground rounded-md hover:bg-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
