import React from 'react';
import hazardsData from '../../data/hazards.json';
import { AlertTriangle, ShieldAlert, HeartPulse, Activity } from 'lucide-react';

export default function HazardsViewer() {
  return (
    <div className="hazards-grid">
      {hazardsData.map(hazard => (
        <div key={hazard.id} className="hazard-card high-alert">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span className="hud-tag" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', borderColor: 'rgba(244, 63, 94, 0.3)' }}>
              {hazard.severity}
            </span>
            <span className="hud-tag">{hazard.category}</span>
          </div>

          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{hazard.title}</h3>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontFamily: 'Space Mono, monospace', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              RECOGNITION / SYMPTOMS
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem' }}>
              {hazard.symptoms.map((sym, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                  <span style={{ color: '#f43f5e' }}>!</span>
                  <span>{sym}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ padding: '0.85rem 1rem', background: 'rgba(244, 63, 94, 0.08)', borderRadius: '6px', border: '1px solid rgba(244, 63, 94, 0.2)', marginBottom: '1rem', fontSize: '0.82rem' }}>
            <strong style={{ color: '#f43f5e', display: 'block', marginBottom: '0.2rem' }}>IMMEDIATE FIELD ACTION:</strong>
            <p style={{ color: 'var(--text-primary)' }}>{hazard.immediateAction}</p>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <strong>Prevention:</strong> {hazard.prevention}
          </div>
        </div>
      ))}
    </div>
  );
}
