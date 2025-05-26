import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { Home, Calculator, Database, Brain, Book, BarChart2 } from 'lucide-react';
import { useDevice } from '@/hooks/use-device';
import { useUserNavLinks } from '@/hooks/useUserNavLinks';

const MobileNavigation: React.FC = () => {
  const location = useLocation();
  const { isIOS } = useDevice();
  const { navLinks } = useUserNavLinks();
  
  // Don't show mobile navigation on theme test page
  if (location.pathname === '/theme-test') return null;
  
  // Use navLinks from the hook to ensure consistency
  const mobileNavItems = navLinks.slice(0, 5).map(link => ({
    path: link.path,
    label: link.title,
    icon: link.icon,
    premium: link.premium
  }));
  
  return (
    <nav 
      className={`
        fixed bottom-0 left-0 right-0 
        bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
        border-t border-border 
        sm:hidden z-50 
        transition-transform
        ${isIOS ? 'pb-[env(safe-area-inset-bottom)]' : ''}
      `}
      aria-label="Mobile navigation"
    >
      <div className="flex justify-around items-center px-2 py-1">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center px-2 py-2 min-h-[56px] w-full justify-center
              transition-colors duration-200
              ${isActive 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-muted-foreground hover:text-foreground'
              }
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset rounded-md
              touch-manipulation`
            }
            aria-label={item.label}
          >
            <div className="mb-1 transform transition-transform duration-200 scale-110">
              {item.icon}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavigation;
