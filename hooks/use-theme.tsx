export function useTheme() {
  const setDark = () => {
    if (!document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("colortheme", "dark");
    }
  };

  const setLight = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("colortheme", "light");
    }
  };

  return { setDark, setLight };
}
