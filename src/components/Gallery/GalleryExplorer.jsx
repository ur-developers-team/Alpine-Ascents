import React, { useState } from 'react';
import galleryData from '../../data/gallery.json';
import { Camera, MapPin, Mountain, Maximize2 } from 'lucide-react';
import LightboxModal from './LightboxModal';
import './GalleryExplorer.css';

export default function GalleryExplorer() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);

  const categories = ['ALL', ...Array.from(new Set(galleryData.map(g => g.category).filter(Boolean)))];

  const filteredItems = selectedCategory === 'ALL'
    ? galleryData
    : galleryData.filter(g => g.category.toLowerCase() === selectedCategory.toLowerCase());

  const currentItem = activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  const handlePrev = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  const handleNext = () => {
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % filteredItems.length);
    }
  };

  return (
    <section id="gallery" className="section gallery-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Camera size={14} />
            <span>VISUAL CHRONICLES</span>
          </div>
          <h2 className="section-title">EXPEDITION GALLERY</h2>
          <p className="section-subtitle">
            Curated high-resolution photography showcasing the vertical relief, turquoise glacial lakes, and human resilience across the world's highest mountains.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="gallery-filter-pills" role="tablist">
          {categories.map(cat => (
            <button
              key={cat}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedCategory(cat)}
              role="tab"
              aria-selected={selectedCategory === cat}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Masonry Layout */}
        <div className="gallery-masonry">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              className="gallery-item-card"
              onClick={() => setActiveLightboxIndex(idx)}
            >
              <img src={item.image} alt={item.title} loading="lazy" />
              <div className="gallery-item-caption-bar">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span className="hud-tag">{item.category}</span>
                  <Maximize2 size={13} color="var(--text-muted)" />
                </div>
                <h4 style={{ fontSize: '1.05rem', margin: '0.2rem 0' }}>{item.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <MapPin size={12} color="var(--accent)" />
                  <span>{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <LightboxModal
          item={currentItem}
          isOpen={activeLightboxIndex !== null}
          onClose={() => setActiveLightboxIndex(null)}
          onPrev={handlePrev}
          onNext={handleNext}
          currentIndex={activeLightboxIndex !== null ? activeLightboxIndex : 0}
          totalCount={filteredItems.length}
        />
      </div>
    </section>
  );
}
