"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Tarayıcıdan tercih edilen temayı veya localStorage'den kaydedilmiş temayı al
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    // Client-side kodunu çalıştır
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setThemeState(savedTheme);
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      setThemeState("light");
    }
  }, []);

  // Tema değişince class'ları güncelle
  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (theme === "light") {
        root.classList.add("light-theme");
        root.classList.remove("dark-theme");
      } else {
        root.classList.add("dark-theme");
        root.classList.remove("light-theme");
      }
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  // Tema değiştirme fonksiyonu
  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
    if (process.env.NODE_ENV === "development") {
      console.log(`Tema değiştirildi: ${theme === "dark" ? "light" : "dark"}`);
    }
  };

  // Tema ayarlama fonksiyonu
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (process.env.NODE_ENV === "development") {
      console.log(`Tema ayarlandı: ${newTheme}`);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Kullanım için hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
