import React, { useState, useEffect } from 'react';
import './CinematicLoader.css';

export default function CinematicLoader({ minDuration = 1400, onComplete }) {
  const [fading, setFading] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setRemoved(true);
      if (onComplete) onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setFading(true);
      const removeTimer = setTimeout(() => {
        setRemoved(true);
        if (onComplete) onComplete();
      }, 500);
      return () => clearTimeout(removeTimer);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onComplete]);

  if (removed) return null;

  return (
    <div
      className={`cinematic-loader-overlay ${fading ? 'fade-out' : ''}`}
      role="status"
      aria-label="Loading Alpine Ascents Experience"
    >
      {/* SVG Mountain Outline Draw */}
      <svg
        className="loader-mountain-svg"
        viewBox="0 0 160 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Secondary distant ridge */}
        <path
          d="M20 95 L55 50 L85 75 L115 45 L145 95"
          stroke="rgba(212, 175, 55, 0.25)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mountain-draw-path"
          style={{ animationDelay: '0.1s' }}
        />

        {/* Primary K2 Savage Peak Outline */}
        <path
          d="M10 95 L65 25 L80 42 L95 20 L150 95 Z"
          stroke="var(--accent-gold)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mountain-draw-path"
        />

        {/* Apex Summit Glow Spot */}
        <circle
          cx="95"
          cy="20"
          r="3"
          fill="#ffffff"
          stroke="var(--accent-gold)"
          strokeWidth="1"
          className="mountain-glow-apex"
        />
      </svg>

      {/* Brand Title & Tagline Reveal */}
      <div className="loader-brand-block">
        <h1 className="loader-brand-title">ALPINE ASCENTS</h1>
        <p className="loader-brand-tagline">BEYOND LIMITS. ABOVE THE CLOUDS.</p>
      </div>

      {/* Progress Line */}
      <div className="loader-progress-track">
        <div className="loader-progress-fill" />
      </div>
    </div>
  );
}
