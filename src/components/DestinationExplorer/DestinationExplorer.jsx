import React, { useState } from 'react';
import destinationsData from '../../data/destinations.json';
import { useWishlist } from '../../context/WishlistContext';
import { useUserProfile } from '../../context/UserProfileContext';
import { MapPin, Mountain, Calendar, Compass, Heart, ArrowRight, Shield, Check, Sparkles } from 'lucide-react';
import './DestinationExplorer.css';

export default function DestinationExplorer({ onSelectDestination, onOpenTripBuilder }) {
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addRecentlyViewed } = useUserProfile();

  const categories = [
    { label: 'ALL REGIONS', key: 'ALL' },
    { label: 'GILGIT-BALTISTAN & PAKISTAN', key: 'PAKISTAN' },
    { label: 'HIMALAYAS (NEPAL)', key: 'HIMALAYAS' },
    { label: 'EUROPEAN ALPS', key: 'ALPS' },
    { label: 'ANDES / PATAGONIA', key: 'ANDES' }
  ];

  const filteredDestinations = destinationsData.filter(d => {
    if (selectedRegion === 'ALL') return true;
    if (selectedRegion === 'PAKISTAN') return d.country === 'Pakistan';
    if (selectedRegion === 'HIMALAYAS') return d.country === 'Nepal';
    if (selectedRegion === 'ALPS') return d.country.includes('France') || d.country.includes('Switzerland');
    if (selectedRegion === 'ANDES') return d.country === 'Argentina';
    return true;
  });

  const handleOpenDetail = (dest) => {
    addRecentlyViewed(dest, 'destination');
    if (onSelectDestination) {
      onSelectDestination(dest);
    }
  };

  return (
    <section id="destinations" className="section dest-explorer-section">
      <div className="site-container">
        {/* Editorial Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Compass size={14} />
            <span>GLOBAL HIGH-MOUNTAIN DOMAINS</span>
          </div>
          <h2 className="section-title">DESTINATION EXPLORER</h2>
          <p className="section-subtitle">
            Immerse yourself in full-bleed landscape journeys across the Karakoram, Western Himalaya, and international seven summits. No generic lists — every valley is an expedition theatre.
          </p>
        </div>

        {/* Region Filter Pills */}
        <div className="dest-filter-bar" role="tablist">
          {categories.map(cat => (
            <button
              key={cat.key}
              className={`dest-filter-chip ${selectedRegion === cat.key ? 'active' : ''}`}
              onClick={() => setSelectedRegion(cat.key)}
              role="tab"
              aria-selected={selectedRegion === cat.key}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Full-Width Visual Destination Showcase Strips (No Boring Card Grid) */}
        <div className="dest-immersive-stack">
          {filteredDestinations.map((dest, index) => {
            const isSaved = isWishlisted(dest.id);
            const isReverse = index % 2 === 1;

            return (
              <div
                key={dest.id}
                className={`dest-wide-strip ${isReverse ? 'is-reverse' : ''}`}
                id={`dest-strip-${dest.id}`}
              >
                {/* Large Editorial Landscape Canvas */}
                <div
                  className="dest-strip-media"
                  onClick={() => handleOpenDetail(dest)}
                >
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="dest-strip-image"
                    loading="lazy"
                  />
                  <div className="dest-strip-media-overlay" />

                  {/* Overlaid Badges */}
                  <div className="dest-strip-badges">
                    <span className="dest-tag-alt">
                      <Mountain size={12} />
                      <span>{dest.altitude}</span>
                    </span>
                    <span className="dest-tag-diff">
                      <Shield size={12} />
                      <span>{dest.difficulty}</span>
                    </span>
                  </div>

                  <button
                    className={`btn-save dest-strip-save-btn ${isSaved ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(dest, 'destination');
                    }}
                    title="Save to Alpine Passport"
                    aria-label="Save"
                  >
                    <Heart size={18} fill={isSaved ? '#f43f5e' : 'none'} color={isSaved ? '#f43f5e' : '#ffffff'} />
                  </button>
                </div>

                {/* Editorial Content Column */}
                <div className="dest-strip-content">
                  <div className="dest-strip-meta-top">
                    <span className="dest-strip-region-tag">{dest.region} • {dest.country}</span>
                    <span className="dest-strip-season-tag">Window: {dest.bestSeason}</span>
                  </div>

                  <h3 className="dest-strip-title" onClick={() => handleOpenDetail(dest)}>
                    {dest.name}
                  </h3>

                  <p className="dest-strip-overview">
                    {dest.overview}
                  </p>

                  {/* Key Indicator Metrics */}
                  <div className="dest-metrics-grid">
                    <div className="metric-box">
                      <span className="metric-label">Elevation</span>
                      <span className="metric-val">{dest.altitude}</span>
                    </div>
                    <div className="metric-box">
                      <span className="metric-label">Standard Window</span>
                      <span className="metric-val">{dest.duration}</span>
                    </div>
                    <div className="metric-box">
                      <span className="metric-label">Starting From</span>
                      <span className="metric-val highlight">${dest.startingPrice}</span>
                    </div>
                  </div>

                  {/* Feature Highlights Pills */}
                  {dest.activities && (
                    <div className="dest-chips-row">
                      {dest.activities.slice(0, 3).map((act, i) => (
                        <span key={i} className="dest-chip-item">
                          <Check size={12} color="var(--accent)" />
                          <span>{act}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Row */}
                  <div className="dest-strip-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleOpenDetail(dest)}
                    >
                      <span>Explore {dest.name}</span>
                      <ArrowRight size={15} />
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() => {
                        if (onOpenTripBuilder) {
                          onOpenTripBuilder(dest.id);
                        }
                      }}
                    >
                      <Sparkles size={14} />
                      <span>Custom Package</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
