
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NavbarLinks from "@/components/NavbarLinks";
import RegionSelector from "@/components/RegionSelector";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const { profile } = useAuth();
  const isPremiumUser = profile?.subscription_tier === 'premium';
  
  // Handle scrolling behavior and visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar at the top of the page
      if (currentScrollY < 10) {
        setIsVisible(true);
        setScrolled(false);
      } 
      // Hide when scrolling down, show when scrolling up
      else {
        if (currentScrollY > lastScrollY) {
          setIsVisible(false); // Scrolling down
        } else {
          setIsVisible(true); // Scrolling up
        }
        setScrolled(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Handle mouse movement to show navbar when near top
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY < 60) {
        setIsVisible(true);
      }
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

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

  // Different nav links for free vs premium users
  const freeUserNavLinks = [
    { title: "Home", path: "/" },
    { title: "Calculator", path: "/calculator" },
    { title: "Projects", path: "/projects" },
    { title: "Pricing", path: "/pricing" },
    { title: "About", path: "/about" },
    { title: "Contact", path: "/contact" },
  ];
  
  const premiumUserNavLinks = [
    { title: "Home", path: "/" },
    { title: "Dashboard", path: "/dashboard" },
    { title: "Calculator", path: "/calculator" },
    { title: "Projects", path: "/projects" },
    { title: "Material DB", path: "/materials", premium: true },
    { title: "Analytics", path: "/analytics", premium: true },
    { title: "About", path: "/about" },
  ];
  
  const navLinks = isPremiumUser ? premiumUserNavLinks : freeUserNavLinks;

  return (
    <motion.nav 
      className={`py-4 border-b backdrop-blur-sm fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "border-border/50 bg-background/95 shadow-sm" 
          : "border-transparent bg-background/80"
      } ${
        isDarkMode ? "dark" : ""
      } ${isPremiumUser ? 'premium-user' : ''}`}
      initial={{ y: -100 }}
      animate={{ 
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0
      }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      style={{ height: "var(--navbar-height, 64px)" }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <motion.div 
                className="h-8 w-8 rounded-full bg-gradient-to-tr from-carbon-600 to-carbon-400 mr-2 flex items-center justify-center"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="h-3 w-3 bg-white rounded-full"></div>
              </motion.div>
              <span className="text-xl font-semibold">CarbonConstruct</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navLinks.map((link) => (
              <motion.div
                key={link.path}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={link.premium ? 'premium-feature' : ''}
              >
                <Link 
                  to={link.path} 
                  className="text-foreground/80 hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:w-0 after:bg-carbon-500 after:transition-all hover:after:w-full px-2 py-1 text-sm"
                >
                  {link.title}
                </Link>
              </motion.div>
            ))}
            
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
              className="ml-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden pt-4 pb-2 absolute bg-background/95 backdrop-blur-sm left-0 right-0 border-b border-border/50 shadow-sm top-[64px]"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-1 px-4 py-2">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className={`px-4 py-3 text-foreground/80 hover:text-foreground transition-colors hover:bg-carbon-50 dark:hover:bg-carbon-800 rounded-md ${link.premium ? 'premium-feature' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.title}
                    {link.premium && (
                      <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Premium
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
