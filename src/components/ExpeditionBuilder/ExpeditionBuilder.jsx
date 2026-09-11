import React, { useState } from 'react';
import { useUserProfile } from '../../context/UserProfileContext';
import { Compass, Check, ArrowRight, ArrowLeft, Bookmark, Send, Sparkles, AlertCircle } from 'lucide-react';
import './ExpeditionBuilder.css';

const DESTINATIONS = [
  { id: 'gb-hunza', name: 'Hunza Valley & Passu', region: 'Gilgit-Baltistan', basePrice: 450, desc: 'Silk Road kingdom, ancient forts, Passu Cones' },
  { id: 'gb-skardu-k2', name: 'Skardu & K2 Concordia', region: 'Gilgit-Baltistan', basePrice: 950, desc: 'Baltoro glacier siege, Trango Towers, K2 basecamp' },
  { id: 'gb-fairy-meadows', name: 'Nanga Parbat & Fairy Meadows', region: 'Gilgit-Baltistan', basePrice: 420, desc: 'Raikot face, alpine pine cabins, Beyal glacier' },
  { id: 'np-everest', name: 'Everest Base Camp & Khumbu', region: 'Himalayas, Nepal', basePrice: 850, desc: 'Sherpa teahouses, Tengboche monastery, Kala Patthar' },
  { id: 'fr-mont-blanc', name: 'Mont Blanc & Chamonix', region: 'Alps, France/Italy', basePrice: 780, desc: 'Classic alpine crest, Gouter ridge, cable car skywalk' },
  { id: 'ar-fitz-roy', name: 'Mount Fitz Roy & El Chaltén', region: 'Patagonia, Argentina', basePrice: 680, desc: 'Granite spires, glacial lagoons, roaring wind' }
];

const DURATIONS = [
  { days: 7, label: '7 Days (Express Route)', multiplier: 1.0 },
  { days: 12, label: '12 Days (Standard Acclimatization)', multiplier: 1.55 },
  { days: 16, label: '16 Days (Deep Wilderness Push)', multiplier: 1.95 },
  { days: 21, label: '21 Days (High Glacial Siege)', multiplier: 2.45 },
  { days: 28, label: '28 Days (Full Summit Expedition)', multiplier: 3.1 }
];

const STYLES = [
  { id: 'explorer', name: 'Explorer', priceAdd: 0, desc: 'Active, authentic, teahouses and lightweight trail camping.' },
  { id: 'comfort', name: 'Comfort', priceAdd: 280, desc: 'Private wooden pine chalets, hot bucket showers, paced stages.' },
  { id: 'premium', name: 'Premium', priceAdd: 650, desc: 'Restored royal forts, heated glamping domes, private chefs.' },
  { id: 'expedition-pro', name: 'Expedition Pro', priceAdd: 520, desc: 'Technical high-altitude siege support, high porters, satellite tracking.' }
];

const GROUP_SIZES = [
  { id: 'solo', label: 'Solo Climber', multiplier: 1.25, desc: 'Dedicated private guide and bespoke pace.' },
  { id: 'small', label: '2 - 4 Climbers (Rope Team)', multiplier: 1.0, desc: 'Ideal balance of camaraderie and agility.' },
  { id: 'medium', label: '5 - 8 Climbers', multiplier: 0.88, desc: 'Shared group porter logistics with 12% group discount.' },
  { id: 'large', label: '9 - 12 Climbers', multiplier: 0.80, desc: 'Large expedition team with 20% team discount.' }
];

const ACTIVITIES = [
  { id: 'glacier-trek', name: 'Glacier Trekking & Moraines', price: 120 },
  { id: 'ice-climbing', name: 'Waterfall & Serac Ice Climbing', price: 240 },
  { id: 'astrophotography', name: 'Alpine Astrophotography Night', price: 90 },
  { id: 'cultural-tour', name: 'Ancient Silk Road Forts & Villages', price: 80 },
  { id: 'high-camping', name: 'High-Altitude Wilderness Bivouac', price: 150 }
];

const ACCOMMODATIONS = [
  { id: 'base-tents', name: '4-Season Geodesic Expedition Tents', price: 80, desc: 'Windproof Mountain Hardwear dome tents with warm mats.' },
  { id: 'alpine-lodges', name: 'Authentic Alpine Guesthouses', price: 180, desc: 'Family-run mountain lodges with wood-stove dining.' },
  { id: 'glamping-domes', name: 'Lakeview Heated Glamping Domes', price: 340, desc: 'Panoramic glass domes suspended over glacial waters.' },
  { id: 'heritage-forts', name: '5-Star Royal Palace Forts (Serena)', price: 580, desc: 'Centuries-old Tibetan timber suites and royal gardens.' }
];

