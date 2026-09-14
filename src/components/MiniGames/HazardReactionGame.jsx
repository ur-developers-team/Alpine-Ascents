import React, { useState, useEffect, useRef } from 'react';
import hazardScenarios from '../../data/miniGames.json';
import { useGamification } from '../../context/GamificationContext';
import { Timer, CheckCircle2, XCircle, RotateCcw, ShieldAlert, BookOpen } from 'lucide-react';
import './HazardReactionGame.css';

export default function HazardReactionGame() {
  const { completeMiniGame } = useGamification();
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(hazardScenarios[0]?.timeLimitSec || 5);
  const [gameStatus, setGameStatus] = useState('idle'); // idle, active, answered, complete
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);

  const currentScenario = hazardScenarios[scenarioIndex] || hazardScenarios[0];
  const timerRef = useRef(null);

  // Countdown timer
  useEffect(() => {
    if (gameStatus === 'active' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameStatus('answered');
            setSelectedOption({ isCorrect: false, feedback: 'Time Expired! In alpine emergencies, hesitation is fatal.' });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearTimeout(timerRef.current);
  }, [gameStatus, timeLeft]);

  const handleStart = () => {
    setGameStatus('active');
    setTimeLeft(currentScenario.timeLimitSec);
    setSelectedOption(null);
  };

  const handleSelectAnswer = (option) => {
    if (gameStatus !== 'active') return;
    clearTimeout(timerRef.current);
    setSelectedOption(option);
    setGameStatus('answered');

    if (option.isCorrect) {
      setScore(prev => prev + 25);
    }
  };

  const handleNext = () => {
    if (scenarioIndex < hazardScenarios.length - 1) {
      setScenarioIndex(prev => prev + 1);
      setGameStatus('active');
      setTimeLeft(hazardScenarios[scenarioIndex + 1].timeLimitSec);
      setSelectedOption(null);
    } else {
      setGameStatus('complete');
      completeMiniGame('hazard', 'hazard_survivor');
    }
  };

  const handleReset = () => {
    setScenarioIndex(0);
    setScore(0);
    setGameStatus('idle');
    setTimeLeft(hazardScenarios[0].timeLimitSec);
    setSelectedOption(null);
  };

  return (
    <div className="hazard-game-container">
      <div className="hazard-game-header">
        <div>
          <h3>⚡ Avalanche & Hazard Reflex Trainer</h3>
          <p>Rapid alpine emergencies demand decisive survival instincts. You have seconds to act.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="hazard-score-badge">Score: {score} pts</span>
          <button className="btn btn-outline btn-sm" onClick={handleReset}>
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {gameStatus === 'idle' && (
        <div className="hazard-start-banner">
          <div className="hazard-start-icon">
            <ShieldAlert size={36} color="#ef4444" />
          </div>
          <h4>Simulate Real High-Altitude Emergencies</h4>
          <p>You will face {hazardScenarios.length} unpredictable scenarios: wind slab avalanches, whistling rockfalls, whiteouts, and crevasse breaches with strict countdown clocks.</p>
          <button className="btn btn-primary btn-lg" onClick={handleStart}>
            <span>Engage Hazard Simulation</span>
          </button>
        </div>
      )}

      {(gameStatus === 'active' || gameStatus === 'answered') && (
        <div className="hazard-scenario-card">
          <div className="hazard-meta-strip">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="hazard-danger-tag">⚠ {currentScenario.hazardType}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentScenario.altitude}</span>
            </div>

            {/* Countdown timer */}
            <div className={`hazard-timer-box ${timeLeft <= 2 ? 'critical' : ''}`}>
              <Timer size={16} />
              <span>{timeLeft}s</span>
            </div>
          </div>

          <h4 className="hazard-scenario-title">{currentScenario.title}</h4>
          <p className="hazard-scenario-prompt">{currentScenario.prompt}</p>

          {/* Options Grid */}
          <div className="hazard-options-list">
            {currentScenario.options.map((opt, idx) => {
              const isChosen = selectedOption?.id === opt.id;
              let btnClass = 'hazard-opt-btn';
              if (gameStatus === 'answered') {
                if (opt.isCorrect) btnClass += ' correct';
                else if (isChosen) btnClass += ' wrong';
              }

              return (
                <button
                  key={opt.id}
                  className={btnClass}
                  onClick={() => handleSelectAnswer(opt)}
                  disabled={gameStatus === 'answered'}
                >
                  <span className="opt-letter">{String.fromCharCode(65 + idx)}</span>
                  <span className="opt-text">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Answer Feedback Debrief */}
          {gameStatus === 'answered' && selectedOption && (
            <div className={`hazard-debrief-box ${selectedOption.isCorrect ? 'pass' : 'fail'}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                {selectedOption.isCorrect ? <CheckCircle2 size={18} color="#10b981" /> : <XCircle size={18} color="#ef4444" />}
                <strong>{selectedOption.isCorrect ? 'DECISIVE SURVIVAL ACTION' : 'CRITICAL TACTICAL FAILURE'}</strong>
              </div>
              <p>{selectedOption.feedback}</p>
              <div className="hazard-official-protocol">
                <strong>Official Mountaineering Protocol:</strong> {currentScenario.protocol}
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary btn-sm" onClick={handleNext}>
                  <span>{scenarioIndex < hazardScenarios.length - 1 ? 'Next Hazard Incident →' : 'Complete Debrief →'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {gameStatus === 'complete' && (
        <div className="hazard-complete-banner">
          <div className="hazard-complete-trophy">
            <ShieldAlert size={36} color="#d4af37" />
          </div>
          <h4>Simulation Complete: Final Score {score} / 100</h4>
          <p>
            {score >= 75
              ? 'Outstanding reflexes and alpine risk judgment. You earned the "Alpine Reflex Master" badge!'
              : 'You survived, but reviewing high-altitude hazard protocols in the Mountaineering Knowledge section is strongly recommended.'}
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1rem' }}>
            <button className="btn btn-outline btn-sm" onClick={handleReset}>
              <RotateCcw size={14} />
              <span>Retry Challenge</span>
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                const el = document.querySelector('#knowledge');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <BookOpen size={14} />
              <span>Review Hazards Knowledge</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
