import React, { useState, useEffect, useRef } from 'react';
import { useGamification } from '../../context/GamificationContext';
import { Activity, Wind, Heart, Play, RotateCcw, Award, CheckCircle2 } from 'lucide-react';
import './OxygenStaminaChallenge.css';

export default function OxygenStaminaChallenge() {
  const { completeMiniGame } = useGamification();
  const [altitude, setAltitude] = useState(7900); // Death zone starts at 7,900m
  const [stamina, setStamina] = useState(100);
  const [oxygen, setOxygen] = useState(100);
  const [heartRate, setHeartRate] = useState(120);
  const [status, setStatus] = useState('ready'); // ready, climbing, resting, exhausted, success
  const [message, setMessage] = useState('Maintain your rest-step rhythm to reach 8,611m without exhaustion.');

  const TARGET_ALTITUDE = 8611;

  // Recovery / depletion ticker
  useEffect(() => {
    if (status === 'climbing') {
      const timer = setInterval(() => {
        setStamina(prev => {
          const next = prev - 4;
          if (next <= 10) {
            setStatus('exhausted');
            setMessage('⚠ Acute physical exhaustion! You pushed too hard without resting.');
            return 5;
          }
          return next;
        });

        setOxygen(prev => Math.max(prev - 1.2, 5));
        setHeartRate(prev => Math.min(prev + 3, 178));
        setAltitude(prev => {
          const next = prev + 15;
          if (next >= TARGET_ALTITUDE) {
            setStatus('success');
            setMessage('🏆 Summit Ridge breached! Exceptional rhythm, pacing, and breath control.');
            completeMiniGame('oxygen', 'route_scout');
            return TARGET_ALTITUDE;
          }
          return next;
        });
      }, 400);

      return () => clearInterval(timer);
    } else if (status === 'resting') {
      const timer = setInterval(() => {
        setStamina(prev => Math.min(prev + 5, 100));
        setOxygen(prev => Math.max(prev - 0.4, 5)); // Oxygen still slowly depletes in Death Zone
        setHeartRate(prev => Math.max(prev - 4, 110));
      }, 400);

      return () => clearInterval(timer);
    }
  }, [status, completeMiniGame]);

  const handleClimbStep = () => {
    if (status === 'success' || status === 'exhausted') return;
    setStatus('climbing');
    setMessage('Climbing: Rest-stepping rhythm in progress. Monitor stamina closely.');
  };

  const handleRestStep = () => {
    if (status === 'success' || status === 'exhausted') return;
    setStatus('resting');
    setMessage('Resting: Inhaling two deep breaths per step to clear lactic acid.');
  };

  const handleReset = () => {
    setAltitude(7900);
    setStamina(100);
    setOxygen(100);
    setHeartRate(120);
    setStatus('ready');
    setMessage('Maintain your rest-step rhythm to reach 8,611m without exhaustion.');
  };

  return (
    <div className="oxygen-challenge-container">
      <div className="challenge-header">
        <div>
          <h3>🫁 Death Zone Pace & Oxygen Challenge</h3>
          <p>Above 8,000m, atmospheric pressure is one-third of sea level. Alternate climb and rest to summit.</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={handleReset}>
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      </div>

      {/* Telemetry Dashboard */}
      <div className="challenge-dashboard-grid">
        {/* Altitude Meter */}
        <div className="challenge-metric-box">
          <span className="metric-tag">CURRENT ALTITUDE</span>
          <div className="metric-val font-mono">{altitude}m</div>
          <span className="metric-target">Target: 8,611m K2 Apex</span>
        </div>

        {/* Stamina Meter */}
        <div className="challenge-metric-box">
          <div className="metric-top-label">
            <span className="metric-tag">STAMINA RESERVES</span>
            <span className="metric-percent">{Math.round(stamina)}%</span>
          </div>
          <div className="meter-track">
            <div
              className={`meter-fill ${stamina < 30 ? 'danger' : 'success'}`}
              style={{ width: `${stamina}%` }}
            />
          </div>
          <span className="metric-note">{stamina < 30 ? 'Depleted! Rest now.' : 'Energy nominal'}</span>
        </div>

        {/* Oxygen Bottle */}
        <div className="challenge-metric-box">
          <div className="metric-top-label">
            <span className="metric-tag">BOTTLED OXYGEN</span>
            <span className="metric-percent">{Math.round(oxygen)}%</span>
          </div>
          <div className="meter-track">
            <div
              className="meter-fill"
              style={{ width: `${oxygen}%`, background: '#38bdf8' }}
            />
          </div>
          <span className="metric-note">2.5 L/min flow regulator</span>
        </div>

        {/* Heart Rate */}
        <div className="challenge-metric-box">
          <span className="metric-tag">HEART RATE</span>
          <div className="metric-val heart-pulse font-mono">
            <Heart size={20} color="#ef4444" style={{ display: 'inline', marginRight: '0.4rem' }} />
            {heartRate} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted, #475569)' }}>BPM</span>
          </div>
          <span className="metric-note">{heartRate > 165 ? 'Elevated cardiovascular load' : 'Stable cadence'}</span>
        </div>
      </div>

      {/* Status Bar */}
      <div className={`challenge-status-bar ${status}`}>
        <span>{message}</span>
      </div>

      {/* Control Buttons */}
      <div className="challenge-controls-row">
        <button
          className="btn btn-primary btn-lg"
          onClick={handleClimbStep}
          disabled={status === 'success' || status === 'exhausted' || status === 'climbing'}
        >
          <Activity size={18} />
          <span>Climb Step (Push Upward)</span>
        </button>

        <button
          className="btn btn-outline btn-lg"
          onClick={handleRestStep}
          disabled={status === 'success' || status === 'exhausted' || status === 'resting'}
        >
          <Wind size={18} />
          <span>Rest Step (Catch Breath)</span>
        </button>
      </div>

      <div className="challenge-lesson-callout">
        <strong>💡 The Himalayan 'Rest-Step' Technique:</strong> At extreme altitude, climbers lock the knee of their downhill leg on every stride for 1-2 seconds, transferring body weight to the skeletal bone structure rather than burning muscular glycogen.
      </div>
    </div>
  );
}
