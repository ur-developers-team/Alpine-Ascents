import React, { useState } from 'react';
import { MapPin, Compass, Calendar, Users, DollarSign, Search, ArrowRight } from 'lucide-react';
import './QuickSearchDock.css';

export default function QuickSearchDock({ onFilterExpeditions, onOpenPlanModal }) {
  const [destination, setDestination] = useState('ALL');
  const [style, setStyle] = useState('ALL');
  const [duration, setDuration] = useState('ALL');
  const [travelers, setTravelers] = useState('2');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onFilterExpeditions) {
      onFilterExpeditions({ destination, style, duration, travelers });
    }
    const el = document.querySelector('#expeditions');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="quick-search-dock-wrapper">
      <div className="site-container">
        <form className="quick-search-dock-card" onSubmit={handleSearchSubmit}>
          {/* Destination */}
          <div className="dock-field">
            <div className="dock-field-label">
              <MapPin size={14} color="var(--accent)" />
              <span>WHERE TO?</span>
            </div>
            <select
              className="dock-select"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              aria-label="Select Destination"
            >
              <option value="ALL">All Mountain Regions</option>
              <option value="hunza-valley">Hunza & Passu Cones</option>
              <option value="skardu-baltoro">Skardu & Baltoro K2</option>
              <option value="fairy-meadows">Fairy Meadows & Nanga Parbat</option>
              <option value="deosai-plateau">Deosai Alpine Plains</option>
              <option value="naltar-valley">Naltar Emerald Lakes</option>
              <option value="kaghan-swat">Kaghan & Swat Valleys</option>
              <option value="himalayas-nepal">Everest & Himalayas</option>
              <option value="alps-chamonix">Mont Blanc & Alps</option>
            </select>
          </div>

          <div className="dock-divider" />

          {/* Travel Style */}
          <div className="dock-field">
            <div className="dock-field-label">
              <Compass size={14} color="var(--accent)" />
              <span>EXPERIENCE TYPE</span>
            </div>
            <select
              className="dock-select"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              aria-label="Select Experience Style"
            >
              <option value="ALL">All Travel Styles</option>
              <option value="FAMILY">Family Friendly</option>
              <option value="COUPLE / LUXURY">Couple / Romantic</option>
              <option value="EXPLORER">Active Explorer</option>
              <option value="TREKKING">Alpine Trekking</option>
              <option value="EXPEDITION PRO">Expedition Pro</option>
              <option value="PHOTOGRAPHY">Photography Focus</option>
              <option value="CAMPING">Wilderness Camping</option>
              <option value="BUDGET">Budget Value</option>
            </select>
          </div>

          <div className="dock-divider" />

          {/* Duration */}
          <div className="dock-field">
            <div className="dock-field-label">
              <Calendar size={14} color="var(--accent)" />
              <span>DURATION</span>
            </div>
            <select
              className="dock-select"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              aria-label="Select Duration"
            >
              <option value="ALL">Any Duration</option>
              <option value="short">Weekend (3 - 5 Days)</option>
              <option value="medium">Standard (6 - 8 Days)</option>
              <option value="long">Deep Expedition (10 - 18 Days)</option>
              <option value="siege">High Siege (20+ Days)</option>
            </select>
          </div>

          <div className="dock-divider" />

          {/* Travelers */}
          <div className="dock-field">
            <div className="dock-field-label">
              <Users size={14} color="var(--accent)" />
              <span>TRAVELERS</span>
            </div>
            <select
              className="dock-select"
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
              aria-label="Select Travelers"
            >
              <option value="1">1 Solo Climber</option>
              <option value="2">2 Travelers (Duo)</option>
              <option value="4">4 Climbers (Rope Team)</option>
              <option value="family">Family (2 Adults + Kids)</option>
              <option value="group">Group / Corporate (6+)</option>
            </select>
          </div>

          {/* Action CTA */}
          <div className="dock-action-cell">
            <button type="submit" className="dock-submit-btn">
              <Search size={16} />
              <span>FIND TRIPS</span>
            </button>
            <button
              type="button"
              className="dock-plan-custom-btn"
              onClick={onOpenPlanModal}
              title="Open full 7-step expedition planner"
            >
              <span>PLANNER</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
