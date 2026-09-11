import React, { useState } from 'react';
import GearPackingGame from './GearPackingGame';
import OxygenStaminaChallenge from './OxygenStaminaChallenge';
import HazardReactionGame from './HazardReactionGame';
import RouteStoryAdventure from './RouteStoryAdventure';
import { Gamepad2, Briefcase, Activity, AlertTriangle, Compass, Award } from 'lucide-react';
import './MiniGamesHub.css';

export default function MiniGamesHub() {
  const [activeGame, setActiveGame] = useState('gear');

  const games = [
    { id: 'gear', label: 'PACK YOUR EXPEDITION', icon: <Briefcase size={15} /> },
    { id: 'oxygen', label: 'DEATH ZONE PACE', icon: <Activity size={15} /> },
    { id: 'hazard', label: 'AVALANCHE REFLEX', icon: <AlertTriangle size={15} /> },
    { id: 'route', label: 'CHOOSE YOUR ROUTE', icon: <Compass size={15} /> }
  ];

  return (
    <section id="mini-games-hub" className="section mini-games-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Gamepad2 size={14} />
            <span>INTERACTIVE SIMULATIONS</span>
          </div>
          <h2 className="section-title">ALPINE EXPEDITION CHALLENGES</h2>
          <p className="section-subtitle">
            Test your survival instincts, gear preparation, pace control, and route decision-making in realistic Karakoram high-altitude scenarios.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="games-nav-tab-bar" role="tablist">
          {games.map(g => (
            <button
              key={g.id}
              className={`btn btn-sm ${activeGame === g.id ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveGame(g.id)}
              role="tab"
              aria-selected={activeGame === g.id}
            >
              {g.icon}
              <span>{g.label}</span>
            </button>
          ))}
        </div>

        {/* Active Game Panes */}
        <div className="games-panes-wrapper">
          {activeGame === 'gear' && <GearPackingGame />}
          {activeGame === 'oxygen' && <OxygenStaminaChallenge />}
          {activeGame === 'hazard' && <HazardReactionGame />}
          {activeGame === 'route' && <RouteStoryAdventure />}
        </div>
      </div>
    </section>
  );
}
