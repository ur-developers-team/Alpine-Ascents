import React, { useState } from 'react';
import {
  Compass, MapPin, Sliders, CheckCircle2, Plane, Navigation,
  Mountain, Award, RotateCcw, ChevronDown, ChevronUp, Check,
  Shield, ArrowRight, Clock, Sparkles
} from 'lucide-react';
import expeditionStepsData from '../../data/expeditionSteps.json';
import './ExpeditionTimeline.css';

const ICON_MAP = {
  Compass,
  MapPin,
  Sliders,
  CheckCircle2,
  Plane,
  Navigation,
  Mountain,
  RotateCcw
};

const TIMELINE_STEPS = expeditionStepsData;

export default function ExpeditionTimeline({ onOpenPlanModal }) {
  const [expandedStep, setExpandedStep] = useState(1);

  const toggleStep = (stepNum) => {
    setExpandedStep(prev => (prev === stepNum ? null : stepNum));
  };

  return (
    <section id="timeline" className="section expedition-timeline-section" aria-label="Expedition Timeline">
      <div className="site-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Compass size={14} />
            <span>OPERATIONAL BLUEPRINT</span>
          </div>
          <h2 className="section-title">EXPEDITION TIMELINE</h2>
          <p className="section-subtitle">
            From initial mountain dream to standing at the base of colossal peaks and returning home safely. Follow our rigorous 8-phase operational lifecycle.
          </p>
        </div>

        {/* Step-by-Step Editorial Timeline (Editorial Progression Line — Requirement 15) */}
        <div className="editorial-timeline-flow">
          {TIMELINE_STEPS.map((item) => {
            const Icon = ICON_MAP[item.icon] || Compass;
            const isExpanded = expandedStep === item.step;

            return (
              <div
                key={item.step}
                className={`timeline-editorial-item ${isExpanded ? 'is-active' : ''}`}
                id={`timeline-step-${item.step}`}
              >
                {/* Visual Step Marker & Track Line */}
                <div className="timeline-marker-col">
                  <div className="timeline-step-badge">
                    <span>{String(item.step).padStart(2, '0')}</span>
                  </div>
                  <div className="timeline-connecting-line" />
                </div>

                {/* Content Block */}
                <div className="timeline-content-block">
                  {/* Clickable Header Strip */}
                  <div
                    className="timeline-row-summary"
                    onClick={() => toggleStep(item.step)}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                  >
                    <div className="summary-lead">
                      <div className="summary-tags-line">
                        <span className="phase-pill">{item.phase}</span>
                        <span className="duration-pill">
                          <Clock size={11} />
                          <span>{item.duration}</span>
                        </span>
                      </div>
                      <h3 className="step-title-text">{item.title}</h3>
                      <p className="step-summary-text">{item.summary}</p>
                    </div>

                    <div className="summary-toggle-col">
                      <span className="toggle-label">{isExpanded ? 'COLLAPSE' : 'EXPLORE PHASE'}</span>
                      <div className="toggle-chevron-btn">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Step Details (Protocols, Logistics, Details) */}
                  {isExpanded && (
                    <div className="timeline-expanded-details animate-fade-in">
                      <div className="expanded-inner">
                        <p className="expanded-narrative">{item.details}</p>

                        <div className="protocols-checklist-box">
                          <h4 className="protocols-title">
                            <Shield size={14} color="var(--accent)" />
                            <span>OPERATIONAL CHECKLIST & SAFETY PROTOCOLS</span>
                          </h4>
                          <div className="protocols-list">
                            {item.protocols.map((protocol, idx) => (
                              <div key={idx} className="protocol-item">
                                <div className="proto-check-circle">
                                  <Check size={11} />
                                </div>
                                <span className="proto-text">{protocol}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="expanded-footer-actions">
                          <button
                            className="btn btn-primary btn-sm timeline-cta"
                            onClick={() => {
                              if (onOpenPlanModal) onOpenPlanModal({ stepPhase: item.title });
                            }}
                          >
                            <span>Initiate This Phase With Alpine Ascents</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
