import React from 'react';
import { X, Shield, MapPin, Check, Award, Globe, Send } from 'lucide-react';

export default function GuideDetailModal({ guide, isOpen, onClose, onRequestGuide }) {
  if (!isOpen || !guide) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close guide details">
          <X size={18} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ height: '320px', position: 'relative' }}>
            <img src={guide.image} alt={guide.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ padding: '2rem' }}>
            <span className="hud-tag" style={{ marginBottom: '0.4rem' }}>{guide.status}</span>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>{guide.name}</h3>
            <p style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem' }}>{guide.role}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div><strong>Primary Region:</strong> {guide.region}</div>
              <div><strong>Field Experience:</strong> {guide.experienceYears} Years</div>
              <div><strong>Key Summits:</strong> {guide.summits}</div>
              <div><strong>Languages:</strong> {guide.languages.join(', ')}</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '2rem' }}>
          <div className="dest-detail-section-block">
            <span className="section-eyebrow">PROFESSIONAL BIOGRAPHY</span>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.7' }}>{guide.bio}</p>
          </div>

          <div className="dest-detail-section-block">
            <span className="section-eyebrow">SPECIALIZED COMPETENCIES & CERTIFICATIONS</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.65rem', marginTop: '0.5rem' }}>
              {guide.skills.map((s, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.75rem', background: 'var(--bg-tertiary)', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.85rem' }}>
                  <Check size={14} color="var(--accent)" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              *Illustrative sample guide profile adhering to international UIAGM guidelines.
            </span>
            <button
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onRequestGuide && onRequestGuide(guide);
              }}
            >
              <Send size={16} />
              <span>REQUEST THIS GUIDE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
