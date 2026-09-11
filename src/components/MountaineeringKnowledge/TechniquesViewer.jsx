import React from 'react';
import techniquesData from '../../data/techniques.json';
import { Shield, Check, Compass, AlertCircle } from 'lucide-react';

export default function TechniquesViewer() {
  return (
    <div className="techniques-grid">
      {techniquesData.map(tech => (
        <div key={tech.id} className="technique-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span className="hud-tag">{tech.category}</span>
            <span className="hud-tag" style={{ background: 'rgba(217, 119, 6, 0.15)', color: '#fbbf24', borderColor: '#d97706' }}>
              {tech.difficulty}
            </span>
          </div>

          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>{tech.name}</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{tech.description}</p>

          {/* Steps */}
          <div className="technique-steps-list">
            {tech.steps.map((step, idx) => (
              <div key={idx} className="technique-step-item">
                <span className="step-circle">{idx + 1}</span>
                <span style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>{step}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'auto', padding: '0.85rem 1rem', background: 'var(--bg-tertiary)', borderRadius: '6px', border: '1px solid var(--border)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <AlertCircle size={15} color="var(--accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.78rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Golden Rule: </strong>
              <span style={{ color: 'var(--text-secondary)' }}>{tech.goldenRule}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
