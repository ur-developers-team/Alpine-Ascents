import React, { useState, useEffect } from 'react';
import { Mountain, Flag, Sparkles } from 'lucide-react';
import './AltitudeScrollIndicator.css';

export default function AltitudeScrollIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, scrolled)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Map 0-100% to 5,150m (Base Camp) -> 8,848m (Summit)
  const currentMeters = Math.round(5150 + (scrollProgress / 100) * (8848 - 5150));
  const currentFeet = Math.round(currentMeters * 3.28084);

  const getCampName = (pct) => {
    if (pct < 20) return 'Base Camp · 5,150m';
    if (pct < 45) return 'Camp I · Icefall Traversed';
    if (pct < 70) return 'Camp II · Lhotse Face';
    if (pct < 92) return 'Camp III / High Camp (Death Zone)';
    return 'SUMMIT REACHED! · 8,848m';
  };

  const isSummit = scrollProgress >= 92;

  return (
    <div
      className={`altitude-scroll-hud ${isSummit ? 'summit-active' : ''}`}
      onClick={() => setIsMinimized(!isMinimized)}
      title="Click to toggle altitude telemetry display"
      role="status"
      aria-label={`Altitude Tracker: ${currentMeters} meters`}
    >
      <div className="altitude-hud-icon-wrap">
        {isSummit ? <Flag size={16} /> : <Mountain size={16} />}
      </div>

      {!isMinimized && (
        <>
          <div className="altitude-hud-data">
            <span className="altitude-hud-elevation">
              {currentMeters.toLocaleString()}m <small style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({currentFeet.toLocaleString()}ft)</small>
            </span>
            <span className="altitude-hud-camp">
              {getCampName(scrollProgress)}
            </span>
          </div>

          <div className="altitude-hud-mini-bar">
            <div
              className="altitude-hud-mini-fill"
              style={{ height: `${scrollProgress}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
}
