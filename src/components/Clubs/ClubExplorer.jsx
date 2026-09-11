import React from 'react';
import clubsData from '../../data/clubs.json';
import { Globe, MapPin, ExternalLink, ShieldCheck, Users } from 'lucide-react';

export default function ClubExplorer() {
  return (
    <section id="clubs" className="section" style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Users size={14} />
            <span>INSTITUTIONAL GUARDIANS</span>
          </div>
          <h2 className="section-title">ALPINE CLUBS & ORGANIZATIONS</h2>
          <p className="section-subtitle">
            National and global governing bodies establishing international climbing safety standards, maintaining alpine refuges, and stewarding mountain regions.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
          {clubsData.map(club => (
            <div key={club.id} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="hud-tag">FOUNDED {club.founded}</span>
                <span className="hud-tag">{club.country}</span>
              </div>

              <h4 style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>{club.name}</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                <MapPin size={14} color="var(--accent)" />
                <span>HQ: {club.city}</span>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.6' }}>
                {club.role}
              </p>

              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{club.membership}</span>
                <a
                  href={club.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                >
                  <span>Portal</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
