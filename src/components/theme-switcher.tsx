"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const handleClick = () => {
    theme === "system" || theme === "light"
      ? setTheme("dark")
     : theme === "dark" 
     ? setTheme("blob")
      : setTheme("light");
  };

  return (
    <button onClick={handleClick} className="w-full link bg-maskot2 text-primary rounded py-2 outline-none active:scale-98 transition duration-200">
      Сменить тему
    </button>
  );
};

export default ThemeSwitcher;
