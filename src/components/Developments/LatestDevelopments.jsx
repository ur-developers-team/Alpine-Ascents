import React from 'react';
import developmentsData from '../../data/developments.json';
import { Sparkles, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LatestDevelopments() {
  return (
    <section id="developments" className="section" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Sparkles size={14} />
            <span>FRONTIERS & INNOVATION</span>
          </div>
          <h2 className="section-title">LATEST IN THE MOUNTAINS</h2>
          <p className="section-subtitle">
            Recent technological, physiological, and environmental breakthroughs transforming extreme high-altitude exploration.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
          {developmentsData.map(dev => (
            <div key={dev.id} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="hud-tag">{dev.badge}</span>
                <span style={{ fontSize: '0.75rem', fontFamily: 'Space Mono, monospace', color: 'var(--text-muted)' }}>{dev.date}</span>
              </div>

              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>{dev.title}</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.6' }}>
                {dev.summary}
              </p>

              <div style={{ marginTop: 'auto', padding: '0.85rem 1rem', background: 'var(--bg-tertiary)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                <strong style={{ fontSize: '0.78rem', color: 'var(--accent)', display: 'block', marginBottom: '0.2rem' }}>
                  OPERATIONAL IMPACT
                </strong>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>{dev.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
