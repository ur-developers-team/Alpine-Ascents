import React, { useState } from 'react';
import familyOffersData from '../../data/familyOffers.json';
import { Users, Shield, Check, Calendar, ArrowRight, Sparkles, Home, Utensils, Truck, Compass } from 'lucide-react';
import './FamilyOffersSection.css';

export default function FamilyOffersSection({ onSelectOffer, onOpenPlanModal }) {
  const [selectedOfferIndex, setSelectedOfferIndex] = useState(0);
  const currentOffer = familyOffersData[selectedOfferIndex] || familyOffersData[0];

  const handleExplore = () => {
    if (onOpenPlanModal) {
      onOpenPlanModal();
    } else {
      const el = document.querySelector('#expeditions');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="family-offers" className="section family-offers-section" aria-label="Family Mountain Escapes">
      <div className="site-container">
        {/* Editorial Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Users size={14} />
            <span>MULTI-GENERATION MOUNTAIN TRAVEL</span>
          </div>
          <h2 className="section-title">FAMILY MOUNTAIN ESCAPES</h2>
          <p className="section-subtitle">
            Safe, relaxed-pace high-altitude wonder engineered for parents, children, and grandparents. Enjoy 5-star royal heritage forts, private 4x4 Land Cruisers, and pediatric-certified mountain guides.
          </p>
        </div>

        {/* Full-Width Visual Promotional Showcase (No Generic Card Grid) */}
        <div className="family-fullwidth-showcase">
          {/* Top Promotional Hero Strip */}
          <div className="family-promo-hero">
            <img
              src={currentOffer.image}
              alt={currentOffer.title}
              className="family-hero-bg-img"
              loading="lazy"
            />
            <div className="family-hero-gradient" />

            <div className="family-hero-floating-content">
              <div className="family-hero-badges">
                <span className="family-promo-pill">
                  <Sparkles size={13} color="var(--accent-gold)" />
                  <span>FAMILY PRIVILEGE: SAVE {currentOffer.discount}</span>
                </span>
                <span className="family-age-pill">
                  <Shield size={13} />
                  <span>Safe for ages {currentOffer.minAge}+</span>
                </span>
              </div>

              <h3 className="family-hero-headline">{currentOffer.title}</h3>
              <p className="family-hero-location">{currentOffer.destinationName} • {currentOffer.duration}</p>

              <p className="family-hero-message">
                Specially calibrated acclimatization curves with leisurely morning starts, organic orchard dining, and private heated suites in 400-year-old restored silk road royal fort palaces.
              </p>

              {/* Inclusions Row */}
              <div className="family-inclusions-bar">
                <div className="family-inc-item">
                  <Home size={16} color="var(--accent)" />
                  <div>
                    <strong>Accommodation</strong>
                    <span>{currentOffer.accommodation}</span>
                  </div>
                </div>

                <div className="family-inc-item">
                  <Utensils size={16} color="var(--accent)" />
                  <div>
                    <strong>Food & Gastronomy</strong>
                    <span>{currentOffer.includedMeals}</span>
                  </div>
                </div>

                <div className="family-inc-item">
                  <Truck size={16} color="var(--accent)" />
                  <div>
                    <strong>Transport</strong>
                    <span>Private 4x4 Prado SUV</span>
                  </div>
                </div>

                <div className="family-inc-item">
                  <Compass size={16} color="var(--accent)" />
                  <div>
                    <strong>Activities</strong>
                    <span>{currentOffer.highlights ? currentOffer.highlights.slice(0, 2).join(' & ') : 'Forts & Lake Boating'}</span>
                  </div>
                </div>
              </div>

              {/* CTA Row */}
              <div className="family-hero-actions">
                <button
                  className="btn btn-primary btn-lg family-primary-cta"
                  onClick={handleExplore}
                  id="family-explore-btn"
                >
                  <Users size={18} />
                  <span>EXPLORE FAMILY OFFERS</span>
                  <ArrowRight size={16} />
                </button>

                <div className="family-price-badge">
                  <span className="family-price-from">All-Inclusive Family Dossier</span>
                  <span className="family-price-val">${currentOffer.price} <small>/ family</small></span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Route Selector Strips */}
          <div className="family-route-selector-bar">
            <span className="family-selector-label">FEATURED FAMILY ROUTES:</span>
            <div className="family-selector-tabs">
              {familyOffersData.map((offer, idx) => (
                <button
                  key={offer.id}
                  className={`family-tab-strip ${selectedOfferIndex === idx ? 'active' : ''}`}
                  onClick={() => setSelectedOfferIndex(idx)}
                >
                  <span className="tab-num">0{idx + 1}</span>
                  <span className="tab-name">{offer.destinationName}</span>
                  <span className="tab-disc">{offer.discount}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
