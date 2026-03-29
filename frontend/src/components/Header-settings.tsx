import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

function getStoredTheme(): Theme {
  const auth = JSON.parse(sessionStorage.getItem("auth") ?? "{}");
  const userId = auth?.user_id;
  const key = userId ? `theme:user:${userId}` : "theme:guest";
  const saved = localStorage.getItem(key);
  return saved === "light" ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.add("theme-switching");
  root.setAttribute("data-theme", theme);
  window.dispatchEvent(new CustomEvent("app-theme-change", { detail: { theme } }));
  window.setTimeout(() => {
    root.classList.remove("theme-switching");
  }, 0);
}

export function HeaderSettings() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const initialTheme = getStoredTheme();
    setTheme(initialTheme);
    applyTheme(initialTheme);

    const onThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ theme?: string }>;
      const nextTheme = customEvent?.detail?.theme;
      if (nextTheme === "dark" || nextTheme === "light") {
        setTheme(nextTheme);
      }
    };

    window.addEventListener("app-theme-change", onThemeChange);
    return () => window.removeEventListener("app-theme-change", onThemeChange);
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);

    const auth = JSON.parse(sessionStorage.getItem("auth") ?? "{}");
    const userId = auth?.user_id;
    const key = userId ? `theme:user:${userId}` : "theme:guest";
    localStorage.setItem(key, nextTheme);
  };

  return (
    <>
      <button
        type="button"
        onClick={toggleTheme}
        className="header-settings-header inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#1B232B] bg-[#11161B] text-white transition-colors hover:bg-[#1A2129]"
        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    </>
  );
}

export default HeaderSettings;
