import React, { useState } from 'react';
import AnimatedRiver from './AnimatedRiver';
import { Mountain, Trees, Compass, Eye } from 'lucide-react';
import './MountainParallaxScene.css';

export default function MountainParallaxScene() {
  const [activeZone, setActiveZone] = useState('hunza');

  return (
    <section className="mountain-scene-wrap" aria-label="Interactive Alpine Ecosystem Landscape">
      <div className="site-container">
        {/* Section Header */}
        <div className="mountain-scene-header">
          <span className="section-eyebrow">
            <Compass size={13} style={{ display: 'inline', marginRight: '0.4rem' }} />
            ANIMATED ALPINE ECOSYSTEM
          </span>
          <h2 className="section-title">Mountains, Forests & Glacial Waters</h2>
          <p className="section-subtitle">
            Experience the natural progression of high Karakoram topography: soaring 7,000m granite spires, ancient pine woodlands, and mineral-rich turquoise meltwater rivers.
          </p>

          {/* Region Switcher */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.25rem' }}>
            <button
              className={`btn btn-sm ${activeZone === 'hunza' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveZone('hunza')}
            >
              Hunza Valley & Passu
            </button>
            <button
              className={`btn btn-sm ${activeZone === 'skardu' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveZone('skardu')}
            >
              Skardu & Upper Indus
            </button>
            <button
              className={`btn btn-sm ${activeZone === 'baltoro' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveZone('baltoro')}
            >
              Baltoro & Braldu Gorge
            </button>
          </div>
        </div>

        {/* Viewport Frame */}
        <div className="scene-layers-viewport">
          <div className="scene-sky-box">
            {/* Drifting Clouds */}
            <div className="scene-cloud-drift" />

            {/* Distant & Midground Mountain Silhouettes */}
            <svg
              className="scene-peaks-svg"
              viewBox="0 0 1200 280"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Distant snow massif */}
              <polygon
                points="0,280 120,120 280,210 450,80 620,180 800,90 980,190 1150,110 1200,280"
                fill="rgba(30, 41, 59, 0.6)"
              />

              {/* Snow caps on distant peaks */}
              <polygon points="120,120 150,150 90,150" fill="rgba(255, 255, 255, 0.55)" />
              <polygon points="450,80 500,130 400,130" fill="rgba(255, 255, 255, 0.7)" />
              <polygon points="800,90 840,135 760,135" fill="rgba(255, 255, 255, 0.65)" />

              {/* Foreground jagged granite towers (Passu Cones Cathedral Style) */}
              <polygon
                points="0,280 180,160 260,220 390,130 520,240 680,120 780,200 920,110 1080,210 1200,150 1200,280"
                fill="#0f172a"
              />
            </svg>

            {/* Pine Forest Ridge Silhouette */}
            <div className="scene-forest-layer">
              <svg
                className="scene-forest-svg"
                viewBox="0 0 1200 60"
                preserveAspectRatio="none"
                fill="#022c22"
                opacity="0.9"
              >
                <path d="M 0,60 L 0,35 Q 50,20 100,35 T 200,35 T 300,25 T 400,35 T 500,28 T 600,35 T 700,25 T 800,35 T 900,28 T 1000,35 T 1100,25 T 1200,35 L 1200,60 Z" />
              </svg>
            </div>
          </div>

          {/* Animated Glacial River Current */}
          <div className="scene-river-container">
            <AnimatedRiver destinationId={activeZone} />
          </div>

          {/* Ecosystem Telemetry Stats */}
          <div className="scene-valley-stats">
            <div className="scene-stat-cell">
              <span>Glacial Melt Index</span>
              <strong>3,240 m³/sec Peak Discharge</strong>
            </div>
            <div className="scene-stat-cell">
              <span>Ecosystem Altitude</span>
              <strong>2,438m to 7,788m Relief</strong>
            </div>
            <div className="scene-stat-cell">
              <span>Watershed Origin</span>
              <strong>Batura & Baltoro Glaciers</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
