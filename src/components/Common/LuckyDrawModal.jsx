import React, { useState } from 'react';
import { X, Sparkles, Compass, Award, Copy, Check, ArrowRight, ShieldCheck, Gift } from 'lucide-react';
import luckyDrawData from '../../data/luckyDraw.json';
import { useUserProfile } from '../../context/UserProfileContext';
import { useToast } from '../../context/ToastContext';
import './LuckyDrawModal.css';

export default function LuckyDrawModal({ isOpen, onClose, onApplyReward }) {
  const { profile, addAchievement } = useUserProfile();
  const { showToast } = useToast ? useToast() : { showToast: () => {} };

  const [name, setName] = useState(profile.name || '');
  const [email, setEmail] = useState(profile.email || '');
  const [favDest, setFavDest] = useState('Hunza & Attabad');
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinRotation, setSpinRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSpin = (e) => {
    e.preventDefault();
    if (isSpinning) return;

    setIsSpinning(true);
    setWonPrize(null);

    // Random prize selection
    const randomIndex = Math.floor(Math.random() * luckyDrawData.prizes.length);
    const selectedPrize = luckyDrawData.prizes[randomIndex];

    // Compute rotation (multi-revolution spin + target sector angle)
    const extraSpins = 5 * 360;
    const segmentAngle = 360 / luckyDrawData.prizes.length;
    const targetAngle = extraSpins + (randomIndex * segmentAngle) + (segmentAngle / 2);

    setSpinRotation(prev => prev + targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(selectedPrize);
      if (addAchievement) {
        addAchievement('alpine-lucky-climber');
      }
      if (showToast) {
        showToast(`🎉 You unlocked: ${selectedPrize.name}!`, 'success');
      }
    }, 3200);
  };

  const handleCopyCode = () => {
    if (!wonPrize) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(wonPrize.code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="modal-overlay lucky-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content lucky-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close Lucky Draw">
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="lucky-header-bar">
          <span className="lucky-campaign-pill">
            <Gift size={13} />
            <span>SEASONAL EXPEDITION REWARD</span>
          </span>
          <h2 className="lucky-modal-title">{luckyDrawData.campaignTitle}</h2>
          <p className="lucky-modal-tagline">{luckyDrawData.tagline}</p>
        </div>

        {/* Main Interactive Stage */}
        <div className="lucky-modal-body">
          {!wonPrize ? (
            <div className="lucky-spin-stage">
              {/* Form Input */}
              <form className="lucky-entry-form" onSubmit={handleSpin}>
                <div className="lucky-input-grid">
                  <div className="lucky-field">
                    <label>Explorer Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Honnold"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="lucky-field">
                    <label>Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="climber@alpineascents.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="lucky-field full-width">
                    <label>Dream Mountain Destination</label>
                    <select
                      value={favDest}
                      onChange={(e) => setFavDest(e.target.value)}
                    >
                      <option value="Hunza & Attabad">Hunza Valley & Passu Cathedral</option>
                      <option value="Skardu & K2">Skardu & K2 Concordia</option>
                      <option value="Fairy Meadows">Fairy Meadows & Nanga Parbat</option>
                      <option value="Deosai Plains">Deosai Alpine Wilderness</option>
                      <option value="Naltar Lakes">Naltar Valley Emerald Lakes</option>
                    </select>
                  </div>
                </div>

                {/* Spinning Wheel Graphic */}
                <div className="compass-wheel-container">
                  <div
                    className={`compass-wheel ${isSpinning ? 'is-spinning' : ''}`}
                    style={{ transform: `rotate(${spinRotation}deg)` }}
                  >
                    <div className="wheel-needle" />
                    <div className="compass-face">
                      <Compass size={80} color="var(--accent)" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg lucky-spin-btn"
                  disabled={isSpinning}
                >
                  <Sparkles size={18} />
                  <span>{isSpinning ? 'SPINNING COMPASS...' : 'SPIN THE COMPASS & REVEAL'}</span>
                </button>
              </form>
            </div>
          ) : (
            /* Won Prize Certificate Reveal */
            <div className="lucky-prize-reveal animate-fade-in">
              <div className="prize-cert-box">
                <div className="prize-icon-circle" style={{ background: wonPrize.color || '#0284c7' }}>
                  <Award size={36} color="#ffffff" />
                </div>
                <span className="prize-cat-pill">{wonPrize.category} Privilege</span>
                <h3 className="prize-name">{wonPrize.name}</h3>
                <p className="prize-desc">{wonPrize.description}</p>

                {/* Voucher Code Box */}
                <div className="prize-code-box">
                  <span className="code-label">OFFICIAL CLAIM CODE:</span>
                  <div className="code-display">
                    <code>{wonPrize.code}</code>
                    <button className="copy-btn" onClick={handleCopyCode}>
                      {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
                      <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                </div>

                <div className="prize-action-row">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      onClose();
                      if (onApplyReward) onApplyReward(wonPrize);
                    }}
                  >
                    <span>Apply Code to Expedition</span>
                    <ArrowRight size={15} />
                  </button>
                  <button className="btn btn-outline" onClick={() => setWonPrize(null)}>
                    <span>Spin Again</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mandatory Demo Disclaimer */}
          <div className="lucky-disclaimer-card">
            <ShieldCheck size={15} color="var(--accent-gold)" />
            <span>{luckyDrawData.disclaimer}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
