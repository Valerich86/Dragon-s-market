'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilitySettings {
  isLargeTextMode: boolean;
  isHighContrastMode: boolean; 
}

const AccessibilityContext = createContext<{
  settings: AccessibilitySettings;
  toggleLargeText: () => void;
  toggleHighContrast: () => void;
} | null>(null);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    isLargeTextMode: false,
    isHighContrastMode: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem('dragon-bazar-accessibility-settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dragon-bazar-accessibility-settings', JSON.stringify(settings));
  }, [settings]);
  const toggleLargeText = () => {
    setSettings(prev => ({
      ...prev,
      isLargeTextMode: !prev.isLargeTextMode
    }));
  };
  const toggleHighContrast = () => {
    setSettings(prev => ({
      ...prev,
      isHighContrastMode: !prev.isHighContrastMode
    }));
  };
  return (
    <AccessibilityContext.Provider value={{ settings, toggleLargeText, toggleHighContrast }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return context;
}
