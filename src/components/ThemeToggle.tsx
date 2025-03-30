
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme based on system preference or stored value
  useEffect(() => {
    // Check if the user has a theme preference stored
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (storedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      // Use system preference as default
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      // Switch to light mode
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      toast.success('Light mode activated');
    } else {
      // Switch to dark mode
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      toast.success('Dark mode activated');
    }
    
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="p-2 bg-background/80 backdrop-blur-sm border border-border rounded-full shadow-md flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full transition-transform hover:scale-110"
        onClick={toggleTheme}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? (
          <Sun className="h-5 w-5 text-yellow-400" />
        ) : (
          <Moon className="h-5 w-5 text-carbon-600" />
        )}
      </Button>
    </div>
  );
};

export default ThemeToggle;
