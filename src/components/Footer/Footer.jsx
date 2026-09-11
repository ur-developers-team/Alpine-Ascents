import React from 'react';
import { Mountain, Compass, Shield, Heart, User, ArrowUp } from 'lucide-react';
import './Footer.css';

export default function Footer({ onOpenProfile, onOpenWishlist, onOpenTripBuilder }) {
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div className="navbar-logo-icon">
                <Mountain size={18} />
              </div>
              <h3>ALPINE ASCENTS</h3>
            </div>
            <p style={{ fontStyle: 'italic', color: 'var(--accent)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              "Beyond Limits. Above the Clouds."
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.7', maxWidth: '320px' }}>
              Premier single-page mountaineering, high-altitude expedition agency, and Gilgit-Baltistan discovery platform. Built upon rigorous SRS safety and educational standards.
            </p>
          </div>

          {/* Column 1: EXPLORE */}
          <div>
            <div className="footer-col-title">EXPLORE</div>
            <ul className="footer-links-list">
              <li><a href="#expeditions" className="footer-link" onClick={(e) => { e.preventDefault(); scrollTo('#expeditions'); }}>Expedition Packages</a></li>
              <li><a href="#mountain-finder" className="footer-link" onClick={(e) => { e.preventDefault(); scrollTo('#mountain-finder'); }}>Mountain Finder</a></li>
              <li><a href="#destinations" className="footer-link" onClick={(e) => { e.preventDefault(); scrollTo('#destinations'); }}>Destination Explorer</a></li>
              <li><a href="#gilgit-baltistan" className="footer-link" onClick={(e) => { e.preventDefault(); scrollTo('#gilgit-baltistan'); }}>Gilgit-Baltistan Flagship</a></li>
              <li><a href="#map" className="footer-link" onClick={(e) => { e.preventDefault(); scrollTo('#map'); }}>Interactive Global Map</a></li>
            </ul>
          </div>

          {/* Column 2: LEARN */}
          <div>
            <div className="footer-col-title">LEARN</div>
            <ul className="footer-links-list">
              <li><a href="#knowledge" className="footer-link" onClick={(e) => { e.preventDefault(); scrollTo('#knowledge'); }}>Mountaineering Knowledge</a></li>
              <li><a href="#knowledge" className="footer-link" onClick={(e) => { e.preventDefault(); scrollTo('#knowledge'); }}>Historic Ascents Timeline</a></li>
              <li><a href="#knowledge" className="footer-link" onClick={(e) => { e.preventDefault(); scrollTo('#knowledge'); }}>Alpine vs Siege Styles</a></li>
              <li><a href="#equipment" className="footer-link" onClick={(e) => { e.preventDefault(); scrollTo('#equipment'); }}>Equipment Checklist</a></li>
              <li><a href="#journal" className="footer-link" onClick={(e) => { e.preventDefault(); scrollTo('#journal'); }}>The Alpine Journal</a></li>
            </ul>
          </div>

          {/* Column 3: COMPANY & NETWORK */}
          <div>
            <div className="footer-col-title">COMPANY</div>
            <ul className="footer-links-list">
              <li><a href="#guides" className="footer-link" onClick={(e) => { e.preventDefault(); scrollTo('#guides'); }}>High-Altitude Guides</a></li>
              <li><a href="#clubs" className="footer-link" onClick={(e) => { e.preventDefault(); scrollTo('#clubs'); }}>Alpine Clubs & ACP</a></li>
              <li><a href="#stories" className="footer-link" onClick={(e) => { e.preventDefault(); scrollTo('#stories'); }}>Expedition Stories</a></li>
              <li><a href="#developments" className="footer-link" onClick={(e) => { e.preventDefault(); scrollTo('#developments'); }}>Latest Developments</a></li>
              <li><a href="#offers" className="footer-link" onClick={(e) => { e.preventDefault(); scrollTo('#offers'); }}>Expedition Offers</a></li>
            </ul>
          </div>

          {/* Column 4: CLIMBER PORTAL */}
          <div>
            <div className="footer-col-title">CLIMBER ACCESS</div>
            <ul className="footer-links-list">
              <li>
                <button className="footer-link" onClick={onOpenProfile} style={{ textAlign: 'left' }}>
                  My Profile & Preferences
                </button>
              </li>
              <li>
                <button className="footer-link" onClick={onOpenWishlist} style={{ textAlign: 'left' }}>
                  My Saved Wishlist
                </button>
              </li>
              <li>
                <button className="footer-link" onClick={onOpenTripBuilder} style={{ textAlign: 'left' }}>
                  Build Custom Expedition
                </button>
              </li>
              <li>
                <button className="footer-link" onClick={onOpenProfile} style={{ textAlign: 'left' }}>
                  Preparation Progress
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            &copy; 2026-2027 Alpine Ascents International. Engineered for World-Class High-Altitude Alpinism.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontFamily: 'Space Mono, monospace', fontSize: '0.75rem' }}>
            <span>Telemetry: Karakoram & Alps</span>
            <span>Zero Real Transactions</span>
            <span>Honest Frontend Demo Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
