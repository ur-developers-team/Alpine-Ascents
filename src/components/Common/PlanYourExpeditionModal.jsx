import React, { useState } from 'react';
import {
  X, Compass, MapPin, Users, Calendar, Award, DollarSign,
  Mountain, ArrowRight, ArrowLeft, Check, Sparkles, Shield,
  Bookmark, Send, FileText, CheckCircle2, Clock, Truck, Home, Utensils, AlertCircle
} from 'lucide-react';
import { useUserProfile } from '../../context/UserProfileContext';
import { useToast } from '../../context/ToastContext';
import './PlanYourExpeditionModal.css';

import bookingOptionsData from '../../data/bookingOptions.json';

const {
  destinations: DESTINATIONS,
  travelTypes: TRAVEL_TYPES,
  experienceLevels: EXPERIENCE_LEVELS,
  packageTypes: PACKAGE_TYPES,
  budgetRanges: BUDGET_RANGES,
  foodOptions: FOOD_OPTIONS,
  shelterOptions: SHELTER_OPTIONS,
  transportOptions: TRANSPORT_OPTIONS,
  activityOptions: ACTIVITY_OPTIONS
} = bookingOptionsData;

export default function PlanYourExpeditionModal({ isOpen, onClose, onOpenCustomBuilder, onRequestManifest }) {
  const { saveTrip } = useUserProfile();
  const { showToast } = useToast ? useToast() : { showToast: () => {} };

  // 8 steps + Review (9) + Submitted confirmation (10)
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dossierRef, setDossierRef] = useState('');

  // Form Fields
  const [searchDest, setSearchDest] = useState('');
  const [destination, setDestination] = useState(DESTINATIONS[0]);
  const [travelType, setTravelType] = useState(TRAVEL_TYPES[1]);
  const [departureDate, setDepartureDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [durationDays, setDurationDays] = useState(7);
  const [travelers, setTravelers] = useState(2);
  const [experienceLevel, setExperienceLevel] = useState(EXPERIENCE_LEVELS[1]);
  const [packageType, setPackageType] = useState(PACKAGE_TYPES[0]);
  const [budgetRange, setBudgetRange] = useState(BUDGET_RANGES[1]);
  
  // Step 8 Requirements
  const [foodPref, setFoodPref] = useState(FOOD_OPTIONS[0]);
  const [shelterPref, setShelterPref] = useState(SHELTER_OPTIONS[1]);
  const [transportPref, setTransportPref] = useState(TRANSPORT_OPTIONS[0]);
  const [selectedActivities, setSelectedActivities] = useState(['Glacier Trekking', 'Ancient Silk Road Forts']);
  const [specialNotes, setSpecialNotes] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  if (!isOpen) return null;

  const filteredDests = DESTINATIONS.filter(d =>
    d.name.toLowerCase().includes(searchDest.toLowerCase()) ||
    d.region.toLowerCase().includes(searchDest.toLowerCase())
  );

  // Dynamic estimate calculation based on user selections
  const baseRate = destination.id.includes('k2') ? 2200 : destination.id.includes('nanga') ? 1800 : destination.id.includes('skardu') ? 1100 : 780;
  const budgetMultiplier = budgetRange.id === 'budget' ? 0.65 : budgetRange.id === 'luxury' ? 1.7 : budgetRange.id === 'unlimited' ? 2.8 : 1.0;
  const daysMultiplier = durationDays / 7;
  const travelerDiscount = travelers >= 4 ? 0.88 : travelers >= 2 ? 0.95 : 1.0;
  const estimatedPerPerson = Math.round(baseRate * budgetMultiplier * daysMultiplier * travelerDiscount);
  const estimatedTotal = estimatedPerPerson * travelers;

  const toggleActivity = (act) => {
    setSelectedActivities(prev =>
      prev.includes(act) ? prev.filter(a => a !== act) : [...prev, act]
    );
  };

  const handleNext = () => {
    if (step < 8) setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const handleSubmitRequest = () => {
    const refCode = `AA-${destination.id.toUpperCase().slice(0, 3)}-${Math.floor(100000 + Math.random() * 900000)}`;
    setDossierRef(refCode);

    const tripManifest = {
      id: refCode,
      name: `${destination.name} ${packageType.label}`,
      destinationName: destination.name,
      region: destination.region,
      travelStyle: travelType.label,
      departureDate: departureDate,
      durationDays: durationDays,
      groupSize: `${travelers} Explorer(s)`,
      experienceLevel: experienceLevel.label,
      packageType: packageType.label,
      budgetTier: budgetRange.sub,
      foodPreference: foodPref.label,
      shelterPreference: shelterPref.label,
      transportPreference: transportPref.label,
      activities: selectedActivities,
      specialNotes: specialNotes,
      contactName: contactName || 'Alpine Explorer',
      contactEmail: contactEmail || 'explorer@alpineascents.com',
      contactPhone: contactPhone || '+1 (555) 019-2834',
      estimatedTotal: estimatedTotal,
      price: estimatedPerPerson,
      status: 'Expedition Dossier Prepared'
    };

    saveTrip(tripManifest);
    setIsSubmitted(true);

    if (onRequestManifest) {
      onRequestManifest(tripManifest);
    }

    if (showToast) showToast(`🏔 Expedition Dossier #${refCode} Prepared!`, 'success');
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setStep(1);
    onClose();
  };

  return (
    <div className="plan-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="plan-modal-container" onClick={e => e.stopPropagation()}>
        {/* Modal Top Header */}
        <div className="plan-modal-header">
          <div className="plan-modal-header-left">
            <span className="plan-step-pill">
              {isSubmitted ? 'CONFIRMED' : `STEP ${step} OF 8 — PLAN YOUR EXPEDITION`}
            </span>
            <h2 className="plan-modal-title">
              {isSubmitted && 'Expedition Request Prepared'}
              {!isSubmitted && step === 1 && 'STEP 1: Select Your Destination'}
              {!isSubmitted && step === 2 && 'STEP 2: Choose Your Travel Type'}
              {!isSubmitted && step === 3 && 'STEP 3: Travel Dates & Duration'}
              {!isSubmitted && step === 4 && 'STEP 4: Number of Travelers'}
              {!isSubmitted && step === 5 && 'STEP 5: Mountain Experience Level'}
              {!isSubmitted && step === 6 && 'STEP 6: Expedition Package Format'}
              {!isSubmitted && step === 7 && 'STEP 7: Expedition Preferences & Logistics'}
              {!isSubmitted && step === 8 && 'STEP 8: Expedition Review & Request'}
            </h2>
          </div>
          <button className="plan-modal-close" onClick={onClose} aria-label="Close planning modal">
            <X size={20} />
          </button>
        </div>

        {/* Progress Tracker Bar */}
        {!isSubmitted && (
          <div className="plan-progress-track">
            <div className="plan-progress-fill" style={{ width: `${(step / 8) * 100}%` }} />
          </div>
        )}

        {/* Modal Step Content Body */}
        <div className="plan-modal-body">
          {/* CONFIRMATION STATE POST SUBMISSION */}
          {isSubmitted ? (
            <div className="plan-submitted-state animate-fade-in">
              <div className="submitted-hero-icon">
                <CheckCircle2 size={54} color="#10b981" />
              </div>

              <h3 className="submitted-title">Your Expedition Request Has Been Prepared</h3>
              <p className="submitted-sub">
                Reference Dossier ID: <strong className="submitted-ref-code">{dossierRef}</strong>
              </p>

              <div className="submitted-dossier-box">
                <div className="dossier-row">
                  <span className="dossier-label">Destination:</span>
                  <span className="dossier-val">{destination.name} ({destination.region})</span>
                </div>
                <div className="dossier-row">
                  <span className="dossier-label">Departure Date & Duration:</span>
                  <span className="dossier-val">{departureDate} • {durationDays} Days</span>
                </div>
                <div className="dossier-row">
                  <span className="dossier-label">Travel Party:</span>
                  <span className="dossier-val">{travelers} Traveler(s) • {travelType.label}</span>
                </div>
                <div className="dossier-row">
                  <span className="dossier-label">Package Format:</span>
                  <span className="dossier-val">{packageType.label} ({experienceLevel.label} Level)</span>
                </div>
                <div className="dossier-row">
                  <span className="dossier-label">Selected Logistics:</span>
                  <span className="dossier-val">{shelterPref.label} • {transportPref.label}</span>
                </div>
                <div className="dossier-row">
                  <span className="dossier-label">Estimated Total:</span>
                  <span className="dossier-val highlight-gold">${estimatedTotal.toLocaleString()} USD</span>
                </div>
              </div>

              <div className="submitted-notice-box">
                <AlertCircle size={18} color="var(--accent)" />
                <p>
                  <strong>Preparation Note:</strong> This expedition request is now stored in your local Climber Passport. In a full production environment, our accredited Karakoram Base Operations team assigns your UIAGM lead guide and reviews government permit windows within 24 hours. No immediate payment was processed.
                </p>
              </div>

              <div className="submitted-actions-row">
                <button className="btn btn-outline" onClick={() => window.print()}>
                  <FileText size={15} />
                  <span>Print Dossier Summary</span>
                </button>
                <button className="btn btn-primary" onClick={handleReset}>
                  <span>Done & Return to Site</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: DESTINATION (Searchable Dropdown) */}
              {step === 1 && (
                <div className="plan-step-view animate-fade-in">
                  <p className="plan-step-hint">Select your target high-altitude domain across Pakistan and international ranges:</p>
                  <div className="plan-dest-search-wrap">
                    <MapPin size={16} color="var(--accent)" />
                    <input
                      type="text"
                      placeholder="Search destinations (Hunza, Skardu, Gilgit, K2, Nanga Parbat...)"
                      value={searchDest}
                      onChange={(e) => setSearchDest(e.target.value)}
                      className="plan-dest-search-input"
                      autoFocus
                    />
                  </div>

                  <div className="plan-dest-options-grid">
                    {filteredDests.map(d => (
                      <div
                        key={d.id}
                        className={`plan-dest-card ${destination.id === d.id ? 'active' : ''}`}
                        onClick={() => setDestination(d)}
                      >
                        <div className="plan-dest-card-top">
                          <span className="plan-dest-name">{d.name}</span>
                          <span className="plan-dest-alt">{d.altitude}</span>
                        </div>
                        <span className="plan-dest-region">{d.region}</span>
                        <p className="plan-dest-desc">{d.desc}</p>
                        {destination.id === d.id && (
                          <div className="plan-card-check">
                            <Check size={14} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: TRAVEL TYPE */}
              {step === 2 && (
                <div className="plan-step-view animate-fade-in">
                  <p className="plan-step-hint">Tell us who is traveling so we can calibrate accommodations, guides, and vehicles:</p>
                  <div className="plan-grid-2col">
                    {TRAVEL_TYPES.map(t => (
                      <div
                        key={t.id}
                        className={`plan-selection-card ${travelType.id === t.id ? 'active' : ''}`}
                        onClick={() => setTravelType(t)}
                      >
                        <div className="plan-selection-header">
                          <span className="plan-selection-title">{t.label}</span>
                          {travelType.id === t.id && <Check size={16} color="var(--accent)" />}
                        </div>
                        <p className="plan-selection-desc">{t.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: TRAVEL DATE & DURATION (Real Date Picker) */}
              {step === 3 && (
                <div className="plan-step-view animate-fade-in">
                  <p className="plan-step-hint">Select your intended departure calendar date and expedition duration:</p>
                  
                  <div className="plan-date-picker-box">
                    <div className="date-field-group">
                      <label className="field-label">
                        <Calendar size={15} color="var(--accent)" />
                        <span>Preferred Departure Date:</span>
                      </label>
                      <input
                        type="date"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        className="plan-calendar-input"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className="date-field-group">
                      <label className="field-label">
                        <Clock size={15} color="var(--accent)" />
                        <span>Expedition Duration (Days):</span>
                      </label>
                      <div className="duration-stepper">
                        {[5, 7, 10, 14, 21].map(d => (
                          <button
                            key={d}
                            type="button"
                            className={`duration-pill ${durationDays === d ? 'active' : ''}`}
                            onClick={() => setDurationDays(d)}
                          >
                            {d} Days
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="plan-season-recommendation">
                    <Sparkles size={16} color="var(--accent-gold)" />
                    <span>Recommended High Windows: June – September for K2/Nanga Parbat climbs; April – May for Apricot Bloom in Hunza.</span>
                  </div>
                </div>
              )}

              {/* STEP 4: NUMBER OF TRAVELERS */}
              {step === 4 && (
                <div className="plan-step-view animate-fade-in">
                  <p className="plan-step-hint">How many climbers, trekkers, or explorers will be in your party?</p>
                  <div className="plan-traveler-counter-box">
                    <button
                      className="counter-btn"
                      onClick={() => setTravelers(prev => Math.max(1, prev - 1))}
                      aria-label="Decrease travelers"
                    >
                      -
                    </button>
                    <div className="counter-val-wrap">
                      <span className="counter-number">{travelers}</span>
                      <span className="counter-text">{travelers === 1 ? 'Solo Adventurer' : 'Travelers'}</span>
                    </div>
                    <button
                      className="counter-btn"
                      onClick={() => setTravelers(prev => Math.min(24, prev + 1))}
                      aria-label="Increase travelers"
                    >
                      +
                    </button>
                  </div>

                  <div className="plan-traveler-perk">
                    {travelers >= 4 ? (
                      <span className="perk-highlight">✨ 4+ Travelers qualifies for our 12% Shared Rope Team Logistics Discount!</span>
                    ) : travelers >= 2 ? (
                      <span className="perk-highlight">✨ 2 Travelers qualifies for twin-sharing suite privilege.</span>
                    ) : (
                      <span className="perk-highlight">✨ 1:1 dedicated mountain guide ratio and custom pace.</span>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 5: EXPERIENCE LEVEL */}
              {step === 5 && (
                <div className="plan-step-view animate-fade-in">
                  <p className="plan-step-hint">We engineer all acclimatization profiles according to your team's real experience:</p>
                  <div className="plan-list-col">
                    {EXPERIENCE_LEVELS.map(lvl => (
                      <div
                        key={lvl.id}
                        className={`plan-selection-card ${experienceLevel.id === lvl.id ? 'active' : ''}`}
                        onClick={() => setExperienceLevel(lvl)}
                      >
                        <div className="plan-selection-header">
                          <span className="plan-selection-title">{lvl.label}</span>
                          {experienceLevel.id === lvl.id && <Check size={16} color="var(--accent)" />}
                        </div>
                        <p className="plan-selection-desc">{lvl.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6: PACKAGE FORMAT (Curated vs Custom) */}
              {step === 6 && (
                <div className="plan-step-view animate-fade-in">
                  <p className="plan-step-hint">Choose between our battle-tested standard itineraries or a fully bespoke custom route:</p>
                  <div className="plan-grid-2col">
                    {PACKAGE_TYPES.map(pkg => (
                      <div
                        key={pkg.id}
                        className={`plan-selection-card ${packageType.id === pkg.id ? 'active' : ''}`}
                        onClick={() => setPackageType(pkg)}
                      >
                        <div className="plan-selection-header">
                          <div>
                            <span className="plan-selection-title">{pkg.label}</span>
                            <span className="plan-pkg-badge">{pkg.badge}</span>
                          </div>
                          {packageType.id === pkg.id && <Check size={16} color="var(--accent)" />}
                        </div>
                        <p className="plan-selection-desc">{pkg.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 7: PREFERENCES & LOGISTICS (Budget, Food, Shelter, Transport, Activities, Notes) */}
              {step === 7 && (
                <div className="plan-step-view animate-fade-in">
                  <p className="plan-step-hint">Calibrate your expedition budget target, accommodations, cuisine, and logistics:</p>
                  
                  {/* Budget Selector */}
                  <div className="req-subgroup" style={{ marginBottom: '1.25rem' }}>
                    <label className="req-group-title">
                      <DollarSign size={15} color="var(--accent)" />
                      <span>Target Budget Tier:</span>
                    </label>
                    <div className="plan-grid-2col">
                      {BUDGET_RANGES.map(b => (
                        <div
                          key={b.id}
                          className={`plan-budget-card ${budgetRange.id === b.id ? 'active' : ''}`}
                          onClick={() => setBudgetRange(b)}
                        >
                          <div className="plan-budget-price">{b.label}</div>
                          <div className="plan-budget-sub">{b.sub}</div>
                          <p className="plan-budget-desc">{b.desc}</p>
                          {budgetRange.id === b.id && <Check size={16} color="var(--accent)" className="budget-check" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="requirements-scroll-area">
                    {/* Food Preference */}
                    <div className="req-subgroup">
                      <label className="req-group-title">
                        <Utensils size={15} color="var(--accent)" />
                        <span>Food & Trail Gastronomy:</span>
                      </label>
                      <div className="req-chips-grid">
                        {FOOD_OPTIONS.map(f => (
                          <div
                            key={f.id}
                            className={`req-chip-card ${foodPref.id === f.id ? 'active' : ''}`}
                            onClick={() => setFoodPref(f)}
                          >
                            <span className="chip-name">{f.label}</span>
                            <span className="chip-desc">{f.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shelter Preference */}
                    <div className="req-subgroup">
                      <label className="req-group-title">
                        <Home size={15} color="var(--accent)" />
                        <span>Shelter & Accommodation:</span>
                      </label>
                      <div className="req-chips-grid">
                        {SHELTER_OPTIONS.map(s => (
                          <div
                            key={s.id}
                            className={`req-chip-card ${shelterPref.id === s.id ? 'active' : ''}`}
                            onClick={() => setShelterPref(s)}
                          >
                            <span className="chip-name">{s.label}</span>
                            <span className="chip-desc">{s.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Transport Preference */}
                    <div className="req-subgroup">
                      <label className="req-group-title">
                        <Truck size={15} color="var(--accent)" />
                        <span>Transport & Mobility:</span>
                      </label>
                      <div className="req-chips-grid">
                        {TRANSPORT_OPTIONS.map(tr => (
                          <div
                            key={tr.id}
                            className={`req-chip-card ${transportPref.id === tr.id ? 'active' : ''}`}
                            onClick={() => setTransportPref(tr)}
                          >
                            <span className="chip-name">{tr.label}</span>
                            <span className="chip-desc">{tr.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Activities Multi-select */}
                    <div className="req-subgroup">
                      <label className="req-group-title">
                        <Mountain size={15} color="var(--accent)" />
                        <span>Included Activities:</span>
                      </label>
                      <div className="act-pill-selector">
                        {ACTIVITY_OPTIONS.map(act => {
                          const isSel = selectedActivities.includes(act);
                          return (
                            <button
                              key={act}
                              type="button"
                              className={`act-pill ${isSel ? 'active' : ''}`}
                              onClick={() => toggleActivity(act)}
                            >
                              {isSel ? <Check size={13} /> : <span>+</span>}
                              <span>{act}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Special Notes */}
                    <div className="req-subgroup">
                      <label className="req-group-title">
                        <FileText size={15} color="var(--accent)" />
                        <span>Special Medical, Gear, or Dietary Requirements:</span>
                      </label>
                      <textarea
                        className="plan-textarea"
                        placeholder="E.g., High-altitude acclimatization sensitivity, vegetarian preferences, specific gear rental requirements..."
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 8: FINAL REVIEW & EXPEDITION SUMMARY */}
              {step === 8 && (
                <div className="plan-step-view plan-summary-view animate-fade-in">
                  <div className="summary-banner">
                    <Sparkles size={20} color="var(--accent-gold)" />
                    <div>
                      <h4>Official Expedition Request Blueprint</h4>
                      <p>Review your parameters before generating your official expedition dossier.</p>
                    </div>
                  </div>

                  <div className="summary-card-matrix">
                    <div className="summary-cell">
                      <span className="cell-label">Destination</span>
                      <span className="cell-value highlight">{destination.name}</span>
                      <span className="cell-sub">{destination.region} ({destination.altitude})</span>
                    </div>
                    <div className="summary-cell">
                      <span className="cell-label">Dates & Duration</span>
                      <span className="cell-value">{durationDays} Days</span>
                      <span className="cell-sub">Departing {departureDate}</span>
                    </div>
                    <div className="summary-cell">
                      <span className="cell-label">Travel Party</span>
                      <span className="cell-value">{travelers} Traveler(s)</span>
                      <span className="cell-sub">{travelType.label}</span>
                    </div>
                    <div className="summary-cell">
                      <span className="cell-label">Package Format</span>
                      <span className="cell-value">{packageType.label}</span>
                      <span className="cell-sub">{experienceLevel.label} Tier</span>
                    </div>
                  </div>

                  {/* Options Snapshot */}
                  <div className="summary-options-snapshot">
                    <div className="snap-item"><strong>Budget Tier:</strong> {budgetRange.sub}</div>
                    <div className="snap-item"><strong>Stay:</strong> {shelterPref.label}</div>
                    <div className="snap-item"><strong>Meals:</strong> {foodPref.label}</div>
                    <div className="snap-item"><strong>Transport:</strong> {transportPref.label}</div>
                    <div className="snap-item"><strong>Activities:</strong> {selectedActivities.join(', ')}</div>
                  </div>

                  {/* Contact Fields with Phone */}
                  <div className="summary-contact-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
                    <input
                      type="text"
                      className="summary-input"
                      placeholder="Your Full Name *"
                      value={contactName}
                      onChange={e => setContactName(e.target.value)}
                      required
                    />
                    <input
                      type="email"
                      className="summary-input"
                      placeholder="Email Address (for dossier dispatch) *"
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      required
                    />
                    <input
                      type="tel"
                      className="summary-input"
                      placeholder="Contact Phone Number"
                      value={contactPhone}
                      onChange={e => setContactPhone(e.target.value)}
                    />
                  </div>

                  <div className="summary-financial-box">
                    <div className="financial-row">
                      <span>Estimated Total ({travelers} Travelers • {durationDays} Days)</span>
                      <span className="financial-total">${estimatedTotal.toLocaleString()} USD</span>
                    </div>
                    <div className="financial-subtext">
                      ≈ ${estimatedPerPerson.toLocaleString()} USD per traveler • Includes mountain logistics, certified guide ratio, park permits & full board
                    </div>
                  </div>

                  <div className="summary-disclaimer">
                    *Estimated Price: Final expedition permits and guide allocations will be validated in your official dossier without immediate payment.
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Bottom Actions Footer */}
        {!isSubmitted && (
          <div className="plan-modal-footer">
            {step > 1 ? (
              <button className="btn btn-outline" onClick={handleBack}>
                <ArrowLeft size={16} />
                <span>Previous</span>
              </button>
            ) : (
              <div />
            )}

            <div className="plan-footer-actions">
              {step < 8 ? (
                <button className="btn btn-primary" onClick={handleNext} id="plan-modal-continue-btn">
                  <span>{step === 7 ? 'Review Blueprint & Estimate' : 'Continue'}</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" onClick={handleSubmitRequest} id="plan-submit-request-btn">
                    <Send size={15} />
                    <span>REQUEST BOOKING</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
