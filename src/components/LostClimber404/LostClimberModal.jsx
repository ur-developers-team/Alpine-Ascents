import React, { useState, useEffect } from 'react';
import { Compass, AlertTriangle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, Home, Flag, X } from 'lucide-react';
import './LostClimberModal.css';

const GRID_SIZE = 7;
const BASE_CAMP = { x: 6, y: 6 };

const INITIAL_CREVASSES = [
  { x: 1, y: 2 },
  { x: 2, y: 4 },
  { x: 3, y: 1 },
  { x: 4, y: 3 },
  { x: 5, y: 5 },
  { x: 5, y: 2 }
];

const INITIAL_FLARES = [
  { x: 0, y: 4, id: 1 },
  { x: 3, y: 3, id: 2 },
  { x: 5, y: 1, id: 3 }
];

export default function LostClimberModal({ isOpen, onClose, onReturnHome }) {
  const [player, setPlayer] = useState({ x: 0, y: 0 });
  const [stamina, setStamina] = useState(3);
  const [score, setScore] = useState(0);
  const [flares, setFlares] = useState(INITIAL_FLARES);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'

  const restartGame = () => {
    setPlayer({ x: 0, y: 0 });
    setStamina(3);
    setScore(0);
    setFlares(INITIAL_FLARES);
    setGameStatus('playing');
  };

  const move = (dx, dy) => {
    if (gameStatus !== 'playing') return;

    setPlayer(prev => {
      const newX = Math.max(0, Math.min(GRID_SIZE - 1, prev.x + dx));
      const newY = Math.max(0, Math.min(GRID_SIZE - 1, prev.y + dy));

      // Check Crevasse hazard
      const hitCrevasse = INITIAL_CREVASSES.some(c => c.x === newX && c.y === newY);
      if (hitCrevasse) {
        if (stamina <= 1) {
          setGameStatus('lost');
        } else {
          setStamina(s => s - 1);
        }
        return { x: 0, y: 0 }; // Reset to start on fall
      }

      // Check Rescue Flares
      const flareIndex = flares.findIndex(f => f.x === newX && f.y === newY);
      if (flareIndex !== -1) {
        setScore(s => s + 150);
        setFlares(fl => fl.filter((_, idx) => idx !== flareIndex));
      }

      // Check Base Camp Reached
      if (newX === BASE_CAMP.x && newY === BASE_CAMP.y) {
        setGameStatus('won');
        setScore(s => s + 500);
      }

      return { x: newX, y: newY };
    });
  };

  // Keyboard navigation listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        move(0, -1);
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        move(0, 1);
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        move(-1, 0);
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        move(1, 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, gameStatus, stamina, flares]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="lost-climber-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="lost-climber-header">
          <div className="lost-climber-badge">
            <AlertTriangle size={13} />
            <span>404 · OFF-ROUTE RESCUE</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close rescue game">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="lost-climber-body">
          <h3 className="lost-climber-title">Lost Climber: Return to Base Camp</h3>
          <p className="lost-climber-subtitle">
            You wandered off the fixed rope into a whiteout blizzard! Navigate across the glaciated terrain to Base Camp (⛺) while avoiding crevasses (🕳️) and collecting emergency flare beacons (🔥).
          </p>

          <div className="lost-climber-stats">
            <div className="lost-stat-pill">
              STAMINA: <strong>{'❤️'.repeat(stamina) || 'None'}</strong>
            </div>
            <div className="lost-stat-pill">
              RESCUE SCORE: <strong>{score} pts</strong>
            </div>
          </div>

          {/* 7x7 Glacier Grid */}
          <div className="glacier-grid">
            {Array.from({ length: GRID_SIZE }).map((_, y) => (
              Array.from({ length: GRID_SIZE }).map((_, x) => {
                const isPlayer = player.x === x && player.y === y;
                const isCamp = BASE_CAMP.x === x && BASE_CAMP.y === y;
                const isCrevasse = INITIAL_CREVASSES.some(c => c.x === x && c.y === y);
                const isFlare = flares.some(f => f.x === x && f.y === y);

                let content = '';
                let cellClass = 'glacier-cell';

                if (isPlayer) {
                  content = '🧗';
                  cellClass += ' climber';
                } else if (isCamp) {
                  content = '⛺';
                  cellClass += ' camp';
                } else if (isFlare) {
                  content = '🔥';
                  cellClass += ' flare';
                } else if (isCrevasse) {
                  content = '🕳️';
                  cellClass += ' crevasse';
                }

                return (
                  <div key={`${x}-${y}`} className={cellClass}>
                    {content}
                  </div>
                );
              })
            ))}
          </div>

          {/* Status feedback */}
          {gameStatus === 'won' && (
            <div style={{ color: '#10b981', fontWeight: 800, marginBottom: '1rem', textAlign: 'center' }}>
              🎉 BASE CAMP REACHED! You safely returned to the expedition team.
            </div>
          )}

          {gameStatus === 'lost' && (
            <div style={{ color: '#ef4444', fontWeight: 800, marginBottom: '1rem', textAlign: 'center' }}>
              ⚠️ STAMINA DEPLETED! Trapped in the blizzard crevasses. Click restart!
            </div>
          )}

          {/* D-Pad for Touch/Mobile */}
          <div className="dpad-container">
            <div />
            <button className="dpad-btn" onClick={() => move(0, -1)} aria-label="Move Up">
              <ArrowUp size={16} />
            </button>
            <div />
            <button className="dpad-btn" onClick={() => move(-1, 0)} aria-label="Move Left">
              <ArrowLeft size={16} />
            </button>
            <button className="dpad-btn" onClick={() => move(0, 1)} aria-label="Move Down">
              <ArrowDown size={16} />
            </button>
            <button className="dpad-btn" onClick={() => move(1, 0)} aria-label="Move Right">
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Action Footer */}
          <div className="lost-climber-footer">
            <button
              className="btn btn-outline btn-sm"
              onClick={restartGame}
            >
              <RotateCcw size={14} />
              <span>Restart Traverse</span>
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                onClose();
                if (onReturnHome) onReturnHome();
              }}
            >
              <Home size={14} />
              <span>Return to Expedition</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
