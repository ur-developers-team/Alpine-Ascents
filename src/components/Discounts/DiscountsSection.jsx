import React, { useState } from 'react';
import discountsData from '../../data/discounts.json';
import { Tag, Sparkles, Check, Copy, Gift, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import './DiscountsSection.css';

export default function DiscountsSection({ onOpenLuckyDraw, onSelectDiscount }) {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2500);
      });
    }
  };

  return (
    <section id="offers" className="section discounts-section" aria-label="Special Expedition Offers">
      <div className="site-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Tag size={14} />
            <span>SEASONAL INCENTIVES & EXPEDITION PRIVILEGES</span>
          </div>
          <h2 className="section-title">SPECIAL EXPEDITION OFFERS</h2>
          <p className="section-subtitle">
            Transparent group concessions and early planning privileges. Claim voucher codes directly into your expedition blueprint.
          </p>
        </div>

        {/* Interactive Lucky Draw Campaign Strip */}
        <div className="lucky-campaign-banner">
          <div className="lucky-banner-content">
            <div className="lucky-banner-badge">
              <Gift size={14} />
              <span>INTERACTIVE COMPASS REWARD</span>
            </div>
            <h3 className="lucky-banner-title">WIN YOUR NEXT MOUNTAIN PRIVILEGE</h3>
            <p className="lucky-banner-sub">
              Spin our interactive expedition compass simulator to reveal exclusive discount vouchers, complimentary equipment rental packs, or luxury palace upgrades.
            </p>
          </div>
          <button
            className="btn btn-primary btn-lg lucky-launch-btn"
            onClick={onOpenLuckyDraw}
          >
            <Sparkles size={18} />
            <span>SPIN EXPEDITION COMPASS</span>
          </button>
        </div>

        {/* Large Horizontal Offer Strips (No Repetitive Cards) */}
        <div className="horizontal-offers-stack">
          {discountsData.map((d) => (
            <div key={d.id} className="offer-horizontal-strip">
              <div className="strip-left-accent">
                <span className="strip-badge">{d.badge}</span>
                <span className="strip-discount-val">{d.discount}</span>
              </div>

              <div className="strip-main-info">
                <h3 className="strip-title">{d.title}</h3>
                <p className="strip-desc">{d.description}</p>
                <div className="strip-eligibility">
                  <Clock size={13} color="var(--accent)" />
                  <span>{d.eligibility}</span>
                </div>
              </div>

              <div className="strip-action-col">
                <div className="strip-code-badge">
                  <span>Code:</span>
                  <code>{d.code}</code>
                </div>

                <button
                  className="btn btn-outline btn-sm strip-claim-btn"
                  onClick={() => handleCopy(d.code)}
                >
                  {copiedCode === d.code ? (
                    <>
                      <Check size={14} color="#10b981" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>CLAIM VOUCHER</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
