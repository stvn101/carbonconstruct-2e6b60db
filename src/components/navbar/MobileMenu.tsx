
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
          className="fixed inset-x-0 top-16 z-40 md:hidden px-4 pb-6 pt-2 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`px-4 py-3 text-foreground/80 hover:text-foreground transition-colors hover:bg-accent rounded-md ${link.premium ? 'premium-feature' : ''}`}
                onClick={() => {
                  onClose();
                }}
                role="menuitem"
              >
                <span className="flex items-center">
                  {link.icon && <span className="mr-3">{link.icon}</span>}
                  {link.title}
                  {link.premium && (
                    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Premium
                    </span>
                  )}
                </span>
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
