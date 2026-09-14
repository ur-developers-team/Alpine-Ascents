import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEMES = [
  {
    id: 'alpine-day',
    name: 'Alpine Day',
    tagline: 'White Snow & Sky Editorial',
    accent: '#0284c7',
    bg: '#f8fafc',
    description: 'Pristine white snow, sky blue and crisp granite textures inspired by real mountain expeditions.'
  },
  {
    id: 'summit-night',
    name: 'Summit Night',
    tagline: 'Nocturnal Glacier & Slate',
    accent: '#38bdf8',
    bg: '#070c12',
    description: 'High-altitude nocturnal atmosphere with obsidian rock and luminescent ice-blue highlights.'
  },
  {
    id: 'expedition',
    name: 'Expedition',
    tagline: 'Earthy Adventure & Brass',
    accent: '#d97706',
    bg: '#141812',
    description: 'Rugged expedition canvas, olive stone, weathered parchment, and brass compass accents.'
  },
  {
    id: 'himalayan',
    name: 'Himalayan',
    tagline: 'Prayer Flag Saffron & Lapis',
    accent: '#f59e0b',
    bg: '#0f1422',
    description: 'Rich royal blue and prayer-flag saffron inspired by ancient high Himalayan peaks.'
  }
];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('alpine_theme');
      if (saved && THEMES.some(t => t.id === saved)) {
        return saved;
      }
      // System Theme Support (Requirement 29)
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'alpine-day';
      }
    } catch {
      // fallback
    }
    return 'alpine-day';
  });

  useEffect(() => {
    try {
      localStorage.setItem('alpine_theme', theme);
    } catch (e) {
      console.warn('Could not save theme preference', e);
    }
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // System Theme change listener when user hasn't explicitly set a custom theme in this session
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleSystemChange = (e) => {
      try {
        const saved = localStorage.getItem('alpine_theme');
        if (!saved) {
          setTheme(e.matches ? 'alpine-day' : 'summit-night');
        }
      } catch {
        // ignore
      }
    };
    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);

  const changeTheme = (themeId) => {
    if (THEMES.some(t => t.id === themeId)) {
      setTheme(themeId);
    }
  };

  const toggleTheme = () => {
    // Quick toggle between primary dark (summit-night) and light (alpine-day)
    setTheme(prev => (prev === 'alpine-day' ? 'summit-night' : 'alpine-day'));
  };

  const currentTheme = THEMES.find(t => t.id === theme) || THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, changeTheme, toggleTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
