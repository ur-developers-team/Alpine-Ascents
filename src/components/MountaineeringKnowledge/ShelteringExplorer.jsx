import React from 'react';
import shelteringData from '../../data/sheltering.json';
import { Home, Wind, ShieldCheck, Mountain } from 'lucide-react';

export default function ShelteringExplorer() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
      {shelteringData.map(shelter => (
        <div key={shelter.id} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="hud-tag">
              <Mountain size={11} />
              <span>{shelter.altitudeRange}</span>
            </span>
            <span className="hud-tag">{shelter.weight}</span>
          </div>

          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{shelter.name}</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            {shelter.description}
          </p>

          <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-tertiary)', borderRadius: '6px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Wind size={16} color="var(--accent)" />
            <span style={{ fontSize: '0.8rem' }}>Wind Tolerance: <strong>{shelter.windResistance}</strong></span>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontFamily: 'Space Mono, monospace', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              KEY ARCHITECTURAL FEATURES
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem' }}>
              {shelter.features.map((feat, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--accent)' }}>•</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <strong>Ideal Deployment:</strong> {shelter.idealUse}
          </div>
        </div>
      ))}
    </div>
  );
}
