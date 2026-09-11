import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Palette, Check, Sparkles } from 'lucide-react';
import './ThemeSwitcher.css';

export default function ThemeSwitcher({ compact = false, inline = false }) {
  const { theme, changeTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const currentThemeObj = themes.find(t => t.id === theme) || themes[0];

  // Inline mode for mobile drawer
  if (inline) {
    return (
      <div className="theme-switcher-inline" role="radiogroup" aria-label="Alpine Atmospheres">
        {themes.map((t) => (
          <button
            key={t.id}
            className={`theme-option-card inline-card ${theme === t.id ? 'active' : ''}`}
            onClick={() => changeTheme(t.id)}
            role="radio"
            aria-checked={theme === t.id}
            title={`${t.name} — ${t.tagline}`}
          >
            <div className="theme-color-preview" style={{ backgroundColor: t.bg }}>
              <span className="theme-color-inner" style={{ backgroundColor: t.accent }} />
            </div>
            <div className="theme-info">
              <div className="theme-title">
                <span>{t.name}</span>
                {theme === t.id && <Check size={14} color="var(--accent)" />}
              </div>
              <div className="theme-tagline">{t.tagline}</div>
            </div>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="theme-switcher-container" ref={dropdownRef}>
      <button
        className={`theme-trigger-btn ${compact ? 'compact' : 'adaptive'}`}
        onClick={() => setIsOpen(!isOpen)}
        title={`Alpine Atmosphere: ${currentThemeObj.name} (Click to switch)`}
        aria-label={`Alpine Atmosphere theme switcher, currently ${currentThemeObj.name}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span
          className="theme-indicator-dot"
          style={{ backgroundColor: currentThemeObj.accent }}
          aria-hidden="true"
        />
        <span className="theme-name-text">{currentThemeObj.name}</span>
        <Palette size={15} className="theme-palette-icon" aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          className="theme-dropdown-menu"
          role="menu"
          aria-label="Select Alpine Atmosphere"
        >
          <div className="theme-dropdown-header">
            <Sparkles size={12} color="var(--accent)" />
            <span>ALPINE ATMOSPHERES</span>
          </div>
          {themes.map((t) => (
            <button
              key={t.id}
              className={`theme-option-card ${theme === t.id ? 'active' : ''}`}
              onClick={() => {
                changeTheme(t.id);
                setIsOpen(false);
              }}
              role="menuitem"
              aria-label={`Switch to ${t.name}: ${t.tagline}`}
            >
              <div className="theme-color-preview" style={{ backgroundColor: t.bg }}>
                <span className="theme-color-inner" style={{ backgroundColor: t.accent }} />
              </div>
              <div className="theme-info">
                <div className="theme-title">
                  <span>{t.name}</span>
                  {theme === t.id && <Check size={14} color="var(--accent)" />}
                </div>
                <div className="theme-tagline">{t.tagline}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
