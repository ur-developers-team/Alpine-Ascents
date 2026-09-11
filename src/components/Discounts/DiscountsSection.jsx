import React, { useState } from 'react';
import discountsData from '../../data/discounts.json';
import { Tag, Sparkles, Check, Copy } from 'lucide-react';

export default function DiscountsSection() {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  return (
    <section id="offers" className="section" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Tag size={14} />
            <span>SEASONAL INCENTIVES</span>
          </div>
          <h2 className="section-title">EXPEDITION PRIVILEGES & OFFERS</h2>
          <p className="section-subtitle">
            Transparent group concessions and early planning privileges. Copy code to apply during your custom expedition request.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {discountsData.map(d => (
            <div key={d.id} className="card" style={{ padding: '2.25rem', display: 'flex', flexDirection: 'column', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="hud-tag" style={{ background: 'rgba(217, 119, 6, 0.2)', color: '#fbbf24', borderColor: '#d97706' }}>
                  {d.badge}
                </span>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent)' }}>{d.discount}</span>
              </div>

              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.4rem' }}>{d.title}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>{d.description}</p>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                <strong>Eligibility:</strong> {d.eligibility}
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.9rem', fontWeight: 700, padding: '0.35rem 0.65rem', background: 'var(--bg-tertiary)', borderRadius: '4px', border: '1px dashed var(--border)' }}>
                  {d.code}
                </div>

                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleCopy(d.code)}
                >
                  {copiedCode === d.code ? (
                    <>
                      <Check size={14} color="#10b981" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
