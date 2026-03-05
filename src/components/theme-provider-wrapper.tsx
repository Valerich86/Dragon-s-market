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
      defaultTheme="dark"
      themes={["light", "dark", "blob"]}
    >
      {children}
    </ThemeProvider>
  );
}
