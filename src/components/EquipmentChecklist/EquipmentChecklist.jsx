import React from 'react';
import equipmentData from '../../data/equipment.json';
import { useUserProfile } from '../../context/UserProfileContext';
import { CheckSquare, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import './EquipmentChecklist.css';

export default function EquipmentChecklist() {
  const { checklist, toggleChecklistItem } = useUserProfile();

  const categories = Array.from(new Set(equipmentData.map(e => e.category)));

  const totalItems = equipmentData.length;
  const completedItems = Object.values(checklist).filter(Boolean).length;
  const percentage = Math.round((completedItems / totalItems) * 100);

  return (
    <section id="equipment" className="section checklist-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <CheckSquare size={14} />
            <span>EXPEDITION READINESS AUDIT</span>
          </div>
          <h2 className="section-title">EQUIPMENT & PREPARATION CHECKLIST</h2>
          <p className="section-subtitle">
            A comprehensive, field-tested gear inventory for high-altitude glacial objectives. Check items off as you inspect and pack. Progress is saved locally.
          </p>
        </div>

        <div className="checklist-wrapper">
          {/* Progress Card */}
          <div className="checklist-progress-card">
            <div>
              <span className="section-eyebrow" style={{ textAlign: 'left', margin: 0 }}>PREPARATION PROGRESS</span>
              <h3 style={{ fontSize: '1.75rem', marginTop: '0.2rem' }}>
                {percentage}% Ready for High Altitude
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {completedItems} of {totalItems} items verified and stowed in expedition duffel.
              </p>
            </div>

            <div className="checklist-progress-bar-wrap">
              <div style={{ width: '100%', height: '10px', background: 'var(--bg-tertiary)', borderRadius: '5px', overflow: 'hidden', border: '1px solid var(--border)', marginBottom: '0.5rem' }}>
                <div style={{ width: `${percentage}%`, height: '100%', background: percentage === 100 ? '#10b981' : 'var(--accent)', transition: 'width 0.3s ease' }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {percentage < 50 ? 'Early Preparation Phase' : percentage < 90 ? 'Gear Acclimatization Window' : 'Summit Ready'}
              </span>
            </div>
          </div>

          {/* Categories Blocks */}
          {categories.map(cat => {
            const items = equipmentData.filter(e => e.category === cat);
            return (
              <div key={cat} className="checklist-category-block">
                <div className="checklist-category-header">
                  {cat} ({items.filter(i => checklist[i.id]).length}/{items.length})
                </div>

                <div className="checklist-items-grid">
                  {items.map(item => {
                    const isChecked = !!checklist[item.id];
                    return (
                      <div
                        key={item.id}
                        className={`checklist-item-card ${isChecked ? 'checked' : ''}`}
                        onClick={() => toggleChecklistItem(item.id)}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by parent div
                          style={{ accentColor: 'var(--accent)', width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <strong style={{ fontSize: '0.92rem', color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: isChecked ? 'line-through' : 'none' }}>
                              {item.name}
                            </strong>
                            <span className="hud-tag" style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                              {item.importance}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: '1.4' }}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={18} color="var(--accent)" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Disclaimer: Educational packing checklist based on international UIAA and ACP expedition guidelines. Always consult your lead guide prior to technical high-camp departure.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
