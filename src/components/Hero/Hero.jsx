import React, { useEffect, useState, useRef } from 'react';
import { Compass, ArrowDown, MapPin, Navigation, Mountain, Calendar, Sparkles } from 'lucide-react';
import { useMagnetic } from '../../hooks/useMagnetic';
import { useLanguage } from '../../context/LanguageContext';
import './Hero.css';

export default function Hero({ onOpenTripBuilder, onExploreClick }) {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const primaryMagneticRef = useMagnetic(0.28);
  const secondaryMagneticRef = useMagnetic(0.25);
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);

    let rafId;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollToNext = () => {
    const nextSection = document.querySelector('#places') || document.querySelector('#expeditions');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Parallax rates (disabled on reduced motion)
  const isReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clampedScroll = Math.min(scrollY, 900);

  const bgParallax = isReduced ? 0 : clampedScroll * 0.22;
  const cloudsParallax = isReduced ? 0 : clampedScroll * 0.38;
  const mountainLineParallax = isReduced ? 0 : clampedScroll * 0.45;
  const contentParallax = isReduced ? 0 : clampedScroll * 0.52;
  const contentOpacity = isReduced ? 1 : Math.max(0, 1 - clampedScroll / 650);

  return (
    <section className="hero-section" aria-label="Hero Showcase">
      {/* Parallax Layer 0: High-Resolution Mountain Summit Backdrop & Looping Atmosphere */}
      <div
        className="hero-bg-container"
        style={{ transform: `translate3d(0, ${bgParallax}px, 0)` }}
      >
        <img
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2400&q=85"
          alt="High Karakoram Mountain Summits"
          className="hero-bg-image"
          loading="eager"
        />
        <div className="hero-overlay-gradient" />
      </div>

      {/* Parallax Layer 1: Atmospheric Cloud Mist Overlay */}
      <div
        className="hero-cloud-layer"
        style={{ transform: `translate3d(0, ${cloudsParallax}px, 0)` }}
      >
        <div className="hero-drifting-cloud cloud-1" />
        <div className="hero-drifting-cloud cloud-2" />
      </div>

      {/* Parallax Layer 2: Animated SVG Mountain Route Line Draw */}
      <div
        className="hero-svg-line-container"
        style={{ transform: `translate3d(0, ${mountainLineParallax}px, 0)` }}
      >
        <svg
          className={`hero-route-svg ${mounted ? 'animate-route' : ''}`}
          viewBox="0 0 1200 500"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Topographic Contour Lines */}
          <path
            d="M-50 420 Q 200 240, 500 360 T 1000 220 T 1250 340"
            stroke="rgba(212, 175, 55, 0.12)"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
          <path
            d="M-50 460 Q 250 280, 600 400 T 1150 270 T 1250 390"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
          />

          {/* Primary Expedition Ascent Line Draw (Askole -> Concordia -> K2 Apex) */}
          <path
            d="M 50 450 L 220 380 L 380 340 L 520 280 L 680 230 L 820 160 L 960 70 L 1020 95 L 1150 40"
            stroke="var(--accent-gold)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="expedition-draw-path"
          />

          {/* Summit Camp Waypoints */}
          <circle cx="520" cy="280" r="4" fill="var(--accent-gold)" className="waypoint-glow" />
          <circle cx="820" cy="160" r="4" fill="var(--accent-gold)" className="waypoint-glow" />
          <circle cx="960" cy="70" r="6" fill="#ffffff" stroke="var(--accent-gold)" strokeWidth="2" className="waypoint-glow apex" />
        </svg>
      </div>

      {/* Parallax Layer 3: Hero Foreground Content & Editorial Statement */}
      <div
        className="container hero-content"
        style={{
          transform: `translate3d(0, ${contentParallax}px, 0)`,
          opacity: contentOpacity
        }}
      >
        {/* Micro-Information HUD Bar */}
        <div className="hero-hud-bar" aria-label="Expedition Location Telemetry">
          <div className="hero-hud-item">
            <MapPin size={13} color="var(--accent-gold)" />
            <span>Range: <strong>Karakoram / Baltistan</strong></span>
          </div>
          <span className="hero-hud-divider" />
          <div className="hero-hud-item">
            <Navigation size={13} color="var(--accent-gold)" />
            <span>Coords: <strong>35°52' N, 76°30' E</strong></span>
          </div>
          <span className="hero-hud-divider" />
          <div className="hero-hud-item">
            <Mountain size={13} color="var(--accent-gold)" />
            <span>Apex: <strong>8,611m (K2)</strong></span>
          </div>
          <span className="hero-hud-divider" />
          <div className="hero-hud-item">
            <Calendar size={13} color="var(--accent-gold)" />
            <span>Window: <strong>Summer 2026/27</strong></span>
          </div>
        </div>

        {/* Cinematic Headline with Restored Mountain/Climbing Theme */}
        <div className="hero-headline-group">
          <div className="hero-brand-pill">
            <Sparkles size={13} color="var(--accent)" />
            <span>{t('hero', 'eyebrow') || 'PREMIER HIGH-ALTITUDE MOUNTAINEERING & EXPEDITIONS'}</span>
          </div>

          <h1 className="hero-title">
            {t('hero', 'titleLine1') || 'BEYOND LIMITS.'}{' '}
            <span className="hero-title-accent">{t('hero', 'titleLine2') || 'ABOVE THE CLOUDS.'}</span>
          </h1>

          <p className="hero-subtitle">
            {t('hero', 'subtitle') || 'World-class alpine expeditions across the Karakoram, Himalayas, Hindu Kush, and international seven summits. Guided by certified UIAGM/IFMGA leaders.'}
          </p>

          {/* Quick Alpine Accreditations Bar */}
          <div className="hero-stats-row" aria-label="Alpine Ascents Track Record">
            <div className="hero-stat-pill">
              <span className="hero-stat-number">{t('hero', 'statPeaks') || '14+'}</span>
              <span className="hero-stat-text">{t('hero', 'statPeaksLabel') || 'Eight-Thousanders & 7 Summits'}</span>
            </div>
            <span className="hero-stat-divider" />
            <div className="hero-stat-pill">
              <span className="hero-stat-number">{t('hero', 'statGuides') || '100%'}</span>
              <span className="hero-stat-text">{t('hero', 'statGuidesLabel') || 'Certified Alpine Leadership'}</span>
            </div>
            <span className="hero-stat-divider" />
            <div className="hero-stat-pill">
              <span className="hero-stat-number">{t('hero', 'statSafety') || '99.4%'}</span>
              <span className="hero-stat-text">{t('hero', 'statSafetyLabel') || 'Safety & Evac Readiness'}</span>
            </div>
          </div>
        </div>

        {/* Hero Action CTAs with Magnetic Effect */}
        <div className="hero-actions">
          <div ref={primaryMagneticRef} className="magnetic-button-wrap">
            <button
              className="btn btn-primary btn-lg"
              onClick={onExploreClick || scrollToNext}
            >
              <Compass size={18} />
              <span>{t('hero', 'exploreBtn') || 'EXPLORE EXPEDITIONS'}</span>
            </button>
          </div>

          <div ref={secondaryMagneticRef} className="magnetic-button-wrap">
            <button
              className="btn btn-secondary btn-lg"
              onClick={onOpenTripBuilder}
            >
              <Mountain size={18} />
              <span>{t('hero', 'buildBtn') || 'BUILD MY EXPEDITION'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Down Prompt */}
      <div
        className="hero-scroll-indicator"
        onClick={scrollToNext}
        role="button"
        tabIndex={0}
        aria-label="Scroll to discover"
      >
        <div className="scroll-mouse-wheel" />
        <span>EXPLORE DOWN</span>
        <ArrowDown size={14} />
      </div>
    </section>
  );
}
