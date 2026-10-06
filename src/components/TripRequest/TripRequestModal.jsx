import React, { useState, useEffect } from 'react';
import { useUserProfile } from '../../context/UserProfileContext';
import { X, Send, Compass, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function TripRequestModal({ initialTrip, isOpen, onClose }) {
  const { profile, saveTrip } = useUserProfile();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    destination: initialTrip?.destinationName || initialTrip?.destination || 'Hunza Valley & Passu',
    packageType: initialTrip?.type || initialTrip?.travelStyle || 'Explorer',
    travelDates: initialTrip?.departureDate || 'June 2027 Window',
    groupSize: initialTrip?.groupSize || '2-4 Climbers',
    notes: initialTrip?.specialNotes || 'Inquiring regarding high-altitude acclimatization schedule and gear rental availability.'
  });

  // Re-synchronize state whenever modal opens or initialTrip / profile changes
  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setFormData({
        name: profile?.name || '',
        email: profile?.email || '',
        destination: initialTrip?.destinationName || initialTrip?.destination || 'Hunza Valley & Passu',
        packageType: initialTrip?.type || initialTrip?.travelStyle || 'Explorer',
        travelDates: initialTrip?.departureDate || 'June 2027 Window',
        groupSize: initialTrip?.groupSize || '2-4 Climbers',
        notes: initialTrip?.specialNotes || 'Inquiring regarding high-altitude acclimatization schedule and gear rental availability.'
      });
    }
  }, [isOpen, initialTrip, profile]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalEstimatedTotal = initialTrip?.estimatedTotal ?? initialTrip?.price ?? 890;
    const finalPerPerson = initialTrip?.price ?? finalEstimatedTotal;
    const basePrice = initialTrip?.basePrice ?? initialTrip?.breakdown?.basePrice;
    const optionsPrice = initialTrip?.optionsPrice ?? initialTrip?.breakdown?.optionsPrice;
    const discount = initialTrip?.discount ?? initialTrip?.breakdown?.discount;

    // Save to user profile "My Trips"
    saveTrip({
      ...initialTrip,
      id: initialTrip?.id || `request-${Date.now()}`,
      name: initialTrip?.name || `Custom Expedition: ${formData.destination}`,
      destinationName: formData.destination,
      travelStyle: formData.packageType,
      groupSize: formData.groupSize,
      travelDates: formData.travelDates,
      requesterName: formData.name,
      requesterEmail: formData.email,
      specialNotes: formData.notes,
      basePrice,
      optionsPrice,
      discount,
      price: finalPerPerson,
      estimatedTotal: finalEstimatedTotal,
      breakdown: initialTrip?.breakdown ?? (basePrice !== undefined ? {
        basePrice,
        optionsPrice,
        discount,
        total: finalEstimatedTotal
      } : undefined),
      status: 'Request Manifest Prepared'
    });
    setSubmitted(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close form">
          <X size={18} />
        </button>

        <div style={{ padding: 'clamp(1.25rem, 4vw, 2rem) clamp(1rem, 4vw, 2.5rem)', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
          <span className="section-eyebrow" style={{ textAlign: 'left', marginBottom: '0.2rem' }}>
            OFFICIAL MANIFEST REQUEST
          </span>
          <h3 style={{ fontSize: 'clamp(1.25rem, 4.5vw, 1.6rem)' }}>REQUEST AN EXPEDITION DOSSIER</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Submit your parameters to receive an expedition itinerary, equipment guidelines, and guide roster.
          </p>
        </div>

        <div style={{ padding: 'clamp(1.25rem, 4vw, 2rem) clamp(1rem, 4vw, 2.5rem)' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <CheckCircle2 size={54} color="#10b981" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Your Expedition Request Has Been Prepared!</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: '1.6' }}>
                Your custom itinerary for <strong>{formData.destination}</strong> has been saved directly to your <strong>Profile Dashboard under "My Trips"</strong>.
              </p>
              <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                *Notice: As a frontend demonstration platform, no payment has been processed and no commercial transaction has occurred.
              </div>
              <button className="btn btn-primary" onClick={onClose}>
                Return to Exploration
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Manifest Summary Bar */}
              {initialTrip && (
                <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <span className="hud-tag" style={{ marginBottom: '0.2rem' }}>{initialTrip.type || initialTrip.travelStyle || 'Expedition'}</span>
                      <h5 style={{ fontSize: '1.05rem', margin: 0 }}>{initialTrip.name || initialTrip.destinationName}</h5>
                      {initialTrip.groupSize && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.25rem' }}>
                          Party: {initialTrip.groupSize}
                        </span>
                      )}
                    </div>
                    <div style={{ textAlign: 'right', minWidth: '130px' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent)', display: 'block' }}>
                        ${(initialTrip.estimatedTotal ?? initialTrip.price ?? 890).toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
                        {initialTrip.estimatedTotal !== undefined && initialTrip.price !== undefined && initialTrip.estimatedTotal !== initialTrip.price
                          ? 'Estimated Total Party'
                          : 'Estimated Demo Total'}
                      </span>
                      {initialTrip.estimatedTotal !== undefined && initialTrip.price !== undefined && initialTrip.estimatedTotal !== initialTrip.price && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.15rem' }}>
                          (${initialTrip.price.toLocaleString()} / person)
                        </span>
                      )}
                    </div>
                  </div>

                  {initialTrip.breakdown && (
                    <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed var(--border)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <span>Base: <strong>${initialTrip.breakdown.basePrice?.toLocaleString()}</strong></span>
                      <span>Options: <strong>${initialTrip.breakdown.optionsPrice?.toLocaleString()}</strong></span>
                      <span style={{ color: '#10b981' }}>Privilege Discount: <strong>-${initialTrip.breakdown.discount?.toLocaleString()}</strong></span>
                    </div>
                  )}
                </div>
              )}

              <div className="dashboard-grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Expedition Destination</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Anticipated Departure Window</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.travelDates}
                    onChange={(e) => setFormData({ ...formData, travelDates: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Special Inquiries or Medical Notes</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Zero spam · Saved to local browser storage
                </span>
                <button type="submit" className="btn btn-primary">
                  <Send size={16} />
                  <span>Prepare Expedition Request</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
