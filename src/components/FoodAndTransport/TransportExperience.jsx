import React from 'react';
import transportData from '../../data/transport.json';
import { Navigation, Clock, ShieldCheck, MapPin, Compass } from 'lucide-react';
import './FoodAndTransport.css';

export default function TransportExperience() {
  return (
    <div className="exp-sub-section" style={{ borderBottom: 'none' }}>
      <div className="section-header" style={{ marginBottom: '2rem' }}>
        <div className="section-eyebrow">
          <Navigation size={14} />
          <span>EXPEDITION MOBILITY & ARTERIES</span>
        </div>
        <h3 style={{ fontSize: '1.8rem' }}>TRANSPORT & HIGHWAY ACCESS</h3>
        <p className="section-subtitle">
          Navigating the vertical canyons of the Indus and Hunza rivers via the Karakoram Highway, high-altitude STOL airfields, and helicopter shuttles.
        </p>
      </div>

      <div className="transport-grid">
        {transportData.map(item => (
          <div key={item.id} className="transport-card">
            <div>
              <div className="route-step-line">
                <MapPin size={14} />
                <span>{item.startingLocation}</span>
                <span>→</span>
                <span>{item.destination}</span>
              </div>

              <h4 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>{item.route}</h4>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <span className="hud-tag">{item.transportType}</span>
                <span className="hud-tag">
                  <Clock size={11} />
                  <span>{item.duration}</span>
                </span>
              </div>

              <div style={{ fontSize: '0.78rem', fontFamily: 'Space Mono, monospace', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                ROUTE HIGHLIGHTS
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.5rem' }}>
                {item.highlights.map((h, i) => (
                  <li key={i} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.4rem' }}>
                    <span style={{ color: 'var(--accent)' }}>•</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Comfort Rating:</span>
                <strong style={{ color: 'var(--text-primary)' }}>{item.comfortLevel}</strong>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Specs: {item.vehicleSpecs}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
