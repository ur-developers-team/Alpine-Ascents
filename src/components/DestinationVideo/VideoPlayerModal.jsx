import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, RotateCcw,
  X, ChevronLeft, ChevronRight, AlertCircle, Loader2, FastForward, Rewind,
  MapPin, Clock, Shield, Sparkles, Compass
} from 'lucide-react';
import './VideoPlayerModal.css';

export default function VideoPlayerModal({
  isOpen,
  onClose,
  activeVideoIndex,
  videos,
  onChangeVideo
}) {
  const video = videos[activeVideoIndex] || videos[0];

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(video?.duration || 10);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  const videoRef = useRef(null);
  const playerStageRef = useRef(null);
  const hideControlsTimerRef = useRef(null);

  // Format time MM:SS
  const formatTime = (secs) => {
    if (!secs || isNaN(secs) || secs < 0) return '00:00';
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  // Reset state when video changes
  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);
    setHasError(false);
    setHasEnded(false);
    setCurrentTime(0);
    setIsPlaying(false);

    if (videoRef.current) {
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch(() => {
            // Autoplay with sound might be blocked; try muted or fall back to ready state
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play()
                .then(() => {
                  setIsPlaying(true);
                  setIsLoading(false);
                })
                .catch(() => {
                  setIsPlaying(false);
                  setIsLoading(false);
                });
            } else {
              setIsPlaying(false);
              setIsLoading(false);
            }
          });
      }
    }
  }, [activeVideoIndex, isOpen]);

  // Keyboard navigation & controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipTime(-5);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipTime(5);
          break;
        case 'ArrowUp':
          e.preventDefault();
          adjustVolume(0.1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          adjustVolume(-0.1);
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPlaying, volume, isMuted, isFullscreen, duration]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Controls auto-hide on inactivity
  const showControlsTemporarily = () => {
    setControlsVisible(true);
    clearTimeout(hideControlsTimerRef.current);
    hideControlsTimerRef.current = setTimeout(() => {
      if (isPlaying) {
        setControlsVisible(false);
      }
    }, 3200);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (hasEnded) {
      handleReplay();
      return;
    }
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleReplay = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    setCurrentTime(0);
    setHasEnded(false);
    videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const skipTime = (delta) => {
    if (!videoRef.current) return;
    const newTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + delta));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const adjustVolume = (delta) => {
    if (!videoRef.current) return;
    const newVol = Math.max(0, Math.min(1, volume + delta));
    setVolume(newVol);
    videoRef.current.volume = newVol;
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
      videoRef.current.muted = false;
    }
  };

  // Draggable Seek handlers
  const handleSeekChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleSeekMouseDown = () => {
    setIsSeeking(true);
  };

  const handleSeekMouseUp = () => {
    setIsSeeking(false);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && volume === 0) {
      setVolume(0.5);
      videoRef.current.volume = 0.5;
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleFullscreen = () => {
    if (!playerStageRef.current) return;
    if (!document.fullscreenElement) {
      if (playerStageRef.current.requestFullscreen) {
        playerStageRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handlePrev = () => {
    const prevIdx = (activeVideoIndex - 1 + videos.length) % videos.length;
    onChangeVideo(prevIdx);
  };

  const handleNext = () => {
    const nextIdx = (activeVideoIndex + 1) % videos.length;
    onChangeVideo(nextIdx);
  };

  if (!isOpen || !video) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="video-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="video-modal-container"
        onClick={(e) => e.stopPropagation()}
        onMouseMove={showControlsTemporarily}
      >
        {/* Top Header Bar: Back / Close & Telemetry */}
        <div className="video-modal-header">
          <button
            className="video-back-btn"
            onClick={onClose}
            aria-label="Back to Expedition Cinema"
          >
            <ChevronLeft size={18} />
            <span>BACK / CLOSE CINEMA</span>
          </button>

          <div className="video-modal-counter">
            <span>EXPEDITION FILM {String(activeVideoIndex + 1).padStart(2, '0')} / {String(videos.length).padStart(2, '0')}</span>
          </div>

          <button
            className="video-close-icon-btn"
            onClick={onClose}
            aria-label="Close video player"
          >
            <X size={20} />
          </button>
        </div>

        {/* Real Video Player Stage */}
        <div
          className={`video-player-stage ${isFullscreen ? 'is-fullscreen' : ''}`}
          ref={playerStageRef}
          onClick={togglePlay}
        >
          {/* Native HTML5 Video Element */}
          <video
            ref={videoRef}
            key={video.id}
            className="native-modal-video"
            src={video.video}
            poster={video.poster}
            preload="auto"
            playsInline
            muted={isMuted}
            onLoadedMetadata={(e) => {
              setDuration(e.target.duration || 10);
              setCurrentTime(e.target.currentTime);
              setIsLoading(false);
              setHasError(false);
            }}
            onLoadedData={() => {
              setIsLoading(false);
            }}
            onCanPlay={() => {
              setIsLoading(false);
            }}
            onPlay={() => {
              setIsPlaying(true);
              setIsLoading(false);
              setHasEnded(false);
            }}
            onPlaying={() => {
              setIsLoading(false);
              setIsPlaying(true);
            }}
            onTimeUpdate={(e) => {
              if (isLoading) {
                setIsLoading(false);
              }
              if (!isSeeking) {
                setCurrentTime(e.target.currentTime);
                if (!duration && e.target.duration) {
                  setDuration(e.target.duration);
                }
              }
            }}
            onPause={() => {
              setIsPlaying(false);
            }}
            onWaiting={() => {
              // Only trigger spinner if we are at the very beginning and not yet ready
              if (videoRef.current && videoRef.current.readyState < 3 && currentTime === 0) {
                setIsLoading(true);
              }
            }}
            onEnded={() => {
              setIsPlaying(false);
              setIsLoading(false);
              setHasEnded(true);
            }}
            onError={(e) => {
              console.error('HTML5 video error event:', e);
              setIsLoading(false);
              setHasError(true);
            }}
          />

          {/* Loading Spinner Overlay */}
          {isLoading && !hasError && (
            <div className="video-stage-overlay loading-overlay">
              <Loader2 size={44} className="video-spin-loader" />
              <span>STREAMING HIGH-ALTITUDE ARCHIVE...</span>
            </div>
          )}

          {/* Error State Overlay */}
          {hasError && (
            <div className="video-stage-overlay error-overlay" onClick={(e) => e.stopPropagation()}>
              <AlertCircle size={48} color="#ef4444" />
              <h3>Video Footage Unavailable</h3>
              <p>The high-altitude media stream could not be loaded at this time.</p>
              <div className="error-actions-row">
                <button className="btn btn-primary btn-sm" onClick={handleNext}>
                  Try Another Video
                </button>
                <button className="btn btn-outline btn-sm" onClick={onClose}>
                  Return to Archive
                </button>
              </div>
            </div>
          )}

          {/* Video Ended State Overlay */}
          {hasEnded && !hasError && (
            <div className="video-stage-overlay ended-overlay" onClick={(e) => e.stopPropagation()}>
              <h3 className="ended-title">EXPEDITION FILM COMPLETED</h3>
              <div className="ended-actions-row">
                <button className="btn btn-primary ended-btn" onClick={handleReplay}>
                  <RotateCcw size={16} />
                  <span>Replay Video</span>
                </button>
                <button className="btn btn-secondary ended-btn" onClick={handleNext}>
                  <span>Next Video</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Center Play Disc when paused (and not loading/ended/error) */}
          {!isPlaying && !isLoading && !hasEnded && !hasError && (
            <div className="video-center-disc" onClick={(e) => { e.stopPropagation(); togglePlay(); }}>
              <Play size={36} fill="#ffffff" color="#ffffff" style={{ marginLeft: '4px' }} />
            </div>
          )}

          {/* Custom In-Player Control Bar */}
          <div
            className={`video-custom-controls-bar ${controlsVisible || !isPlaying ? 'is-visible' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Draggable Progress / Timeline Bar */}
            <div className="video-timeline-wrapper">
              <div className="timeline-track-bg">
                <div
                  className="timeline-track-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max={duration || 10}
                step="0.05"
                value={currentTime}
                onChange={handleSeekChange}
                onMouseDown={handleSeekMouseDown}
                onMouseUp={handleSeekMouseUp}
                onTouchStart={handleSeekMouseDown}
                onTouchEnd={handleSeekMouseUp}
                className="video-timeline-slider"
                aria-label="Drag video progress timeline"
              />
            </div>

            {/* Bottom Controls Row: Play, Rewind, Volume, Time, Speed, Fullscreen */}
            <div className="video-controls-row">
              <div className="controls-left-group">
                {/* Play / Pause */}
                <button
                  className="ctrl-btn main-play-btn"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

                {/* Quick Skip -5s */}
                <button
                  className="ctrl-btn skip-btn"
                  onClick={() => skipTime(-5)}
                  aria-label="Rewind 5 seconds"
                  title="Rewind 5s (Left Arrow)"
                >
                  <Rewind size={16} />
                  <span>5s</span>
                </button>

                {/* Quick Skip +5s */}
                <button
                  className="ctrl-btn skip-btn"
                  onClick={() => skipTime(5)}
                  aria-label="Fast forward 5 seconds"
                  title="Forward 5s (Right Arrow)"
                >
                  <FastForward size={16} />
                  <span>5s</span>
                </button>

                {/* Volume & Mute */}
                <div className="volume-control-wrap">
                  <button
                    className="ctrl-btn volume-btn"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                    title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                  >
                    {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                    aria-label="Volume slider"
                  />
                </div>

                {/* Real Time Counter (currentTime / duration) */}
                <div className="time-display-badge">
                  <span className="current-time">{formatTime(currentTime)}</span>
                  <span className="time-divider">/</span>
                  <span className="total-duration">{formatTime(duration)}</span>
                </div>
              </div>

              <div className="controls-right-group">
                {/* Playback Speed Pills */}
                <div className="speed-pills-row">
                  {[0.75, 1, 1.25, 1.5].map((s) => (
                    <button
                      key={s}
                      className={`speed-pill-btn ${playbackSpeed === s ? 'active' : ''}`}
                      onClick={() => handleSpeedChange(s)}
                    >
                      {s}x
                    </button>
                  ))}
                </div>

                {/* Fullscreen Toggle */}
                <button
                  className="ctrl-btn fullscreen-btn"
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                  title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
                >
                  {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Dossier & Intel Information */}
        <div className="video-modal-intel-card">
          <div className="video-intel-meta">
            <span className="intel-cat-tag">{video.category}</span>
            <span className="intel-dot">•</span>
            <span className="intel-loc">
              <MapPin size={13} color="var(--accent)" />
              <span>{video.location}</span>
            </span>
            <span className="intel-dot">•</span>
            <span className="intel-mountain">
              <Compass size={13} color="var(--accent)" />
              <span>{video.mountain}</span>
            </span>
            <span className="intel-dot">•</span>
            <span className="intel-duration">
              <Clock size={13} color="var(--accent)" />
              <span>{video.duration}s 4K Visual Master</span>
            </span>
          </div>

          <h2 className="video-intel-title">{video.title}</h2>
          <p className="video-intel-desc">{video.description}</p>
        </div>

        {/* Bottom Navigation: Previous & Next Video Buttons */}
        <div className="video-modal-nav-bar">
          <button
            className="video-nav-step-btn prev-btn"
            onClick={handlePrev}
            aria-label="Previous Expedition Video"
          >
            <ChevronLeft size={20} />
            <div className="step-btn-text">
              <span className="step-label">PREVIOUS EXPEDITION</span>
              <span className="step-title">
                {videos[(activeVideoIndex - 1 + videos.length) % videos.length].title}
              </span>
            </div>
          </button>

          <button
            className="video-nav-step-btn next-btn"
            onClick={handleNext}
            aria-label="Next Expedition Video"
          >
            <div className="step-btn-text">
              <span className="step-label">NEXT EXPEDITION</span>
              <span className="step-title">
                {videos[(activeVideoIndex + 1) % videos.length].title}
              </span>
            </div>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
