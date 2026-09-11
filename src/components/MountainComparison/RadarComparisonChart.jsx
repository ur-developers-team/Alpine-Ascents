import React, { useState } from 'react';
import mountainsData from '../../data/mountains.json';
import { Activity, Shield, Award, AlertTriangle, ArrowRight, Check } from 'lucide-react';

const CALIBRATED_DIMENSIONS = {
  'k2': { altitude: 97, technical: 98, remoteness: 96, duration: 95, hazard: 97, demand: 99 },
  'everest': { altitude: 100, technical: 82, remoteness: 75, duration: 92, hazard: 84, demand: 92 },
  'nanga-parbat': { altitude: 92, technical: 96, remoteness: 80, duration: 85, hazard: 95, demand: 94 },
  'broad-peak': { altitude: 91, technical: 80, remoteness: 94, duration: 80, hazard: 76, demand: 85 },
  'gasherbrum-1': { altitude: 91, technical: 89, remoteness: 95, duration: 85, hazard: 86, demand: 90 },
  'mont-blanc': { altitude: 54, technical: 55, remoteness: 30, duration: 25, hazard: 60, demand: 65 },
  'matterhorn': { altitude: 51, technical: 85, remoteness: 35, duration: 20, hazard: 70, demand: 78 },
  'trango-towers': { altitude: 71, technical: 99, remoteness: 94, duration: 75, hazard: 75, demand: 96 },
  'rakaposhi': { altitude: 88, technical: 88, remoteness: 55, duration: 70, hazard: 82, demand: 90 },
  'fitz-roy': { altitude: 38, technical: 95, remoteness: 65, duration: 50, hazard: 80, demand: 92 }
};

const AXES = [
  { key: 'altitude', label: 'Altitude (Peak Elevation)' },
  { key: 'technical', label: 'Technical Difficulty' },
  { key: 'remoteness', label: 'Remoteness & Approach' },
  { key: 'duration', label: 'Expedition Duration' },
  { key: 'hazard', label: 'Objective Hazard Index' },
  { key: 'demand', label: 'Physical Demand' }
];

