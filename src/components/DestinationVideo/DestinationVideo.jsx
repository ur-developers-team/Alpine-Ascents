import React, { useState } from 'react';
import videosData from '../../data/videos.json';
import {
  Play, Film, MapPin, Clock, Shield, Compass, Sparkles, ChevronRight
} from 'lucide-react';
import VideoPlayerModal from './VideoPlayerModal';
import './DestinationVideo.css';

export default function DestinationVideo() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [featuredVideoId, setFeaturedVideoId] = useState(videosData[0].id);

  // Modal Player State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVideoIndex, setModalVideoIndex] = useState(0);

  const categories = [
    'ALL',
    ...Array.from(new Set(videosData.map(v => v.category).filter(Boolean)))
  ];

  const filteredVideos = selectedCategory === 'ALL'
    ? videosData
    : videosData.filter(v => v.category.toLowerCase() === selectedCategory.toLowerCase());

  const featuredVideo = videosData.find(v => v.id === featuredVideoId) || filteredVideos[0] || videosData[0];

  const handleOpenVideo = (videoItem) => {
    const idx = videosData.findIndex(v => v.id === videoItem.id);
    setModalVideoIndex(idx !== -1 ? idx : 0);
    setFeaturedVideoId(videoItem.id);
    setIsModalOpen(true);
  };

  return (
    <section id="videos" className="section video-cinema-section" aria-label="The Mountains in Motion">
      <div className="site-container">
        {/* Editorial Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Film size={14} />
            <span>AUTHENTIC EXPEDITION CINEMATOGRAPHY</span>
          </div>
          <h2 className="section-title">THE MOUNTAINS IN MOTION</h2>
          <p className="section-subtitle">
            Authentic high-altitude visual expeditions across Pakistan's 8,000m peaks and hidden glacial valleys. Every film features real playable 4K footage and complete player telemetry.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="cinema-categories-row" role="tablist" aria-label="Video categories">
          {categories.map(cat => (
            <button
              key={cat}
              className={`cinema-filter-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
              role="tab"
              aria-selected={selectedCategory === cat}
            >
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* The Cinema Master Stage (Editorial Preview Showcase) */}
        <div className="cinema-master-stage">
          {/* Featured Video Preview Hero (Clicking Opens Real Video Player Modal) */}
          <div
            className="cinema-preview-container"
            onClick={() => handleOpenVideo(featuredVideo)}
            role="button"
            tabIndex={0}
            aria-label={`Play ${featuredVideo.title}`}
          >
            <img
              src={featuredVideo.poster}
              alt={featuredVideo.title}
              className="cinema-preview-poster-img"
              loading="lazy"
            />
            <div className="cinema-preview-gradient" />

            {/* Overlaid Play Interaction */}
            <div className="cinema-center-play-overlay">
              <div className="cinema-play-disc">
                <Play size={36} fill="#ffffff" color="#ffffff" style={{ marginLeft: '4px' }} />
              </div>
              <span className="cinema-play-prompt">▶ PLAY EXPEDITION FILM</span>
              <span className="cinema-play-subtext">{featuredVideo.duration}s 4K Visual Footage • Click to Launch Player</span>
            </div>

            {/* Top Corner Telemetry Badge */}
            <div className="cinema-preview-top-badge">
              <span className="badge-live-pulse" />
              <span>REAL EXPEDITION FOOTAGE</span>
            </div>

            {/* Bottom Corner Duration Pill */}
            <div className="cinema-preview-duration-badge">
              <Clock size={12} />
              <span>{featuredVideo.duration}s</span>
            </div>
          </div>

          {/* Active Video Intel Dossier Bar */}
          <div className="cinema-intel-bar">
            <div className="cinema-intel-text">
              <div className="cinema-meta-tag">
                <span className="meta-category">{featuredVideo.category} ARCHIVE</span>
                <span className="meta-sep">•</span>
                <MapPin size={13} color="var(--accent)" />
                <span className="meta-loc">{featuredVideo.location}</span>
                <span className="meta-sep">•</span>
                <Compass size={13} color="var(--accent)" />
                <span className="meta-mountain">{featuredVideo.mountain}</span>
                <span className="meta-sep">•</span>
                <Clock size={13} color="var(--accent)" />
                <span className="meta-duration">{featuredVideo.duration}s</span>
              </div>
              <h3 className="cinema-active-title">{featuredVideo.title}</h3>
              <p className="cinema-active-desc">{featuredVideo.description}</p>
            </div>

            <div className="cinema-intel-cta-wrap">
              <button
                className="btn btn-primary cinema-play-cta-btn"
                onClick={() => handleOpenVideo(featuredVideo)}
              >
                <Play size={16} fill="currentColor" />
                <span>PLAY VIDEO</span>
              </button>
            </div>
          </div>

          {/* Horizontal Cinematic Video Reel (10 Selectable Mountain Films) */}
          <div className="cinema-reel-wrapper">
            <div className="cinema-reel-header">
              <span className="reel-eyebrow">
                EXPEDITION CINEMA REEL ({filteredVideos.length} TITLES AVAILABLE) — CLICK TO PLAY:
              </span>
            </div>

            <div className="cinema-horizontal-reel">
              {filteredVideos.map(vid => {
                const isSelected = vid.id === featuredVideo.id;
                return (
                  <div
                    key={vid.id}
                    className={`cinema-reel-thumbnail ${isSelected ? 'active' : ''}`}
                    onClick={() => handleOpenVideo(vid)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Play ${vid.title}`}
                  >
                    <div className="reel-thumb-img-wrap">
                      <img
                        src={vid.poster}
                        alt={vid.title}
                        className="reel-thumb-img"
                        loading="lazy"
                      />
                      <div className="reel-thumb-overlay" />
                      <div className="reel-thumb-play-icon">
                        <Play size={16} fill="#ffffff" color="#ffffff" style={{ marginLeft: '2px' }} />
                      </div>
                      <span className="reel-thumb-duration">{vid.duration}s</span>
                    </div>

                    <div className="reel-thumb-info">
                      <span className="reel-thumb-cat">{vid.category}</span>
                      <h4 className="reel-thumb-title">{vid.title}</h4>
                      <span className="reel-thumb-loc">{vid.location}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dedicated Fullscreen / Modal Real Video Viewer */}
        <VideoPlayerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          activeVideoIndex={modalVideoIndex}
          videos={videosData}
          onChangeVideo={(idx) => {
            setModalVideoIndex(idx);
            setFeaturedVideoId(videosData[idx].id);
          }}
        />
      </div>
    </section>
  );
}
