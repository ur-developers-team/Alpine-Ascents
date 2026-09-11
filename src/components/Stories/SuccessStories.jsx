import React from 'react';
import storiesData from '../../data/successStories.json';
import { Award, Mountain, Clock, Check, Sparkles } from 'lucide-react';

export default function SuccessStories() {
  return (
    <section id="stories" className="section" style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Award size={14} />
            <span>TRIUMPHS OF HUMAN SPIRIT</span>
          </div>
          <h2 className="section-title">EXPEDITION STORIES</h2>
          <p className="section-subtitle">
            Historic and modern accounts of courage, camaraderie, and barrier-breaking achievements upon the most formidable peaks in the world.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
          {storiesData.map(story => (
            <div key={story.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '240px', position: 'relative', overflow: 'hidden' }}>
                <img src={story.image} alt={story.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                  <span className="hud-tag">
                    <Mountain size={11} />
                    <span>{story.peak}</span>
                  </span>
                </div>
              </div>

              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span className="section-eyebrow" style={{ fontSize: '0.72rem', textAlign: 'left', marginBottom: '0.2rem' }}>
                  {story.region}
                </span>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>{story.title}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '1rem' }}>
                  Leader: {story.leadClimber} · {story.duration}
                </div>

                <p style={{ fontSize: '0.9rem', lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  {story.story}
                </p>

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'Space Mono, monospace', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    HISTORIC HIGHLIGHTS
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {story.highlights.map((h, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        <Check size={13} color="#10b981" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
