import React from 'react';
import { Command, X, Navigation, Search, HelpCircle } from 'lucide-react';
import keyboardShortcutsData from '../../data/keyboardShortcuts.json';
import './KeyboardShortcutModal.css';

export default function KeyboardShortcutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const { navigationShortcuts = [], generalShortcuts = [] } = keyboardShortcutsData;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="shortcut-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="shortcut-header">
          <h3>
            <Command size={18} color="var(--accent)" />
            <span>ALPINE KEYBOARD SHORTCUTS</span>
          </h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close shortcuts help">
            <X size={18} />
          </button>
        </div>

        <div className="shortcut-body">
          <div className="shortcut-section-title">GLOBAL NAVIGATION SEQUENCES</div>
          <div className="shortcut-list">
            {navigationShortcuts.map((sc, idx) => (
              <div key={idx} className="shortcut-row">
                <span className="shortcut-desc">{sc.label}</span>
                <div className="shortcut-keys">
                  {sc.keys.map((k, kIdx) => (
                    <React.Fragment key={kIdx}>
                      <kbd className="shortcut-kbd">{k}</kbd>
                      {kIdx < sc.keys.length - 1 && <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>then</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="shortcut-section-title">CONTROLS & SHORTCUTS</div>
          <div className="shortcut-list">
            {generalShortcuts.map((sc, idx) => (
              <div key={idx} className="shortcut-row">
                <span className="shortcut-desc">{sc.label}</span>
                <div className="shortcut-keys">
                  {sc.keys.map((k, kIdx) => (
                    <React.Fragment key={kIdx}>
                      <kbd className="shortcut-kbd">{k}</kbd>
                      {kIdx < sc.keys.length - 1 && <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>+</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
