
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "@/types/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: NavLink[];
  onClose: () => void;
}

const MobileMenu = ({ isOpen, navLinks, onClose }: MobileMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
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
                onClick={onClose}
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
  );
};

export default MobileMenu;
