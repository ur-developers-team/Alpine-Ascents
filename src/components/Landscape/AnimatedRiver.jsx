import React from 'react';
import animationsData from '../../data/animations.json';
import { Waves } from 'lucide-react';
import './AnimatedRiver.css';

export default function AnimatedRiver({ destinationId = 'hunza', customName = null }) {
  const sceneConfig = animationsData.scenes[destinationId] || animationsData.scenes['hunza'];
  const riverConfig = sceneConfig?.river || {
    name: 'Glacial Meltwater River',
    speed: 1.2,
    gradientStart: '#06b6d4',
    gradientEnd: '#0284c7',
    accentGlaze: '#38bdf8'
  };

  const displayName = customName || riverConfig.name;

  return (
    <div className="animated-river-wrap" aria-label={`Animated landscape of ${displayName}`}>
      {/* Telemetry Tag */}
      <div className="river-label-tag">
        <span className="river-pulse-dot" />
        <Waves size={12} />
        <span>{displayName}</span>
      </div>

      {/* Fluid SVG Waves Canvas */}
      <svg
        className="river-svg-canvas"
        viewBox="0 0 2000 160"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`riverGrad-${destinationId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={riverConfig.gradientStart} stopOpacity="0.85" />
            <stop offset="100%" stopColor={riverConfig.gradientEnd} stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id={`glazeGrad-${destinationId}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={riverConfig.accentGlaze} stopOpacity="0.2" />
            <stop offset="50%" stopColor={riverConfig.accentGlaze} stopOpacity="0.8" />
            <stop offset="100%" stopColor={riverConfig.accentGlaze} stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Deep Undercurrent Layer */}
        <g className="river-wave-layer river-wave-deep">
          <path
            d="M 0 60 Q 250 20, 500 60 T 1000 60 T 1500 60 T 2000 60 L 2000 160 L 0 160 Z"
            fill={`url(#riverGrad-${destinationId})`}
          />
        </g>

        {/* Mid-Stream Current Layer */}
        <g className="river-wave-layer river-wave-mid">
          <path
            d="M 0 80 Q 200 45, 400 80 T 800 80 T 1200 80 T 1600 80 T 2000 80 L 2000 160 L 0 160 Z"
            fill={`url(#riverGrad-${destinationId})`}
            opacity="0.8"
          />
        </g>

        {/* Surface Foam / Sunlight Glint Layer */}
        <g className="river-wave-layer river-wave-crest">
          <path
            d="M 0 95 Q 180 70, 360 95 T 720 95 T 1080 95 T 1440 95 T 1800 95 T 2000 95"
            stroke={`url(#glazeGrad-${destinationId})`}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>
      </svg>

      {/* River Bank Fade */}
      <div className="river-bank-silhouette" />
    </div>
  );
}
