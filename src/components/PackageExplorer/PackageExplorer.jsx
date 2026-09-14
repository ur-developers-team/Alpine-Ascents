import React, { useState } from 'react';
import packagesData from '../../data/packages.json';
import { useWishlist } from '../../context/WishlistContext';
import { useUserProfile } from '../../context/UserProfileContext';
import {
  Compass, MapPin, Calendar, Heart, Shield, ArrowRight,
  Check, ChevronDown, ChevronUp, Layers, SlidersHorizontal, Sparkles, X,
  Home, Utensils, Truck, Mountain, Users, Tag
} from 'lucide-react';
import PackageComparison from './PackageComparison';
import './PackageExplorer.css';

export default function PackageExplorer({ onSelectPackage, onOpenTripBuilder, initialFilter }) {
  const [selectedDestination, setSelectedDestination] = useState('ALL');
  const [selectedDuration, setSelectedDuration] = useState('ALL');
  const [selectedBudget, setSelectedBudget] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedSeason, setSelectedSeason] = useState('ALL');

  const [expandedPackageId, setExpandedPackageId] = useState(null);
  const [comparisonList, setComparisonList] = useState([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);

  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addRecentlyViewed } = useUserProfile();

  // Extract unique destinations for filter
  const destinationsList = [
    'ALL',
    'Hunza Valley',
    'Skardu & Baltistan',
    'Gilgit & Confluence',
    'K2 & Concordia',
    'Fairy Meadows & Nanga Parbat',
    'Deosai National Park',
    'Naltar Valley',
    'Kaghan & Babusar',
    'Swat Valley'
  ];

  // Filtering logic across all 6 dimensions
  const filteredPackages = packagesData.filter(pkg => {
    // 1. Destination
    if (selectedDestination !== 'ALL') {
      const destMatch = pkg.destinationName.toLowerCase().includes(selectedDestination.split(' ')[0].toLowerCase()) ||
                        pkg.name.toLowerCase().includes(selectedDestination.split(' ')[0].toLowerCase());
      if (!destMatch) return false;
    }

    // 2. Duration
    if (selectedDuration === 'short' && pkg.durationDays > 5) return false;
    if (selectedDuration === 'medium' && (pkg.durationDays < 6 || pkg.durationDays > 9)) return false;
    if (selectedDuration === 'long' && (pkg.durationDays < 10 || pkg.durationDays > 18)) return false;
    if (selectedDuration === 'siege' && pkg.durationDays < 19) return false;

    // 3. Budget
    if (selectedBudget === 'budget' && pkg.price > 800) return false;
    if (selectedBudget === 'standard' && (pkg.price < 800 || pkg.price > 1600)) return false;
    if (selectedBudget === 'luxury' && (pkg.price < 1600 || pkg.price > 2500)) return false;
    if (selectedBudget === 'unlimited' && pkg.price < 2500) return false;

    // 4. Difficulty
    if (selectedDifficulty !== 'ALL' && !pkg.difficulty.toLowerCase().includes(selectedDifficulty.toLowerCase())) {
      return false;
    }

    // 5. Travel Type
    if (selectedType !== 'ALL' && !pkg.type.toUpperCase().includes(selectedType.toUpperCase())) {
      return false;
    }

    // 6. Season
    if (selectedSeason !== 'ALL') {
      const seasonText = `${pkg.bestSeason || ''} ${pkg.overview || ''}`.toLowerCase();
      if (!seasonText.includes(selectedSeason.toLowerCase())) return false;
    }

    return true;
  });

  const toggleCompare = (pkg) => {
    if (comparisonList.some(p => p.id === pkg.id)) {
      setComparisonList(prev => prev.filter(p => p.id !== pkg.id));
    } else {
      if (comparisonList.length >= 3) {
        alert('You can compare a maximum of 3 expedition packages at once.');
        return;
      }
      setComparisonList(prev => [...prev, pkg]);
    }
  };

  const handleSelect = (pkg) => {
    addRecentlyViewed(pkg, 'package');
    if (onSelectPackage) {
      onSelectPackage(pkg);
    }
  };

  const toggleRowExpand = (id) => {
    setExpandedPackageId(prev => (prev === id ? null : id));
  };

  const handleResetFilters = () => {
    setSelectedDestination('ALL');
    setSelectedDuration('ALL');
    setSelectedBudget('ALL');
    setSelectedDifficulty('ALL');
    setSelectedType('ALL');
    setSelectedSeason('ALL');
  };

  return (
    <section id="expeditions" className="section pkg-explorer-section" aria-label="Expedition Package Explorer">
      <div className="site-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Compass size={14} />
            <span>AUTHENTIC EXPEDITION INVENTORY</span>
          </div>
          <h2 className="section-title">EXPEDITION PACKAGE EXPLORER</h2>
          <p className="section-subtitle">
            Curated mountain itineraries with strict high-altitude safety ratios, accredited UIAGM leaders, transparent logistics, and progressive acclimatization profiles.
          </p>
        </div>

        {/* 6 Clean Dropdown Filters Bar (Requirement 12: Destination, Duration, Budget, Difficulty, Travel Type, Season) */}
        <div className="pkg-clean-filter-bar" role="search" aria-label="Expedition Filters">
          {/* 1. Destination */}
          <div className="filter-dropdown-wrap">
            <label>Destination:</label>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="clean-filter-select"
            >
              {destinationsList.map(d => (
                <option key={d} value={d}>{d === 'ALL' ? 'All Destinations' : d}</option>
              ))}
            </select>
          </div>

          {/* 2. Duration */}
          <div className="filter-dropdown-wrap">
            <label>Duration:</label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="clean-filter-select"
            >
              <option value="ALL">All Durations</option>
              <option value="short">Express (3-5 Days)</option>
              <option value="medium">Standard (6-9 Days)</option>
              <option value="long">Deep Route (10-18 Days)</option>
              <option value="siege">High Siege (19+ Days)</option>
            </select>
          </div>

          {/* 3. Budget */}
          <div className="filter-dropdown-wrap">
            <label>Budget:</label>
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="clean-filter-select"
            >
              <option value="ALL">All Budgets</option>
              <option value="budget">Under $800</option>
              <option value="standard">$800 - $1,600</option>
              <option value="luxury">$1,600 - $2,500</option>
              <option value="unlimited">$2,500+</option>
            </select>
          </div>

          {/* 4. Difficulty */}
          <div className="filter-dropdown-wrap">
            <label>Difficulty:</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="clean-filter-select"
            >
              <option value="ALL">All Difficulties</option>
              <option value="easy">Easy / Family</option>
              <option value="moderate">Moderate</option>
              <option value="challenging">Challenging / High Trek</option>
              <option value="technical">Technical Mountaineering</option>
            </select>
          </div>

          {/* 5. Travel Type */}
          <div className="filter-dropdown-wrap">
            <label>Travel Type:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="clean-filter-select"
            >
              <option value="ALL">All Travel Types</option>
              <option value="FAMILY">Family Adventures</option>
              <option value="LUXURY">Luxury & Couple</option>
              <option value="TREKKING">Glacier Trekking</option>
              <option value="EXPEDITION PRO">Peak Climbing</option>
              <option value="CAMPING">Wilderness Camping</option>
              <option value="PHOTOGRAPHY">Photography</option>
            </select>
          </div>

          {/* 6. Season */}
          <div className="filter-dropdown-wrap">
            <label>Season:</label>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="clean-filter-select"
            >
              <option value="ALL">All Seasons</option>
              <option value="summer">Summer (Jun - Aug)</option>
              <option value="autumn">Autumn (Sep - Oct)</option>
              <option value="spring">Spring (Apr - May)</option>
              <option value="winter">Winter Window</option>
            </select>
          </div>

          {/* Compare Trigger / Reset */}
          <div className="filter-actions-wrap">
            <button
              className={`btn btn-sm ${comparisonList.length > 0 ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setShowComparisonModal(true)}
              disabled={comparisonList.length === 0}
              title="Compare selected packages"
            >
              <Layers size={13} />
              <span>Compare ({comparisonList.length})</span>
            </button>
          </div>
        </div>

        {/* Large Horizontal Package Rows (Accordion Editorial Experience — Requirement 11) */}
        <div className="pkg-horizontal-rows-stack">
          {filteredPackages.length === 0 ? (
            <div className="pkg-empty-state">
              <Compass size={40} color="var(--text-muted)" />
              <h3>No expeditions match these criteria</h3>
              <p>Try broadening your filters or reset to view all packages.</p>
              <button className="btn btn-outline btn-sm" onClick={handleResetFilters}>
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredPackages.map(pkg => {
              const isSaved = isWishlisted(pkg.id);
              const isComparing = comparisonList.some(p => p.id === pkg.id);
              const isExpanded = expandedPackageId === pkg.id;

              return (
                <div
                  key={pkg.id}
                  className={`pkg-editorial-row ${isExpanded ? 'is-expanded' : ''}`}
                  id={`pkg-row-${pkg.id}`}
                >
                  {/* Top Horizontal Row Header */}
                  <div className="pkg-row-summary" onClick={() => toggleRowExpand(pkg.id)}>
                    <div className="pkg-row-lead">
                      <div className="pkg-row-tags">
                        <span className="pkg-type-tag">{pkg.type}</span>
                        <span className="pkg-diff-tag">
                          <Shield size={11} />
                          <span>{pkg.difficulty}</span>
                        </span>
                        {pkg.discountPercent && (
                          <span className="pkg-disc-tag">{pkg.discountPercent}% OFF</span>
                        )}
                      </div>
                      <h3 className="pkg-row-heading">{pkg.name}</h3>
                      <div className="pkg-row-subline">
                        <span><MapPin size={12} /> {pkg.destinationName}</span>
                        <span className="sep">•</span>
                        <span><Calendar size={12} /> {pkg.duration}</span>
                      </div>
                    </div>

                    <div className="pkg-row-telemetry">
                      <div className="telemetry-cell">
                        <span className="t-label">DURATION</span>
                        <span className="t-val">{pkg.durationDays} Days</span>
                      </div>
                      <div className="telemetry-cell">
                        <span className="t-label">CATEGORY</span>
                        <span className="t-val">{pkg.type.split('/')[0]}</span>
                      </div>
                      <div className="telemetry-cell price-cell">
                        <span className="t-label">FROM</span>
                        <span className="t-price">${pkg.price} <small>/ person</small></span>
                      </div>
                    </div>

                    <div className="pkg-row-cta-col">
                      <button
                        className="btn btn-outline btn-sm pkg-view-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRowExpand(pkg.id);
                        }}
                      >
                        <span>{isExpanded ? 'CLOSE DETAILS' : 'VIEW DETAILS'}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      <button
                        className="btn btn-primary btn-sm pkg-book-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(pkg);
                        }}
                      >
                        <span>BOOK NOW</span>
                      </button>

                      <div className="pkg-mini-icons" onClick={e => e.stopPropagation()}>
                        <button
                          className={`btn-icon-tiny ${isComparing ? 'active' : ''}`}
                          onClick={() => toggleCompare(pkg)}
                          title="Compare this package"
                        >
                          <Layers size={13} />
                        </button>
                        <button
                          className={`btn-icon-tiny ${isSaved ? 'active' : ''}`}
                          onClick={() => toggleWishlist(pkg, 'package')}
                          title="Save to Alpine Passport"
                        >
                          <Heart size={13} fill={isSaved ? '#f43f5e' : 'none'} color={isSaved ? '#f43f5e' : 'currentColor'} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Row Panel (Itinerary, Food, Shelter, Transport, Activities, Guide, Included, Excluded, Discount) */}
                  {isExpanded && (
                    <div className="pkg-expanded-drawer animate-fade-in">
                      <div className="pkg-drawer-inner">
                        {/* 1. Overview */}
                        <p className="pkg-drawer-overview">{pkg.overview}</p>

                        {/* 2. Specs Matrix: Food, Shelter, Transport, Guide, Activities, Discount */}
                        <div className="pkg-specs-matrix">
                          <div className="spec-matrix-box">
                            <Home size={15} color="var(--accent)" />
                            <div>
                              <strong>Shelter & Stay:</strong>
                              <span>{pkg.accommodation}</span>
                            </div>
                          </div>

                          <div className="spec-matrix-box">
                            <Utensils size={15} color="var(--accent)" />
                            <div>
                              <strong>Food Plan:</strong>
                              <span>{pkg.meals}</span>
                            </div>
                          </div>

                          <div className="spec-matrix-box">
                            <Truck size={15} color="var(--accent)" />
                            <div>
                              <strong>Transport:</strong>
                              <span>Private 4x4 Mountain Prado / Jeep</span>
                            </div>
                          </div>

                          <div className="spec-matrix-box">
                            <Mountain size={15} color="var(--accent)" />
                            <div>
                              <strong>Certified Guide:</strong>
                              <span>{pkg.guide || 'Accredited UIAGM/Local Sirdar'}</span>
                            </div>
                          </div>

                          <div className="spec-matrix-box">
                            <Tag size={15} color="var(--accent-gold)" />
                            <div>
                              <strong>Special Discount:</strong>
                              <span>{pkg.discountPercent ? `${pkg.discountPercent}% Early Planning Privilege` : 'Standard Rate Guarantee'}</span>
                            </div>
                          </div>
                        </div>

                        {/* 3. Day-by-Day Itinerary */}
                        <div className="pkg-itinerary-block">
                          <h4>DAY-BY-DAY ROUTE ITINERARY</h4>
                          <div className="itinerary-timeline-list">
                            {pkg.itineraryDays && pkg.itineraryDays.map((day, idx) => (
                              <div key={idx} className="itinerary-day-row">
                                <span className="day-badge">Day {day.day}</span>
                                <div className="day-details-wrap">
                                  <div className="day-title">{day.title}</div>
                                  <div className="day-text">{day.details}</div>
                                  <div className="day-logistics">
                                    <span>🏨 {day.stay}</span>
                                    <span>🍴 {day.meals}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 4. Included & Excluded Columns */}
                        <div className="pkg-inc-exc-grid">
                          <div className="inc-column">
                            <h5>✦ WHAT IS INCLUDED:</h5>
                            <div className="inc-items-list">
                              {pkg.included && pkg.included.map((inc, i) => (
                                <div key={i} className="inc-row">
                                  <Check size={13} color="#10b981" />
                                  <span>{inc}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="exc-column">
                            <h5>✕ WHAT IS EXCLUDED:</h5>
                            <div className="inc-items-list">
                              {pkg.notIncluded && pkg.notIncluded.map((notInc, i) => (
                                <div key={i} className="exc-row">
                                  <X size={13} color="#ef4444" />
                                  <span>{notInc}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* 5. Bottom Action Bar */}
                        <div className="pkg-drawer-bottom-bar">
                          <div className="drawer-price-info">
                            <span className="price-label">Transparent Expedition Investment:</span>
                            <span className="price-number">${pkg.price} USD</span>
                            {pkg.originalPrice && <span className="price-old">${pkg.originalPrice}</span>}
                          </div>

                          <button
                            className="btn btn-primary pkg-request-cta"
                            onClick={() => handleSelect(pkg)}
                          >
                            <span>Request This Expedition</span>
                            <ArrowRight size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Comparison Modal Overlay */}
        {showComparisonModal && (
          <div className="modal-overlay" onClick={() => setShowComparisonModal(false)}>
            <div className="modal-content pkg-compare-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="pkg-compare-modal-header">
                <h3>EXPEDITION COMPARISON MATRIX</h3>
                <button className="modal-close-btn" onClick={() => setShowComparisonModal(false)}>
                  <X size={18} />
                </button>
              </div>
              <div className="pkg-compare-modal-body">
                <PackageComparison
                  packages={comparisonList}
                  onClose={() => setShowComparisonModal(false)}
                  onSelectPackage={(p) => {
                    setShowComparisonModal(false);
                    handleSelect(p);
                  }}
                  onRemoveFromComparison={(pkgId) => {
                    setComparisonList(prev => prev.filter(p => p.id !== pkgId));
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
