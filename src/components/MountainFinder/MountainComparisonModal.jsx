import React from 'react';
import { X, Mountain, Scale, Check } from 'lucide-react';

export default function MountainComparisonModal({ mountains, isOpen, onClose, onRemoveMountain }) {
  if (!isOpen || !mountains || mountains.length === 0) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1000px' }}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close comparison">
          <X size={18} />
        </button>

        <div style={{ padding: '2rem 2.5rem 1.5rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Scale size={24} color="var(--accent)" />
            <div>
              <h3 style={{ fontSize: '1.6rem' }}>MOUNTAIN COMPARISON MATRIX</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Comparing {mountains.length} iconic summits side-by-side.
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: '2rem', overflowX: 'auto' }}>
          <table className="comparison-table" aria-label="Mountain Comparison">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>CRITERIA</th>
                {mountains.map(m => (
                  <th key={m.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{m.name}</div>
                        <span className="hud-tag" style={{ marginTop: '0.2rem' }}>{m.altitudeFormatted}</span>
                      </div>
                      {mountains.length > 1 && (
                        <button
                          onClick={() => onRemoveMountain(m.id)}
                          style={{ color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
                          title="Remove from comparison"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Altitude / Elevation</strong></td>
                {mountains.map(m => (
                  <td key={m.id}><strong>{m.altitudeFormatted}</strong> ({m.altitude}m)</td>
                ))}
              </tr>
              <tr>
                <td><strong>Mountain Range</strong></td>
                {mountains.map(m => (
                  <td key={m.id}>{m.range}</td>
                ))}
              </tr>
              <tr>
                <td><strong>Country / Region</strong></td>
                {mountains.map(m => (
                  <td key={m.id}>{m.country} ({m.region})</td>
                ))}
              </tr>
              <tr>
                <td><strong>Difficulty Rating</strong></td>
                {mountains.map(m => (
                  <td key={m.id}>{m.difficulty}</td>
                ))}
              </tr>
              <tr>
                <td><strong>First Historic Ascent</strong></td>
                {mountains.map(m => (
                  <td key={m.id}>{m.firstAscent}</td>
                ))}
              </tr>
              <tr>
                <td><strong>Optimal Climbing Window</strong></td>
                {mountains.map(m => (
                  <td key={m.id}>{m.bestSeason}</td>
                ))}
              </tr>
              <tr>
                <td><strong>Expedition Duration</strong></td>
                {mountains.map(m => (
                  <td key={m.id}>{m.duration}</td>
                ))}
              </tr>
              <tr>
                <td><strong>Dominant Terrain</strong></td>
                {mountains.map(m => (
                  <td key={m.id} style={{ fontSize: '0.82rem' }}>{m.terrain}</td>
                ))}
              </tr>
              <tr>
                <td><strong>Climbing Style</strong></td>
                {mountains.map(m => (
                  <td key={m.id}>{m.expeditionType}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
