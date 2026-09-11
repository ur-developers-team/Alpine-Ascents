import React, { useState } from 'react';
import { useGamification } from '../../context/GamificationContext';
import { Mountain, Flag, Trophy, Award, ChevronUp, ChevronDown, Compass, Gamepad2 } from 'lucide-react';
import './ClimbSummitHUD.css';

export default function ClimbSummitHUD({ onOpenGames }) {
  const { progressStats, setShowCertificate, setShowCelebration } = useGamification();
  const [isExpanded, setIsExpanded] = useState(false);

  const { percentage, currentStage, isSummit } = progressStats;

  // Calculate climber position along mountain slope (SVG coordinate 0% to 100%)
  const climberY = 100 - percentage; // 100 is base, 0 is summit
  const climberX = 15 + (percentage * 0.7); // moves from left (15%) toward summit (85%)

  return (
    <aside
      className={`climb-summit-hud ${isExpanded ? 'expanded' : 'collapsed'}`}
      aria-label="Expedition Summit Ascent Progress"
    >
      {/* HUD Header Bar / Toggle */}
      <div className="hud-pill-header" onClick={() => setIsExpanded(prev => !prev)}>
        <div className="hud-pill-left">
          <div className={`hud-summit-icon ${isSummit ? 'apex-glow' : ''}`}>
            {isSummit ? <Flag size={18} color="#d4af37" /> : <Mountain size={18} />}
          </div>
          <div className="hud-pill-info">
            <span className="hud-pill-label">
              {isSummit ? 'SUMMIT CONQUERED' : 'CLIMBING K2 APEX'}
            </span>
            <div className="hud-pill-stage">
              <strong>{currentStage.altitude}</strong> · {currentStage.name}
            </div>
          </div>
        </div>

        <div className="hud-pill-right">
          <span className="hud-pill-percentage">{percentage}%</span>
          <button className="hud-toggle-btn" aria-label={isExpanded ? 'Collapse HUD' : 'Expand HUD'}>
            {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
      </div>

      {/* Expanded Interactive Mountain Visualization */}
      {isExpanded && (
        <div className="hud-expanded-body">
          <div className="hud-mountain-graphic-container">
            <svg
              className="hud-mountain-svg"
              viewBox="0 0 320 180"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="hudMountainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(212, 175, 55, 0.4)" />
                  <stop offset="50%" stopColor="rgba(15, 23, 42, 0.85)" />
                  <stop offset="100%" stopColor="rgba(10, 15, 29, 0.95)" />
                </linearGradient>
                <linearGradient id="hudAscentLine" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="70%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>

              {/* Distant Ridge Silhouette */}
              <polygon
                points="0,180 60,110 120,135 180,95 240,140 320,180"
                fill="rgba(255, 255, 255, 0.04)"
              />

              {/* Main Mountain Silhouette */}
              <polygon
                points="20,180 180,30 290,180"
                fill="url(#hudMountainGrad)"
                stroke="rgba(212, 175, 55, 0.3)"
                strokeWidth="1.5"
              />

              {/* Ascent Route Line */}
              <path
                d="M 35,175 Q 90,140 120,105 T 180,32"
                fill="none"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Active Climbed Route */}
              <path
                d="M 35,175 Q 90,140 120,105 T 180,32"
                fill="none"
                stroke="url(#hudAscentLine)"
                strokeWidth="3"
                strokeDasharray="200"
                strokeDashoffset={200 - (200 * (percentage / 100))}
                style={{ transition: 'stroke-dashoffset 800ms ease-out' }}
              />

              {/* Summit Flag at 180, 24 */}
              <g transform="translate(175, 14)">
                <line x1="5" y1="0" x2="5" y2="18" stroke="#d4af37" strokeWidth="2" />
                <polygon points="5,0 18,5 5,10" fill="#f59e0b" />
              </g>

              {/* Base Camp Tent Marker at 35, 168 */}
              <g transform="translate(25, 162)">
                <polygon points="10,0 20,14 0,14" fill="#38bdf8" opacity="0.85" />
              </g>

              {/* Climber Position Marker */}
              <g
                className="hud-climber-marker"
                style={{
                  transform: `translate(${25 + (percentage * 1.5)}px, ${168 - (percentage * 1.4)}px)`,
                  transition: 'transform 800ms cubic-bezier(0.25, 1, 0.5, 1)'
                }}
              >
                <circle cx="0" cy="0" r="7" fill="#d4af37" className="hud-pulse-ring" />
                <circle cx="0" cy="0" r="4" fill="#ffffff" />
              </g>
            </svg>
          </div>

          <div className="hud-elevation-stats">
            <div className="hud-stat-item">
              <span className="hud-stat-caption">Ascent Route</span>
              <strong>Abruzzi Ridge Direct</strong>
            </div>
            <div className="hud-stat-item">
              <span className="hud-stat-caption">Elevation Gained</span>
              <strong style={{ color: 'var(--accent, #d4af37)' }}>
                +{Math.round((percentage / 100) * 3461)}m
              </strong>
            </div>
            <div className="hud-stat-item">
              <span className="hud-stat-caption">Acclimatization</span>
              <strong>{percentage >= 80 ? 'Death Zone' : percentage >= 40 ? 'Adapted' : 'Ascending'}</strong>
            </div>
          </div>

          <p className="hud-stage-description">
            {currentStage.desc} Complete mini-games, explore mountain profiles, and read safety journals to scale the apex.
          </p>

          <div className="hud-actions-row">
            <button
              className="btn btn-sm btn-outline"
              onClick={() => {
                const el = document.querySelector('#mini-games-hub');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                if (onOpenGames) onOpenGames();
              }}
            >
              <Gamepad2 size={14} />
              <span>Play Challenges</span>
            </button>

            {isSummit ? (
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setShowCertificate(true)}
              >
                <Trophy size={14} />
                <span>Claim Certificate</span>
              </button>
            ) : (
              <button
                className="btn btn-sm btn-outline"
                onClick={() => {
                  const el = document.querySelector('#mountain-finder');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Compass size={14} />
                <span>Explore Peaks (+4%)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
