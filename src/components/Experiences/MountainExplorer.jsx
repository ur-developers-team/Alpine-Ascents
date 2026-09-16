import React, { useState } from 'react';
import mountainsData from '../../data/mountains.json';
import { Mountain, MapPin, Calendar, Shield, ArrowRight, Layers, Heart, ChevronDown, ChevronUp, Compass, Sparkles, Scale } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import MountainComparisonModal from '../MountainFinder/MountainComparisonModal';
import './Experiences.css';

export default function MountainExplorer() {
  const [activePeakId, setActivePeakId] = useState('k2');
  const [expandedFacts, setExpandedFacts] = useState(false);
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const { toggleWishlist, isWishlisted } = useWishlist();

  // Prominent switchable peaks directly driven from mountainsData
  const featuredPeaks = mountainsData.filter(m => m.featured);
  const currentMountain = mountainsData.find(m => m.id === activePeakId) || mountainsData[0];
  const isSaved = isWishlisted(currentMountain.id);

  const toggleCompare = (mountain) => {
    if (compareList.some(m => m.id === mountain.id)) {
      setCompareList(prev => prev.filter(m => m.id !== mountain.id));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare a maximum of 3 mountains simultaneously.');
        return;
      }
      setCompareList(prev => [...prev, mountain]);
    }
  };

  const nextMountain = () => {
    const currentIndex = featuredPeaks.findIndex(m => m.id === activePeakId);
    const nextIndex = (currentIndex + 1) % featuredPeaks.length;
    setActivePeakId(featuredPeaks[nextIndex].id);
    setExpandedFacts(false);
  };

  const prevMountain = () => {
    const currentIndex = featuredPeaks.findIndex(m => m.id === activePeakId);
    const prevIndex = (currentIndex - 1 + featuredPeaks.length) % featuredPeaks.length;
    setActivePeakId(featuredPeaks[prevIndex].id);
    setExpandedFacts(false);
  };

  return (
    <section id="mountains" className="section mountain-explorer-section" aria-label="Mountain Summits Showcase">
      <div className="site-container">
        {/* Editorial Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Mountain size={14} />
            <span>GLOBAL APEX SUMMITS</span>
          </div>
          <h2 className="section-title">THE EIGHT-THOUSANDERS & ICONIC PEAKS</h2>
          <p className="section-subtitle">
            Explore legendary apexes of the Karakoram and Himalaya with verified technical ascent beta, real-time elevation telemetry, and route difficulty analysis.
          </p>
        </div>

        <div className="mountain-explorer-wrap">
          {/* Mountain Switcher Tabs */}
          <div className="mountain-switcher-bar" role="tablist" aria-label="Select Mountain Summit">
        {featuredPeaks.map(peak => (
          <button
            key={peak.id}
            className={`mountain-switch-btn ${peak.id === activePeakId ? 'active' : ''}`}
            onClick={() => {
              setActivePeakId(peak.id);
              setExpandedFacts(false);
            }}
            role="tab"
            aria-selected={peak.id === activePeakId}
          >
            <Mountain size={14} />
            <span>{peak.name.split(' ')[0]}</span>
            <span className="switch-alt-badge">{peak.altitudeFormatted ? peak.altitudeFormatted.split(' ')[0] : `${peak.altitude}m`}</span>
          </button>
        ))}
      </div>

      {/* Large Visual Mountain Showcase (Asymmetric Editorial Section, No Boring Card Grid) */}
      <div className="mountain-hero-stage">
        <div className="mountain-hero-media">
          <img
            src={currentMountain.image}
            alt={currentMountain.name}
            className="mountain-hero-img"
            loading="lazy"
          />
          <div className="mountain-hero-overlay" />

          {/* Floating Save Button */}
          <button
            className={`btn-save mountain-save-btn ${isSaved ? 'active' : ''}`}
            onClick={() => toggleWishlist(currentMountain, 'mountain')}
            title="Save Peak to Passport"
            aria-label="Save Mountain"
          >
            <Heart size={18} fill={isSaved ? '#f43f5e' : 'none'} color={isSaved ? '#f43f5e' : '#ffffff'} />
          </button>

          {/* Large Elevation Backdrop Watermark */}
          <div className="mountain-altitude-watermark">
            {currentMountain.altitudeFormatted ? currentMountain.altitudeFormatted.split(' ')[0] : `${currentMountain.altitude}m`}
          </div>

          <div className="mountain-hero-caption">
            <span className="mountain-range-tag">{currentMountain.range} • {currentMountain.country}</span>
            <h2 className="mountain-apex-name">{currentMountain.name}</h2>
          </div>
        </div>

        {/* Mountain Technical Intel Dossier */}
        <div className="mountain-hero-intel">
          {/* Quick Metrics Grid */}
          <div className="mountain-metrics-grid">
            <div className="mountain-metric-cell">
              <span className="m-metric-label">ALTITUDE</span>
              <span className="m-metric-val">{currentMountain.altitudeFormatted || `${currentMountain.altitude}m`}</span>
            </div>
            <div className="mountain-metric-cell">
              <span className="m-metric-label">RANGE</span>
              <span className="m-metric-val">{currentMountain.range}</span>
            </div>
            <div className="mountain-metric-cell">
              <span className="m-metric-label">DIFFICULTY</span>
              <span className="m-metric-val highlight">{currentMountain.difficulty}</span>
            </div>
            <div className="mountain-metric-cell">
              <span className="m-metric-label">BEST SEASON</span>
              <span className="m-metric-val">{currentMountain.bestSeason}</span>
            </div>
          </div>

          <p className="mountain-summary-text">
            {currentMountain.summary || currentMountain.description}
          </p>

          {/* Expandable Technical Facts Accordion */}
          <div className="mountain-expandable-box">
            <button
              className="mountain-expand-trigger"
              onClick={() => setExpandedFacts(!expandedFacts)}
              aria-expanded={expandedFacts}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} color="var(--accent)" />
                <strong>Technical Ascent Beta & Route History</strong>
              </div>
              {expandedFacts ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {expandedFacts && (
              <div className="mountain-facts-panel animate-fade-in">
                <div className="fact-line">
                  <span className="fact-title">First Ascent:</span>
                  <span className="fact-desc">{currentMountain.firstAscent || 'Documented Alpine Expedition'}</span>
                </div>
                <div className="fact-line">
                  <span className="fact-title">Expedition Style:</span>
                  <span className="fact-desc">{currentMountain.expeditionType || 'High-Altitude Siege / Alpine Pro'}</span>
                </div>
                <div className="fact-line">
                  <span className="fact-title">Typical Duration:</span>
                  <span className="fact-desc">{currentMountain.duration || '40 - 55 Days'}</span>
                </div>
                <div className="fact-line">
                  <span className="fact-title">Terrain & Key Hazards:</span>
                  <span className="fact-desc">{currentMountain.terrain || 'Granite buttresses, blue ice gullies, serac fall risk'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="mountain-hero-actions" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                const builderEl = document.querySelector('#trip-builder');
                if (builderEl) builderEl.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>EXPLORE {currentMountain.name.toUpperCase()}</span>
              <ArrowRight size={14} />
            </button>

            <button
              className="btn btn-outline"
              onClick={nextMountain}
              title="Next Mountain"
            >
              <span>NEXT MOUNTAIN →</span>
            </button>

            <button
              className={`btn btn-outline btn-sm ${compareList.some(m => m.id === currentMountain.id) ? 'btn-primary' : ''}`}
              onClick={() => {
                toggleCompare(currentMountain);
                setComparisonModalOpen(true);
              }}
            >
              <Scale size={14} />
              <span>{compareList.some(m => m.id === currentMountain.id) ? 'Comparing' : 'Compare'}</span>
            </button>
          </div>
        </div>
      </div>

        </div>
      </div>

      {/* Comparison Modal */}
      {comparisonModalOpen && (
        <MountainComparisonModal
          comparedMountains={compareList.length > 0 ? compareList : [currentMountain, mountainsData.find(m => m.id === 'nanga-parbat') || mountainsData[1]]}
          onClose={() => setComparisonModalOpen(false)}
          onRemove={(id) => setCompareList(prev => prev.filter(m => m.id !== id))}
        />
      )}
    </section>
  );
}
