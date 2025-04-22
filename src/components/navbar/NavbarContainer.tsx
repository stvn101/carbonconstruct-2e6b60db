
import { motion } from "framer-motion";
import { useNavbarVisibility } from "@/hooks/use-navbar-visibility";

interface NavbarContainerProps {
  children: React.ReactNode;
  isDarkMode: boolean;
  isPremiumUser: boolean;
}

const NavbarContainer = ({ children, isDarkMode, isPremiumUser }: NavbarContainerProps) => {
  const { isVisible, scrolled } = useNavbarVisibility();
  
  return (
    <motion.nav 
      className={`py-4 border-b fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "border-border/50 bg-stone-100 dark:bg-gray-800 shadow-sm" 
          : "border-transparent bg-stone-100 dark:bg-gray-800"
      } ${
        isDarkMode ? "dark dark-navbar text-carbon-200" : ""
      } ${isPremiumUser ? 'premium-user' : ''}`}
      initial={{ y: -100 }}
      animate={{ 
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0
      }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      {children}
    </motion.nav>
  );
};

export default NavbarContainer;
