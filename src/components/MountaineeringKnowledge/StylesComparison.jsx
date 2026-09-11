import React from 'react';
import stylesData from '../../data/styles.json';
import { Check, X as Cross, Award } from 'lucide-react';

export default function StylesComparison() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
      {stylesData.map(style => (
        <div key={style.id} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '1rem' }}>
            <span className="hud-tag" style={{ marginBottom: '0.4rem' }}>{style.badge}</span>
            <h3 style={{ fontSize: '1.4rem' }}>{style.name}</h3>
          </div>

          <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
            {style.description}
          </p>

          <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem' }}>
            <div><strong>Speed:</strong> {style.speed}</div>
            <div><strong>Support:</strong> {style.support}</div>
            <div><strong>Supplemental O2:</strong> {style.oxygen}</div>
            <div><strong>Fixed Ropes:</strong> {style.fixedRopes}</div>
            <div><strong>Camps:</strong> {style.camps}</div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontFamily: 'Space Mono, monospace', color: '#10b981', marginBottom: '0.4rem' }}>KEY ADVANTAGES</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem' }}>
              {style.pros.map((p, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.4rem' }}>
                  <Check size={14} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <strong>Iconic Practitioners:</strong> {style.representativeClimbers}
          </div>
        </div>
      ))}
    </div>
  );
}
