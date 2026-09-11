import React, { useState } from 'react';
import videosData from '../../data/videos.json';
import VideoDetailModal from './VideoDetailModal';
import { Film, Play, MapPin, Clock, Compass, Filter } from 'lucide-react';
import './DestinationVideo.css';

export default function DestinationVideo() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeModalVideo, setActiveModalVideo] = useState(null);

  const categories = [
    'ALL',
    'Expedition Films',
    'Destination Guides',
    'Travel Guides',
    'Mountain Stories',
    'Climbing Techniques',
    'Safety & Hazards',
    'Gilgit-Baltistan',
    'Base Camp Experiences'
  ];

  const filteredVideos = selectedCategory === 'ALL'
    ? videosData
    : videosData.filter(v => v.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="videos" className="section video-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Film size={14} />
            <span>EXPEDITION CINEMA & ARCHIVES</span>
          </div>
          <h2 className="section-title">HIGH-ALTITUDE DOCUMENTARY CINEMA</h2>
          <p className="section-subtitle">
            Experience 4K aerial traverses, Technical ice climbing masterclasses, and Himalayan mountaineering stories captured across the Karakoram, Western Himalaya, and European Alps.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="video-categories-row" role="tablist">
          {categories.map(cat => (
            <button
              key={cat}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedCategory(cat)}
              role="tab"
              aria-selected={selectedCategory === cat}
            >
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Video Cards Grid */}
        <div className="video-library-grid">
          {filteredVideos.map(vid => (
            <div
              key={vid.id}
              className="video-archive-card"
              onClick={() => setActiveModalVideo(vid)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setActiveModalVideo(vid);
              }}
              aria-label={`Watch ${vid.title}`}
            >
              <div className="video-thumbnail-wrap">
                <img src={vid.poster} alt={vid.title} className="video-poster-img" />
                <div className="video-play-hover-overlay">
                  <div className="play-button-icon">
                    <Play size={22} fill="#0b111e" color="#0b111e" />
                  </div>
                </div>
                <div className="video-badge-duration">
                  <Clock size={12} />
                  <span>{vid.duration}</span>
                </div>
                <span className="video-badge-category">{vid.category}</span>
              </div>

              <div className="video-card-meta">
                <div className="video-card-location">
                  <MapPin size={13} color="var(--accent, #d4af37)" />
                  <span>{vid.location}</span>
                </div>
                <h3 className="video-card-title">{vid.title}</h3>
                <p className="video-card-desc">{vid.description}</p>
                <div className="video-card-footer">
                  <span className="watch-now-label">Watch Film →</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Cinema Modal */}
        <VideoDetailModal
          video={activeModalVideo}
          isOpen={!!activeModalVideo}
          onClose={() => setActiveModalVideo(null)}
          onSelectVideo={setActiveModalVideo}
        />
      </div>
    </section>
  );
}
