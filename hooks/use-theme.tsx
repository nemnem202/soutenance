import { useEffect, useState } from "react";

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    setCurrentTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  const setDark = () => {
    if (!document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("colortheme", "dark");
      setCurrentTheme("dark");
    }
  };

  const setLight = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("colortheme", "light");
      setCurrentTheme("light");
    }
  };

  return { currentTheme, setDark, setLight };
}
