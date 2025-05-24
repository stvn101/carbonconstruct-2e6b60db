
import { NavLink as RouterNavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { NavLink } from "@/types/navigation";
import { cn } from "@/lib/utils";

interface NavbarMenuProps {
  navLinks: NavLink[];
  isMobile?: boolean;
}

const NavbarMenu = ({ navLinks, isMobile }: NavbarMenuProps) => {
  // On mobile, we'll use a different navigation component
  if (isMobile) return null;

  return (
    <nav className="hidden md:flex items-center space-x-1" aria-label="Main navigation">
      {navLinks.map((link) => (
        <motion.div
          key={link.path}
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className={`${link.premium ? 'premium-feature' : ''}`}
        >
          <RouterNavLink 
            to={link.path} 
            className={({ isActive }) => cn(
              "text-foreground/80 hover:text-foreground transition-colors relative px-4 py-3 mx-1 text-sm font-medium",
              "after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:w-0 after:bg-green-600 after:transition-all hover:after:w-[calc(100%-16px)]",
              "dark:text-carbon-50 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-background rounded-md",
              isActive && "text-foreground font-medium after:w-[calc(100%-16px)] after:bg-green-600"
            )}
          >
            {link.title}
          </RouterNavLink>
        </motion.div>
      ))}
    </nav>
  );
};

export default NavbarMenu;
