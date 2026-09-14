import React, { useState } from 'react';
import { Mountain, ArrowLeftRight, Wind, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

import toolsData from '../../data/toolsData.json';

const BENCHMARKS = toolsData.altitudeBenchmarks;

export default function AltitudeConverter() {
  const [meters, setMeters] = useState(5150); // Default to K2 Base Camp
  const [feet, setFeet] = useState(16896);

  const handleMetersChange = (val) => {
    const m = parseFloat(val) || 0;
    setMeters(val);
    setFeet(Math.round(m * 3.28084));
  };

  const handleFeetChange = (val) => {
    const f = parseFloat(val) || 0;
    setFeet(val);
    setMeters(Math.round(f / 3.28084));
  };

  const setPreset = (m) => {
    setMeters(m);
    setFeet(Math.round(m * 3.28084));
  };

  const numM = parseFloat(meters) || 0;

  // Approximate Barometric Formula: P = P0 * (1 - 2.25577e-5 * h)^5.25588
  const atmosphericPressureHpa = Math.max(
    0,
    Math.round(1013.25 * Math.pow(Math.max(0, 1 - 2.25577e-5 * numM), 5.25588))
  );

  // Effective available O2 percentage compared to sea level (100%)
  const effectiveO2Percent = Math.min(100, Math.max(0, Math.round((atmosphericPressureHpa / 1013.25) * 100)));

  // Altitude Zone Classification
  const getZoneDetails = (m) => {
    if (m < 2400) {
      return {
        label: 'Standard Altitude / Low Hypoxia Risk',
        color: '#10b981',
        advice: 'Normal physiological endurance. AMS incidence negligible for healthy individuals.',
        icon: <CheckCircle2 size={16} color="#10b981" />
      };
    } else if (m < 3500) {
      return {
        label: 'High Altitude (Acclimatization Onset)',
        color: '#38bdf8',
        advice: 'Mild hypobaric hypoxia. Limit daily ascent to 500m. Hydrate heavily (4L/day).',
        icon: <Mountain size={16} color="#38bdf8" />
      };
    } else if (m < 5500) {
      return {
        label: 'Very High Altitude (Severe Hypoxia)',
        color: '#f59e0b',
        advice: 'Severe hyperventilation at rest. High risk of AMS; carry Diamox and descend on acute headache.',
        icon: <AlertCircle size={16} color="#f59e0b" />
      };
    } else if (m < 7900) {
      return {
        label: 'Extreme Altitude (Strenuous Deterioration)',
        color: '#f97316',
        advice: 'Human body cannot permanently acclimatize. Muscle wasting begins; rapid rotatory staging.',
        icon: <AlertCircle size={16} color="#f97316" />
      };
    } else {
      return {
        label: 'The Death Zone (Above 7,900m)',
        color: '#ef4444',
        advice: 'Cellular necrosis outpaces recovery. Supplemental bottle O2 and strict turnaround timers required.',
        icon: <ShieldAlert size={16} color="#ef4444" />
      };
    }
  };

  const zone = getZoneDetails(numM);
  const barPercent = Math.min(100, Math.max(0, (numM / 8848) * 100));

  return (
    <div className="altitude-converter-card">
      <div className="tool-card-header">
        <div className="tool-header-badge">
          <Wind size={13} />
          <span>HYPOBARIC TELEMETRY</span>
        </div>
        <h3 className="tool-card-title">Real-Time Altitude & Oxygen Converter</h3>
        <p className="tool-card-desc">
          Convert seamlessly between metric (Meters) and imperial (Feet), calculate barometric pressure drop, and assess Death Zone physiological risks.
        </p>
      </div>

      {/* Two-Way Input Grid */}
      <div className="altitude-inputs-grid">
        <div className="altitude-input-box">
          <label className="tool-input-label">METERS (m)</label>
          <div className="altitude-field-wrap">
            <input
              type="number"
              className="tool-number-input"
              value={meters}
              onChange={(e) => handleMetersChange(e.target.value)}
              placeholder="e.g. 5150"
              min="0"
              max="9000"
            />
            <span className="altitude-unit">m</span>
          </div>
        </div>

        <div className="altitude-swap-icon">
          <ArrowLeftRight size={20} color="var(--accent)" />
        </div>

        <div className="altitude-input-box">
          <label className="tool-input-label">FEET (ft)</label>
          <div className="altitude-field-wrap">
            <input
              type="number"
              className="tool-number-input"
              value={feet}
              onChange={(e) => handleFeetChange(e.target.value)}
              placeholder="e.g. 16896"
              min="0"
              max="30000"
            />
            <span className="altitude-unit">ft</span>
          </div>
        </div>
      </div>

      {/* Quick Alpine Benchmarks Presets */}
      <div className="altitude-presets-wrap">
        <span className="tool-sublabel">SUMMIT PRESETS:</span>
        <div className="altitude-presets-chips">
          {BENCHMARKS.map((b) => (
            <button
              key={b.name}
              type="button"
              className={`altitude-preset-btn ${numM === b.meters ? 'active' : ''}`}
              onClick={() => setPreset(b.meters)}
            >
              <span>{b.name}</span>
              <small>{b.meters}m</small>
            </button>
          ))}
        </div>
      </div>

      {/* Relative Altitude Progress Bar */}
      <div className="altitude-visual-bar-wrap">
        <div className="altitude-bar-labels">
          <span>Sea Level (0m)</span>
          <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
            {numM.toLocaleString()}m ({effectiveO2Percent}% O₂)
          </span>
          <span>Everest (8,848m)</span>
        </div>
        <div className="altitude-track">
          <div
            className="altitude-progress"
            style={{
              width: `${barPercent}%`,
              background: `linear-gradient(90deg, #10b981 0%, #38bdf8 40%, #f59e0b 70%, #ef4444 100%)`
            }}
          />
          <div className="altitude-thumb" style={{ left: `${barPercent}%` }} />
        </div>
      </div>

      {/* Atmospheric & Medical Metrics Grid */}
      <div className="altitude-metrics-grid">
        <div className="tool-metric-card">
          <span className="metric-card-label">BAROMETRIC PRESSURE</span>
          <strong className="metric-card-val" style={{ color: 'var(--accent)' }}>
            {atmosphericPressureHpa} <small>hPa</small>
          </strong>
          <span className="metric-card-sub">Sea Level: 1,013 hPa</span>
        </div>

        <div className="tool-metric-card">
          <span className="metric-card-label">EFFECTIVE AVAILABLE O₂</span>
          <strong
            className="metric-card-val"
            style={{ color: effectiveO2Percent < 40 ? '#ef4444' : effectiveO2Percent < 60 ? '#f59e0b' : '#10b981' }}
          >
            {effectiveO2Percent}% <small>density</small>
          </strong>
          <span className="metric-card-sub">Sea Level: 100% (20.9% mix)</span>
        </div>

        <div className="tool-metric-card" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            {zone.icon}
            <span className="metric-card-label" style={{ color: zone.color, fontWeight: 700, margin: 0 }}>
              {zone.label}
            </span>
          </div>
          <p className="metric-card-advice">{zone.advice}</p>
        </div>
      </div>
    </div>
  );
}
