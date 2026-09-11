import React, { useState, useRef } from 'react';
import { useGamification } from '../../context/GamificationContext';
import { Award, Printer, Download, X, CheckCircle2, ShieldCheck, Mountain } from 'lucide-react';
import './SummitCertificateModal.css';

export default function SummitCertificateModal() {
  const { showCertificate, setShowCertificate, state, setClimberName } = useGamification();
  const [name, setName] = useState(state.climberName || 'Alex Mercer');
  const certificateRef = useRef(null);

  if (!showCertificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const credentialId = `AA-${Math.abs(name.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString(16).toUpperCase().padStart(8, '0')}`;

  return (
    <div className="certificate-modal-backdrop" onClick={() => setShowCertificate(false)}>
      <div className="certificate-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="certificate-modal-header">
          <div>
            <h3>Official Expedition Credential</h3>
            <p>Customize your name to generate and export your verified completion award.</p>
          </div>
          <button
            className="certificate-modal-close"
            onClick={() => setShowCertificate(false)}
            aria-label="Close certificate modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Name Customization Input */}
        <div className="certificate-input-strip">
          <label htmlFor="climber-cert-name">Enter Recipient Name:</label>
          <div className="certificate-input-group">
            <input
              id="climber-cert-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setClimberName(e.target.value);
              }}
              placeholder="Your Full Name"
              maxLength={40}
            />
            <button className="btn btn-primary btn-sm" onClick={handlePrint}>
              <Printer size={15} />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Certificate Rendering Box (Printable) */}
        <div ref={certificateRef} className="certificate-frame-container printable-certificate">
          <div className="certificate-inner-border">
            {/* Watermark Logo */}
            <div className="certificate-watermark">
              <Mountain size={180} />
            </div>

            <div className="certificate-top-bar">
              <span className="cert-foundation-tag">ALPINE ASCENTS EXPEDITION FOUNDATION</span>
              <span className="cert-serial">CREDENTIAL ID: {credentialId}</span>
            </div>

            <h1 className="cert-main-title">Certificate of Achievement</h1>
            <p className="cert-proclamation">This virtual qualification is honorably presented to</p>

            <div className="cert-recipient-name">
              {name.trim() || 'Distinguished Alpinist'}
            </div>

            <p className="cert-body-text">
              For successfully conquering the high-altitude terrain of the <strong>Alpine Ascents Platform</strong>, mastering glacier ropecraft, demonstrating physiological judgment in the Death Zone, and completing the virtual ascent of <strong>K2 (8,611m) & Karakoram Expeditions</strong>.
            </p>

            <div className="cert-seal-row">
              <div className="cert-signature-block">
                <div className="cert-signature-line">Lead Sirdar & IFMGA Guide</div>
                <span>Expedition Directorate</span>
              </div>

              <div className="cert-gold-seal">
                <Award size={36} color="#0b111e" />
                <span>SUMMIT EXPLORER</span>
              </div>

              <div className="cert-signature-block">
                <div className="cert-signature-line">{currentDate}</div>
                <span>Date of Completion</span>
              </div>
            </div>

            <div className="cert-disclaimer">
              ★ Virtual Educational Credential · Demonstrates mastery of interactive alpine theory, preparation, and safety knowledge. Not a substitute for certified in-person IFMGA mountaineering field licensing.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
