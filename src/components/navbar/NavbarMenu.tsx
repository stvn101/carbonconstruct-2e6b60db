
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { NavLink } from "@/types/navigation";

interface NavbarMenuProps {
  navLinks: NavLink[];
  isMobile?: boolean;
}

const NavbarMenu = ({ navLinks, isMobile }: NavbarMenuProps) => {
  return (
    <>
      {navLinks.map((link) => (
        <motion.div
          key={link.path}
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className={link.premium ? 'premium-feature' : ''}
        >
          <Link 
            to={link.path} 
            className="text-foreground/80 hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:w-0 after:bg-carbon-500 after:transition-all hover:after:w-full px-2 py-1 text-sm dark:text-carbon-50 dark:hover:text-white"
          >
            {link.title}
          </Link>
        </motion.div>
      ))}
    </>
  );
};

export default NavbarMenu;
