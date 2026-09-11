import React, { useState } from 'react';
import destinationsData from '../../data/destinations.json';
import { useWishlist } from '../../context/WishlistContext';
import { MapPin, Mountain, Calendar, Heart, Compass, ArrowRight, Shield } from 'lucide-react';
import './GilgitBaltistanSection.css';

export default function GilgitBaltistanSection({ onSelectDestination, onOpenTripBuilder }) {
  // Filter only Gilgit-Baltistan destinations
  const gbDestinations = destinationsData.filter(d => d.region === 'Gilgit-Baltistan');
  const [selectedDestId, setSelectedDestId] = useState(gbDestinations[0]?.id || 'hunza-valley');
  const { toggleWishlist, isWishlisted } = useWishlist();

  const activeDest = gbDestinations.find(d => d.id === selectedDestId) || gbDestinations[0];

  return (
    <section id="gilgit-baltistan" className="section gb-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Mountain size={14} />
            <span>FLAGSHIP EXPEDITION SHOWCASE</span>
          </div>
          <h2 className="section-title">EXPLORE GILGIT-BALTISTAN</h2>
          <p className="section-subtitle">
            The epicenter of extreme mountain topography. Home to the greatest convergence of 8,000m peaks, prehistoric glaciers, and legendary Silk Road alpine valleys on Earth.
          </p>
        </div>

        {/* Tab Selector Pills */}
        <div className="gb-tab-pills" role="tablist" aria-label="Gilgit-Baltistan Destinations">
          {gbDestinations.map((dest) => (
            <button
              key={dest.id}
              className={`gb-pill-btn ${dest.id === selectedDestId ? 'active' : ''}`}
              onClick={() => setSelectedDestId(dest.id)}
              role="tab"
              aria-selected={dest.id === selectedDestId}
            >
              <MapPin size={14} />
              <span>{dest.name}</span>
            </button>
          ))}
        </div>

        {/* Main Interactive Showcase Card */}
        {activeDest && (
          <div className="gb-showcase-card">
            {/* Left Media Column */}
            <div className="gb-media-wrapper">
              <img
                src={activeDest.image}
                alt={activeDest.name}
                className="gb-media-img"
              />
              <div className="gb-media-gradient" />

              <div className="gb-media-badge-group">
                <span className="hud-tag">
                  <Mountain size={11} />
                  <span>ALT: {activeDest.altitude}</span>
                </span>
                <span className="hud-tag" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', borderColor: '#059669' }}>
                  <Shield size={11} />
                  <span>{activeDest.difficulty}</span>
                </span>
              </div>

              <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', zIndex: 2 }}>
                <button
                  className={`btn-save ${isWishlisted(activeDest.id) ? 'active' : ''}`}
                  onClick={() => toggleWishlist(activeDest, 'destination')}
                  title={isWishlisted(activeDest.id) ? 'Remove from wishlist' : 'Save to wishlist'}
                  aria-label="Save destination"
                >
                  <Heart size={18} fill={isWishlisted(activeDest.id) ? '#f43f5e' : 'none'} />
                </button>
              </div>
            </div>

            {/* Right Details Column */}
            <div className="gb-details-pane">
              <span className="section-eyebrow" style={{ textAlign: 'left', marginBottom: '0.4rem' }}>
                {activeDest.region}, Pakistan
              </span>
              <h3 style={{ fontSize: '2rem', marginBottom: '0.85rem' }}>{activeDest.name}</h3>

              <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                {activeDest.overview}
              </p>

              {/* Structured Metadata Grid */}
              <div className="gb-meta-grid">
                <div className="gb-meta-item">
                  <span className="gb-meta-label">BEST CLIMBING WINDOW</span>
                  <span className="gb-meta-value">{activeDest.bestSeason}</span>
                </div>
                <div className="gb-meta-item">
                  <span className="gb-meta-label">EXPEDITION DURATION</span>
                  <span className="gb-meta-value">{activeDest.duration}</span>
                </div>
                <div className="gb-meta-item">
                  <span className="gb-meta-label">STARTING DEMO RATE</span>
                  <span className="gb-meta-value" style={{ color: 'var(--accent)' }}>${activeDest.startingPrice}</span>
                </div>
                <div className="gb-meta-item">
                  <span className="gb-meta-label">GPS COORDINATES</span>
                  <span className="gb-meta-value" style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.85rem' }}>
                    {activeDest.coordinates[0]}° N, {activeDest.coordinates[1]}° E
                  </span>
                </div>
              </div>

              {/* Famous Landmarks */}
              <div>
                <span className="gb-meta-label">ICONIC HIGHLIGHTS & LANDMARKS</span>
                <div className="gb-landmarks-list">
                  {activeDest.landmarks.map((l, i) => (
                    <span key={i} className="gb-landmark-tag">{l}</span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => onSelectDestination && onSelectDestination(activeDest)}
                >
                  <span>FULL DESTINATION DOSSIER</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={onOpenTripBuilder}
                >
                  <Compass size={16} />
                  <span>CUSTOMIZE EXPEDITION</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
