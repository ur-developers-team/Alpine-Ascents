import React from 'react';
import { Compass, Sparkles, Mountain, ArrowRight, ShieldCheck, PhoneCall } from 'lucide-react';
import './FinalBookingCTA.css';

export default function FinalBookingCTA({ onOpenPlanModal }) {
  return (
    <section className="final-cta-section" aria-label="Begin Your Expedition">
      <div className="final-cta-media-wrap">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=85"
          className="final-cta-bg-video"
          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
        >
          <source src="/videos/k2.mp4" type="video/mp4" />
          <source src="/videos/hunza.mp4" type="video/mp4" />
        </video>
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=85"
          alt="High Karakoram Apex Summit"
          className="final-cta-bg-img"
          loading="lazy"
        />
        <div className="final-cta-overlay" />
      </div>

      <div className="site-container final-cta-container">
        <div className="final-cta-content">
          <div className="final-cta-badge">
            <Sparkles size={14} />
            <span>THE PEAKS ARE CALLING</span>
          </div>

          <h2 className="final-cta-title">
            READY FOR YOUR GREATEST MOUNTAIN ODYSSEY?
          </h2>

          <p className="final-cta-subtitle">
            Whether standing at K2 Base Camp, cruising turquoise Attabad waters with family, or scaling technical granite needles — your summit journey begins with Alpine Ascents.
          </p>

          <div className="final-cta-actions">
            <button
              className="btn btn-primary btn-lg final-cta-main-btn"
              onClick={onOpenPlanModal}
              id="final-cta-plan-btn"
            >
              <Compass size={19} />
              <span>PLAN YOUR EXPEDITION</span>
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="final-cta-guarantees">
            <div className="guarantee-pill">
              <ShieldCheck size={14} color="#10b981" />
              <span>100% Certified UIAGM / IFMGA Guides</span>
            </div>
            <div className="guarantee-pill">
              <ShieldCheck size={14} color="#10b981" />
              <span>Flexible Permits & Free Window Changes</span>
            </div>
            <div className="guarantee-pill">
              <ShieldCheck size={14} color="#10b981" />
              <span>Transparent Itemized Expedition Pricing</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
