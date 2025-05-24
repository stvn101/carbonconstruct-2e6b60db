
import { motion } from "framer-motion";
import { useNavbarVisibility } from "@/hooks/use-navbar-visibility";
import { useTheme } from "@/components/ThemeProvider";

interface NavbarContainerProps {
  children: React.ReactNode;
  isPremiumUser: boolean;
  isDarkMode?: boolean;
}

const NavbarContainer = ({ children, isPremiumUser, isDarkMode }: NavbarContainerProps) => {
  const { isVisible, scrolled } = useNavbarVisibility();
  const { theme } = useTheme();
  
  // Use provided isDarkMode prop if available, otherwise compute it from theme context
  const effectiveDarkMode = isDarkMode !== undefined ? 
    isDarkMode : 
    theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  return (
    <motion.nav 
      className={`py-4 border-b fixed top-0 w-full z-navbar transition-all duration-300 ${
        scrolled 
          ? "border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm" 
          : "border-transparent bg-background"
      } ${
        isPremiumUser ? 'premium-user' : ''
      }`}
      initial={{ y: -100 }}
      animate={{ 
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0
      }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <div className="w-full">
        {children}
      </div>
    </motion.nav>
  );
};

export default NavbarContainer;
