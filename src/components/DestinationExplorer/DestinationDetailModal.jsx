import React, { useState } from 'react';
import {
  X, MapPin, Mountain, Calendar, Compass, Shield, Heart,
  Check, ArrowRight, ChevronDown, ChevronUp, Droplet, Utensils,
  Home, Truck, AlertTriangle, CloudSun, Sparkles
} from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import './DestinationDetailModal.css';

export default function DestinationDetailModal({ destination, isOpen, onClose, onOpenTripBuilder }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [expandedSections, setExpandedSections] = useState({
    mountains: true,
    lakes: false,
    shelters: false,
    food: false,
    activities: false,
    transport: false,
    accommodation: false,
    safety: false,
    weather: false,
    nearby: false
  });

  if (!isOpen || !destination) return null;

  const toggleSection = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isSaved = isWishlisted(destination.id);

  return (
    <div className="modal-overlay dest-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content dest-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close details">
          <X size={18} />
        </button>

        {/* Cinematic Full-Bleed Media Header */}
        <div className="dest-detail-hero">
          <img
            src={destination.image}
            alt={destination.name}
            className="dest-detail-hero-img"
          />
          <div className="dest-detail-hero-overlay" />

          <div className="dest-detail-hero-caption">
            <div className="dest-hero-badges">
              <span className="dest-hud-pill">
                <Mountain size={12} />
                <span>{destination.altitude}</span>
              </span>
              <span className="dest-hud-pill pill-difficulty">
                <Shield size={12} />
                <span>{destination.difficulty}</span>
              </span>
              <span className="dest-hud-pill pill-season">
                <Calendar size={12} />
                <span>{destination.bestSeason}</span>
              </span>
            </div>

            <h1 className="dest-hero-title">{destination.name}</h1>
            <p className="dest-hero-location">
              <MapPin size={15} color="var(--accent)" />
              <span>{destination.region}, {destination.country}</span>
            </p>
          </div>

          <button
            className={`btn-save dest-hero-wishlist-btn ${isSaved ? 'active' : ''}`}
            onClick={() => toggleWishlist(destination, 'destination')}
            title="Save Destination to Passport"
            aria-label="Save to Wishlist"
          >
            <Heart size={20} fill={isSaved ? '#f43f5e' : 'none'} color={isSaved ? '#f43f5e' : '#ffffff'} />
          </button>
        </div>

        {/* Quick Facts Strip (No Long Walls of Text) */}
        <div className="dest-quick-facts-strip">
          <div className="quick-fact-cell">
            <span className="fact-label">ALTITUDE</span>
            <span className="fact-val">{destination.altitude}</span>
          </div>
          <div className="fact-divider" />
          <div className="quick-fact-cell">
            <span className="fact-label">BEST SEASON</span>
            <span className="fact-val">{destination.bestSeason}</span>
          </div>
          <div className="fact-divider" />
          <div className="quick-fact-cell">
            <span className="fact-label">DIFFICULTY</span>
            <span className="fact-val">{destination.difficulty}</span>
          </div>
          <div className="fact-divider" />
          <div className="quick-fact-cell">
            <span className="fact-label">DURATION</span>
            <span className="fact-val">{destination.duration}</span>
          </div>
          <div className="fact-divider" />
          <div className="quick-fact-cell">
            <span className="fact-label">STARTING FROM</span>
            <span className="fact-val highlight">${destination.startingPrice}</span>
          </div>
        </div>

        {/* Short Editorial Overview */}
        <div className="dest-summary-callout">
          <p>{destination.overview}</p>
        </div>

        {/* Progressive Expandable Accordions */}
        <div className="dest-accordion-container">
          <h3 className="dest-accordion-header-title">EXPLORE DESTINATION PROFILE</h3>
          <p className="dest-accordion-sub">Click any category (+) to reveal technical alpine specifics:</p>

          {/* 1. Mountains & Summits */}
          <div className="dest-accordion-item">
            <button
              className="dest-accordion-trigger"
              onClick={() => toggleSection('mountains')}
              aria-expanded={expandedSections.mountains}
            >
              <div className="trigger-left">
                <Mountain size={17} color="var(--accent)" />
                <span>Mountains & Peaks</span>
              </div>
              {expandedSections.mountains ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedSections.mountains && (
              <div className="dest-accordion-panel animate-fade-in">
                <p>Dominant summits towering over this domain include {destination.landmarks ? destination.landmarks.slice(0, 3).join(', ') : 'major Karakoram spires'}. Surrounding peaks range from 6,000m to 8,000m with vertical granite faces and hanging glaciers.</p>
                <div className="badge-tag-cloud">
                  <span className="alpine-pill-tag">Primary Apex: {destination.altitude}</span>
                  <span className="alpine-pill-tag">Glacial Moraines</span>
                  <span className="alpine-pill-tag">Alpine Ridge Lines</span>
                </div>
              </div>
            )}
          </div>

          {/* 2. Lakes & Waters */}
          <div className="dest-accordion-item">
            <button
              className="dest-accordion-trigger"
              onClick={() => toggleSection('lakes')}
              aria-expanded={expandedSections.lakes}
            >
              <div className="trigger-left">
                <Droplet size={17} color="var(--accent)" />
                <span>Glacial Lakes & Waters</span>
              </div>
              {expandedSections.lakes ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedSections.lakes && (
              <div className="dest-accordion-panel animate-fade-in">
                <p>Fed by sub-polar glaciers, water bodies here feature iridescent cyan and turquoise minerals. Key waters include Attabad Lake, Borith Lake, and upper glacial melt streams suitable for kayaking and boating.</p>
              </div>
            )}
          </div>

          {/* 3. Shelters & Camps */}
          <div className="dest-accordion-item">
            <button
              className="dest-accordion-trigger"
              onClick={() => toggleSection('shelters')}
              aria-expanded={expandedSections.shelters}
            >
              <div className="trigger-left">
                <Home size={17} color="var(--accent)" />
                <span>High Shelters & Base Camps</span>
              </div>
              {expandedSections.shelters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedSections.shelters && (
              <div className="dest-accordion-panel animate-fade-in">
                <p>Available shelters include 4-season geodesic expedition domes, stone shepherd bivouacs, and high-altitude mountain huts with wood-burning heating.</p>
                <div className="dest-bullet-list">
                  <div>• 4-Season Geodesic Camps (Askole, Concordia, Tagaphari)</div>
                  <div>• Stone Alpine Shepherd Huts for weather contingencies</div>
                  <div>• Dedicated mess tents with hot water heating</div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Food & Local Cuisine */}
          <div className="dest-accordion-item">
            <button
              className="dest-accordion-trigger"
              onClick={() => toggleSection('food')}
              aria-expanded={expandedSections.food}
            >
              <div className="trigger-left">
                <Utensils size={17} color="var(--accent)" />
                <span>Local Gastronomy & Trail Rations</span>
              </div>
              {expandedSections.food ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedSections.food && (
              <div className="dest-accordion-panel animate-fade-in">
                <p>Enjoy nutrient-dense traditional fare and specialized high-altitude expedition chef provisions:</p>
                <div className="dest-bullet-list">
                  {destination.localFood ? (
                    destination.localFood.map((food, i) => (
                      <div key={i}>• {food}</div>
                    ))
                  ) : (
                    <>
                      <div>• Fresh Char & Trout caught in cold streams</div>
                      <div>• Chapshuro (Organic minced meat pie)</div>
                      <div>• Apricot walnut cakes & Tumuro herbal mountain tea</div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 5. Activities */}
          <div className="dest-accordion-item">
            <button
              className="dest-accordion-trigger"
              onClick={() => toggleSection('activities')}
              aria-expanded={expandedSections.activities}
            >
              <div className="trigger-left">
                <Compass size={17} color="var(--accent)" />
                <span>Signature Activities & Adventures</span>
              </div>
              {expandedSections.activities ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedSections.activities && (
              <div className="dest-accordion-panel animate-fade-in">
                <div className="activities-pill-grid">
                  {destination.activities && destination.activities.map((act, i) => (
                    <div key={i} className="act-chip">
                      <Check size={14} color="var(--accent)" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 6. Transport & Mountain Jeeps */}
          <div className="dest-accordion-item">
            <button
              className="dest-accordion-trigger"
              onClick={() => toggleSection('transport')}
              aria-expanded={expandedSections.transport}
            >
              <div className="trigger-left">
                <Truck size={17} color="var(--accent)" />
                <span>Transport & Mountain Jeeps</span>
              </div>
              {expandedSections.transport ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedSections.transport && (
              <div className="dest-accordion-panel animate-fade-in">
                <p>{destination.transportOptions ? destination.transportOptions.join(' • ') : 'Dedicated 4x4 Land Cruiser Mountain Jeeps with high clearance and experienced local drivers.'}</p>
              </div>
            )}
          </div>

          {/* 7. Accommodation */}
          <div className="dest-accordion-item">
            <button
              className="dest-accordion-trigger"
              onClick={() => toggleSection('accommodation')}
              aria-expanded={expandedSections.accommodation}
            >
              <div className="trigger-left">
                <Sparkles size={17} color="var(--accent)" />
                <span>Accommodations & Lodges</span>
              </div>
              {expandedSections.accommodation ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedSections.accommodation && (
              <div className="dest-accordion-panel animate-fade-in">
                <p>Ranging from luxury restored palaces to lakeside glamping domes:</p>
                <div className="dest-bullet-list">
                  {destination.stayTypes ? (
                    destination.stayTypes.map((stay, i) => (
                      <div key={i}>• {stay}</div>
                    ))
                  ) : (
                    <div>• 5-Star Heritage Royal Forts, Boutique Chalets, and Luxury Geodesic Domes.</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 8. Safety & Altitude */}
          <div className="dest-accordion-item">
            <button
              className="dest-accordion-trigger"
              onClick={() => toggleSection('safety')}
              aria-expanded={expandedSections.safety}
            >
              <div className="trigger-left">
                <AlertTriangle size={17} color="var(--accent-gold)" />
                <span>Safety & Altitude Protocols</span>
              </div>
              {expandedSections.safety ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedSections.safety && (
              <div className="dest-accordion-panel animate-fade-in">
                <p>Elevation is {destination.altitude}. All itineraries incorporate structured rest stages and daily blood oxygen pulse oximeter telemetry. Emergency satellite messengers (Garmin inReach) and altitude medical kits with Diamox are provided on all departures.</p>
              </div>
            )}
          </div>

          {/* 9. Weather & Climate */}
          <div className="dest-accordion-item">
            <button
              className="dest-accordion-trigger"
              onClick={() => toggleSection('weather')}
              aria-expanded={expandedSections.weather}
            >
              <div className="trigger-left">
                <CloudSun size={17} color="var(--accent)" />
                <span>Weather & Seasonality</span>
              </div>
              {expandedSections.weather ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedSections.weather && (
              <div className="dest-accordion-panel animate-fade-in">
                <p>Optimal season is {destination.bestSeason}. Daytime temperatures average +22°C to +26°C in summer valleys, while high nights can drop to near 0°C. Mountain weather is dynamic; layered GORE-TEX and fleece are essential.</p>
              </div>
            )}
          </div>

          {/* 10. Nearby Places */}
          <div className="dest-accordion-item">
            <button
              className="dest-accordion-trigger"
              onClick={() => toggleSection('nearby')}
              aria-expanded={expandedSections.nearby}
            >
              <div className="trigger-left">
                <MapPin size={17} color="var(--accent)" />
                <span>Nearby Destinations & Extensions</span>
              </div>
              {expandedSections.nearby ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedSections.nearby && (
              <div className="dest-accordion-panel animate-fade-in">
                <p>Easily linked to other crown locations in Gilgit-Baltistan:</p>
                <div className="badge-tag-cloud">
                  {destination.nearbyDestinations ? (
                    destination.nearbyDestinations.map((place, i) => (
                      <span key={i} className="alpine-pill-tag">{place}</span>
                    ))
                  ) : (
                    <span className="alpine-pill-tag">Hunza, Skardu, Fairy Meadows, Deosai</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Sticky CTA */}
        <div className="dest-detail-footer">
          <div className="footer-price-col">
            <span className="footer-price-sub">Starting Expedition Cost</span>
            <span className="footer-price-val">${destination.startingPrice} <small>/ traveler</small></span>
          </div>

          <div className="footer-action-col">
            <button
              className="btn btn-primary"
              onClick={() => {
                onClose();
                if (onOpenTripBuilder) {
                  onOpenTripBuilder(destination.id);
                }
              }}
            >
              <span>Build Expedition Here</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
