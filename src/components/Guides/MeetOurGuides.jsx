import React, { useState } from 'react';
import guidesData from '../../data/guides.json';
import {
  Compass, Award, MapPin, Shield, Check, Star, ArrowRight,
  Languages, Sparkles, X, ChevronRight, UserCheck, Calendar, Activity
} from 'lucide-react';
import './MeetOurGuides.css';

export default function MeetOurGuides({ onOpenPlanModal }) {
  const [filter, setFilter] = useState('ALL');
  const [activeGuideDrawer, setActiveGuideDrawer] = useState(null);

  const filterOptions = [
    { key: 'ALL', label: 'All Expedition Leaders' },
    { key: 'HUNZA', label: 'Hunza & Nagar' },
    { key: 'SKARDU', label: 'Skardu & Baltistan' },
    { key: 'K2', label: 'K2 & Concordia' },
    { key: 'TREKKING', label: 'Glacier Trekking' },
    { key: 'FAMILY', label: 'Family & Heritage' },
    { key: 'MOUNTAINEERING', label: 'High Climbs' }
  ];

  const filteredGuides = guidesData.filter(guide => {
    if (filter === 'ALL') return true;
    if (filter === 'HUNZA') return guide.destinations?.includes('hunza') || guide.region.toLowerCase().includes('hunza');
    if (filter === 'SKARDU') return guide.destinations?.includes('skardu') || guide.region.toLowerCase().includes('skardu');
    if (filter === 'K2') return guide.destinations?.includes('k2-region') || guide.region.toLowerCase().includes('concordia');
    if (filter === 'TREKKING') return guide.expeditionTypes?.some(t => t.toLowerCase().includes('trekking'));
    if (filter === 'FAMILY') return guide.expeditionTypes?.some(t => t.toLowerCase().includes('family') || t.toLowerCase().includes('cultural'));
    if (filter === 'MOUNTAINEERING') return guide.expeditionTypes?.some(t => t.toLowerCase().includes('mountain') || t.toLowerCase().includes('siege'));
    return true;
  });

  const handleOpenDrawer = (guide) => {
    setActiveGuideDrawer(guide);
  };

  const handleCloseDrawer = () => {
    setActiveGuideDrawer(null);
  };

  const handleRequestGuide = (guide) => {
    setActiveGuideDrawer(null);
    if (onOpenPlanModal) {
      onOpenPlanModal({
        preferredGuide: guide.name,
        destinationName: guide.region
      });
    }
  };

  return (
    <section id="guides" className="section guides-master-section" aria-label="Meet Your Expedition Team">
      <div className="site-container">
        {/* Editorial Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Award size={14} />
            <span>ACCREDITED HIGH-ALTITUDE LEADERSHIP</span>
          </div>
          <h2 className="section-title">MEET YOUR EXPEDITION TEAM</h2>
          <p className="section-subtitle">
            World-standard UIAGM/IFMGA certified alpine instructors paired with storied Balti and Hunzakut high-altitude Sirdars. Every guide is vetted for extreme high-altitude safety and local cultural depth.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="guides-filter-bar" role="tablist" aria-label="Filter guides by domain">
          {filterOptions.map(opt => (
            <button
              key={opt.key}
              className={`guides-filter-chip ${filter === opt.key ? 'active' : ''}`}
              onClick={() => setFilter(opt.key)}
              role="tab"
              aria-selected={filter === opt.key}
            >
              <span>{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Large Editorial Horizontal Guide Rows (Zero Card Grids — Requirement 14) */}
        <div className="guides-editorial-rows-stack">
          {filteredGuides.map(guide => (
            <div
              key={guide.id}
              className="guide-editorial-row"
              onClick={() => handleOpenDrawer(guide)}
            >
              {/* Large Guide Portrait */}
              <div className="guide-portrait-column">
                <div className="portrait-wrap">
                  <img
                    src={guide.image}
                    alt={guide.name}
                    className="guide-portrait-img"
                    loading="lazy"
                  />
                  <div className="guide-exp-badge">
                    <strong>{guide.experienceYears}+</strong>
                    <span>YRS EXP</span>
                  </div>
                </div>
              </div>

              {/* Main Credentials & Bio */}
              <div className="guide-details-column">
                <div className="guide-header-line">
                  <div>
                    <span className="guide-status-text">{guide.status}</span>
                    <h3 className="guide-name">{guide.name}</h3>
                    <div className="guide-role-title">{guide.role}</div>
                  </div>

                  <div className="guide-meta-pills">
                    <span className="meta-pill">
                      <MapPin size={12} color="var(--accent)" />
                      <span>{guide.region}</span>
                    </span>
                    <span className="meta-pill">
                      <Languages size={12} color="var(--accent)" />
                      <span>{guide.languages.join(', ')}</span>
                    </span>
                  </div>
                </div>

                {/* Key Telemetry: Summits & Destinations */}
                <div className="guide-telemetry-grid">
                  <div className="telemetry-block">
                    <span className="t-head">KEY DESTINATIONS LED</span>
                    <span className="t-body">
                      {guide.destinations.map(d => d.replace(/-/g, ' ').toUpperCase()).join(' • ')}
                    </span>
                  </div>

                  <div className="telemetry-block">
                    <span className="t-head">APEX SUMMITS & SEASONS</span>
                    <span className="t-body">{guide.summits}</span>
                  </div>
                </div>

                <p className="guide-bio-excerpt">{guide.bio}</p>

                {/* Specialization Tags */}
                <div className="guide-specialties-row">
                  {guide.specialties.slice(0, 4).map((spec, i) => (
                    <span key={i} className="spec-badge">
                      <Check size={11} color="#10b981" />
                      <span>{spec}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Column */}
              <div className="guide-actions-column" onClick={e => e.stopPropagation()}>
                <button
                  className="btn btn-outline btn-sm guide-dossier-btn"
                  onClick={() => handleOpenDrawer(guide)}
                >
                  <span>VIEW DOSSIER</span>
                  <ChevronRight size={14} />
                </button>

                <button
                  className="btn btn-primary btn-sm guide-request-btn"
                  onClick={() => handleRequestGuide(guide)}
                >
                  <span>REQUEST GUIDE</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Leadership Commitment Strip */}
        <div className="guides-commitment-banner">
          <div className="commitment-icon">
            <Sparkles size={24} color="var(--accent-gold)" />
          </div>
          <div className="commitment-text">
            <h4>100% Ethical High-Altitude Porter & Guide Welfare Charter</h4>
            <p>
              Alpine Ascents adheres rigorously to International Mountain Explorers Connection (IMEC) and IPPG protocols. All leaders and porters receive certified mountaineering equipment, comprehensive emergency medical evacuation insurance, and fair living compensation.
            </p>
          </div>
        </div>

        {/* Guide Profile Side Drawer (Requirement 14) */}
        {activeGuideDrawer && (
          <div className="drawer-overlay" onClick={handleCloseDrawer}>
            <div
              className="guide-profile-drawer animate-slide-left"
              onClick={e => e.stopPropagation()}
            >
              {/* Drawer Close */}
              <button
                className="drawer-close-btn"
                onClick={handleCloseDrawer}
                aria-label="Close Guide Profile"
              >
                <X size={20} />
              </button>

              <div className="drawer-scroll-body">
                {/* Hero Profile */}
                <div className="drawer-profile-hero">
                  <img
                    src={activeGuideDrawer.image}
                    alt={activeGuideDrawer.name}
                    className="drawer-hero-img"
                  />
                  <div className="drawer-hero-meta">
                    <span className="drawer-status-badge">{activeGuideDrawer.status}</span>
                    <h3 className="drawer-guide-name">{activeGuideDrawer.name}</h3>
                    <div className="drawer-guide-role">{activeGuideDrawer.role}</div>
                    <div className="drawer-guide-loc">
                      <MapPin size={13} color="var(--accent)" />
                      <span>{activeGuideDrawer.region}, {activeGuideDrawer.country}</span>
                    </div>
                  </div>
                </div>

                {/* Drawer Experience Quick Facts */}
                <div className="drawer-facts-grid">
                  <div className="fact-box">
                    <span className="fact-num">{activeGuideDrawer.experienceYears}+</span>
                    <span className="fact-label">Years Mountain Experience</span>
                  </div>
                  <div className="fact-box">
                    <span className="fact-num">{activeGuideDrawer.languages.length}</span>
                    <span className="fact-label">Languages Spoken</span>
                  </div>
                  <div className="fact-box">
                    <span className="fact-num">100%</span>
                    <span className="fact-label">Safety Compliance</span>
                  </div>
                </div>

                {/* Biography */}
                <div className="drawer-section-block">
                  <h4>EXPEDITION BIOGRAPHY</h4>
                  <p>{activeGuideDrawer.bio}</p>
                </div>

                {/* Summits Log */}
                <div className="drawer-section-block">
                  <h4>SUMMITS & EXPEDITION LOG</h4>
                  <div className="drawer-log-box">
                    <Award size={16} color="var(--accent-gold)" />
                    <span>{activeGuideDrawer.summits}</span>
                  </div>
                </div>

                {/* Technical Skills & Certifications */}
                <div className="drawer-section-block">
                  <h4>TECHNICAL SKILLS & CERTIFICATIONS</h4>
                  <div className="drawer-skills-list">
                    {activeGuideDrawer.skills?.map((skill, idx) => (
                      <div key={idx} className="drawer-skill-item">
                        <Check size={13} color="#10b981" />
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="drawer-section-block">
                  <h4>LANGUAGES FLUENCY</h4>
                  <div className="drawer-languages-row">
                    {activeGuideDrawer.languages.map((lang, idx) => (
                      <span key={idx} className="lang-tag">{lang}</span>
                    ))}
                  </div>
                </div>

                {/* Key Destinations Led */}
                <div className="drawer-section-block">
                  <h4>DOMAINS & SIGNATURE ROUTES</h4>
                  <div className="drawer-domains-row">
                    {activeGuideDrawer.destinations.map((dest, idx) => (
                      <span key={idx} className="dest-tag">
                        <MapPin size={11} />
                        <span>{dest.replace(/-/g, ' ').toUpperCase()}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Sticky Action */}
                <div className="drawer-bottom-cta">
                  <button
                    className="btn btn-primary btn-block drawer-action-btn"
                    onClick={() => handleRequestGuide(activeGuideDrawer)}
                  >
                    <span>REQUEST EXPEDITION WITH {activeGuideDrawer.name.toUpperCase()}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
