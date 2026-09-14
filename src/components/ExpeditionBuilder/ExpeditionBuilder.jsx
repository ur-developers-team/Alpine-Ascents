import React, { useState } from 'react';
import { useUserProfile } from '../../context/UserProfileContext';
import {
  Compass, Check, ArrowRight, Bookmark, Send,
  Sparkles, AlertCircle, RotateCcw, Home, Utensils, Truck,
  Mountain, Shield, ShieldCheck, DollarSign, Radio, CheckSquare,
  Layers, ChevronRight, Eye
} from 'lucide-react';
import './ExpeditionBuilder.css';

import builderOptionsData from '../../data/builderOptions.json';

const {
  destinations: DESTINATIONS,
  durations: DURATIONS,
  groupSizes: GROUP_SIZES,
  shelters: SHELTERS,
  foodPlans: FOOD_PLANS,
  transports: TRANSPORTS,
  guides: GUIDES,
  activities: ACTIVITIES,
  equipment: EQUIPMENT,
  extras: EXTRAS
} = builderOptionsData;

export default function ExpeditionBuilder({ initialDestinationId, onRequestExpedition }) {
  const { saveTrip } = useUserProfile();

  // State
  const [dest, setDest] = useState(DESTINATIONS.find(d => d.id === initialDestinationId) || DESTINATIONS[0]);
  const [duration, setDuration] = useState(DURATIONS[1]);
  const [groupSize, setGroupSize] = useState(GROUP_SIZES[1]);
  const [shelter, setShelter] = useState(SHELTERS[1]);
  const [food, setFood] = useState(FOOD_PLANS[2]);
  const [transport, setTransport] = useState(TRANSPORTS[1]);
  const [guide, setGuide] = useState(GUIDES[0]);
  const [selectedActivities, setSelectedActivities] = useState(['glacier-trek', 'lake-boating']);
  const [selectedEquipment, setSelectedEquipment] = useState(['gear-basic']);
  const [selectedExtras, setSelectedExtras] = useState(['extra-sat-wifi']);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Math Formula: BASE PRICE + OPTIONS - DISCOUNT = ESTIMATED TOTAL
  const basePrice = Math.round(dest.basePrice * duration.multiplier);
  const shelterPrice = shelter.price;
  const foodPrice = food.price;
  const transportPrice = transport.price;
  const guidePrice = guide.price;

  const activitiesPrice = selectedActivities.reduce((sum, id) => {
    const item = ACTIVITIES.find(a => a.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  const equipmentPrice = selectedEquipment.reduce((sum, id) => {
    const item = EQUIPMENT.find(e => e.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  const extrasPrice = selectedExtras.reduce((sum, id) => {
    const item = EXTRAS.find(x => x.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  const totalOptionsPrice = shelterPrice + foodPrice + transportPrice + guidePrice + activitiesPrice + equipmentPrice + extrasPrice;
  const subtotalBeforeGroup = basePrice + totalOptionsPrice;
  const adjustedPerPerson = Math.round(subtotalBeforeGroup * groupSize.multiplier);

  // Seasonal privilege discount (10%)
  const discountAmount = Math.round(adjustedPerPerson * 0.10);
  const estimatedTotalPerPerson = adjustedPerPerson - discountAmount;
  const estimatedTotalParty = estimatedTotalPerPerson * groupSize.count;

  // Toggle Handlers
  const toggleActivity = (id) => {
    setSelectedActivities(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const toggleEquipment = (id) => {
    setSelectedEquipment(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const toggleExtra = (id) => {
    setSelectedExtras(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    setDest(DESTINATIONS[0]);
    setDuration(DURATIONS[1]);
    setGroupSize(GROUP_SIZES[1]);
    setShelter(SHELTERS[1]);
    setFood(FOOD_PLANS[2]);
    setTransport(TRANSPORTS[1]);
    setGuide(GUIDES[0]);
    setSelectedActivities(['glacier-trek', 'lake-boating']);
    setSelectedEquipment(['gear-basic']);
    setSelectedExtras(['extra-sat-wifi']);
    setSavedSuccess(false);
  };

  const handleSaveBlueprint = () => {
    const tripManifest = {
      id: `builder-${Date.now()}`,
      name: `Custom ${dest.name} (${duration.days}D)`,
      destinationName: dest.name,
      duration: `${duration.days} Days`,
      shelter: shelter.name,
      foodPlan: food.name,
      transport: transport.name,
      guide: guide.name,
      groupSize: groupSize.label,
      basePrice,
      optionsPrice: totalOptionsPrice,
      discount: discountAmount,
      price: estimatedTotalPerPerson,
      estimatedTotal: estimatedTotalParty,
      status: 'Custom Blueprint Saved'
    };

    saveTrip(tripManifest);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    window.dispatchEvent(new CustomEvent('alpine-toast', {
      detail: { message: '🏔 Custom Expedition Saved to My Alpine Passport!', type: 'success' }
    }));
  };

  const handleBookExpedition = () => {
    const tripManifest = {
      name: `Custom Expedition: ${dest.name}`,
      destinationName: dest.name,
      duration: `${duration.days} Days`,
      travelStyle: shelter.name,
      shelter: shelter.name,
      foodPlan: food.name,
      transport: transport.name,
      guide: guide.name,
      groupSize: groupSize.label,
      price: estimatedTotalPerPerson,
      estimatedTotal: estimatedTotalParty,
      breakdown: {
        basePrice,
        optionsPrice: totalOptionsPrice,
        discount: discountAmount,
        total: estimatedTotalParty
      }
    };

    if (onRequestExpedition) {
      onRequestExpedition(tripManifest);
    }
  };

  return (
    <section id="trip-builder" className="section builder-section" aria-label="Build Your Own Expedition">
      <div className="site-container">
        {/* Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Compass size={14} />
            <span>BESPOKE ALPINE ARCHITECTURE</span>
          </div>
          <h2 className="section-title">BUILD YOUR OWN EXPEDITION</h2>
          <p className="section-subtitle">
            Configure every dimension of your high-altitude journey — from shelter and food plans to 4x4 mountain vehicles, UIAGM guide ratios, and technical equipment.
          </p>
        </div>

        {/* 2-Column Builder Studio: Step-by-Step Horizontal Rows Left, Sticky Summary Right */}
        <div className="builder-studio-grid">
          {/* Main Steps Column */}
          <div className="builder-steps-column">

            {/* STEP 1: DESTINATION */}
            <div className="builder-step-panel" id="step-destination">
              <div className="step-panel-header">
                <span className="step-index-badge">STEP 01</span>
                <div>
                  <h3 className="step-heading">DESTINATION & LOGISTICS</h3>
                  <p className="step-desc">Select your high mountain domain, itinerary duration, and expedition party size.</p>
                </div>
              </div>

              {/* Destination Horizontal Selector Rows */}
              <div className="builder-horizontal-selectors-stack">
                {DESTINATIONS.map(d => {
                  const isSelected = dest.id === d.id;
                  return (
                    <div
                      key={d.id}
                      className={`builder-selector-row ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => setDest(d)}
                    >
                      <div className="selector-radio">
                        <div className={`radio-dot ${isSelected ? 'active' : ''}`} />
                      </div>
                      <div className="selector-info">
                        <div className="selector-title-row">
                          <span className="selector-name">{d.name}</span>
                          <span className="selector-tag">{d.region}</span>
                        </div>
                        <p className="selector-desc">{d.desc}</p>
                      </div>
                      <div className="selector-price">
                        <span className="p-label">Base Rate</span>
                        <span className="p-val">${d.basePrice}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Duration & Party Row */}
              <div className="builder-subcontrols-row">
                <div className="subcontrol-col">
                  <label>EXPEDITION DURATION</label>
                  <select
                    value={duration.days}
                    onChange={(e) => {
                      const found = DURATIONS.find(dur => dur.days === parseInt(e.target.value));
                      if (found) setDuration(found);
                    }}
                    className="builder-select-field"
                  >
                    {DURATIONS.map(dur => (
                      <option key={dur.days} value={dur.days}>{dur.label}</option>
                    ))}
                  </select>
                </div>
                <div className="subcontrol-col">
                  <label>PARTY FORMAT & RATIO</label>
                  <select
                    value={groupSize.id}
                    onChange={(e) => {
                      const found = GROUP_SIZES.find(g => g.id === e.target.value);
                      if (found) setGroupSize(found);
                    }}
                    className="builder-select-field"
                  >
                    {GROUP_SIZES.map(g => (
                      <option key={g.id} value={g.id}>{g.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* STEP 2: SHELTER */}
            <div className="builder-step-panel" id="step-shelter">
              <div className="step-panel-header">
                <span className="step-index-badge">STEP 02</span>
                <div>
                  <h3 className="step-heading">WHERE WILL YOU SHELTER?</h3>
                  <p className="step-desc">From rugged double-wall high bivouacs to heated panoramic luxury domes.</p>
                </div>
              </div>

              <div className="builder-horizontal-selectors-stack">
                {SHELTERS.map(s => {
                  const isSelected = shelter.id === s.id;
                  return (
                    <div
                      key={s.id}
                      className={`builder-selector-row ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => setShelter(s)}
                    >
                      <div className="selector-radio">
                        <div className={`radio-dot ${isSelected ? 'active' : ''}`} />
                      </div>
                      <div className="selector-info">
                        <div className="selector-title-row">
                          <span className="selector-name">{s.name}</span>
                          <span className="selector-tier-tag">{s.tier} Tier</span>
                        </div>
                        <p className="selector-desc">{s.desc}</p>
                      </div>
                      <div className="selector-price">
                        <span className="p-label">Tier Addition</span>
                        <span className="p-val">+${s.price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: FOOD */}
            <div className="builder-step-panel" id="step-food">
              <div className="step-panel-header">
                <span className="step-index-badge">STEP 03</span>
                <div>
                  <h3 className="step-heading">EXPEDITION GASTRONOMY & NUTRITION</h3>
                  <p className="step-desc">High-altitude metabolic energy requirements and regional artisan dining.</p>
                </div>
              </div>

              <div className="builder-horizontal-selectors-stack">
                {FOOD_PLANS.map(f => {
                  const isSelected = food.id === f.id;
                  return (
                    <div
                      key={f.id}
                      className={`builder-selector-row ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => setFood(f)}
                    >
                      <div className="selector-radio">
                        <div className={`radio-dot ${isSelected ? 'active' : ''}`} />
                      </div>
                      <div className="selector-info">
                        <div className="selector-title-row">
                          <span className="selector-name">{f.name}</span>
                        </div>
                        <p className="selector-desc">{f.desc}</p>
                      </div>
                      <div className="selector-price">
                        <span className="p-label">Plan Cost</span>
                        <span className="p-val">+${f.price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 4: TRANSPORT */}
            <div className="builder-step-panel" id="step-transport">
              <div className="step-panel-header">
                <span className="step-index-badge">STEP 04</span>
                <div>
                  <h3 className="step-heading">MOUNTAIN TRANSPORT & 4x4</h3>
                  <p className="step-desc">Rugged off-road transit designed for high Karakoram mountain gorges.</p>
                </div>
              </div>

              <div className="builder-horizontal-selectors-stack">
                {TRANSPORTS.map(t => {
                  const isSelected = transport.id === t.id;
                  return (
                    <div
                      key={t.id}
                      className={`builder-selector-row ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => setTransport(t)}
                    >
                      <div className="selector-radio">
                        <div className={`radio-dot ${isSelected ? 'active' : ''}`} />
                      </div>
                      <div className="selector-info">
                        <div className="selector-title-row">
                          <span className="selector-name">{t.name}</span>
                        </div>
                        <p className="selector-desc">{t.desc}</p>
                      </div>
                      <div className="selector-price">
                        <span className="p-label">Vehicle Rate</span>
                        <span className="p-val">+${t.price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 5: GUIDE */}
            <div className="builder-step-panel" id="step-guide">
              <div className="step-panel-header">
                <span className="step-index-badge">STEP 05</span>
                <div>
                  <h3 className="step-heading">GUIDE & EXPEDITION LEADERSHIP</h3>
                  <p className="step-desc">Accredited UIAGM international instructors and local high-altitude Sirdars.</p>
                </div>
              </div>

              <div className="builder-horizontal-selectors-stack">
                {GUIDES.map(g => {
                  const isSelected = guide.id === g.id;
                  return (
                    <div
                      key={g.id}
                      className={`builder-selector-row ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => setGuide(g)}
                    >
                      <div className="selector-radio">
                        <div className={`radio-dot ${isSelected ? 'active' : ''}`} />
                      </div>
                      <div className="selector-info">
                        <div className="selector-title-row">
                          <span className="selector-name">{g.name}</span>
                        </div>
                        <p className="selector-desc">{g.desc}</p>
                      </div>
                      <div className="selector-price">
                        <span className="p-label">Guide Ratio</span>
                        <span className="p-val">+${g.price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 6: ACTIVITIES */}
            <div className="builder-step-panel" id="step-activities">
              <div className="step-panel-header">
                <span className="step-index-badge">STEP 06</span>
                <div>
                  <h3 className="step-heading">ACTIVITIES & EXCURSIONS</h3>
                  <p className="step-desc">Select optional excursions to incorporate into your day-by-day itinerary.</p>
                </div>
              </div>

              <div className="builder-horizontal-selectors-stack">
                {ACTIVITIES.map(a => {
                  const isChecked = selectedActivities.includes(a.id);
                  return (
                    <div
                      key={a.id}
                      className={`builder-selector-row is-multi ${isChecked ? 'is-selected' : ''}`}
                      onClick={() => toggleActivity(a.id)}
                    >
                      <div className="selector-checkbox">
                        <div className={`checkbox-box ${isChecked ? 'active' : ''}`}>
                          {isChecked && <Check size={12} />}
                        </div>
                      </div>
                      <div className="selector-info">
                        <span className="selector-name">{a.name}</span>
                        <p className="selector-desc">{a.desc}</p>
                      </div>
                      <div className="selector-price">
                        <span className="p-label">Activity</span>
                        <span className="p-val">+${a.price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 7: EQUIPMENT */}
            <div className="builder-step-panel" id="step-equipment">
              <div className="step-panel-header">
                <span className="step-index-badge">STEP 07</span>
                <div>
                  <h3 className="step-heading">SPECIALIZED EQUIPMENT RENTALS</h3>
                  <p className="step-desc">Safety gear, carbon-fiber trekking poles, satellite communication, and boots.</p>
                </div>
              </div>

              <div className="builder-horizontal-selectors-stack">
                {EQUIPMENT.map(e => {
                  const isChecked = selectedEquipment.includes(e.id);
                  return (
                    <div
                      key={e.id}
                      className={`builder-selector-row is-multi ${isChecked ? 'is-selected' : ''}`}
                      onClick={() => toggleEquipment(e.id)}
                    >
                      <div className="selector-checkbox">
                        <div className={`checkbox-box ${isChecked ? 'active' : ''}`}>
                          {isChecked && <Check size={12} />}
                        </div>
                      </div>
                      <div className="selector-info">
                        <span className="selector-name">{e.name}</span>
                        <p className="selector-desc">{e.desc}</p>
                      </div>
                      <div className="selector-price">
                        <span className="p-label">Rental</span>
                        <span className="p-val">+${e.price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 8: EXTRAS */}
            <div className="builder-step-panel" id="step-extras">
              <div className="step-panel-header">
                <span className="step-index-badge">STEP 08</span>
                <div>
                  <h3 className="step-heading">EXPEDITION EXTRAS & LOGISTICAL PERMITS</h3>
                  <p className="step-desc">Drone clearance, Starlink connectivity, supplemental oxygen, and personal porters.</p>
                </div>
              </div>

              <div className="builder-horizontal-selectors-stack">
                {EXTRAS.map(x => {
                  const isChecked = selectedExtras.includes(x.id);
                  return (
                    <div
                      key={x.id}
                      className={`builder-selector-row is-multi ${isChecked ? 'is-selected' : ''}`}
                      onClick={() => toggleExtra(x.id)}
                    >
                      <div className="selector-checkbox">
                        <div className={`checkbox-box ${isChecked ? 'active' : ''}`}>
                          {isChecked && <Check size={12} />}
                        </div>
                      </div>
                      <div className="selector-info">
                        <span className="selector-name">{x.name}</span>
                        <p className="selector-desc">{x.desc}</p>
                      </div>
                      <div className="selector-price">
                        <span className="p-label">Logistics</span>
                        <span className="p-val">+${x.price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 9: REVIEW */}
            <div className="builder-step-panel" id="step-review">
              <div className="step-panel-header">
                <span className="step-index-badge">STEP 09</span>
                <div>
                  <h3 className="step-heading">REVIEW YOUR CUSTOM BLUEPRINT</h3>
                  <p className="step-desc">Consolidated overview of all selected parameters before official submission.</p>
                </div>
              </div>

              <div className="builder-review-matrix">
                <div className="review-matrix-cell">
                  <span className="r-label">DESTINATION:</span>
                  <span className="r-val">{dest.name} ({duration.days} Days)</span>
                </div>
                <div className="review-matrix-cell">
                  <span className="r-label">PARTY FORMAT:</span>
                  <span className="r-val">{groupSize.label}</span>
                </div>
                <div className="review-matrix-cell">
                  <span className="r-label">SHELTER TIER:</span>
                  <span className="r-val">{shelter.name}</span>
                </div>
                <div className="review-matrix-cell">
                  <span className="r-label">FOOD PLAN:</span>
                  <span className="r-val">{food.name}</span>
                </div>
                <div className="review-matrix-cell">
                  <span className="r-label">4x4 TRANSPORT:</span>
                  <span className="r-val">{transport.name}</span>
                </div>
                <div className="review-matrix-cell">
                  <span className="r-label">LEADERSHIP:</span>
                  <span className="r-val">{guide.name}</span>
                </div>
                <div className="review-matrix-cell">
                  <span className="r-label">ACTIVITIES SELECTED:</span>
                  <span className="r-val">{selectedActivities.length} custom excursions</span>
                </div>
                <div className="review-matrix-cell">
                  <span className="r-label">RENTAL & EXTRAS:</span>
                  <span className="r-val">{selectedEquipment.length + selectedExtras.length} additional provisions</span>
                </div>
              </div>
            </div>

          </div>

          {/* Sticky Live Price Calculation Manifest (Requirement 13) */}
          <div className="builder-sticky-summary-wrap">
            <div className="builder-sticky-summary-card">
              <div className="summary-header">
                <span className="summary-eyebrow">DYNAMIC PRICE BREAKDOWN</span>
                <h3 className="summary-title">{dest.name}</h3>
                <div className="summary-subtitle">
                  <span>{duration.days} Days</span>
                  <span className="sep">•</span>
                  <span>{groupSize.label}</span>
                </div>
              </div>

              {/* Dynamic Formula Display */}
              <div className="formula-callout-box">
                <span className="formula-title">PRICING FORMULA</span>
                <span className="formula-text">BASE PRICE + OPTIONS - DISCOUNT = ESTIMATED TOTAL</span>
              </div>

              {/* Itemized Calculation */}
              <div className="summary-calc-list">
                <div className="calc-row">
                  <span className="calc-label">BASE PRICE ({duration.days}D Itinerary)</span>
                  <span className="calc-val">${basePrice}</span>
                </div>
                <div className="calc-row">
                  <span className="calc-label">+ Shelter: {shelter.tier}</span>
                  <span className="calc-val">+${shelterPrice}</span>
                </div>
                <div className="calc-row">
                  <span className="calc-label">+ Food: {food.name.split(' ')[0]}</span>
                  <span className="calc-val">+${foodPrice}</span>
                </div>
                <div className="calc-row">
                  <span className="calc-label">+ Transport: 4x4 Plan</span>
                  <span className="calc-val">+${transportPrice}</span>
                </div>
                <div className="calc-row">
                  <span className="calc-label">+ Guide Leadership</span>
                  <span className="calc-val">+${guidePrice}</span>
                </div>
                <div className="calc-row">
                  <span className="calc-label">+ Activities ({selectedActivities.length})</span>
                  <span className="calc-val">+${activitiesPrice}</span>
                </div>
                <div className="calc-row">
                  <span className="calc-label">+ Equipment & Extras ({selectedEquipment.length + selectedExtras.length})</span>
                  <span className="calc-val">+${equipmentPrice + extrasPrice}</span>
                </div>
                <div className="calc-row discount-row">
                  <span className="calc-label">- Seasonal Privilege (10%)</span>
                  <span className="calc-val">-${discountAmount}</span>
                </div>
              </div>

              {/* Total Calculation Display */}
              <div className="summary-totals-display">
                <div className="totals-line">
                  <span className="total-lead">ESTIMATED PER CLIMBER:</span>
                  <span className="total-amount">${estimatedTotalPerPerson.toLocaleString()} <small>USD</small></span>
                </div>
                <div className="totals-party-line">
                  <span>Total Party Investment ({groupSize.count} pax):</span>
                  <strong>${estimatedTotalParty.toLocaleString()} USD</strong>
                </div>
              </div>

              {/* CTAs */}
              <div className="summary-actions-stack">
                <button
                  className="btn btn-primary summary-book-btn"
                  onClick={handleBookExpedition}
                  id="btn-book-custom-expedition"
                >
                  <Send size={16} />
                  <span>BOOK CUSTOM EXPEDITION</span>
                </button>

                <div className="summary-sub-actions">
                  <button
                    className={`btn btn-secondary ${savedSuccess ? 'saved' : ''}`}
                    onClick={handleSaveBlueprint}
                  >
                    <Bookmark size={14} />
                    <span>{savedSuccess ? 'Saved to Passport!' : 'Save Blueprint'}</span>
                  </button>

                  <button
                    className="btn btn-outline"
                    onClick={handleReset}
                    title="Reset builder to default"
                  >
                    <RotateCcw size={14} />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Legal Disclaimer */}
              <div className="summary-disclaimer">
                <AlertCircle size={13} color="var(--accent-gold)" />
                <span>
                  *Preliminary Estimate: Permits, seasonal glacier conditions, and porter ratios are confirmed upon official expedition dossier review.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
