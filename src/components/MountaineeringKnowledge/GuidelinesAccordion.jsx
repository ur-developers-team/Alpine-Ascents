import React, { useState } from 'react';
import guidelinesData from '../../data/guidelines.json';
import { ChevronDown, ChevronUp, ShieldCheck, Check } from 'lucide-react';

export default function GuidelinesAccordion() {
  const [openCategory, setOpenCategory] = useState(guidelinesData[0]?.id || 'lnt-principles');

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {guidelinesData.map(group => {
        const isOpen = openCategory === group.id;
        return (
          <div key={group.id} className="card" style={{ overflow: 'hidden' }}>
            <div
              onClick={() => setOpenCategory(isOpen ? null : group.id)}
              style={{
                padding: '1.25rem 1.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                background: isOpen ? 'var(--bg-tertiary)' : 'transparent'
              }}
            >
              <div>
                <span className="section-eyebrow" style={{ fontSize: '0.68rem', textAlign: 'left', marginBottom: '0.15rem' }}>
                  {group.category}
                </span>
                <h4 style={{ fontSize: '1.2rem' }}>{group.title}</h4>
              </div>
              {isOpen ? <ChevronUp size={20} color="var(--accent)" /> : <ChevronDown size={20} />}
            </div>

            {isOpen && (
              <div style={{ padding: '1.5rem 1.75rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {group.principles.map((pr, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ marginTop: '3px', padding: '0.2rem', borderRadius: '50%', background: 'var(--badge-bg)', color: 'var(--accent)' }}>
                      <Check size={14} />
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                        {pr.name}
                      </strong>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {pr.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
