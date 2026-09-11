import React from 'react';
import packagesData from '../../data/packages.json';
import { Check, Compass } from 'lucide-react';

export default function PackageComparison({ onSelectPackage }) {
  return (
    <div style={{ marginTop: '4rem' }}>
      <div className="section-header" style={{ marginBottom: '2rem' }}>
        <div className="section-eyebrow">
          <Compass size={14} />
          <span>SIDE-BY-SIDE MATRIX</span>
        </div>
        <h3 style={{ fontSize: '1.8rem' }}>COMPARE EXPEDITION PACKAGES</h3>
        <p className="section-subtitle">
          Examine the distinct differences between our Explorer, Comfort, Premium, and Expedition Pro tiers.
        </p>
      </div>

      <div className="comparison-table-wrapper">
        <table className="comparison-table" aria-label="Expedition Package Comparison">
          <thead>
            <tr>
              <th style={{ width: '22%' }}>FEATURE / CRITERIA</th>
              {packagesData.map(pkg => (
                <th key={pkg.id} style={{ width: `${78 / packagesData.length}%` }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{pkg.name}</div>
                  <span className="hud-tag">{pkg.type}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Duration</strong></td>
              {packagesData.map(pkg => (
                <td key={pkg.id}><strong>{pkg.duration}</strong></td>
              ))}
            </tr>
            <tr>
              <td><strong>Difficulty Rating</strong></td>
              {packagesData.map(pkg => (
                <td key={pkg.id}>{pkg.difficulty}</td>
              ))}
            </tr>
            <tr>
              <td><strong>Accommodation Type</strong></td>
              {packagesData.map(pkg => (
                <td key={pkg.id}>{pkg.accommodation}</td>
              ))}
            </tr>
            <tr>
              <td><strong>Meals & Nutrition</strong></td>
              {packagesData.map(pkg => (
                <td key={pkg.id}>{pkg.meals}</td>
              ))}
            </tr>
            <tr>
              <td><strong>High-Altitude Guide</strong></td>
              {packagesData.map(pkg => (
                <td key={pkg.id}>{pkg.guide}</td>
              ))}
            </tr>
            <tr>
              <td><strong>Ground Logistics & Transport</strong></td>
              {packagesData.map(pkg => (
                <td key={pkg.id}>{pkg.transport}</td>
              ))}
            </tr>
            <tr>
              <td><strong>Starting Demo Price</strong></td>
              {packagesData.map(pkg => (
                <td key={pkg.id}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent)' }}>${pkg.price}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Per Climber</span>
                </td>
              ))}
            </tr>
            <tr>
              <td><strong>Action</strong></td>
              {packagesData.map(pkg => (
                <td key={pkg.id}>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => onSelectPackage && onSelectPackage(pkg)}
                    style={{ width: '100%' }}
                  >
                    View Details
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
