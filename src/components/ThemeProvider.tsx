
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light"; // The actual theme after resolving "system"
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  resolvedTheme: "light",
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "carbon-construct-ui-theme",
  ...props
}: ThemeProviderProps) {
  // Get initial theme with error handling
  const getInitialTheme = (): Theme => {
    try {
      const storedTheme = localStorage.getItem(storageKey);
      if (storedTheme && ["dark", "light", "system"].includes(storedTheme as Theme)) {
        return storedTheme as Theme;
      }
    } catch (e) {
      console.error("Error accessing localStorage for theme:", e);
    }
    return defaultTheme;
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("light");

  // Apply theme to document
  useEffect(() => {
    try {
      const root = window.document.documentElement;
      console.log("Applying theme:", theme);
      root.classList.remove("light", "dark");

      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        root.classList.add(systemTheme);
        setResolvedTheme(systemTheme);
        
        // Apply consistent dark mode styles to body when using system preference
        if (systemTheme === "dark") {
          document.body.classList.add("dark-mode-body");
          document.body.style.backgroundColor = "hsl(220, 14%, 10%)";
          document.body.style.color = "hsl(0, 0%, 98%)";
        } else {
          document.body.classList.remove("dark-mode-body");
          document.body.style.backgroundColor = "";
          document.body.style.color = "";
        }
        return;
      }

      root.classList.add(theme);
      setResolvedTheme(theme === "dark" ? "dark" : "light");

      // Apply consistent color styles to body
      if (theme === "dark") {
        document.body.classList.add("dark-mode-body");
        // Use our theme colors for background and text
        document.body.style.backgroundColor = "hsl(210, 11%, 15%)"; // #212529
        document.body.style.color = "hsl(210, 17%, 98%)"; // #F8F9FA
      } else {
        document.body.classList.remove("dark-mode-body");
        document.body.style.backgroundColor = "";
        document.body.style.color = "";
      }
    } catch (e) {
      console.error("Error applying theme:", e);
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme === "system") {
      try {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        
        const handleChange = () => {
          const root = window.document.documentElement;
          const newResolvedTheme = mediaQuery.matches ? "dark" : "light";
          setResolvedTheme(newResolvedTheme);
          
          if (mediaQuery.matches) {
            root.classList.remove("light");
            root.classList.add("dark");
            document.body.classList.add("dark-mode-body");
            // Use our theme colors for background and text
            document.body.style.backgroundColor = "hsl(210, 11%, 15%)"; // #212529
            document.body.style.color = "hsl(210, 17%, 98%)"; // #F8F9FA
          } else {
            root.classList.remove("dark");
            root.classList.add("light");
            document.body.classList.remove("dark-mode-body");
            document.body.style.backgroundColor = "";
            document.body.style.color = "";
          }
        };
        
        // Run once on mount to set initial state
        handleChange();
        
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      } catch (e) {
        console.error("Error setting up media query listener:", e);
      }
    }
  }, [theme]);

  // Safe localStorage usage
  const safeSetTheme = (theme: Theme) => {
    try {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    } catch (e) {
      console.error("Error saving theme to localStorage:", e);
      setTheme(theme); // Still update the state even if localStorage fails
    }
  };

  const value = {
    theme,
    resolvedTheme,
    setTheme: safeSetTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
