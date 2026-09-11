import React, { useState } from 'react';
import journalData from '../../data/journal.json';
import { useWishlist } from '../../context/WishlistContext';
import { useUserProfile } from '../../context/UserProfileContext';
import { BookOpen, Clock, Heart, ArrowRight } from 'lucide-react';
import JournalDetailModal from './JournalDetailModal';
import './JournalExplorer.css';

export default function JournalExplorer() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addRecentlyViewed } = useUserProfile();

  const handleCardClick = (art) => {
    addRecentlyViewed(art, 'article');
    setSelectedArticle(art);
    setDetailModalOpen(true);
  };

  return (
    <section id="journal" className="section journal-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <BookOpen size={14} />
            <span>ALPINE PERSPECTIVES</span>
          </div>
          <h2 className="section-title">THE ALPINE JOURNAL</h2>
          <p className="section-subtitle">
            Longform dispatches, physiological essays, gear philosophy, and reflections from the cutting edge of global mountaineering.
          </p>
        </div>

        <div className="journal-grid">
          {journalData.map(article => (
            <div
              key={article.id}
              className="journal-card"
              onClick={() => handleCardClick(article)}
            >
              <div className="journal-card-media">
                <img src={article.image} alt={article.title} className="journal-card-img" loading="lazy" />
                <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 2 }}>
                  <span className="hud-tag">{article.category}</span>
                </div>
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 2 }} onClick={(e) => e.stopPropagation()}>
                  <button
                    className={`btn-save ${isWishlisted(article.id) ? 'active' : ''}`}
                    onClick={() => toggleWishlist(article, 'article')}
                    title="Bookmark Article"
                    aria-label="Bookmark"
                  >
                    <Heart size={16} fill={isWishlisted(article.id) ? '#f43f5e' : 'none'} />
                  </button>
                </div>
              </div>

              <div className="journal-card-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  <Clock size={12} />
                  <span>{article.readTime} · {article.date}</span>
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', lineHeight: '1.4' }}>{article.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>{article.excerpt}</p>

                <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>By {article.author}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>
                    <span>Read Dispatch</span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        <JournalDetailModal
          article={selectedArticle}
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
        />
      </div>
    </section>
  );
}
