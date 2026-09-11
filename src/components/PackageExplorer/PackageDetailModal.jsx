import React, { useState } from 'react';
import { X, Calendar, MapPin, Shield, Check, Minus, Compass, Heart, ChevronDown, ChevronUp, UserCheck, AlertCircle } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

export default function PackageDetailModal({ pkg, isOpen, onClose, onRequestExpedition }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [expandedDay, setExpandedDay] = useState(1);

  if (!isOpen || !pkg) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '960px' }}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close package details">
          <X size={18} />
        </button>

        {/* Hero Header */}
        <div style={{ padding: '2.5rem 2.5rem 1.75rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="hud-tag">{pkg.type}</span>
                <span className="hud-tag" style={{ background: 'rgba(217, 119, 6, 0.2)', color: '#fbbf24', borderColor: '#d97706' }}>
                  {pkg.badge}
                </span>
                <span className="hud-tag">
                  <Shield size={11} />
                  <span>{pkg.difficulty}</span>
                </span>
              </div>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>{pkg.name}</h2>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                <MapPin size={15} color="var(--accent)" />
                <span>{pkg.destinationName} · <strong>{pkg.duration}</strong></span>
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-end' }}>
                {pkg.originalPrice && (
                  <span className="pkg-original-price">${pkg.originalPrice}</span>
                )}
                <span className="pkg-price-amount">${pkg.price}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Per Climber (Demo Estimate)</span>

              <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  className={`btn-save ${isWishlisted(pkg.id) ? 'active' : ''}`}
                  onClick={() => toggleWishlist(pkg, 'package')}
                  title="Save Package to Wishlist"
                  aria-label="Save"
                >
                  <Heart size={18} fill={isWishlisted(pkg.id) ? '#f43f5e' : 'none'} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '2.5rem' }}>
          {/* Overview */}
          <div className="dest-detail-section-block">
            <span className="section-eyebrow">EXPEDITION OVERVIEW</span>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              {pkg.overview}
            </p>
          </div>

          {/* Highlights */}
          <div className="dest-detail-section-block">
            <span className="section-eyebrow">SIGNATURE HIGHLIGHTS</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
              {pkg.highlights.map((h, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.95rem' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)' }} />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Specifications */}
          <div className="dest-detail-section-block">
            <div className="gb-meta-grid" style={{ margin: 0 }}>
              <div className="gb-meta-item">
                <span className="gb-meta-label">ACCOMMODATION</span>
                <span className="gb-meta-value">{pkg.accommodation}</span>
              </div>
              <div className="gb-meta-item">
                <span className="gb-meta-label">MEAL PROVISIONS</span>
                <span className="gb-meta-value">{pkg.meals}</span>
              </div>
              <div className="gb-meta-item">
                <span className="gb-meta-label">HIGH-ALTITUDE GUIDE</span>
                <span className="gb-meta-value">{pkg.guide}</span>
              </div>
              <div className="gb-meta-item">
                <span className="gb-meta-label">GROUND & MOUNTAIN TRANSPORT</span>
                <span className="gb-meta-value">{pkg.transport}</span>
              </div>
            </div>
          </div>

          {/* Interactive Day-by-Day Itinerary */}
          <div className="dest-detail-section-block">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="section-eyebrow" style={{ margin: 0 }}>INTERACTIVE EXPEDITION ITINERARY</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{pkg.itineraryDays?.length || 0} Stages</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {pkg.itineraryDays && pkg.itineraryDays.map((stage) => (
                <div key={stage.day} className="itinerary-day-box">
                  <div
                    className="itinerary-day-header"
                    onClick={() => setExpandedDay(expandedDay === stage.day ? null : stage.day)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className="hud-tag">DAY {stage.day < 10 ? `0${stage.day}` : stage.day}</span>
                      <strong style={{ fontSize: '0.95rem' }}>{stage.title}</strong>
                    </div>
                    {expandedDay === stage.day ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>

                  {expandedDay === stage.day && (
                    <div className="itinerary-day-body">
                      <p>{stage.details}</p>
                      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span>Stay: <strong style={{ color: 'var(--text-primary)' }}>{stage.stay}</strong></span>
                        <span>Meals: <strong style={{ color: 'var(--text-primary)' }}>{stage.meals}</strong></span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="dest-detail-section-block">
            <div className="dashboard-grid-2">
              <div className="pref-card">
                <span className="gb-meta-label" style={{ color: '#10b981' }}>WHAT IS INCLUDED</span>
                <ul style={{ listStyle: 'none', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {pkg.included.map((inc, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.85rem' }}>
                      <Check size={14} color="#10b981" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pref-card">
                <span className="gb-meta-label" style={{ color: '#f43f5e' }}>WHAT IS NOT INCLUDED</span>
                <ul style={{ listStyle: 'none', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {pkg.notIncluded.map((exc, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.85rem' }}>
                      <Minus size={14} color="#f43f5e" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Preparation Advice */}
          <div className="dest-detail-section-block">
            <div style={{ display: 'flex', gap: '0.75rem', padding: '1.25rem', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <AlertCircle size={20} color="var(--accent)" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.2rem' }}>EXPEDITION PREPARATION MANDATE</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{pkg.preparationAdvice}</p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Transparent Honest Pricing:</span>
              <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Zero hidden fees or deceptive surcharges.</p>
            </div>

            <button
              className="btn btn-primary btn-lg"
              onClick={() => {
                onClose();
                onRequestExpedition && onRequestExpedition(pkg);
              }}
            >
              <Compass size={18} />
              <span>REQUEST THIS EXPEDITION</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
