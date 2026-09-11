import React, { useState } from 'react';
import destinationsData from '../../data/destinations.json';
import { useWishlist } from '../../context/WishlistContext';
import { useUserProfile } from '../../context/UserProfileContext';
import { MapPin, Mountain, Calendar, Compass, Heart, ArrowRight } from 'lucide-react';
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

  const handleCardClick = (dest) => {
    addRecentlyViewed(dest, 'destination');
    onSelectDestination && onSelectDestination(dest);
  };

  return (
    <section id="destinations" className="section dest-explorer-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Compass size={14} />
            <span>GLOBAL MOUNTAIN DOMAINS</span>
          </div>
          <h2 className="section-title">DESTINATION EXPLORER</h2>
          <p className="section-subtitle">
            From the colossal granite pinnacles of the Karakoram to the ancient alpine passes of the Alps and Patagonia, discover pristine high-altitude frontiers.
          </p>
        </div>

        {/* Region Filter Bar */}
        <div className="dest-filter-bar" role="tablist">
          {categories.map(cat => (
            <button
              key={cat.key}
              className={`btn btn-sm ${selectedRegion === cat.key ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedRegion(cat.key)}
              role="tab"
              aria-selected={selectedRegion === cat.key}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Destinations Grid */}
        <div className="dest-grid">
          {filteredDestinations.map(dest => (
            <div key={dest.id} className="dest-card">
              {/* Media Header */}
              <div className="dest-card-media" onClick={() => handleCardClick(dest)} style={{ cursor: 'pointer' }}>
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="dest-card-img"
                  loading="lazy"
                />
                <div className="dest-card-badges">
                  <span className="hud-tag">
                    <Mountain size={11} />
                    <span>{dest.altitude}</span>
                  </span>
                  <span className="hud-tag" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', borderColor: '#059669' }}>
                    {dest.difficulty}
                  </span>
                </div>

                <div className="dest-card-save" onClick={(e) => e.stopPropagation()}>
                  <button
                    className={`btn-save ${isWishlisted(dest.id) ? 'active' : ''}`}
                    onClick={() => toggleWishlist(dest, 'destination')}
                    title="Save to Wishlist"
                    aria-label="Save"
                  >
                    <Heart size={16} fill={isWishlisted(dest.id) ? '#f43f5e' : 'none'} />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="dest-card-body">
                <span className="section-eyebrow" style={{ fontSize: '0.72rem', textAlign: 'left', marginBottom: '0.2rem' }}>
                  {dest.region}, {dest.country}
                </span>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', cursor: 'pointer' }} onClick={() => handleCardClick(dest)}>
                  {dest.name}
                </h4>
                <p style={{ fontSize: '0.88rem', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {dest.overview}
                </p>

                {/* Metadata Row */}
                <div className="dest-card-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={13} color="var(--accent)" />
                    <span>{dest.bestSeason}</span>
                  </span>
                  <span>{dest.duration}</span>
                </div>

                {/* Card Footer */}
                <div className="dest-card-footer">
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Starting from</span>
                    <span className="dest-card-price">${dest.startingPrice}</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}> (Sample Demo)</span>
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleCardClick(dest)}
                  >
                    <span>View Dossier</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
