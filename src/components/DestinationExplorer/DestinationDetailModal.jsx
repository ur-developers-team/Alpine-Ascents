import React from 'react';
import { X, MapPin, Mountain, Calendar, Compass, Shield, Heart, Check, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

export default function DestinationDetailModal({ destination, isOpen, onClose, onOpenTripBuilder, onSelectPackage }) {
  const { toggleWishlist, isWishlisted } = useWishlist();

  if (!isOpen || !destination) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '960px' }}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close details">
          <X size={18} />
        </button>

        {/* Hero Image */}
        <div className="dest-detail-hero">
          <img
            src={destination.image}
            alt={destination.name}
            className="dest-detail-hero-img"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(7,12,18,0.3) 0%, rgba(7,12,18,0.9) 100%)' }} />

          <div style={{ position: 'absolute', bottom: '2rem', left: '2.5rem', right: '2.5rem', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="hud-tag">
                  <Mountain size={11} />
                  <span>{destination.altitude}</span>
                </span>
                <span className="hud-tag" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', borderColor: '#059669' }}>
                  <Shield size={11} />
                  <span>{destination.difficulty}</span>
                </span>
              </div>
              <h2 style={{ fontSize: '2.4rem', color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                {destination.name}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem' }}>
                <MapPin size={15} color="var(--accent)" />
                <span>{destination.region}, {destination.country}</span>
              </p>
            </div>

            <button
              className={`btn-save ${isWishlisted(destination.id) ? 'active' : ''}`}
              onClick={() => toggleWishlist(destination, 'destination')}
              title="Save to Wishlist"
              aria-label="Save"
            >
              <Heart size={20} fill={isWishlisted(destination.id) ? '#f43f5e' : 'none'} />
            </button>
          </div>
        </div>

        {/* Detail Content */}
        <div className="dest-detail-body">
          {/* Overview */}
          <div className="dest-detail-section-block">
            <span className="section-eyebrow">GEOGRAPHICAL OVERVIEW</span>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              {destination.overview}
            </p>
          </div>

          {/* Key Facts Grid */}
          <div className="dest-detail-section-block">
            <div className="gb-meta-grid" style={{ margin: 0 }}>
              <div className="gb-meta-item">
                <span className="gb-meta-label">PEAK SEASON / WINDOW</span>
                <span className="gb-meta-value">{destination.bestSeason}</span>
              </div>
              <div className="gb-meta-item">
                <span className="gb-meta-label">STANDARD DURATION</span>
                <span className="gb-meta-value">{destination.duration}</span>
              </div>
              <div className="gb-meta-item">
                <span className="gb-meta-label">ESTIMATED BASE COST</span>
                <span className="gb-meta-value" style={{ color: 'var(--accent)' }}>${destination.startingPrice} (Sample Demo)</span>
              </div>
              <div className="gb-meta-item">
                <span className="gb-meta-label">TOPOGRAPHIC ELEVATION</span>
                <span className="gb-meta-value">{destination.altitude} Above Sea Level</span>
              </div>
            </div>
          </div>

          {/* Activities */}
          <div className="dest-detail-section-block">
            <span className="section-eyebrow">SIGNATURE ACTIVITIES & EXPERIENCES</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginTop: '0.75rem' }}>
              {destination.activities.map((act, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 0.85rem', background: 'var(--bg-tertiary)', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.9rem' }}>
                  <Check size={16} color="var(--accent)" />
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stay, Food & Transport */}
          <div className="dest-detail-section-block">
            <div className="dashboard-grid-2">
              <div className="pref-card">
                <span className="gb-meta-label">WHERE TO STAY</span>
                <ul style={{ listStyle: 'none', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {destination.stayTypes.map((s, idx) => (
                    <li key={idx} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>• {s}</li>
                  ))}
                </ul>
              </div>
              <div className="pref-card">
                <span className="gb-meta-label">LOCAL CUISINE & NOURISHMENT</span>
                <ul style={{ listStyle: 'none', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {destination.localFood.map((f, idx) => (
                    <li key={idx} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>• {f}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="pref-card" style={{ marginTop: '1rem' }}>
              <span className="gb-meta-label">TRANSPORT LOGISTICS & ACCESS</span>
              <ul style={{ listStyle: 'none', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {destination.transportOptions.map((t, idx) => (
                  <li key={idx} style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>• {t}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Nearby Alpine Centers:</span>
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
                {destination.nearbyDestinations.map((nb, i) => (
                  <span key={i} className="gb-landmark-tag">{nb}</span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                className="btn btn-primary"
                onClick={() => {
                  onClose();
                  onOpenTripBuilder && onOpenTripBuilder(destination.id);
                }}
              >
                <Compass size={16} />
                <span>BUILD CUSTOM EXPEDITION HERE</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
