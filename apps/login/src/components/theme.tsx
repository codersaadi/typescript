"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Theme() {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    // Check system preference and set initial theme if not explicitly set
    if (!theme) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      setTheme(systemTheme);
    }
  }, [theme, setTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (!theme) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, setTheme]);

  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div
      className={`h-fit relative grid grid-cols-2 rounded-full border border-divider-light dark:border-divider-dark p-1`}
      role="group"
      aria-label="Theme switcher"
    >
      <button
        className={`h-8 w-8 rounded-full flex flex-row items-center justify-center hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-light-500 dark:focus:ring-primary-dark-500 transition-all ${
          isDark ? "bg-black/10 dark:bg-white/10" : "opacity-60"
        }`}
        onClick={() => setTheme("dark")}
        aria-pressed={isDark}
        aria-label="Switch to dark theme"
      >
        <MoonIcon className="h-4 w-4 flex-shrink-0 text-xl rounded-full transition-transform duration-200 ease-in-out" />
      </button>
      <button
        className={`h-8 w-8 rounded-full flex flex-row items-center justify-center hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-light-500 dark:focus:ring-primary-dark-500 transition-all ${
          !isDark ? "bg-black/10 dark:bg-white/10" : "opacity-60"
        }`}
        onClick={() => setTheme("light")}
        aria-pressed={!isDark}
        aria-label="Switch to light theme"
      >
        <SunIcon className="h-6 w-6 flex-shrink-0 text-xl rounded-full transition-transform duration-200 ease-in-out" />
      </button>
    </div>
  );
}
