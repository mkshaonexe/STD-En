
import { createContext, useState, useContext, useEffect, ReactNode } from "react";

type ThemeName = 
  | "light" 
  | "dark" 
  | "sunset-orange" 
  | "midnight-blue" 
  | "forest-green" 
  | "dark-black" 
  | "ocean-blue" 
  | "soft-purple"
  | "rosy-pink";

type ThemeContextType = {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themes: Array<{
    name: ThemeName;
    label: string;
    colorClass: string;
  }>;
};

const themes = [
  {
    name: "light" as ThemeName,
    label: "Light",
    colorClass: "bg-white",
  },
  {
    name: "dark" as ThemeName,
    label: "Dark",
    colorClass: "bg-gray-800",
  },
  {
    name: "sunset-orange" as ThemeName,
    label: "Sunset Orange",
    colorClass: "bg-orange-400",
  },
  {
    name: "midnight-blue" as ThemeName,
    label: "Midnight Blue",
    colorClass: "bg-indigo-900",
  },
  {
    name: "forest-green" as ThemeName,
    label: "Forest Green",
    colorClass: "bg-green-700",
  },
  {
    name: "dark-black" as ThemeName,
    label: "Dark Black",
    colorClass: "bg-zinc-900",
  },
  {
    name: "ocean-blue" as ThemeName,
    label: "Ocean Blue",
    colorClass: "bg-blue-600",
  },
  {
    name: "soft-purple" as ThemeName,
    label: "Soft Purple",
    colorClass: "bg-purple-300",
  },
  {
    name: "rosy-pink" as ThemeName,
    label: "Rosy Pink",
    colorClass: "bg-pink-400",
  },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(() => {
    // Try to load saved theme
    const savedTheme = localStorage.getItem("theme") as ThemeName;
    if (savedTheme && themes.some(t => t.name === savedTheme)) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes first
    themes.forEach((t) => {
      root.classList.remove(`theme-${t.name}`);
    });
    
    // Add the selected theme class
    root.classList.add(`theme-${theme}`);
    
    // Handle dark mode separately
    if (theme === "dark" || theme === "dark-black" || theme === "midnight-blue") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    // Save the theme preference
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
