import React, { useEffect, useState, useRef } from 'react';
import { Compass, ArrowDown, MapPin, Navigation, Mountain, Calendar, Sparkles, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useMagnetic } from '../../hooks/useMagnetic';
import { useLanguage } from '../../context/LanguageContext';
import './Hero.css';

export default function Hero({ onOpenPlanModal, onExploreClick }) {
  const [scrollY, setScrollY] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);

  const videoRef = useRef(null);
  const primaryMagneticRef = useMagnetic(0.28);
  const secondaryMagneticRef = useMagnetic(0.25);
  const { t } = useLanguage();

  useEffect(() => {
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

  // Ensure autoplay starts smoothly
  useEffect(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setVideoPlaying(true);
            setVideoLoaded(true);
          })
          .catch(() => {
            // Autoplay prevented by browser policy; poster remains visible
            setVideoPlaying(false);
          });
      }
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setVideoPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const scrollToNext = () => {
    const nextSection = document.querySelector('#destinations') || document.querySelector('#expeditions');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Parallax rates (disabled on reduced motion)
  const isReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clampedScroll = Math.min(scrollY, 900);
  const contentParallax = isReduced ? 0 : clampedScroll * 0.42;
  const contentOpacity = isReduced ? 1 : Math.max(0, 1 - clampedScroll / 600);

  return (
    <section className="hero-section" aria-label="Alpine Ascents Hero Showcase">
      {/* Real Full-Bleed Video Background */}
      <div className="hero-media-container">
        {!videoError && (
          <video
            ref={videoRef}
            className={`hero-video-element ${videoLoaded ? 'is-loaded' : ''}`}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2400&q=85"
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
          >
            <source src="/videos/k2.mp4" type="video/mp4" />
            <source src="/videos/hunza.mp4" type="video/mp4" />
          </video>
        )}

        {/* Poster Image Fallback / Initial Eager Layer */}
        <img
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2400&q=85"
          alt="High Karakoram Alpine Peaks"
          className={`hero-poster-fallback ${videoLoaded ? 'fade-out' : ''}`}
          loading="eager"
        />

        {/* Pristine Alpine Sky & Ice Mist Overlays */}
        <div className="hero-alpine-vignette" />
        <div className="hero-ice-bottom-gradient" />
      </div>

      {/* Hero Foreground Content */}
      <div
        className="container hero-content"
        style={{
          transform: `translate3d(0, ${contentParallax}px, 0)`,
          opacity: contentOpacity
        }}
      >
        {/* Micro-Telemetry HUD Bar */}
        <div className="hero-hud-bar" aria-label="Expedition Telemetry">
          <div className="hero-hud-item">
            <MapPin size={13} color="var(--accent-gold)" />
            <span>Range: <strong>Karakoram & Western Himalaya</strong></span>
          </div>
          <span className="hero-hud-divider" />
          <div className="hero-hud-item">
            <Navigation size={13} color="var(--accent-gold)" />
            <span>Coords: <strong>35°52' N, 76°30' E</strong></span>
          </div>
          <span className="hero-hud-divider" />
          <div className="hero-hud-item">
            <Mountain size={13} color="var(--accent-gold)" />
            <span>Highest Apex: <strong>8,611m (K2)</strong></span>
          </div>
          <span className="hero-hud-divider" />
          <div className="hero-hud-item">
            <Calendar size={13} color="var(--accent-gold)" />
            <span>Expeditions: <strong>2026/27 Window Open</strong></span>
          </div>
        </div>

        {/* Headline & Brand Statement */}
        <div className="hero-headline-group">
          <div className="hero-brand-pill">
            <Sparkles size={13} color="var(--accent)" />
            <span>HIGH-ALTITUDE EXPEDITIONS & MOUNTAIN ADVENTURES</span>
          </div>

          <h1 className="hero-title">
            ALPINE ASCENTS
          </h1>

          <p className="hero-subtitle">
            World-class alpine expeditions across the Karakoram, Western Himalaya, and Hindu Kush. Guided by certified UIAGM/IFMGA leaders.
          </p>
        </div>

        {/* Primary Hero CTAs */}
        <div className="hero-actions">
          <div ref={primaryMagneticRef} className="magnetic-button-wrap">
            <button
              className="btn btn-primary btn-lg hero-plan-cta"
              onClick={onOpenPlanModal}
              id="hero-book-now-btn"
            >
              <Compass size={19} />
              <span>BOOK NOW</span>
            </button>
          </div>

          <div ref={secondaryMagneticRef} className="magnetic-button-wrap">
            <button
              className="btn btn-outline btn-lg hero-explore-cta"
              onClick={onExploreClick || scrollToNext}
              id="hero-explore-destinations-btn"
            >
              <Mountain size={18} />
              <span>EXPLORE DESTINATIONS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Video Control Controls */}
      <div className="hero-video-controls" aria-label="Video playback controls">
        <button
          className="hero-video-ctrl-btn"
          onClick={togglePlay}
          aria-label={videoPlaying ? 'Pause background video' : 'Play background video'}
          title={videoPlaying ? 'Pause video' : 'Play video'}
        >
          {videoPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button
          className="hero-video-ctrl-btn"
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
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
