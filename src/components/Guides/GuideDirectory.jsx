import React, { useState } from 'react';
import guidesData from '../../data/guides.json';
import { useWishlist } from '../../context/WishlistContext';
import { useUserProfile } from '../../context/UserProfileContext';
import { Users, Heart, ArrowRight, Shield } from 'lucide-react';
import GuideDetailModal from './GuideDetailModal';
import './GuideDirectory.css';

export default function GuideDirectory({ onRequestGuide }) {
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addRecentlyViewed } = useUserProfile();

  const handleCardClick = (guide) => {
    addRecentlyViewed(guide, 'guide');
    setSelectedGuide(guide);
    setDetailModalOpen(true);
  };

  return (
    <section id="guides" className="section guide-directory-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Users size={14} />
            <span>EXPEDITION MASTERS</span>
          </div>
          <h2 className="section-title">GUIDES & MOUNTAIN EXPERTS</h2>
          <p className="section-subtitle">
            Safety in the Death Zone rests upon seasoned mentorship. Meet our certified UIAGM and veteran Karakoram high-altitude expedition leaders.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="guide-grid">
          {guidesData.map(guide => (
            <div key={guide.id} className="guide-card">
              <div className="guide-card-photo-box" onClick={() => handleCardClick(guide)} style={{ cursor: 'pointer' }}>
                <img
                  src={guide.image}
                  alt={guide.name}
                  className="guide-card-photo"
                  loading="lazy"
                />
                <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 2 }}>
                  <span className="hud-tag">{guide.status}</span>
                </div>

                <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 2 }} onClick={(e) => e.stopPropagation()}>
                  <button
                    className={`btn-save ${isWishlisted(guide.id) ? 'active' : ''}`}
                    onClick={() => toggleWishlist(guide, 'guide')}
                    title="Save Guide"
                    aria-label="Save"
                  >
                    <Heart size={16} fill={isWishlisted(guide.id) ? '#f43f5e' : 'none'} />
                  </button>
                </div>
              </div>

              <div className="guide-card-body">
                <span className="section-eyebrow" style={{ fontSize: '0.68rem', textAlign: 'left', marginBottom: '0.15rem' }}>
                  {guide.region}
                </span>
                <h4 className="guide-card-name">{guide.name}</h4>
                <div className="guide-card-role">{guide.role}</div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
                  <div><strong>Summits:</strong> {guide.summits}</div>
                  <div><strong>Experience:</strong> {guide.experienceYears} Years</div>
                </div>

                {/* Specialties */}
                <div className="guide-skills-pills">
                  {guide.specialties.slice(0, 3).map((spec, i) => (
                    <span key={i} className="guide-skill-tag">{spec}</span>
                  ))}
                </div>

                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleCardClick(guide)}
                  style={{ marginTop: 'auto', width: '100%' }}
                >
                  <span>View Dossier</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          *Sample guide directory illustrating UIAGM credentials, localized high-altitude support roles, and verified expedition ratios.
        </div>

        {/* Modal */}
        <GuideDetailModal
          guide={selectedGuide}
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          onRequestGuide={onRequestGuide}
        />
      </div>
    </section>
  );
}
