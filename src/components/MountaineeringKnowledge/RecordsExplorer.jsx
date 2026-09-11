import React from 'react';
import recordsData from '../../data/records.json';
import { Trophy, Award, Zap, Mountain, Flame, Compass } from 'lucide-react';
import use3DTilt from '../../hooks/use3DTilt';
import useCountUp from '../../hooks/useCountUp';

function MilestoneCounter({ target, label, unit = '', icon: Icon }) {
  const { count, ref } = useCountUp(target, { duration: 2000 });

  return (
    <div ref={ref} className="record-milestone-card" style={{
      background: 'var(--card-bg, rgba(15, 23, 42, 0.75))',
      border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
      borderRadius: '12px',
      padding: '1.25rem 1rem',
      textAlign: 'center',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.35rem'
    }}>
      <div style={{ color: 'var(--accent, #d4af37)', marginBottom: '0.2rem' }}>
        {Icon && <Icon size={22} />}
      </div>
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: '2rem',
        fontWeight: 900,
        color: 'var(--text-primary, #ffffff)',
        lineHeight: 1.1,
        letterSpacing: '-0.5px'
      }}>
        {count}
        {unit && <span style={{ fontSize: '1rem', marginLeft: '0.2rem', color: 'var(--accent, #d4af37)' }}>{unit}</span>}
      </div>
      <div style={{
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: 'var(--text-muted, #94a3b8)',
        fontWeight: 600
      }}>
        {label}
      </div>
    </div>
  );
}

function RecordCard({ rec }) {
  const cardRef = use3DTilt({ max: 6, scale: 1.02 });

  return (
    <div ref={cardRef} className="record-card" style={{
      background: 'var(--card-bg, rgba(15, 23, 42, 0.65))',
      border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
      borderRadius: '16px',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
      transformStyle: 'preserve-3d'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{
          display: 'inline-flex',
          padding: '0.65rem',
          borderRadius: '50%',
          background: 'rgba(212, 175, 55, 0.12)',
          color: 'var(--accent, #d4af37)',
          border: '1px solid rgba(212, 175, 55, 0.3)'
        }}>
          <Trophy size={24} />
        </div>
        <span className="hud-tag" style={{
          fontSize: '0.7rem',
          padding: '0.25rem 0.6rem',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.12)',
          color: 'var(--accent, #d4af37)'
        }}>
          {rec.category}
        </span>
      </div>

      <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text-primary, #fff)' }}>
        {rec.title}
      </h4>

      <div style={{
        fontSize: '1.35rem',
        fontWeight: 900,
        color: 'var(--accent, #d4af37)',
        fontFamily: "'Space Mono', monospace",
        margin: '0.4rem 0',
        letterSpacing: '-0.3px'
      }}>
        {rec.recordTime}
      </div>

      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary, #fff)', marginBottom: '0.4rem' }}>
        👤 {rec.holder} <span style={{ opacity: 0.6, fontWeight: 400 }}>({rec.year})</span>
      </div>

      <p style={{
        fontSize: '0.85rem',
        lineHeight: 1.55,
        color: 'var(--text-secondary, #cbd5e1)',
        marginTop: '0.5rem',
        flexGrow: 1
      }}>
        {rec.details}
      </p>
    </div>
  );
}

export default function RecordsExplorer() {
  return (
    <div className="records-explorer-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Animated Milestones Banner (SRS Requirement 24) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '0.5rem'
      }}>
        <MilestoneCounter target={8611} label="K2 Savage Summit" unit="m" icon={Mountain} />
        <MilestoneCounter target={8849} label="Everest Apex" unit="m" icon={Flame} />
        <MilestoneCounter target={14} label="Crown 8,000m Peaks" icon={Award} />
        <MilestoneCounter target={92} label="14 Peaks Speed Record" unit="d" icon={Zap} />
      </div>

      {/* Records Cards with 3D Tilt (SRS Requirement 11) */}
      <div className="records-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {recordsData.map(rec => (
          <RecordCard key={rec.id} rec={rec} />
        ))}
      </div>
    </div>
  );
}
