import React, { useState, useRef, useEffect } from 'react';
import {
  X, Play, Pause, Maximize, Heart, Share2, MapPin, Compass,
  Mountain, Check, AlertCircle, ArrowLeft, ArrowRight, Volume2,
  VolumeX, Gauge, CheckCircle2, RotateCcw
} from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import videosData from '../../data/videos.json';
import './VideoDetailModal.css';

export default function VideoDetailModal({ video, isOpen, onClose, onSelectVideo }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [copied, setCopied] = useState(false);
  const [hasError, setHasError] = useState(false);

  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const videoSourceUrl = video?.video || (video?.id ? `/videos/${video.id}.mp4` : '/videos/hunza.mp4');

  // Find index for Previous / Next controls
  const currentIndex = videosData.findIndex(v => v.id === video?.id);
  const prevVideo = currentIndex > 0 ? videosData[currentIndex - 1] : videosData[videosData.length - 1];
  const nextVideo = currentIndex < videosData.length - 1 ? videosData[currentIndex + 1] : videosData[0];

  useEffect(() => {
    if (isOpen && video) {
      document.body.style.overflow = 'hidden';
      setHasError(false);
      setIsPlaying(true);
      setCurrentTime(0);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.playbackRate = playbackSpeed;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => setIsPlaying(false));
        }
      }
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
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onSelectVideo) onSelectVideo(nextVideo);
      if (e.key === 'ArrowLeft' && onSelectVideo) onSelectVideo(prevVideo);
      if (e.key === ' ' && videoRef.current) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, nextVideo, prevVideo]);

  if (!isOpen || !video) return null;

  const isSaved = isWishlisted(video.id);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(err => console.warn(err));
    } else {
      document.exitFullscreen().catch(err => console.warn(err));
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatSeconds = (sec) => {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const videoSourceUrl = video.source || video.videoUrl;

  return (
    <div className="video-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={video.title}>
      <div className="video-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Top Header Navigation Bar */}
        <div className="video-modal-top-bar">
          <div className="top-bar-left">
            <button className="btn btn-sm btn-outline" onClick={onClose}>
              <ArrowLeft size={14} />
              <span>Back to Archives</span>
            </button>

            {/* PREVIOUS / NEXT NAVIGATION BUTTONS */}
            <div className="video-nav-arrows">
              <button
                className="btn btn-sm btn-outline"
                onClick={() => onSelectVideo && onSelectVideo(prevVideo)}
                title={`Previous: ${prevVideo.title}`}
              >
                <ArrowLeft size={13} />
                <span className="hide-mobile">Previous</span>
              </button>
              <button
                className="btn btn-sm btn-outline"
                onClick={() => onSelectVideo && onSelectVideo(nextVideo)}
                title={`Next: ${nextVideo.title}`}
              >
                <span className="hide-mobile">Next</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          <div className="top-bar-right">
            <button
              className={`btn btn-sm ${isSaved ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => toggleWishlist({ ...video, name: video.title }, 'video')}
              title="Save to Wishlist"
            >
              <Heart size={14} fill={isSaved ? '#fff' : 'none'} />
              <span className="hide-mobile">{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button className="btn btn-sm btn-outline" onClick={handleShare} title="Share link">
              {copied ? <Check size={14} color="#10b981" /> : <Share2 size={14} />}
              <span className="hide-mobile">{copied ? 'Copied' : 'Share'}</span>
            </button>

            <button className="modal-close-round" onClick={onClose} aria-label="Close video player">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Video Player Container */}
        <div className="video-screen-viewport" ref={playerContainerRef}>
          {hasError ? (
            <div className="video-fallback-screen">
              <img src={video.poster} alt={video.title} className="video-fallback-img" />
              <div className="video-fallback-overlay">
                <AlertCircle size={36} color="#f59e0b" />
                <h4>Video Stream Initializing</h4>
                <p>Retrying connection with our high-altitude media content delivery network...</p>
                <button className="btn btn-primary btn-sm" onClick={() => setHasError(false)}>
                  <RotateCcw size={14} />
                  <span>Reload Player</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="video-native-wrap">
              <video
                ref={videoRef}
                src={videoSourceUrl}
                poster={video.poster}
                playsInline
                autoPlay
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={() => setHasError(true)}
                className="video-native-element"
                onClick={togglePlay}
              />

              {/* Custom Overlay Controls HUD */}
              <div className="custom-player-hud">
                {/* Seek Scrubber Bar */}
                <div className="hud-seek-row">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    className="hud-seek-slider"
                    aria-label="Seek video"
                  />
                </div>

                <div className="hud-bottom-controls">
                  <div className="hud-left-controls">
                    {/* Play/Pause */}
                    <button className="hud-ctrl-btn" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
                      {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </button>

                    {/* Volume & Mute */}
                    <button className="hud-ctrl-btn" onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'}>
                      {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="hud-volume-slider"
                      aria-label="Volume"
                    />

                    {/* Timestamp */}
                    <span className="hud-time-display">
                      {formatSeconds(currentTime)} / {formatSeconds(duration || 120)}
                    </span>
                  </div>

                  <div className="hud-right-controls">
                    {/* Playback Speed Selector */}
                    <div className="speed-selector-group">
                      {[0.75, 1, 1.25, 1.5].map(s => (
                        <button
                          key={s}
                          className={`speed-pill ${playbackSpeed === s ? 'active' : ''}`}
                          onClick={() => handleSpeedChange(s)}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>

                    {/* Fullscreen */}
                    <button className="hud-ctrl-btn" onClick={toggleFullscreen} aria-label="Toggle Fullscreen">
                      <Maximize size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Metadata & Linked Relationships */}
        <div className="video-modal-metadata-strip">
          <div className="video-info-main">
            <div className="video-tags-row">
              <span className="hud-tag">{video.category}</span>
              {video.difficulty && (
                <span className="hud-tag diff-tag">
                  {video.difficulty}
                </span>
              )}
              <div className="video-loc-tag">
                <MapPin size={13} color="var(--accent)" />
                <span>{video.location}</span>
              </div>
              <span className="video-dur-text">Duration: {video.duration}</span>
            </div>

            <h2 className="video-main-title">{video.title}</h2>
            <p className="video-long-desc">{video.description}</p>

            {/* What You Will Learn */}
            {video.whatYouWillLearn && video.whatYouWillLearn.length > 0 && (
              <div className="video-learning-block">
                <h4 className="video-learning-title">
                  <CheckCircle2 size={16} color="var(--accent)" />
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

          {/* Sidebar with Next Up & Relationships */}
          <div className="video-related-sidebar">
            <div className="video-sidebar-card">
              <span className="sidebar-section-title">NEXT UP IN ARCHIVES</span>
              <div
                className="related-video-mini-card"
                onClick={() => onSelectVideo && onSelectVideo(nextVideo)}
                role="button"
                tabIndex={0}
              >
                <img src={nextVideo.thumbnail} alt={nextVideo.title} className="related-mini-poster" />
                <div className="related-mini-content">
                  <div className="related-mini-title">{nextVideo.title}</div>
                  <div className="related-mini-meta">{nextVideo.duration} • {nextVideo.category}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
