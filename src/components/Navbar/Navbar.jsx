import React, { useState, useEffect, useRef } from 'react';
import { Mountain, Search, Heart, User, Compass, Menu, X, ArrowUpRight, Globe, Award, Palette } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useUserProfile } from '../../context/UserProfileContext';
import { useLanguage } from '../../context/LanguageContext';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import AmbientAudioPlayer from '../Common/AmbientAudioPlayer';
import VoiceNavButton from '../Common/VoiceNavButton';
import navigationData from '../../data/navigation.json';
import './Navbar.css';

export default function Navbar({
  onOpenSearch,
  onOpenWishlist,
  onOpenProfile,
  onOpenTripBuilder,
  onOpenQuiz,
  activeSection
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { wishlistCount } = useWishlist();
  const { profile } = useUserProfile();
  const { language, toggleLanguage, t } = useLanguage();
  const drawerRef = useRef(null);

  // SRS Visitor counter
  const [visitorCount, setVisitorCount] = useState(() => {
    try {
      const savedCount = localStorage.getItem('alpine_visitor_count');
      return savedCount ? parseInt(savedCount, 10) : 1482;
    } catch {
      return 1482;
    }
  });

  useEffect(() => {
    try {
      const sessionCounted = sessionStorage.getItem('alpine_session_visitor_counted');
      if (!sessionCounted) {
        const nextCount = visitorCount + 1;
        setVisitorCount(nextCount);
        localStorage.setItem('alpine_visitor_count', nextCount.toString());
        sessionStorage.setItem('alpine_session_visitor_counted', 'true');
      }
    } catch (e) {
      console.warn('Visitor counter error', e);
    }
  }, []);

  // Scroll listener for compact sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard Escape listener & body scroll lock for mobile menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    if (!id || id === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          {/* 1. BRAND LOGO (Complete Brand & Tagline with Zero Clipping) */}
          <a
            href="#"
            className="navbar-brand"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('#');
            }}
            aria-label="Alpine Ascents Home"
          >
            <div className="navbar-logo-icon">
              <Mountain size={18} />
            </div>
            <div className="navbar-brand-text">
              <span className="navbar-brand-title">ALPINE ASCENTS</span>
              <span className="navbar-brand-tagline">Beyond Limits. Above the Clouds.</span>
            </div>
          </a>

          {/* 2. DESKTOP NAVIGATION (Rendered strictly from JSON config) */}
          <nav aria-label="Main Navigation" className="navbar-desktop-nav">
            <ul className="navbar-nav-list">
              {navigationData.map((item) => {
                const isActive = activeSection === item.id || (item.id === 'home' && (!activeSection || activeSection === 'hero'));
                const labelText = language === 'ur' && item.labelUrdu ? item.labelUrdu : item.label;

                return (
                  <li key={item.id} className="navbar-nav-item">
                    <a
                      href={item.path}
                      className={`navbar-nav-link ${isActive ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollTo(item.path);
                      }}
                    >
                      {labelText}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* 3. NAVBAR ACTIONS (Optimized proportions, zero clipping) */}
          <div className="navbar-actions">
            {/* Language Switcher */}
            <button
              className="nav-action-pill-btn"
              onClick={toggleLanguage}
              title={`Switch Language (${language === 'en' ? 'اردو' : 'English'})`}
              aria-label="Switch Language"
            >
              <Globe size={13} />
              <span>{language === 'en' ? 'اردو' : 'EN'}</span>
            </button>

            {/* Adaptive Atmosphere Theme Switcher (Full on desktop, compact on tablet/mobile) */}
            <ThemeSwitcher compact={false} />

            {/* Optional Ambient Mountain Wind Sound (User Opt-in) */}
            <AmbientAudioPlayer />

            {/* Web Speech Voice-Controlled Navigation */}
            <VoiceNavButton />

            {/* Global Search Button */}
            <button
              className="nav-action-icon-btn"
              onClick={onOpenSearch}
              title="Global Search (Ctrl+K)"
              aria-label="Global Search"
            >
              <Search size={16} />
            </button>

            {/* Wishlist Button */}
            <button
              className="nav-action-icon-btn"
              onClick={onOpenWishlist}
              title="Saved Expeditions & Wishlist"
              aria-label="Wishlist"
            >
              <Heart size={16} />
              {wishlistCount > 0 && <span className="nav-badge-bubble">{wishlistCount}</span>}
            </button>

            {/* User Profile Button */}
            <button
              className="nav-action-icon-btn nav-profile-btn"
              onClick={onOpenProfile}
              title={`Climber Profile: ${profile?.name || 'Climber'}`}
              aria-label="Climber Profile"
            >
              <User size={16} />
            </button>

            {/* Primary Desktop CTA: Plan Your Climb */}
            <button
              className="btn btn-primary btn-sm navbar-cta"
              onClick={onOpenTripBuilder}
            >
              <Compass size={14} />
              <span>{t('nav', 'bookTrip') || 'Plan Your Climb'}</span>
            </button>

            {/* Mobile / Tablet Menu Hamburger Toggle */}
            <button
              className="navbar-hamburger-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE / TABLET DRAWER BACKDROP */}
      <div
        className={`mobile-drawer-backdrop ${mobileMenuOpen ? 'visible' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* MOBILE / TABLET MENU DRAWER */}
      <aside
        ref={drawerRef}
        className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
      >
        <div className="mobile-drawer-inner">
          {/* Drawer Header */}
          <div className="mobile-drawer-header">
            <div className="navbar-brand">
              <div className="navbar-logo-icon">
                <Mountain size={16} />
              </div>
              <div className="navbar-brand-text">
                <span className="navbar-brand-title" style={{ fontSize: '1rem' }}>ALPINE ASCENTS</span>
                <span className="navbar-brand-subtitle">EXPEDITIONS</span>
              </div>
            </div>

            <button
              className="mobile-drawer-close"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Utility Row: Visitor telemetry, Language */}
          <div className="mobile-drawer-utilities">
            <div className="mobile-visitor-pill" title="Live Explorers Online">
              <span className="visitor-pulse-dot" />
              <span>{visitorCount.toLocaleString()} {language === 'ur' ? 'کوہ پیما' : 'Climbers'}</span>
            </div>

            <button
              className="nav-action-pill-btn"
              onClick={toggleLanguage}
              style={{ padding: '0.4rem 0.85rem' }}
              aria-label="Switch language"
            >
              <Globe size={13} />
              <span>{language === 'en' ? 'اردو' : 'English'}</span>
            </button>
          </div>

          {/* Dedicated Accessible Mobile Theme Switcher (Requirement 20) */}
          <div className="mobile-drawer-theme-section">
            <div className="mobile-drawer-section-label">
              <Palette size={13} color="var(--accent)" />
              <span>{language === 'ur' ? 'ماحول اور تھیم منتخب کریں' : 'ATMOSPHERE & THEME'}</span>
            </div>
            <ThemeSwitcher inline={true} />
          </div>

          {/* Navigation Links from JSON */}
          <nav className="mobile-nav-block">
            <ul className="mobile-nav-list">
              {navigationData.map((item) => {
                const labelText = language === 'ur' && item.labelUrdu ? item.labelUrdu : item.label;
                const isActive = activeSection === item.id || (item.id === 'home' && (!activeSection || activeSection === 'hero'));

                return (
                  <li key={item.id} className="mobile-nav-item">
                    <a
                      href={item.path}
                      className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollTo(item.path);
                      }}
                    >
                      <span>{labelText}</span>
                      <ArrowUpRight size={15} className="mobile-nav-arrow" />
                    </a>
                  </li>
                );
              })}

              {/* Safety Quiz Direct Trigger */}
              <li className="mobile-nav-item">
                <button
                  className="mobile-nav-link mobile-quiz-link"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenQuiz) onOpenQuiz();
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)' }}>
                    <Award size={16} />
                    {t('nav', 'quiz') || 'Alpine Safety Quiz'}
                  </span>
                  <ArrowUpRight size={15} className="mobile-nav-arrow" />
                </button>
              </li>
            </ul>
          </nav>

          {/* Drawer Footer Actions */}
          <div className="mobile-drawer-footer">
            <div className="mobile-quick-actions-row">
              <button
                className="btn btn-outline btn-sm mobile-action-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenWishlist();
                }}
              >
                <Heart size={14} />
                <span>Wishlist ({wishlistCount})</span>
              </button>

              <button
                className="btn btn-outline btn-sm mobile-action-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProfile();
                }}
              >
                <User size={14} />
                <span>Profile</span>
              </button>
            </div>

            <button
              className="btn btn-primary mobile-cta-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTripBuilder();
              }}
            >
              <Compass size={16} />
              <span>{t('nav', 'bookTrip') || 'Plan Your Climb'}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
