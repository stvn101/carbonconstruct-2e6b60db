
import { NavLink as RouterNavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { NavLink } from "@/types/navigation";
import { cn } from "@/lib/utils";

interface NavbarMenuProps {
  navLinks: NavLink[];
  isMobile?: boolean;
}

const NavbarMenu = ({ navLinks, isMobile }: NavbarMenuProps) => {
  return (
    <nav className="flex items-center">
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
              "text-foreground/80 hover:text-foreground transition-colors relative px-3 py-1 mx-2 text-sm",
              "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:w-0 after:bg-green-600 after:transition-all hover:after:w-full",
              "dark:text-carbon-50 dark:hover:text-white",
              isActive && "text-foreground font-medium after:w-full after:bg-green-600"
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
