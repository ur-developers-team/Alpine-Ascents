import React, { useState } from 'react';
import accommodationsData from '../../data/accommodations.json';
import { Home, MapPin, Mountain, Check, Sparkles } from 'lucide-react';
import '../FoodAndTransport/FoodAndTransport.css';

export default function AccommodationExplorer() {
  const [selectedType, setSelectedType] = useState('ALL');

  const types = ['ALL', ...Array.from(new Set(accommodationsData.map(a => a.type).filter(Boolean)))];

  const filtered = selectedType === 'ALL'
    ? accommodationsData
    : accommodationsData.filter(a => a.type === selectedType);

  return (
    <div className="exp-sub-section">
      <div className="section-header" style={{ marginBottom: '2rem' }}>
        <div className="section-eyebrow">
          <Home size={14} />
          <span>ALPINE HABITAT</span>
        </div>
        <h3 style={{ fontSize: '1.8rem' }}>ACCOMMODATION & MOUNTAIN SHELTERS</h3>
        <p className="section-subtitle">
          From 400-year-old royal stone palaces in Baltistan to high-altitude geodesic dome camps pitched on glacial moraines.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        {types.map(t => (
          <button
            key={t}
            className={`btn btn-sm ${selectedType === t ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedType(t)}
          >
            {t === 'ALL' ? 'ALL SHELTERS' : t}
          </button>
        ))}
      </div>

      <div className="acc-grid">
        {filtered.map(acc => (
          <div key={acc.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
              <img src={acc.image} alt={acc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.4rem' }}>
                <span className="hud-tag">
                  <Mountain size={11} />
                  <span>{acc.altitude}</span>
                </span>
                <span className="hud-tag">{acc.type}</span>
              </div>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                <MapPin size={13} color="var(--accent)" />
                <span>{acc.location}</span>
              </div>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{acc.name}</h4>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>{acc.description}</p>

              {/* Facilities */}
              <div style={{ marginTop: 'auto' }}>
                <div style={{ fontSize: '0.75rem', fontFamily: 'Space Mono, monospace', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  FACILITIES & AMENITIES
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                  {acc.facilities.map((f, i) => (
                    <span key={i} className="gb-landmark-tag" style={{ fontSize: '0.75rem' }}>{f}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Rate</span>
                  <span style={{ fontWeight: 800, color: 'var(--accent)' }}>{acc.priceSample}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
