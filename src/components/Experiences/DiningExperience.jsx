import React, { useState } from 'react';
import foodData from '../../data/food.json';
import { Utensils, Check, Sparkles, Coffee, Sun, Moon, ShieldCheck, Heart } from 'lucide-react';
import './Experiences.css';

export default function DiningExperience() {
  const [selectedRegionId, setSelectedRegionId] = useState('food-hunza-local');
  const [activeMealSection, setActiveMealSection] = useState('local-cuisine');

  const currentPlan = foodData.find(f => f.id === selectedRegionId) || foodData[0];

  const mealModules = [
    { id: 'local-cuisine', label: 'Local Cuisine', icon: Utensils, title: 'Traditional High-Altitude Mountain Fare' },
    { id: 'breakfast', label: 'Breakfast', icon: Coffee, title: 'Pre-Dawn Summit & Trail Fuel' },
    { id: 'lunch', label: 'Lunch', icon: Sun, title: 'Portable Moraine Trail Rations' },
    { id: 'dinner', label: 'Dinner', icon: Moon, title: 'Hot Evening Recovery Feasts' },
    { id: 'dietary', label: 'Special Dietary Options', icon: ShieldCheck, title: 'Custom Organic & Allergy Profiles' }
  ];

  return (
    <div className="dining-experience-wrap">
      <div className="exp-module-header">
        <span className="exp-module-eyebrow">GASTRONOMY & CELLULAR METABOLISM</span>
        <h3 className="exp-module-title">WHAT WILL YOU EAT?</h3>
        <p className="exp-module-desc">
          High-altitude physiology burns 4,000+ calories daily. Explore nutrient-dense organic grains, fresh glacial river trout, and custom chef provisions.
        </p>
      </div>

      {/* Regional Selector Pills */}
      <div className="dining-regions-bar" role="tablist">
        {foodData.map(f => (
          <button
            key={f.id}
            className={`dining-region-btn ${selectedRegionId === f.id ? 'active' : ''}`}
            onClick={() => setSelectedRegionId(f.id)}
            role="tab"
            aria-selected={selectedRegionId === f.id}
          >
            <span>{f.region}</span>
          </button>
        ))}
      </div>

      {/* Expandable Module Selector Buttons */}
      <div className="meal-modules-nav" role="tablist">
        {mealModules.map(m => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              className={`meal-module-btn ${activeMealSection === m.id ? 'active' : ''}`}
              onClick={() => setActiveMealSection(m.id)}
              role="tab"
              aria-selected={activeMealSection === m.id}
            >
              <Icon size={15} />
              <span>[ {m.label} ]</span>
            </button>
          );
        })}
      </div>

      {/* Active Meal Module Detail Panel */}
      <div className="meal-module-card animate-fade-in">
        {activeMealSection === 'local-cuisine' && (
          <div className="meal-panel-content">
            <div className="meal-panel-header">
              <span className="meal-cuisine-tag">{currentPlan.cuisineType}</span>
              <span className="meal-inc-badge">{currentPlan.inclusionStatus}</span>
            </div>
            <h4 className="meal-section-title">Authentic Mountain Hearth Gastronomy</h4>
            <p className="meal-body-text">
              Centuries-old recipes perfected in mountain valleys using cold-pressed apricot kernel oil, whole stoneground buckwheat, wild mountain cumin, and slow-braised meats.
            </p>
            <div className="meal-metabolic-benefit">
              <Sparkles size={16} color="var(--accent)" />
              <div>
                <strong>Metabolic & High-Altitude Benefit:</strong>
                <p>{currentPlan.altitudeBenefit}</p>
              </div>
            </div>
          </div>
        )}

        {activeMealSection === 'breakfast' && (
          <div className="meal-panel-content">
            <div className="meal-panel-header">
              <span className="meal-cuisine-tag">Alpine Dawn Staging</span>
              <span className="meal-inc-badge">Daily Hot Breakfast</span>
            </div>
            <h4 className="meal-section-title">Pre-Climb Energy Loading</h4>
            <p className="meal-body-text">{currentPlan.breakfast}</p>
            <div className="meal-highlights-list">
              <div className="hl-item"><Check size={14} color="#10b981" /><span>Freshly brewed Tumuro herbal tea & mountain coffee</span></div>
              <div className="hl-item"><Check size={14} color="#10b981" /><span>Slow-burning carbohydrates for sustained trail output</span></div>
            </div>
          </div>
        )}

        {activeMealSection === 'lunch' && (
          <div className="meal-panel-content">
            <div className="meal-panel-header">
              <span className="meal-cuisine-tag">On the Moraine Trail</span>
              <span className="meal-inc-badge">High Energy Pocket Packs</span>
            </div>
            <h4 className="meal-section-title">Midday Trail Rations & Pocket Provisions</h4>
            <p className="meal-body-text">{currentPlan.lunch}</p>
            <div className="meal-highlights-list">
              <div className="hl-item"><Check size={14} color="#10b981" /><span>Electrolyte powder replenishments provided at lunch break</span></div>
              <div className="hl-item"><Check size={14} color="#10b981" /><span>Vacuum-sealed, weather-proof packaging</span></div>
            </div>
          </div>
        )}

        {activeMealSection === 'dinner' && (
          <div className="meal-panel-content">
            <div className="meal-panel-header">
              <span className="meal-cuisine-tag">Base Camp Mess Tent</span>
              <span className="meal-inc-badge">3-Course Hot Feasts</span>
            </div>
            <h4 className="meal-section-title">Evening Recovery & Warm Hearth Dining</h4>
            <p className="meal-body-text">{currentPlan.dinner}</p>
            <div className="meal-highlights-list">
              <div className="hl-item"><Check size={14} color="#10b981" /><span>High-protein repair nutrients to rebuild muscle glycogen</span></div>
              <div className="hl-item"><Check size={14} color="#10b981" /><span>Served hot inside heated dining mess tents or palace hearths</span></div>
            </div>
          </div>
        )}

        {activeMealSection === 'dietary' && (
          <div className="meal-panel-content">
            <div className="meal-panel-header">
              <span className="meal-cuisine-tag">Bespoke Dietary Adaptations</span>
              <span className="meal-inc-badge">Tailored on Request</span>
            </div>
            <h4 className="meal-section-title">Custom Dietary Preferences & Allergies</h4>
            <p className="meal-body-text">
              Our expedition culinary team accommodates all major lifestyle and medical preferences without sacrificing nutritional caloric density:
            </p>
            <div className="dietary-tags-grid">
              {currentPlan.dietaryOptions && currentPlan.dietaryOptions.map((opt, i) => (
                <div key={i} className="diet-pill">
                  <Heart size={14} color="#f43f5e" />
                  <span>{opt}</span>
                </div>
              ))}
              <div className="diet-pill">
                <Heart size={14} color="#f43f5e" />
                <span>100% Halal Certified Meats</span>
              </div>
              <div className="diet-pill">
                <Heart size={14} color="#f43f5e" />
                <span>Pure Glacial Filtered Drinking Water (Boiled + Steripen)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
