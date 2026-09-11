import React, { useState } from 'react';
import { TrendingUp, MapPin, Compass, ShieldAlert, Award } from 'lucide-react';
import routesData from '../../data/routes.json';
import { useUserProfile } from '../../context/UserProfileContext';
import { useLanguage } from '../../context/LanguageContext';
import './ElevationChart.css';

export default function ElevationChart() {
  const [selectedRoute, setSelectedRoute] = useState(routesData[0]);
  const [selectedWaypointIndex, setSelectedWaypointIndex] = useState(0);
  const { unlockBadge } = useUserProfile();
  const { t } = useLanguage();

  const waypoints = selectedRoute.waypoints;
  const activeWp = waypoints[selectedWaypointIndex] || waypoints[0];

  const handleSelectRoute = (route) => {
    setSelectedRoute(route);
    setSelectedWaypointIndex(0);
    unlockBadge('route_scout');
  };

  // SVG dimensions
  const svgWidth = 800;
  const svgHeight = 240;
  const padLeft = 60;
  const padRight = 40;
  const padTop = 30;
  const padBottom = 40;

  const plotW = svgWidth - padLeft - padRight;
  const plotH = svgHeight - padTop - padBottom;

  const altitudes = waypoints.map(w => w.altitudeM);
  const minAlt = Math.max(0, Math.min(...altitudes) - 200);
  const maxAlt = Math.max(...altitudes) + 200;
  const maxDist = waypoints[waypoints.length - 1].distanceKm || 1;

  const coords = waypoints.map((w, idx) => {
    const x = padLeft + (w.distanceKm / maxDist) * plotW;
    const y = (padTop + plotH) - ((w.altitudeM - minAlt) / (maxAlt - minAlt)) * plotH;
    return { x, y, ...w, idx };
  });

  const linePath = coords.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x},${pt.y}`, '');
  const areaPath = `${linePath} L ${coords[coords.length - 1].x},${padTop + plotH} L ${coords[0].x},${padTop + plotH} Z`;

  // Grid steps (4 elevation horizontal markers)
  const gridSteps = [0, 0.33, 0.66, 1].map(ratio => {
    const alt = Math.round(minAlt + ratio * (maxAlt - minAlt));
    const y = (padTop + plotH) - ratio * plotH;
    return { alt, y };
  });

  return (
    <section id="elevation" className="elevation-section">
      <div className="site-container">
        <div className="section-header">
          <span className="section-eyebrow">
            <TrendingUp size={14} style={{ display: 'inline', marginRight: '0.4rem' }} />
            {t('routes3d', 'badge')}
          </span>
          <h2 className="section-title">High-Altitude Route Elevation Profiles</h2>
          <p className="section-subtitle">
            Inspect waypoint distances, stage ascents, camps, and technical terrain barriers across legendary alpine routes.
          </p>
        </div>

        <div className="elevation-container">
          {/* Route selector buttons */}
          <div className="elevation-route-selector">
            {routesData.map(route => (
              <button
                key={route.id}
                className={`route-btn ${selectedRoute.id === route.id ? 'active' : ''}`}
                onClick={() => handleSelectRoute(route)}
              >
                <Compass size={15} />
                <span>{route.name}</span>
              </button>
            ))}
          </div>

          {/* Route High-level statistics */}
          <div className="elevation-stats-bar">
            <div className="elevation-stat-item">
              <span>Target Peak</span>
              <strong>{selectedRoute.mountain}</strong>
            </div>
            <div className="elevation-stat-item">
              <span>Total Distance</span>
              <strong>{selectedRoute.totalDistance}</strong>
            </div>
            <div className="elevation-stat-item">
              <span>Max Altitude</span>
              <strong>{selectedRoute.maxAltitude}</strong>
            </div>
            <div className="elevation-stat-item">
              <span>Elevation Net Gain</span>
              <strong>{selectedRoute.elevationGain}</strong>
            </div>
          </div>

          {/* SVG Altitude Profile */}
          <div className="elevation-svg-wrapper">
            <svg
              className="elevation-svg"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
              role="img"
              aria-label={`Elevation profile of ${selectedRoute.name}`}
            >
              <defs>
                <linearGradient id="elevationAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-gold)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--accent-gold)" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {gridSteps.map((step, i) => (
                <g key={i}>
                  <line
                    x1={padLeft}
                    y1={step.y}
                    x2={svgWidth - padRight}
                    y2={step.y}
                    stroke="rgba(255,255,255,0.08)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={padLeft - 8}
                    y={step.y + 4}
                    fill="var(--text-muted)"
                    fontSize="10"
                    textAnchor="end"
                    fontFamily="monospace"
                  >
                    {step.alt}m
                  </text>
                </g>
              ))}

              {/* Area and Line */}
              <path d={areaPath} fill="url(#elevationAreaGrad)" />
              <path
                d={linePath}
                fill="none"
                stroke="var(--accent-gold)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Waypoint Nodes */}
              {coords.map((pt, i) => {
                const isSelected = selectedWaypointIndex === i;
                return (
                  <g
                    key={i}
                    className="waypoint-node"
                    onClick={() => setSelectedWaypointIndex(i)}
                    role="button"
                    tabIndex="0"
                  >
                    {isSelected && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="10"
                        fill="none"
                        stroke="var(--accent-gold)"
                        strokeWidth="1.5"
                        opacity="0.6"
                      />
                    )}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? 6 : 4}
                      fill={isSelected ? '#ffffff' : 'var(--accent-gold)'}
                      stroke="var(--bg-primary)"
                      strokeWidth="2"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Active Waypoint Detail Card */}
          <div className="elevation-waypoint-card">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                <span className="hud-tag">Waypoint {selectedWaypointIndex + 1} of {waypoints.length}</span>
                <span className="badge badge-subtle">{activeWp.difficulty}</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{activeWp.stage}</h3>
            </div>

            <div className="waypoint-details-grid">
              <div className="waypoint-detail-col">
                <span>Waypoint Altitude</span>
                <strong>{activeWp.altitudeM}m ({(activeWp.altitudeM * 3.28084).toFixed(0)} ft)</strong>
              </div>
              <div className="waypoint-detail-col">
                <span>Cumulative Distance</span>
                <strong>{activeWp.distanceKm} km</strong>
              </div>
              <div className="waypoint-detail-col">
                <span>Terrain Character</span>
                <strong>{activeWp.terrain}</strong>
              </div>
              <div className="waypoint-detail-col">
                <span>Camp / Shelter</span>
                <strong>{activeWp.camp}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
