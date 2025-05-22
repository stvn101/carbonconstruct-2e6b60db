
import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { Home, Calculator, Database, Book, MessageSquare, Settings } from 'lucide-react';

const MobileNavigation: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={22} /> },
    { path: '/calculator', label: 'Calculator', icon: <Calculator size={22} /> },
    { path: '/materials', label: 'Materials', icon: <Database size={22} /> },
    { path: '/resources', label: 'Resources', icon: <Book size={22} /> },
    { path: '/grok-ai', label: 'Grok AI', icon: <MessageSquare size={22} /> },
  ];

  if (location.pathname === '/theme-test') return null;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border sm:hidden z-navbar bottom-navigation">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center px-3 py-2 min-h-[56px] w-full justify-center ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <div className="mb-1">{item.icon}</div>
            <span className="text-xs">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNavigation;
