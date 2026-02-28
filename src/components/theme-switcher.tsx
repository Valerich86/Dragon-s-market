"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
      <button
        onClick={() =>
          theme === "system" || theme === "theme-1"
            ? setTheme("theme-2")
            : theme === "theme-2"
              ? setTheme("theme-3")
              : theme === "theme-3"
                ? setTheme("theme-4")
                : theme === "theme-4"
                  ? setTheme("theme-5")
                  : setTheme("theme-1")
        }
        className={
          `bg-accent theme-5:bg-maskot3 py-2 w-1/2 
          p-2 rounded text-primary hover:shadow-[0px_0px_20px_-5px_#E23324] 
          theme-5:hover:shadow-[0px_0px_20px_-5px_#591628] transition duration-200 
          cursor-pointer outline-none active:scale-98`
        }
      >
        Поменять тему
      </button>
  );
};

export default ThemeSwitcher;
