import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Palette, Check, Sparkles } from 'lucide-react';
import './ThemeSwitcher.css';

export default function ThemeSwitcher({ compact = false }) {
  const { theme, changeTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentThemeObj = themes.find(t => t.id === theme) || themes[0];

  return (
    <div className="theme-switcher-container" ref={dropdownRef}>
      <button
        className={`theme-trigger-btn ${compact ? 'compact' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title={`Alpine Atmosphere: ${currentThemeObj.name}`}
        aria-label="Theme switcher"
        aria-expanded={isOpen}
      >
        <span className="theme-indicator-dot" style={{ backgroundColor: currentThemeObj.accent }} />
        {!compact && <span className="theme-name-text">{currentThemeObj.name}</span>}
        <Palette size={15} />
      </button>

      {isOpen && (
        <div className="theme-dropdown-menu" role="menu">
          <div style={{ padding: '0.25rem 0.5rem 0.5rem', borderBottom: '1px solid var(--border)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>
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
