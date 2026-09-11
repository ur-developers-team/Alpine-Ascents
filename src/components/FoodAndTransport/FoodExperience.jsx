import React from 'react';
import foodData from '../../data/food.json';
import { Utensils, Check, Heart, Shield } from 'lucide-react';
import './FoodAndTransport.css';

export default function FoodExperience() {
  return (
    <div className="exp-sub-section">
      <div className="section-header" style={{ marginBottom: '2rem' }}>
        <div className="section-eyebrow">
          <Utensils size={14} />
          <span>GASTRONOMY & HIGH-ALTITUDE NUTRITION</span>
        </div>
        <h3 style={{ fontSize: '1.8rem' }}>FOOD EXPERIENCE & TRAIL NUTRITION</h3>
        <p className="section-subtitle">
          High-altitude physiology demands rapid caloric conversion. Discover traditional Himalayan and Balti fuel alongside curated expedition base camp menus.
        </p>
      </div>

      <div className="food-grid">
        {foodData.map(food => (
          <div key={food.id} className="food-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span className="section-eyebrow" style={{ fontSize: '0.72rem', textAlign: 'left', marginBottom: '0.2rem' }}>{food.region}</span>
                <h4 style={{ fontSize: '1.3rem' }}>{food.cuisineType}</h4>
              </div>
              <span className="hud-tag" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderColor: '#059669' }}>
                {food.inclusionStatus}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', margin: '1rem 0 1.5rem', fontSize: '0.88rem' }}>
              <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-tertiary)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                <strong style={{ color: 'var(--accent)', display: 'block', marginBottom: '0.2rem' }}>Breakfast</strong>
                <p style={{ fontSize: '0.82rem' }}>{food.breakfast}</p>
              </div>

              <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-tertiary)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                <strong style={{ color: 'var(--accent)', display: 'block', marginBottom: '0.2rem' }}>Trail Lunch</strong>
                <p style={{ fontSize: '0.82rem' }}>{food.lunch}</p>
              </div>

              <div style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-tertiary)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                <strong style={{ color: 'var(--accent)', display: 'block', marginBottom: '0.2rem' }}>Hot Alpine Dinner</strong>
                <p style={{ fontSize: '0.82rem' }}>{food.dinner}</p>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', fontFamily: 'Space Mono, monospace', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                METABOLIC / ALTITUDE BENEFIT
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{food.altitudeBenefit}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
