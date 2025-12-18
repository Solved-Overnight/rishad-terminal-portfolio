import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, ThemeColors, ThemeId, THEMES } from '../utils/themes';

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (id: ThemeId) => void;
  updateCustomTheme: (colors: Partial<ThemeColors>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>('default');
  const [customColors, setCustomColors] = useState<ThemeColors>(THEMES.default.colors);

  // Load from local storage on mount
  useEffect(() => {
    const savedId = localStorage.getItem('themeId') as ThemeId;
    if (savedId && THEMES[savedId] || savedId === 'custom') {
      setCurrentThemeId(savedId);
    }
    
    const savedCustom = localStorage.getItem('customThemeColors');
    if (savedCustom) {
      try {
        setCustomColors(JSON.parse(savedCustom));
      } catch (e) {
        console.error("Failed to parse custom theme", e);
      }
    }
  }, []);

  // Compute the actual active theme object
  const activeTheme: Theme = currentThemeId === 'custom' 
    ? { id: 'custom', name: 'Custom', colors: customColors }
    : THEMES[currentThemeId];

  // Apply CSS variables whenever the theme changes
  useEffect(() => {
    const root = document.documentElement;
    const colors = activeTheme.colors;
    
    root.style.setProperty('--terminal-bg', colors.bg);
    root.style.setProperty('--terminal-primary', colors.primary);
    root.style.setProperty('--terminal-secondary', colors.secondary);
    root.style.setProperty('--terminal-accent', colors.accent);
    root.style.setProperty('--terminal-dim', colors.dim);
    root.style.setProperty('--terminal-text', colors.text);
    root.style.setProperty('--terminal-text-dim', colors.textDim);
  }, [activeTheme]);

  const handleSetTheme = (id: ThemeId) => {
    setCurrentThemeId(id);
    localStorage.setItem('themeId', id);
  };

  const handleUpdateCustomTheme = (newColors: Partial<ThemeColors>) => {
    const updated = { ...customColors, ...newColors };
    setCustomColors(updated);
    localStorage.setItem('customThemeColors', JSON.stringify(updated));
    // If we aren't already on custom, switch to it
    if (currentThemeId !== 'custom') {
      handleSetTheme('custom');
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      currentTheme: activeTheme, 
      setTheme: handleSetTheme,
      updateCustomTheme: handleUpdateCustomTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};