import React, { useState } from 'react';
import packagesData from '../../data/packages.json';
import { useWishlist } from '../../context/WishlistContext';
import { useUserProfile } from '../../context/UserProfileContext';
import { Compass, MapPin, Calendar, Heart, Shield, ArrowRight, Check } from 'lucide-react';
import PackageComparison from './PackageComparison';
import './PackageExplorer.css';

export default function PackageExplorer({ onSelectPackage, onOpenTripBuilder }) {
  const [selectedType, setSelectedType] = useState('ALL');
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addRecentlyViewed } = useUserProfile();

  const types = ['ALL', 'EXPLORER', 'COMFORT', 'PREMIUM', 'EXPEDITION PRO'];

  const filteredPackages = selectedType === 'ALL'
    ? packagesData
    : packagesData.filter(p => p.type.toUpperCase() === selectedType);

  const handleCardClick = (pkg) => {
    addRecentlyViewed(pkg, 'package');
    onSelectPackage && onSelectPackage(pkg);
  };

  return (
    <section id="expeditions" className="section pkg-explorer-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Compass size={14} />
            <span>CURATED EXPEDITIONS</span>
          </div>
          <h2 className="section-title">EXPEDITION PACKAGES</h2>
          <p className="section-subtitle">
            Authentic, rigorously planned mountaineering journeys. Each itinerary is structured with acclimatization safety protocols, experienced high-altitude guides, and transparent pricing.
          </p>
        </div>

        {/* Package Type Tabs */}
        <div className="pkg-type-tabs" role="tablist">
          {types.map(t => (
            <button
              key={t}
              className={`btn btn-sm ${selectedType === t ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedType(t)}
              role="tab"
              aria-selected={selectedType === t}
            >
              {t === 'ALL' ? 'ALL PACKAGES' : t}
            </button>
          ))}
        </div>

        {/* Packages Grid */}
        <div className="pkg-grid">
          {filteredPackages.map(pkg => (
            <div key={pkg.id} className="pkg-card">
              {/* Card Header */}
              <div className="pkg-card-header">
                <div className="pkg-card-badge-row">
                  <span className="hud-tag">{pkg.type}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span className="hud-tag" style={{ background: 'rgba(217, 119, 6, 0.15)', color: '#fbbf24', borderColor: '#d97706' }}>
                      {pkg.badge}
                    </span>
                    <button
                      className={`btn-save ${isWishlisted(pkg.id) ? 'active' : ''}`}
                      onClick={() => toggleWishlist(pkg, 'package')}
                      title="Save Package"
                      aria-label="Save"
                    >
                      <Heart size={16} fill={isWishlisted(pkg.id) ? '#f43f5e' : 'none'} />
                    </button>
                  </div>
                </div>

                <h3 className="pkg-card-title">{pkg.name}</h3>
                <div className="pkg-card-dest">
                  <MapPin size={14} color="var(--accent)" />
                  <span>{pkg.destinationName}</span>
                </div>
              </div>

              {/* Specs List */}
              <div className="pkg-specs-list">
                <div className="pkg-spec-row">
                  <span className="pkg-spec-label">Duration</span>
                  <span className="pkg-spec-val">{pkg.duration}</span>
                </div>
                <div className="pkg-spec-row">
                  <span className="pkg-spec-label">Difficulty</span>
                  <span className="pkg-spec-val">{pkg.difficulty}</span>
                </div>
                <div className="pkg-spec-row">
                  <span className="pkg-spec-label">Stay</span>
                  <span className="pkg-spec-val" style={{ fontSize: '0.8rem' }}>{pkg.accommodation}</span>
                </div>
                <div className="pkg-spec-row">
                  <span className="pkg-spec-label">Guide</span>
                  <span className="pkg-spec-val" style={{ fontSize: '0.8rem' }}>{pkg.guide}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pkg-card-footer">
                <div className="pkg-price-group">
                  {pkg.originalPrice && (
                    <span className="pkg-original-price">${pkg.originalPrice}</span>
                  )}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
                    <span className="pkg-price-amount">${pkg.price}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>/ Climber</span>
                  </div>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleCardClick(pkg)}
                >
                  <span>View Details</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Embedded Package Comparison Matrix */}
        <PackageComparison onSelectPackage={onSelectPackage} />
      </div>
    </section>
  );
}
