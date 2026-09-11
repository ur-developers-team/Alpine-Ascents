import React, { useState } from 'react';
import { Activity, Wind, Navigation, Wrench } from 'lucide-react';
import AltitudeConverter from './AltitudeConverter';
import GeoDistanceCalculator from './GeoDistanceCalculator';
import RadarComparisonChart from '../MountainComparison/RadarComparisonChart';
import './AlpineToolsSuite.css';

export default function AlpineToolsSuite() {
  const [activeTool, setActiveTool] = useState('radar'); // 'radar', 'altitude', 'geodesy'

  return (
    <section id="alpine-tools" className="section alpine-tools-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Wrench size={14} />
            <span>EXPEDITION INSTRUMENTATION</span>
          </div>
          <h2 className="section-title">ALPINE TOOLS SUITE</h2>
          <p className="section-subtitle">
            Scientific-grade telemetry tools for high-altitude planning: multi-dimensional summit radar matrices, real-time hypobaric oxygen conversion, and spherical Haversine distance geodesy.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="tools-tab-bar" role="tablist" aria-label="Alpine Tools Navigation">
          <button
            className={`tools-tab-btn ${activeTool === 'radar' ? 'active' : ''}`}
            onClick={() => setActiveTool('radar')}
            role="tab"
            aria-selected={activeTool === 'radar'}
          >
            <Activity size={16} />
            <span>Summit Radar Matrix</span>
          </button>

          <button
            className={`tools-tab-btn ${activeTool === 'altitude' ? 'active' : ''}`}
            onClick={() => setActiveTool('altitude')}
            role="tab"
            aria-selected={activeTool === 'altitude'}
          >
            <Wind size={16} />
            <span>Altitude & Oxygen Telemetry</span>
          </button>

          <button
            className={`tools-tab-btn ${activeTool === 'geodesy' ? 'active' : ''}`}
            onClick={() => setActiveTool('geodesy')}
            role="tab"
            aria-selected={activeTool === 'geodesy'}
          >
            <Navigation size={16} />
            <span>Geo-Distance & Azimuth</span>
          </button>
        </div>

        {/* Dynamic Tool Content */}
        <div className="tools-content-area">
          {activeTool === 'radar' && <RadarComparisonChart />}
          {activeTool === 'altitude' && <AltitudeConverter />}
          {activeTool === 'geodesy' && <GeoDistanceCalculator />}
        </div>
      </div>
    </section>
  );
}
