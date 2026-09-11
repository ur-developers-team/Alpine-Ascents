import React, { useState } from 'react';
import { X, Clock, Calendar, User, Heart, Bookmark, Share2 } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

export default function JournalDetailModal({ article, isOpen, onClose }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [scrollProgress, setScrollProgress] = useState(0);

  if (!isOpen || !article) return null;

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(progress);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '850px' }}>
        {/* Reading Progress Bar */}
        <div className="reading-progress-bar">
          <div className="reading-progress-fill" style={{ width: `${scrollProgress}%` }} />
        </div>

        <button className="modal-close-btn" onClick={onClose} aria-label="Close article">
          <X size={18} />
        </button>

        <div style={{ height: '320px', position: 'relative', overflow: 'hidden' }}>
          <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(7,12,18,0.2) 0%, rgba(7,12,18,0.85) 100%)' }} />

          <div style={{ position: 'absolute', bottom: '1.5rem', left: '2rem', right: '2rem' }}>
            <span className="hud-tag" style={{ marginBottom: '0.4rem' }}>{article.category}</span>
            <h2 style={{ fontSize: '2rem', color: '#ffffff', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
              {article.title}
            </h2>
          </div>
        </div>

        <div style={{ padding: '2rem 2.5rem', maxHeight: '55vh', overflowY: 'auto' }} onScroll={handleScroll}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                <User size={18} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem' }}>{article.author}</strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{article.authorRole} · {article.date}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="hud-tag">
                <Clock size={12} />
                <span>{article.readTime}</span>
              </span>
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

          <div style={{ fontSize: '1.05rem', lineHeight: '1.85', color: 'var(--text-secondary)' }}>
            {article.content.split('\n\n').map((para, i) => (
              <p key={i} style={{ marginBottom: '1.25rem' }}>
                {para}
              </p>
            ))}
          </div>

          <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {article.tags.map(t => (
              <span key={t} className="gb-landmark-tag">#{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
