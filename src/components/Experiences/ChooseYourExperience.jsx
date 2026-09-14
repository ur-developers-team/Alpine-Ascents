import React, { useState } from 'react';
import MountainExplorer from './MountainExplorer';
import StayExperience from './StayExperience';
import DiningExperience from './DiningExperience';
import TransportExperience from '../FoodAndTransport/TransportExperience';
import GilgitBaltistanSection from '../GilgitBaltistan/GilgitBaltistanSection';
import {
  Compass, Mountain, Home, Utensils, Truck, MapPin, ArrowRight,
  Sparkles, Camera, Tent, Users, Crown, Footprints, Shield
} from 'lucide-react';
import './Experiences.css';

import experiencesData from '../../data/experiences.json';

const ICON_MAP = {
  Footprints,
  Mountain,
  Tent,
  Camera,
  Users,
  Crown,
  Compass
};

const EXPERIENCES_CATALOG = experiencesData.experiences;


export default function ChooseYourExperience({ onSelectDestination, onOpenTripBuilder }) {
  const [activeSubTab, setActiveSubTab] = useState('experiences');

  const subTabs = [
    { id: 'experiences', label: 'Choose Your Experience', icon: Compass },
    { id: 'mountains', label: 'Mountain Summits', icon: Mountain },
    { id: 'stay', label: 'Where You\'ll Stay', icon: Home },
    { id: 'dining', label: 'What You\'ll Eat', icon: Utensils },
    { id: 'transport', label: 'How You\'ll Travel', icon: Truck },
    { id: 'regions', label: 'Northern Valleys & Hubs', icon: MapPin }
  ];

  const handleScrollToPackages = (filterKey) => {
    const el = document.querySelector('#expeditions');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="experiences" className="section experiences-master-section" aria-label="Choose Your Adventure">
      <div className="site-container">
        {/* Editorial Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Compass size={14} />
            <span>EXPEDITION ARCHETYPES</span>
          </div>
          <h2 className="section-title">CHOOSE YOUR ADVENTURE</h2>
          <p className="section-subtitle">
            From high-altitude glacial trekking and eight-thousander sieges to family heritage escapes and starlit wilderness camping. Select your adventure archetype to view tailored expedition dossiers.
          </p>
        </div>

        {/* Dynamic Sub-Module Display */}
        <div className="exp-active-content">
          <div className="signature-experiences-stack animate-fade-in">
            <div className="adventure-strips-container">
              {EXPERIENCES_CATALOG.slice(0, 6).map((exp, idx) => {
                const Icon = ICON_MAP[exp.icon] || Compass;
                return (
                  <div
                    key={exp.id}
                    className="adventure-visual-strip"
                    onClick={() => handleScrollToPackages(exp.filterKey)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${exp.title} Adventure`}
                  >
                    <div className="adventure-strip-bg">
                      <img
                        src={exp.image}
                        alt={exp.title}
                        className="adventure-strip-img"
                        loading="lazy"
                      />
                      <div className="adventure-strip-overlay" />
                    </div>

                    <div className="adventure-strip-content">
                      <div className="adventure-strip-top">
                        <span className="adventure-strip-badge">
                          <Icon size={14} />
                          <span>{exp.badge}</span>
                        </span>
                        <span className="adventure-strip-idx">0{idx + 1}</span>
                      </div>

                      <div className="adventure-strip-main">
                        <h3 className="adventure-strip-title">{exp.title}</h3>
                        <p className="adventure-strip-tagline">{exp.tagline}</p>
                        <p className="adventure-strip-desc">{exp.description}</p>

                        <div className="adventure-strip-highlights">
                          {exp.highlights.map((h, i) => (
                            <span key={i} className="adventure-hl-pill">✦ {h}</span>
                          ))}
                        </div>
                      </div>

                      <div className="adventure-strip-footer">
                        <button
                          className="btn btn-primary btn-sm adventure-select-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleScrollToPackages(exp.filterKey);
                          }}
                        >
                          <span>Explore {exp.title} Packages</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
