import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, Maximize, Heart, Share2, MapPin, Compass, Mountain, Check, AlertCircle, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import videosData from '../../data/videos.json';
import './VideoDetailModal.css';

export default function VideoDetailModal({ video, isOpen, onClose, onSelectVideo }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [copied, setCopied] = useState(false);
  const videoRef = useRef(null);

  const isEmbed = video?.videoUrl?.includes('youtube') || video?.videoUrl?.includes('youtu.be') || video?.videoUrl?.includes('vimeo');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setHasError(false);
      setIsPlaying(false);
    } else {
      document.body.style.overflow = '';
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, video]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen || !video) return null;

  const isSaved = isWishlisted(video.id);

  const handleShare = () => {
    const url = video.externalUrl || `${window.location.origin}${window.location.pathname}#video=${video.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        window.dispatchEvent(new CustomEvent('alpine-toast', {
          detail: { message: '🔗 Video link copied to clipboard!', type: 'info' }
        }));
      });
    }
  };

  // Related videos recommendation logic
  const relatedVideos = (videosData || [])
    .filter(v => v.id !== video.id && (v.category === video.category || v.mountainId === video.mountainId || v.destinationId === video.destinationId))
    .slice(0, 3);

  return (
    <div className="video-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={video.title}>
      <div className="video-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Top Header Bar */}
        <div className="video-modal-top-bar">
          <button className="btn btn-sm btn-outline" onClick={onClose}>
            <span>← Back to Video Archives</span>
          </button>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {video.externalUrl && (
              <a
                href={video.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline"
                title="Watch on official source"
              >
                <ExternalLink size={14} />
                <span className="hide-mobile">Open Source</span>
              </a>
            )}

            <button
              className={`btn btn-sm ${isSaved ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => toggleWishlist({ ...video, name: video.title }, 'video')}
              title="Save to wishlist"
            >
              <Heart size={14} fill={isSaved ? '#fff' : 'none'} />
              <span className="hide-mobile">{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button className="btn btn-sm btn-outline" onClick={handleShare} title="Share video">
              {copied ? <Check size={14} color="#10b981" /> : <Share2 size={14} />}
              <span className="hide-mobile">{copied ? 'Copied' : 'Share'}</span>
            </button>

            <button className="modal-close-round" onClick={onClose} aria-label="Close video player">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Cinematic Screen Player */}
        <div className="video-screen-viewport">
          {hasError ? (
            <div className="video-fallback-screen">
              <img src={video.poster} alt={video.title} className="video-fallback-img" />
              <div className="video-fallback-overlay">
                <AlertCircle size={36} color="#f59e0b" />
                <h4>Embedded Playback Restricted</h4>
                <p>This mountain expedition documentary is available directly on its official media archive.</p>
                {video.externalUrl && (
                  <a
                    href={video.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: '0.75rem' }}
                  >
                    <ExternalLink size={14} />
                    <span>Watch on Official Source</span>
                  </a>
                )}
              </div>
            </div>
          ) : isEmbed ? (
            <iframe
              src={video.videoUrl}
              title={video.title}
              className="video-native-element"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ border: 'none', width: '100%', height: '100%' }}
              onError={() => setHasError(true)}
            />
          ) : (
            <video
              ref={videoRef}
              src={video.videoUrl}
              poster={video.poster}
              controls
              autoPlay
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={() => setHasError(true)}
              className="video-native-element"
            />
          )}
        </div>

        {/* Video Metadata & Linked Relationships */}
        <div className="video-modal-metadata-strip">
          <div className="video-info-main">
            <div className="video-tags-row">
              <span className="hud-tag">{video.category}</span>
              {video.difficulty && (
                <span className="hud-tag diff-tag" style={{ background: 'rgba(212, 175, 55, 0.15)', color: 'var(--accent-gold)' }}>
                  {video.difficulty}
                </span>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <MapPin size={13} color="var(--accent, #38bdf8)" />
                <span>{video.location}</span>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Duration: {video.duration}</span>
            </div>

            <h2 className="video-main-title">{video.title}</h2>
            <p className="video-long-desc">{video.description}</p>

            {/* What You Will Learn Storytelling Section */}
            {video.whatYouWillLearn && video.whatYouWillLearn.length > 0 && (
              <div className="video-learning-block">
                <h4 className="video-learning-title">
                  <CheckCircle2 size={16} color="var(--accent, #38bdf8)" />
                  <span>Key Expedition Learning Points</span>
                </h4>
                <ul className="video-learning-list">
                  {video.whatYouWillLearn.map((pt, idx) => (
                    <li key={idx} className="video-learning-item">
                      <span className="learning-bullet">✦</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Related Mountain / Package Connectors & Related Videos */}
          <div className="video-related-sidebar">
            <div className="video-sidebar-card">
              <span className="sidebar-section-title">EXPEDITION RELATIONSHIPS</span>

              {video.relatedMountainIds && video.relatedMountainIds.length > 0 && (
                <div className="related-item-row">
                  <Mountain size={16} color="var(--accent, #38bdf8)" />
                  <div>
                    <span className="related-caption">Linked Mountain</span>
                    <strong>{video.relatedMountainIds.join(', ').toUpperCase()}</strong>
                  </div>
                </div>
              )}

              {video.relatedPackageIds && video.relatedPackageIds.length > 0 && (
                <div className="related-item-row">
                  <Compass size={16} color="var(--accent, #38bdf8)" />
                  <div>
                    <span className="related-caption">Official Package</span>
                    <strong>{video.relatedPackageIds[0].replace(/-/g, ' ').toUpperCase()}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Related Video Cards */}
            {relatedVideos.length > 0 && (
              <div className="video-sidebar-card related-videos-block">
                <span className="sidebar-section-title">RELATED DOCUMENTARIES</span>
                <div className="related-videos-column">
                  {relatedVideos.map((rel) => (
                    <div
                      key={rel.id}
                      className="related-video-mini-card"
                      onClick={() => onSelectVideo && onSelectVideo(rel)}
                      role="button"
                      tabIndex={0}
                      title={`Watch ${rel.title}`}
                    >
                      <img
                        src={rel.thumbnail || rel.poster}
                        alt={rel.title}
                        className="related-mini-poster"
                      />
                      <div className="related-mini-content">
                        <div className="related-mini-title">{rel.title}</div>
                        <div className="related-mini-meta">{rel.duration} · {rel.category}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
