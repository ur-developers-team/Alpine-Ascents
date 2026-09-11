import React from 'react';
import historyData from '../../data/history.json';
import { Flag, Award, Mountain, Snowflake, Compass, Shield, Wind } from 'lucide-react';

export default function HistoryTimeline() {
  const getIcon = (type) => {
    switch (type) {
      case 'award': return <Award size={16} color="var(--accent)" />;
      case 'flag': return <Flag size={16} color="var(--accent)" />;
      case 'snowflake': return <Snowflake size={16} color="var(--accent)" />;
      case 'shield': return <Shield size={16} color="var(--accent)" />;
      case 'wind': return <Wind size={16} color="var(--accent)" />;
      default: return <Mountain size={16} color="var(--accent)" />;
    }
  };

  return (
    <div className="timeline-container">
      {historyData.map((item, idx) => (
        <div key={idx} className="timeline-node">
          <div className="timeline-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span className="hud-tag" style={{ fontSize: '0.85rem' }}>{item.year}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.region} · Elev: {item.elevation}</span>
            </div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {getIcon(item.icon)}
              <span>{item.event}</span>
            </h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '0.5rem' }}>
              Pioneers: {item.climbers}
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              {item.significance}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
