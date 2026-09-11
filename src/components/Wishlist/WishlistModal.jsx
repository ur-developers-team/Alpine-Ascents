import React, { useState } from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { Heart, X, Trash2, Mountain, MapPin, Compass, BookOpen, Users, ExternalLink, Share2, Copy, Check } from 'lucide-react';

export default function WishlistModal({ isOpen, onClose, onSelectItem }) {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const [filterType, setFilterType] = useState('ALL');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const filteredItems = filterType === 'ALL'
    ? wishlist
    : wishlist.filter(item => (item.itemType || '').toUpperCase() === filterType);

  const getIconForType = (type) => {
    switch ((type || '').toLowerCase()) {
      case 'mountain': return <Mountain size={18} color="var(--accent)" />;
      case 'destination': return <MapPin size={18} color="var(--accent)" />;
      case 'package': return <Compass size={18} color="var(--accent)" />;
      case 'guide': return <Users size={18} color="var(--accent)" />;
      case 'article': return <BookOpen size={18} color="var(--accent)" />;
      default: return <Mountain size={18} color="var(--accent)" />;
    }
  };

  const handleShareWishlist = () => {
    if (wishlist.length === 0) return;
    const ids = wishlist.map(item => `${item.id}:${item.itemType || 'item'}`).join(',');
    const shareUrl = `${window.location.origin}${window.location.pathname}#wishlist=${encodeURIComponent(ids)}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
        window.dispatchEvent(new CustomEvent('alpine-toast', {
          detail: {
            message: '🔗 Shareable Wishlist URL copied to clipboard!',
            type: 'trip'
          }
        }));
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px' }}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close wishlist">
          <X size={18} />
        </button>

        <div style={{ padding: '1.75rem 2rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <Heart size={22} color="#f43f5e" fill="#f43f5e" />
            <h3 style={{ fontSize: '1.4rem' }}>My Expedition Wishlist</h3>
            <span className="hud-tag" style={{ marginLeft: 'auto' }}>{wishlist.length} Saved Items</span>
            {wishlist.length > 0 && (
              <button
                className="btn btn-sm btn-outline"
                onClick={handleShareWishlist}
                title="Generate shareable wishlist link"
              >
                {copied ? <Check size={14} color="#10b981" /> : <Share2 size={14} />}
                <span>{copied ? 'Link Copied!' : 'Share Wishlist'}</span>
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1.25rem', overflowX: 'auto' }}>
            {['ALL', 'DESTINATION', 'MOUNTAIN', 'PACKAGE', 'GUIDE', 'ARTICLE'].map(cat => (
              <button
                key={cat}
                className={`btn btn-sm ${filterType === cat ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilterType(cat)}
                style={{ fontSize: '0.78rem', padding: '0.35rem 0.8rem' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '1.5rem 2rem', maxHeight: '60vh', overflowY: 'auto' }}>
          {wishlist.length === 0 ? (
            <div className="search-empty-state">
              <Heart size={44} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
              <h4>Your Wishlist is Empty</h4>
              <p>Explore mountains, destinations, and packages and click the ♡ button to save them here for later reference.</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="search-empty-state">
              <h4>No items in "{filterType}" category</h4>
              <p>Switch back to "ALL" to view all your saved items.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.25rem',
                    borderRadius: '8px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    <div style={{ padding: '0.6rem', borderRadius: '6px', background: 'var(--bg-card)' }}>
                      {getIconForType(item.itemType)}
                    </div>
                    <div>
                      <span className="hud-tag" style={{ textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                        {item.itemType || 'Saved'}
                      </span>
                      <h5 style={{ fontSize: '1rem', margin: '0.1rem 0' }}>{item.name || item.title}</h5>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {item.region || item.country || item.range || item.category || ''}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        onClose();
                        onSelectItem && onSelectItem(item.itemType || 'item', item);
                      }}
                      title="View Details"
                    >
                      <ExternalLink size={14} />
                      <span className="hide-mobile">Explore</span>
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="btn-save active"
                      title="Remove from wishlist"
                      aria-label="Remove"
                    >
                      <Trash2 size={15} color="#f43f5e" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {wishlist.length > 0 && (
          <div style={{ padding: '1rem 2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Tip: Shared URLs encode your selection into a portable state link.
            </span>
            <button
              className="btn btn-outline btn-sm"
              onClick={clearWishlist}
              style={{ color: '#f43f5e', borderColor: 'rgba(244, 63, 94, 0.3)' }}
            >
              Clear Entire Wishlist
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
