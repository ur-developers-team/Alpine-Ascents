import React, { useState } from 'react';
import sheltersData from '../../data/shelters.json';
import { Home, Mountain, Check, Sparkles, ChevronDown, ChevronUp, DollarSign } from 'lucide-react';
import './Experiences.css';

export default function StayExperience() {
  const [activeTab, setActiveTab] = useState('shelter-geodesic-pro');

  const tabs = [
    { id: 'shelter-basic-camp', label: 'Camp', title: 'Wilderness Base Camp' },
    { id: 'shelter-geodesic-pro', label: 'Base Camp', title: '4-Season Geodesic Dome' },
    { id: 'shelter-alpine-hut', label: 'Mountain Shelter', title: 'Stone Alpine Mountain Refuge' },
    { id: 'shelter-glamping-dome', label: 'Glamping Camp', title: 'Lakeview Heated Glamping Dome' },
    { id: 'shelter-heritage-fort', label: 'Hotel / Palace', title: 'Silk Road Royal Fort Palace' }
  ];

  const currentShelter = sheltersData.find(s => s.id === activeTab) || sheltersData[0];

  return (
    <div className="stay-experience-wrap">
      <div className="exp-module-header">
        <span className="exp-module-eyebrow">HIGH-ALTITUDE HABITAT & SHELTER</span>
        <h3 className="exp-module-title">WHERE WILL YOU STAY?</h3>
        <p className="exp-module-desc">
          Click an accommodation tier below to inspect engineered shelters, from 4-season hurricane domes pitched on glacial moraines to 400-year-old restored Tibetan royal suites.
        </p>
      </div>

      {/* Interactive Tabs */}
      <div className="stay-tabs-bar" role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`stay-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            <Home size={15} />
            <span>[ {tab.label} ]</span>
          </button>
        ))}
      </div>

      {/* Expandable Module Content */}
      <div className="stay-showcase-card animate-fade-in">
        <div className="stay-showcase-header">
          <div>
            <span className="stay-tier-badge">{currentShelter.tier}</span>
            <h4 className="stay-name">{currentShelter.name}</h4>
          </div>
          <div className="stay-price-pill">
            <span className="stay-price-val">${currentShelter.pricePerNight}</span>
            <span className="stay-price-unit">/ night est.</span>
          </div>
        </div>

        <div className="stay-meta-row">
          <span className="stay-alt-badge">
            <Mountain size={13} />
            <span>Operational Elevation: {currentShelter.altitudeRange}</span>
          </span>
          <span className="stay-tested-badge">
            <Sparkles size={13} />
            <span>{currentShelter.badge}</span>
          </span>
        </div>

        <p className="stay-description">{currentShelter.description}</p>

        {/* Features & Amenities */}
        <div className="stay-features-block">
          <span className="features-header-label">ENGINEERED AMENITIES & PROTOCOLS:</span>
          <div className="stay-features-grid">
            {currentShelter.features && currentShelter.features.map((feat, i) => (
              <div key={i} className="stay-feature-item">
                <Check size={14} color="var(--accent)" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