const TRANSPORTS = [
  { id: '4x4-jeep', name: 'Private 4x4 Land Cruiser / Hilux', price: 220, desc: 'Chauffeur-driven with off-road suspension and snorkel.' },
  { id: 'flight-jeep', name: 'Scenic Domestic Flight + 4x4 Jeep', price: 420, desc: 'Aerial flight over Nanga Parbat plus dedicated ground 4x4.' },
  { id: 'heli-charter', name: 'Helicopter High-Altitude Shuttle', price: 1100, desc: 'Military-grade turbine helicopter transfer to high base camps.' }
];

const ADDONS = [
  { id: 'private-guide', name: 'Dedicated UIAGM / Senior High Guide', price: 350 },
  { id: 'sat-comms', name: 'Garmin inReach Satellite Emergency Kit', price: 95 },
  { id: 'gear-rental', name: 'Full B3 Boots, Crampons & Ice Axe Rental', price: 180 },
  { id: 'extra-day', name: 'Extra High Acclimatization Day & Night', price: 140 }
];

export default function ExpeditionBuilder({ initialDestinationId, onRequestExpedition }) {
  const { saveTrip } = useUserProfile();
  const [currentStep, setCurrentStep] = useState(1);
  const [savedStatus, setSavedStatus] = useState(false);

  // Configuration state
  const [dest, setDest] = useState(DESTINATIONS.find(d => d.id === initialDestinationId) || DESTINATIONS[0]);
  const [duration, setDuration] = useState(DURATIONS[0]);
  const [style, setStyle] = useState(STYLES[0]);
  const [groupSize, setGroupSize] = useState(GROUP_SIZES[1]);
  const [selectedActivities, setSelectedActivities] = useState(['glacier-trek']);
  const [accommodation, setAccommodation] = useState(ACCOMMODATIONS[0]);
  const [transport, setTransport] = useState(TRANSPORTS[0]);
  const [selectedAddons, setSelectedAddons] = useState(['sat-comms']);

  // Dynamic Price Calculation
  const baseCost = Math.round(dest.basePrice * duration.multiplier);
  const styleCost = style.priceAdd;
  const stayCost = accommodation.price;
  const transportCost = transport.price;
  const activitiesCost = selectedActivities.reduce((sum, actId) => {
    const act = ACTIVITIES.find(a => a.id === actId);
    return sum + (act ? act.price : 0);
  }, 0);
  const addonsCost = selectedAddons.reduce((sum, addId) => {
    const add = ADDONS.find(a => a.id === addId);
    return sum + (add ? add.price : 0);
  }, 0);

  const rawTotal = (baseCost + styleCost + stayCost + transportCost + activitiesCost + addonsCost) * groupSize.multiplier;
  const estimatedTotal = Math.round(rawTotal);
  const originalEstimate = Math.round(rawTotal * 1.18);
  const savings = originalEstimate - estimatedTotal;

  const toggleActivity = (id) => {
    setSelectedActivities(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const toggleAddon = (id) => {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleSaveTrip = () => {
    const tripManifest = {
      destination: dest.name,
      destinationName: dest.name,
      durationDays: duration.days,
      duration: `${duration.days} Days`,
      travelStyle: style.name,
      groupSize: groupSize.label,
      accommodation: accommodation.name,
      transport: transport.name,
      activities: selectedActivities.map(id => ACTIVITIES.find(a => a.id === id)?.name),
      addons: selectedAddons.map(id => ADDONS.find(a => a.id === id)?.name),
      estimatedTotal,
      savings
    };
    saveTrip(tripManifest);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3500);
  };

  const handleRequestClick = () => {
    const tripManifest = {
      name: `${dest.name} Custom Expedition`,
      destinationName: dest.name,
      duration: `${duration.days} Days`,
      travelStyle: style.name,
      groupSize: groupSize.label,
      accommodation: accommodation.name,
      transport: transport.name,
      price: estimatedTotal,
      type: style.name.toUpperCase()
    };
    onRequestExpedition && onRequestExpedition(tripManifest);
  };

  const stepNames = [
    'Destination', 'Duration', 'Travel Style', 'Group Size',
    'Activities', 'Stay', 'Transport', 'Add-ons'
  ];

  return (
    <section id="trip-builder" className="section builder-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Compass size={14} />
            <span>BESPOKE EXPEDITION ARCHITECT</span>
          </div>
          <h2 className="section-title">BUILD YOUR EXPEDITION</h2>
          <p className="section-subtitle">
            Configure your custom mountain journey step-by-step. Real-time cost estimates dynamically update with high-altitude safety requirements and group discounts.
          </p>
        </div>

        <div className="builder-wrapper">
          {/* Header */}
          <div className="builder-header">
            <div>
              <span className="hud-tag" style={{ marginBottom: '0.35rem' }}>STEP 0{currentStep} OF 08</span>
              <h3 style={{ fontSize: '1.4rem' }}>{stepNames[currentStep - 1]}</h3>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {currentStep > 1 && (
                <button className="btn btn-outline btn-sm" onClick={() => setCurrentStep(currentStep - 1)}>
                  <ArrowLeft size={14} />
                  <span>Previous</span>
                </button>
              )}
              {currentStep < 8 ? (
                <button className="btn btn-primary btn-sm" onClick={() => setCurrentStep(currentStep + 1)}>
                  <span>Next Step</span>
                  <ArrowRight size={14} />
                </button>
              ) : (
                <button className="btn btn-primary btn-sm" onClick={handleRequestClick}>
                  <Send size={14} />
                  <span>Review Manifest</span>
                </button>
              )}
            </div>
          </div>

          {/* 8-Step Navigation Bar */}
          <div className="builder-steps-nav" role="tablist">
            {stepNames.map((name, idx) => {
              const stepNum = idx + 1;
              const isDone = stepNum < currentStep;
              const isActive = stepNum === currentStep;
              return (
                <button
                  key={name}
                  className={`builder-step-tab ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                  onClick={() => setCurrentStep(stepNum)}
                  role="tab"
                  aria-selected={isActive}
                >
                  <span className="builder-step-num">
                    {isDone ? '✓ ' : ''}STEP 0{stepNum}
                  </span>
                  <span>{name}</span>
                </button>
              );
            })}
          </div>

          {/* Content Grid */}
          <div className="builder-content-grid">
            {/* Step Selection Pane */}
            <div className="builder-step-pane">
              {/* STEP 1: DESTINATION */}
              {currentStep === 1 && (
                <div>
                  <h4>Select Your Primary Mountain Domain</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Choose the glaciated region for your base and approach route.
                  </p>
                  <div className="builder-options-grid">
                    {DESTINATIONS.map(d => (
                      <div
                        key={d.id}
                        className={`builder-option-card ${dest.id === d.id ? 'selected' : ''}`}
                        onClick={() => setDest(d)}
                      >
                        <div>
                          <span className="section-eyebrow" style={{ fontSize: '0.68rem', marginBottom: '0.2rem' }}>{d.region}</span>
                          <h4>{d.name}</h4>
                          <p>{d.desc}</p>
                        </div>
                        <div className="builder-option-price">From ${d.basePrice} Base</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: DURATION */}
              {currentStep === 2 && (
                <div>
                  <h4>Select Expedition Length</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    High-altitude safety mandates proper acclimatization pacing.
                  </p>
                  <div className="builder-options-grid">
                    {DURATIONS.map(dur => (
                      <div
                        key={dur.days}
                        className={`builder-option-card ${duration.days === dur.days ? 'selected' : ''}`}
                        onClick={() => setDuration(dur)}
                      >
                        <h4>{dur.days} Days</h4>
                        <p>{dur.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: TRAVEL STYLE */}
              {currentStep === 3 && (
                <div>
                  <h4>Select Expedition Style & Comfort Tier</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Tailor the level of shelter, support personnel, and wilderness immersion.
                  </p>
                  <div className="builder-options-grid">
                    {STYLES.map(s => (
                      <div
                        key={s.id}
                        className={`builder-option-card ${style.id === s.id ? 'selected' : ''}`}
                        onClick={() => setStyle(s)}
                      >
                        <div>
                          <h4>{s.name}</h4>
                          <p>{s.desc}</p>
                        </div>
                        <div className="builder-option-price">
                          {s.priceAdd === 0 ? 'Standard Base' : `+$${s.priceAdd}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: GROUP SIZE */}
              {currentStep === 4 && (
                <div>
                  <h4>Expedition Team Composition</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Larger rope teams benefit from shared logistical porter fees and group rates.
                  </p>
                  <div className="builder-options-grid">
                    {GROUP_SIZES.map(g => (
                      <div
                        key={g.id}
                        className={`builder-option-card ${groupSize.id === g.id ? 'selected' : ''}`}
                        onClick={() => setGroupSize(g)}
                      >
                        <h4>{g.label}</h4>
                        <p>{g.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: ACTIVITIES */}
              {currentStep === 5 && (
                <div>
                  <h4>Included High-Altitude Activities</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Select specialized disciplines to include in your expedition manifest.
                  </p>
                  <div className="builder-options-grid">
                    {ACTIVITIES.map(act => (
                      <div
                        key={act.id}
                        className={`builder-option-card ${selectedActivities.includes(act.id) ? 'selected' : ''}`}
                        onClick={() => toggleActivity(act.id)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4>{act.name}</h4>
                          {selectedActivities.includes(act.id) && <Check size={16} color="var(--accent)" />}
                        </div>
                        <div className="builder-option-price">+${act.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6: ACCOMMODATION */}
              {currentStep === 6 && (
                <div>
                  <h4>Shelter & Base Camp Infrastructure</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    From geodesic high glacier tents to heated lakeside domes.
                  </p>
                  <div className="builder-options-grid">
                    {ACCOMMODATIONS.map(acc => (
                      <div
                        key={acc.id}
                        className={`builder-option-card ${accommodation.id === acc.id ? 'selected' : ''}`}
                        onClick={() => setAccommodation(acc)}
                      >
                        <div>
                          <h4>{acc.name}</h4>
                          <p>{acc.desc}</p>
                        </div>
                        <div className="builder-option-price">+${acc.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 7: TRANSPORT */}
              {currentStep === 7 && (
                <div>
                  <h4>Ground & Mountain Access Transport</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Choose your transit mode through rugged mountain gorges.
                  </p>
                  <div className="builder-options-grid">
                    {TRANSPORTS.map(t => (
                      <div
                        key={t.id}
                        className={`builder-option-card ${transport.id === t.id ? 'selected' : ''}`}
                        onClick={() => setTransport(t)}
                      >
                        <div>
                          <h4>{t.name}</h4>
                          <p>{t.desc}</p>
                        </div>
                        <div className="builder-option-price">+${t.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 8: ADD-ONS */}
              {currentStep === 8 && (
                <div>
                  <h4>High-Altitude Equipment & Safety Add-Ons</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Optional safety gear, professional guides, and communication units.
                  </p>
                  <div className="builder-options-grid">
                    {ADDONS.map(add => (
                      <div
                        key={add.id}
                        className={`builder-option-card ${selectedAddons.includes(add.id) ? 'selected' : ''}`}
                        onClick={() => toggleAddon(add.id)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4>{add.name}</h4>
                          {selectedAddons.includes(add.id) && <Check size={16} color="var(--accent)" />}
                        </div>
                        <div className="builder-option-price">+${add.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Live Dynamic Price Summary Pane */}
            <div className="builder-summary-pane">
              <div>
                <span className="section-eyebrow">ESTIMATED MANIFEST BREAKDOWN</span>
                <h4 style={{ fontSize: '1.25rem', marginTop: '0.25rem' }}>{dest.name}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {duration.days} Days · {style.name} · {groupSize.label}
                </div>

                {/* Calculation List */}
                <div className="summary-calc-list">
                  <div className="summary-calc-row">
                    <span>Base Approach Route</span>
                    <span>${baseCost}</span>
                  </div>
                  <div className="summary-calc-row">
                    <span>Style Tier ({style.name})</span>
                    <span>+${styleCost}</span>
                  </div>
                  <div className="summary-calc-row">
                    <span>Accommodation ({accommodation.name.split(' ')[0]})</span>
                    <span>+${stayCost}</span>
                  </div>
                  <div className="summary-calc-row">
                    <span>Transport Mode</span>
                    <span>+${transportCost}</span>
                  </div>
                  <div className="summary-calc-row">
                    <span>Activities ({selectedActivities.length})</span>
                    <span>+${activitiesCost}</span>
                  </div>
                  <div className="summary-calc-row">
                    <span>Add-ons ({selectedAddons.length})</span>
                    <span>+${addonsCost}</span>
                  </div>

                  <div className="summary-calc-row total">
                    <span>ESTIMATED TOTAL</span>
                    <span style={{ color: 'var(--accent)' }}>${estimatedTotal}</span>
                  </div>
                </div>

                {/* Savings Badge */}
                <div className="summary-save-badge">
                  <Sparkles size={14} />
                  <span>YOU SAVE ${savings} WITH EARLY BIRD & TEAM RATE</span>
                </div>

                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.85rem' }}>
                  *Illustrative demo pricing for architectural showcase. No real booking/payment charges.
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1.5rem' }}>
                <button
                  className="btn btn-primary"
                  onClick={handleRequestClick}
                >
                  <Send size={16} />
                  <span>REQUEST THIS EXPEDITION</span>
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={handleSaveTrip}
                >
                  <Bookmark size={16} />
                  <span>{savedStatus ? '✓ SAVED TO YOUR PROFILE!' : 'SAVE THIS TRIP'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
