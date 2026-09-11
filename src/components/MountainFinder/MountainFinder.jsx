import React, { useState } from 'react';
import mountainsData from '../../data/mountains.json';
import { useWishlist } from '../../context/WishlistContext';
import { Mountain, MapPin, Scale, Heart, ArrowRight, Filter } from 'lucide-react';
import MountainComparisonModal from './MountainComparisonModal';
import './MountainFinder.css';

export default function MountainFinder({ onSelectMountain }) {
  const [minAltitude, setMinAltitude] = useState(3000);
  const [selectedRange, setSelectedRange] = useState('ALL');
  const [comparedMountains, setComparedMountains] = useState([]);
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const { toggleWishlist, isWishlisted } = useWishlist();

  const ranges = ['ALL', 'Karakoram', 'Himalayas', 'Alps', 'Andes'];

  const filteredMountains = mountainsData.filter(m => {
    const altitudeMatch = m.altitude >= minAltitude;
    const rangeMatch = selectedRange === 'ALL' || m.range.toLowerCase().includes(selectedRange.toLowerCase());
    return altitudeMatch && rangeMatch;
  });

  const toggleCompare = (mountain) => {
    if (comparedMountains.some(m => m.id === mountain.id)) {
      setComparedMountains(comparedMountains.filter(m => m.id !== mountain.id));
    } else {
      if (comparedMountains.length >= 3) {
        alert('You can compare a maximum of 3 mountains simultaneously.');
        return;
      }
      setComparedMountains([...comparedMountains, mountain]);
    }
  };

  const removeMountainFromCompare = (id) => {
    setComparedMountains(comparedMountains.filter(m => m.id !== id));
  };

  return (
    <section id="mountain-finder" className="section mountain-finder-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Mountain size={14} />
            <span>OROGRAPHIC DATABASE</span>
          </div>
          <h2 className="section-title">MOUNTAIN FINDER</h2>
          <p className="section-subtitle">
            Explore Earth's most challenging high-altitude massifs. Filter by elevation thresholds, geographic ranges, and compare terrain profiles.
          </p>
        </div>

        {/* Filter Controls Card */}
        <div className="mountain-controls-card">
          <div className="mountain-controls-grid">
            {/* Altitude Slider */}
            <div className="mountain-slider-group">
              <div className="mountain-slider-header">
                <span>MINIMUM ALTITUDE THRESHOLD:</span>
                <strong style={{ color: 'var(--accent)', fontFamily: 'Space Mono, monospace' }}>
                  {minAltitude.toLocaleString()}m+
                </strong>
              </div>
              <input
                type="range"
                className="mountain-slider"
                min="0"
                max="8500"
                step="250"
                value={minAltitude}
                onChange={(e) => setMinAltitude(parseInt(e.target.value, 10))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <span>Sea Level (0m)</span>
                <span>4,000m (Alpine)</span>
                <span>8,000m+ (Death Zone)</span>
              </div>
            </div>

            {/* Range Selector */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem' }}>RANGE FILTER</label>
              <select
                className="form-control"
                value={selectedRange}
                onChange={(e) => setSelectedRange(e.target.value)}
              >
                {ranges.map(r => (
                  <option key={r} value={r}>{r === 'ALL' ? 'All Mountain Ranges' : r}</option>
                ))}
              </select>
            </div>

            {/* Comparison Launcher */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <button
                className={`btn ${comparedMountains.length > 0 ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setComparisonModalOpen(true)}
                disabled={comparedMountains.length === 0}
                style={{ width: '100%' }}
              >
                <Scale size={16} />
                <span>Compare Peaks ({comparedMountains.length}/3)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mountains Grid */}
        <div className="mountain-grid">
          {filteredMountains.map(mountain => {
            const isSelectedForCompare = comparedMountains.some(m => m.id === mountain.id);
            return (
              <div key={mountain.id} className="mountain-card">
                <div className="mountain-card-media">
                  <img
                    src={mountain.image}
                    alt={mountain.name}
                    className="mountain-card-img"
                    loading="lazy"
                  />
                  <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.4rem', zIndex: 2 }}>
                    <span className="hud-tag" style={{ background: 'rgba(7, 12, 18, 0.75)', borderColor: 'var(--accent)' }}>
                      {mountain.altitudeFormatted}
                    </span>
                    <span className="hud-tag">{mountain.range}</span>
                  </div>

                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 2 }}>
                    <button
                      className={`btn-save ${isWishlisted(mountain.id) ? 'active' : ''}`}
                      onClick={() => toggleWishlist(mountain, 'mountain')}
                      title="Save Mountain to Wishlist"
                      aria-label="Save"
                    >
                      <Heart size={16} fill={isWishlisted(mountain.id) ? '#f43f5e' : 'none'} />
                    </button>
                  </div>
                </div>

                <div className="mountain-card-body">
                  <span className="section-eyebrow" style={{ fontSize: '0.7rem', textAlign: 'left', marginBottom: '0.2rem' }}>
                    {mountain.region}, {mountain.country}
                  </span>
                  <h4 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>{mountain.name}</h4>
                  <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>{mountain.summary}</p>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    <div><strong>Difficulty:</strong> {mountain.difficulty}</div>
                    <div><strong>First Ascent:</strong> {mountain.firstAscent}</div>
                  </div>

                  <div className="mountain-compare-btn-row">
                    <button
                      className={`btn btn-sm ${isSelectedForCompare ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => toggleCompare(mountain)}
                      style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                    >
                      <Scale size={13} />
                      <span>{isSelectedForCompare ? 'Selected' : 'Compare'}</span>
                    </button>

                    <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.72rem', color: 'var(--accent)' }}>
                      {mountain.altitude >= 8000 ? 'DEATH ZONE' : 'HIGH ALPINE'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for Mountain Comparison */}
        <MountainComparisonModal
          mountains={comparedMountains}
          isOpen={comparisonModalOpen}
          onClose={() => setComparisonModalOpen(false)}
          onRemoveMountain={removeMountainFromCompare}
        />
      </div>
    </section>
  );
}
