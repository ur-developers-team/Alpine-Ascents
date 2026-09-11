import React, { useEffect } from 'react';
import { useGamification } from '../../context/GamificationContext';
import { Trophy, Flag, Award, X, Sparkles, CheckCircle2 } from 'lucide-react';
import './SummitCelebrationModal.css';

export default function SummitCelebrationModal() {
  const { showCelebration, setShowCelebration, setShowCertificate } = useGamification();

  useEffect(() => {
    if (showCelebration) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showCelebration]);

  if (!showCelebration) return null;

  return (
    <div className="celebration-backdrop" onClick={() => setShowCelebration(false)}>
      <div className="celebration-card" onClick={(e) => e.stopPropagation()}>
        <button
          className="celebration-close-btn"
          onClick={() => setShowCelebration(false)}
          aria-label="Close celebration"
        >
          <X size={18} />
        </button>

        {/* Confetti & Snowburst Canvas Elements */}
        <div className="snowburst-emitter">
          <span className="snow-flake flake-1">❄</span>
          <span className="snow-flake flake-2">✦</span>
          <span className="snow-flake flake-3">❄</span>
          <span className="snow-flake flake-4">✦</span>
          <span className="snow-flake flake-5">❄</span>
        </div>

        <div className="celebration-summit-badge">
          <Flag size={36} color="#d4af37" className="flag-wave" />
        </div>

        <span className="celebration-eyebrow">
          <Sparkles size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
          EXPEDITION TRIUMPH · 8,611M REACHED
        </span>

        <h2 className="celebration-title">🏔️ SUMMIT REACHED!</h2>

        <p className="celebration-subtitle">
          You have mastered the virtual ridges of Alpine Ascents. Through topographic research, safety ropecraft, hazard vigilance, and high-altitude packing, you have earned your place atop the savage apex of K2.
        </p>

        <div className="celebration-badge-box">
          <div className="celebration-badge-icon">
            <Trophy size={26} color="#d4af37" />
          </div>
          <div>
            <strong>Summit Champion Achievement Unlocked</strong>
            <p>Your official expedition credential is now available in your personal profile.</p>
          </div>
        </div>

        <div className="celebration-actions">
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowCelebration(false);
              setShowCertificate(true);
            }}
          >
            <Award size={16} />
            <span>Generate Official Certificate</span>
          </button>
          <button
            className="btn btn-outline"
            onClick={() => setShowCelebration(false)}
          >
            <span>Continue Exploring</span>
          </button>
        </div>
      </div>
    </div>
  );
}
