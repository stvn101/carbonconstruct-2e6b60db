
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
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "carbon-construct-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      
      // Apply dark mode to body when using system preference
      if (systemTheme === "dark") {
        document.body.classList.add("dark-mode-body");
      } else {
        document.body.classList.remove("dark-mode-body");
      }
      return;
    }

    root.classList.add(theme);

    // Apply consistent dark mode styling to body
    if (theme === "dark") {
      document.body.classList.add("dark-mode-body");
      document.body.style.backgroundColor = "hsl(220, 14%, 10%)";
      document.body.style.color = "hsl(123, 30%, 92%)";
    } else {
      document.body.classList.remove("dark-mode-body");
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      
      const handleChange = () => {
        const root = window.document.documentElement;
        if (mediaQuery.matches) {
          root.classList.remove("light");
          root.classList.add("dark");
          document.body.classList.add("dark-mode-body");
          document.body.style.backgroundColor = "hsl(220, 14%, 10%)";
          document.body.style.color = "hsl(123, 30%, 92%)";
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
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
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
