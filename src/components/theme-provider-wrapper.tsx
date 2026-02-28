"use client";

import { ThemeProvider } from "next-themes";

export function ThemeProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="theme-1"
      themes={["theme-1", "theme-2", "theme-3", "theme-4", "theme-5"]}
    >
      {children}
    </ThemeProvider>
  );
}
