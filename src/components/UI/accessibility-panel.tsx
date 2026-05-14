"use client";

import { useAccessibility } from "../providers/accessibility-provider";
import { useState } from "react";

export function AccessibilityPanel() {
  const { settings, toggleLargeText, toggleHighContrast } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="z-50 relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Настройки доступности"
        className="bg-gray-200 link text-sm text-primary px-2 rounded-full shadow-lg flex items-center"
      >
        👁️ <span className="lg:text-sm">версия для слабовидящих</span>
      </button>

      {isOpen && (
        <div className="absolute -top-10 left-1/2 -translate-x-[50%] bg-primary p-4 rounded-xl shadow-lg border w-64 z-100 no-contrast no-scaling">
          <h2 className="font-bold mb-2">Режим для слабовидящих</h2>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.isLargeTextMode}
                onChange={toggleLargeText}
                className="mr-2"
              />
              Увеличенный текст
            </label>
          </div>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.isHighContrastMode}
                onChange={toggleHighContrast}
                className="mr-2"
              />
              Высокий контраст
            </label>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="mt-2 text-sm opacity-50 cursor-pointer"
          >
            Закрыть
          </button>
        </div>
      )}
    </div>
  );
}
