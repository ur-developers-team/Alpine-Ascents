import React, { useState, useRef } from 'react';
import glacierData from '../../data/glacierComparison.json';
import { Layers, MoveHorizontal, Compass, Eye, ShieldCheck } from 'lucide-react';
import './GlacierSlider.css';

export default function GlacierSlider() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const currentGlacier = glacierData[selectedIndex] || glacierData[0];

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedPct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(clampedPct);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <section id="glacier-comparison" className="section glacier-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Layers size={14} />
            <span>ENVIRONMENTAL GLACIOLOGY</span>
          </div>
          <h2 className="section-title">A CENTURY OF KARAKORAM ICE</h2>
          <p className="section-subtitle">
            Compare historic early 20th-century expedition survey photography against modern high-resolution satellite monitoring.
          </p>
        </div>

        {/* Glacier Selector Tabs */}
        <div className="glacier-selector-row">
          {glacierData.map((g, idx) => (
            <button
              key={g.id}
              className={`btn btn-sm ${selectedIndex === idx ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => {
                setSelectedIndex(idx);
                setSliderPos(50);
              }}
            >
              <Compass size={14} />
              <span>{g.title.split(':')[0]}</span>
            </button>
          ))}
        </div>

        {/* Interactive Comparison Card */}
        <div className="glacier-comparison-box">
          <div className="glacier-telemetry-header">
            <div>
              <span className="glacier-coords-tag">{currentGlacier.coordinates}</span>
              <h3 className="glacier-box-title">{currentGlacier.title}</h3>
              <p className="glacier-box-desc">{currentGlacier.caption}</p>
            </div>
            <div className="glacier-hint-pill">
              <MoveHorizontal size={14} />
              <span>Drag divider horizontally</span>
            </div>
          </div>

          {/* Draggable Splitter Frame */}
          <div
            ref={containerRef}
            className="glacier-slider-frame"
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            onTouchMove={handleTouchMove}
          >
            {/* After Image (Full width background) */}
            <img
              src={currentGlacier.afterImage}
              alt={`${currentGlacier.title} - ${currentGlacier.afterYear}`}
              className="glacier-img-layer after-layer"
            />
            <span className="glacier-year-badge after-badge">
              {currentGlacier.afterYear}
            </span>

            {/* Before Image (Clipped overlay) */}
            <div
              className="glacier-clip-wrapper"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <img
                src={currentGlacier.beforeImage}
                alt={`${currentGlacier.title} - ${currentGlacier.beforeYear}`}
                className="glacier-img-layer before-layer"
              />
              <span className="glacier-year-badge before-badge">
                {currentGlacier.beforeYear}
              </span>
            </div>

            {/* Divider Handle Line */}
            <div
              className="glacier-divider-bar"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="divider-handle-grip">
                <MoveHorizontal size={16} color="#0b111e" />
              </div>
            </div>
          </div>

          {/* Scientific Observations */}
          <div className="glacier-scientific-footer">
            <div className="glacier-obs-card">
              <strong>Glaciological Field Observation:</strong>
              <p>{currentGlacier.observation}</p>
            </div>
            <div className="glacier-climate-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent, #d4af37)', marginBottom: '0.2rem' }}>
                <ShieldCheck size={16} />
                <strong>Alpine Ascents Conservation Mandate</strong>
              </div>
              <p>{currentGlacier.climateNote}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
