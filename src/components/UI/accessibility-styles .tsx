// components/TextScaling.tsx
"use client";

import { useEffect } from "react";
import { useAccessibility } from "../providers/accessibility-provider";

export function AccessibilityStyles () {
  const { settings } = useAccessibility();

  useEffect(() => {
    if (typeof window === "undefined") return; // Защита от SSR

    const applyScaling = () => {
      const body = document.body;
      if (settings.isLargeTextMode) {
        body.classList.add("large-text-mode");
      } else {
        body.classList.remove("large-text-mode");
      }
      if (settings.isHighContrastMode) {
        body.classList.add("high-contrast-mode");
      } else {
        body.classList.remove("high-contrast-mode");
      }
    };

    applyScaling();

    // Перепроверяем после загрузки контента (на случай динамических элементов)
    window.addEventListener("load", applyScaling);
    return () => window.removeEventListener("load", applyScaling);
  }, [settings.isLargeTextMode, settings.isHighContrastMode]);

  return null;
}