export default function RadarComparisonChart() {
  const [mountainAId, setMountainAId] = useState('k2');
  const [mountainBId, setMountainBId] = useState('everest');
  const [hoveredAxis, setHoveredAxis] = useState(null);

  const mountainA = mountainsData.find(m => m.id === mountainAId) || mountainsData[0];
  const mountainB = mountainsData.find(m => m.id === mountainBId) || mountainsData[1];

  const scoresA = CALIBRATED_DIMENSIONS[mountainA.id] || { altitude: 70, technical: 70, remoteness: 70, duration: 70, hazard: 70, demand: 70 };
  const scoresB = CALIBRATED_DIMENSIONS[mountainB.id] || { altitude: 60, technical: 60, remoteness: 60, duration: 60, hazard: 60, demand: 60 };

  // SVG Radar Dimensions
  const size = 380;
  const center = size / 2;
  const radius = 135;
  const levels = [0.25, 0.5, 0.75, 1.0];

  const getCoordinates = (index, valueRatio) => {
    const angle = (Math.PI * 2 / AXES.length) * index - Math.PI / 2;
    const r = radius * valueRatio;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const getPolygonPoints = (scores) => {
    return AXES.map((axis, i) => {
      const ratio = (scores[axis.key] || 50) / 100;
      const { x, y } = getCoordinates(i, ratio);
      return `${x},${y}`;
    }).join(' ');
  };

  const pointsA = getPolygonPoints(scoresA);
  const pointsB = getPolygonPoints(scoresB);

  return (
    <div className="radar-chart-card">
      <div className="tool-card-header">
        <div className="tool-header-badge">
          <Activity size={13} />
          <span>6-AXIS RADAR COMPARISON</span>
        </div>
        <h3 className="tool-card-title">Multi-Dimensional Summit Radar Analysis</h3>
        <p className="tool-card-desc">
          Compare any two peaks side-by-side across six vital alpine axes: elevation, technical grade, wilderness remoteness, staging time, objective hazards, and physiological strain.
        </p>
      </div>

      {/* Mountain Pickers */}
      <div className="radar-selectors-bar">
        <div className="radar-picker-group">
          <label className="tool-input-label" style={{ color: '#38bdf8' }}>
            SUMMIT ALPHA (CYAN)
          </label>
          <select
            className="tool-select-field"
            value={mountainAId}
            onChange={(e) => setMountainAId(e.target.value)}
          >
            {mountainsData.map(m => (
              <option key={m.id} value={m.id}>{m.name} ({m.altitudeFormatted})</option>
            ))}
          </select>
        </div>

        <div className="radar-vs-divider">VS</div>

        <div className="radar-picker-group">
          <label className="tool-input-label" style={{ color: '#f59e0b' }}>
            SUMMIT BETA (AMBER)
          </label>
          <select
            className="tool-select-field"
            value={mountainBId}
            onChange={(e) => setMountainBId(e.target.value)}
          >
            {mountainsData.map(m => (
              <option key={m.id} value={m.id}>{m.name} ({m.altitudeFormatted})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart & Legend Grid */}
      <div className="radar-chart-display-grid">
        <div className="radar-svg-container">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="radar-svg" role="img" aria-label="Radar Comparison Chart">
            {/* Concentric Web Grid Lines */}
            {levels.map((lvl, idx) => (
              <polygon
                key={idx}
                points={AXES.map((_, i) => {
                  const { x, y } = getCoordinates(i, lvl);
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1"
                strokeDasharray={idx < 3 ? '3,3' : 'none'}
              />
            ))}

            {/* Spokes from Center */}
            {AXES.map((_, i) => {
              const { x, y } = getCoordinates(i, 1.0);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Polygon A (Cyan) */}
            <polygon
              points={pointsA}
              fill="rgba(56, 189, 248, 0.28)"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Polygon B (Amber) */}
            <polygon
              points={pointsB}
              fill="rgba(245, 158, 11, 0.24)"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Interactive Data Vertices A */}
            {AXES.map((axis, i) => {
              const { x, y } = getCoordinates(i, (scoresA[axis.key] || 50) / 100);
              return (
                <circle
                  key={`a-${i}`}
                  cx={x}
                  cy={y}
                  r="5"
                  fill="#38bdf8"
                  stroke="#070c12"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredAxis(axis.key)}
                  onMouseLeave={() => setHoveredAxis(null)}
                  style={{ cursor: 'pointer' }}
                />
              );
            })}

            {/* Interactive Data Vertices B */}
            {AXES.map((axis, i) => {
              const { x, y } = getCoordinates(i, (scoresB[axis.key] || 50) / 100);
              return (
                <circle
                  key={`b-${i}`}
                  cx={x}
                  cy={y}
                  r="5"
                  fill="#f59e0b"
                  stroke="#070c12"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredAxis(axis.key)}
                  onMouseLeave={() => setHoveredAxis(null)}
                  style={{ cursor: 'pointer' }}
                />
              );
            })}

            {/* Outer Axis Labels */}
            {AXES.map((axis, i) => {
              const angle = (Math.PI * 2 / AXES.length) * i - Math.PI / 2;
              const r = radius + 24;
              const x = center + r * Math.cos(angle);
              const y = center + r * Math.sin(angle);
              const isHovered = hoveredAxis === axis.key;

              return (
                <text
                  key={i}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`radar-axis-text ${isHovered ? 'active' : ''}`}
                  fill={isHovered ? 'var(--accent-light)' : 'var(--text-secondary)'}
                  fontSize="11"
                  fontWeight={isHovered ? '700' : '500'}
                  fontFamily="Inter, sans-serif"
                >
                  {axis.label.split(' ')[0]}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Breakdown & Legend Table */}
        <div className="radar-legend-col">
          <div className="radar-legend-header">
            <div className="radar-legend-tag tag-a">
              <span className="dot-a" />
              <strong>{mountainA.name.split('(')[0]}</strong>
            </div>
            <div className="radar-legend-tag tag-b">
              <span className="dot-b" />
              <strong>{mountainB.name.split('(')[0]}</strong>
            </div>
          </div>

          <div className="radar-metrics-table">
            {AXES.map(axis => {
              const valA = scoresA[axis.key] || 0;
              const valB = scoresB[axis.key] || 0;
              const diff = valA - valB;
              const isHovered = hoveredAxis === axis.key;

              return (
                <div
                  key={axis.key}
                  className={`radar-row-item ${isHovered ? 'hovered' : ''}`}
                  onMouseEnter={() => setHoveredAxis(axis.key)}
                  onMouseLeave={() => setHoveredAxis(null)}
                >
                  <div className="radar-row-label">
                    <span>{axis.label}</span>
                  </div>
                  <div className="radar-row-bars">
                    <div className="radar-val-tag" style={{ color: '#38bdf8' }}>
                      {valA}/100
                    </div>
                    <div className="radar-val-tag" style={{ color: '#f59e0b' }}>
                      {valB}/100
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expert Synthesis */}
          <div className="radar-synthesis-box">
            <h5 style={{ fontSize: '0.82rem', color: 'var(--text-primary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Alpine Sirdar Synthesis
            </h5>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
              {scoresA.technical > scoresB.technical
                ? `${mountainA.name.split('(')[0]} presents greater technical crux density and objective serac hazard, whereas ${mountainB.name.split('(')[0]} demands higher absolute acclimatization stamina.`
                : `${mountainB.name.split('(')[0]} leads in technical rock/ice ropecraft, while ${mountainA.name.split('(')[0]} features prolonged high-altitude exposure.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
