import React, { useState } from 'react';
import guidesData from '../../data/guides.json';
import faqsData from '../../data/faqs.json';
import companyPillarsData from '../../data/companyPillars.json';
import GlacierSlider from '../GlacierComparison/GlacierSlider';
import {
  ShieldCheck, Award, HeartHandshake, Compass, Users, Check,
  ChevronDown, ChevronUp, Radio, Mountain, Sparkles, PhoneCall
} from 'lucide-react';
import './WhyAlpineAscents.css';

const PILLAR_ICON_MAP = {
  Award,
  ShieldCheck,
  HeartHandshake,
  Compass
};

export default function WhyAlpineAscents({ onOpenPlanModal }) {
  const [activeTab, setActiveTab] = useState('safety');
  const [openFaqId, setOpenFaqId] = useState(faqsData[0]?.id || null);

  const pillars = companyPillarsData.map(p => ({
    ...p,
    icon: PILLAR_ICON_MAP[p.icon] || Award
  }));

  const tabs = [
    { id: 'safety', label: 'Safety & Satellite Telemetry', icon: ShieldCheck },
    { id: 'guides', label: 'Meet Your Mountain Guides', icon: Users },
    { id: 'glaciers', label: 'Environmental Glaciology', icon: Mountain },
    { id: 'faqs', label: 'Expedition FAQs', icon: Sparkles }
  ];

  const toggleFaq = (id) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  return (
    <section id="about" className="section why-us-section" aria-label="Why Alpine Ascents">
      <div className="site-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Compass size={14} />
            <span>INTERNATIONAL EXPEDITION EXCELLENCE</span>
          </div>
          <h2 className="section-title">WHY ALPINE ASCENTS</h2>
          <p className="section-subtitle">
            We are not a generic travel agency. We are an international high-altitude expedition team dedicated to safety, certified leadership, and environmental stewardship across the greatest mountains on Earth.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="why-pillars-grid">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="why-pillar-card">
                <div className="pillar-icon-box">
                  <Icon size={22} />
                </div>
                <div className="pillar-stat">{p.stat}</div>
                <h3 className="pillar-title">{p.title}</h3>
                <p className="pillar-desc">{p.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="why-tabs-bar" role="tablist">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`why-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                aria-selected={activeTab === tab.id}
                id={`why-tab-${tab.id}`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Panel */}
        <div className="why-active-panel">
          {/* TAB 1: SAFETY & SATELLITE */}
          {activeTab === 'safety' && (
            <div className="safety-showcase-panel animate-fade-in">
              <div className="safety-grid-2col">
                <div>
                  <h4 className="safety-box-title">
                    <Radio size={18} color="var(--accent)" />
                    <span>Real-Time Satellite Telemetry & SOS</span>
                  </h4>
                  <div className="safety-points-list">
                    <div className="safety-point-item">
                      <Check size={16} color="#10b981" />
                      <span>Every expedition leader carries dual Iridium satellite communication devices with 10-minute live tracking beacon pings.</span>
                    </div>
                    <div className="safety-point-item">
                      <Check size={16} color="#10b981" />
                      <span>Continuous atmospheric pressure telemetry and severe weather alert feeds synchronized with meteorological stations.</span>
                    </div>
                    <div className="safety-point-item">
                      <Check size={16} color="#10b981" />
                      <span>Direct coordination with Askari Aviation high-altitude rescue helicopters operating across Gilgit-Baltistan.</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="safety-box-title">
                    <ShieldCheck size={18} color="var(--accent)" />
                    <span>High-Altitude Medical Rigor</span>
                  </h4>
                  <div className="safety-points-list">
                    <div className="safety-point-item">
                      <Check size={16} color="#10b981" />
                      <span>Daily pulse oximeter SpO2 and resting heart rate monitoring logged every evening in base camp journals.</span>
                    </div>
                    <div className="safety-point-item">
                      <Check size={16} color="#10b981" />
                      <span>Certified Wilderness First Responders (WFR) with Gamow hyperbaric chambers and medical-grade supplemental oxygen sets.</span>
                    </div>
                    <div className="safety-point-item">
                      <Check size={16} color="#10b981" />
                      <span>Structured UIAA acclimatization schedules: maximum 500m net gain per 24 hours above 3,000m.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GUIDES DIRECTORY */}
          {activeTab === 'guides' && (
            <div className="guides-cards-stack animate-fade-in" id="guides">
              {guidesData.map(guide => (
                <div key={guide.id} className="guide-showcase-card">
                  <div className="guide-card-media">
                    <img src={guide.image} alt={guide.name} className="guide-card-img" loading="lazy" />
                    <div className="guide-card-overlay" />
                    <span className="guide-cred-badge">{guide.experienceYears} Years Exp</span>
                  </div>
                  <div className="guide-card-body">
                    <h4 className="guide-name">{guide.name}</h4>
                    <div className="guide-role">{guide.role}</div>
                    <div className="guide-summits">
                      <strong>Apex Summits:</strong> {guide.summits}
                    </div>
                    <p className="guide-bio">{guide.bio}</p>
                    <div className="guide-skills-list">
                      {guide.specialties && guide.specialties.slice(0, 3).map((spec, i) => (
                        <span key={i} className="guide-skill-chip">{spec}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: GLACIOLOGY SLIDER */}
          {activeTab === 'glaciers' && (
            <div className="animate-fade-in">
              <GlacierSlider />
            </div>
          )}

          {/* TAB 4: EXPEDITION FAQS */}
          {activeTab === 'faqs' && (
            <div className="faq-accordion-stack animate-fade-in">
              {faqsData.map(faq => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div key={faq.id} className="faq-accordion-item">
                    <button
                      className="faq-accordion-btn"
                      onClick={() => toggleFaq(faq.id)}
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {isOpen && (
                      <div className="faq-accordion-panel animate-fade-in">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
