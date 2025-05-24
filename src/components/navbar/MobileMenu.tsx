
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "@/types/navigation";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: NavLink[];
  onClose: () => void;
}

const MobileMenu = ({ isOpen, navLinks, onClose }: MobileMenuProps) => {
  const location = useLocation();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-x-0 top-16 z-40 md:hidden px-4 pb-6 pt-2 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm overflow-y-auto max-h-[80vh]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          <nav className="flex flex-col space-y-1 py-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              
              return (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={cn(
                    "flex items-center px-4 py-3 text-foreground/80 hover:text-foreground transition-colors rounded-md",
                    "hover:bg-accent hover:text-foreground min-h-[44px]",
                    isActive && "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 font-medium",
                    link.premium && "premium-feature"
                  )}
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
              );
            })}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
