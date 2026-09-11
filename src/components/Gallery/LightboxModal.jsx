import React, { useEffect, useRef, useState } from 'react';
import { X, ArrowLeft, ChevronLeft, ChevronRight, MapPin, Mountain } from 'lucide-react';

export default function LightboxModal({
  item,
  isOpen,
  onClose,
  onPrev,
  onNext,
  currentIndex = 0,
  totalCount = 1
}) {
  const [isClosing, setIsClosing] = useState(false);
  const touchStartXRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowLeft') onPrev && onPrev();
      if (e.key === 'ArrowRight') onNext && onNext();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onPrev, onNext]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 280);
  };

  // Mobile Touch Swipe Handling
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartXRef.current;

    if (deltaX > 45 && onPrev) {
      onPrev();
    } else if (deltaX < -45 && onNext) {
      onNext();
    }
    touchStartXRef.current = null;
  };

  if (!isOpen || !item) return null;

  return (
    <div
      className={`gallery-lightbox-overlay ${isClosing ? 'closing' : 'opening'}`}
      onClick={handleClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} - Image ${currentIndex + 1} of ${totalCount}`}
    >
      {/* Top Controls Bar */}
      <div className="lightbox-top-bar" onClick={(e) => e.stopPropagation()}>
        {/* Prominent Back Button */}
        <button
          className="lightbox-back-btn"
          onClick={handleClose}
          aria-label="Back to Gallery"
        >
          <ArrowLeft size={18} />
          <span>← Back to Gallery</span>
        </button>

        {/* Image Counter (e.g. 1 / 18) */}
        <div className="lightbox-counter-pill">
          <span>{currentIndex + 1} / {totalCount}</span>
        </div>

        {/* Clear Close Button */}
        <button
          className="lightbox-close-btn"
          onClick={handleClose}
          aria-label="Close Lightbox"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation Arrows */}
      {onPrev && (
        <button
          className="lightbox-nav-arrow prev"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          aria-label="Previous photograph"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {onNext && (
        <button
          className="lightbox-nav-arrow next"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          aria-label="Next photograph"
        >
          <ChevronRight size={28} />
        </button>
      )}

      {/* Main Image Viewport & Metadata */}
      <div className="gallery-lightbox-content" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox-img-wrapper">
          <img
            src={item.image}
            alt={item.title}
            className="gallery-lightbox-img"
          />
        </div>

        <div className="gallery-lightbox-caption">
          <div className="lightbox-tags-row">
            <span className="hud-tag">{item.category}</span>
            <span className="hud-tag">
              <MapPin size={11} />
              <span>{item.location}</span>
            </span>
            {item.altitude && (
              <span className="hud-tag">
                <Mountain size={11} />
                <span>{item.altitude}</span>
              </span>
            )}
          </div>

          <h3 className="lightbox-item-title">{item.title}</h3>
          <p className="lightbox-item-caption">{item.caption}</p>
        </div>
      </div>
    </div>
  );
}
