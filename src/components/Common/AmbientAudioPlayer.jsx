import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Wind } from 'lucide-react';
import './AmbientAudioPlayer.css';

export default function AmbientAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(() => {
    try {
      return localStorage.getItem('alpine_ambient_sound') === 'true';
    } catch {
      return false;
    }
  });

  const [volume, setVolume] = useState(() => {
    try {
      const savedVol = localStorage.getItem('alpine_ambient_vol');
      return savedVol ? parseFloat(savedVol) : 0.35;
    } catch {
      return 0.35;
    }
  });

  const [showControls, setShowControls] = useState(false);

  // Web Audio Nodes
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const noiseSourceRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('alpine_ambient_sound', isPlaying.toString());
      localStorage.setItem('alpine_ambient_vol', volume.toString());
    } catch {
      // ignore
    }
  }, [isPlaying, volume]);

  const initAudio = () => {
    if (audioCtxRef.current) return;

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      // Generate 5 seconds of pink noise buffer (mountain wind texture)
      const bufferSize = ctx.sampleRate * 5;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;
      noiseSourceRef.current = whiteNoise;

      // Resonant Bandpass Filter simulating high-altitude wind howling
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 380;
      filter.Q.value = 2.4;

      // Low rumble sub-filter
      const lowFilter = ctx.createBiquadFilter();
      lowFilter.type = 'lowpass';
      lowFilter.frequency.value = 220;

      // Gain master
      const gain = ctx.createGain();
      gain.gain.value = volume;
      gainNodeRef.current = gain;

      // Connect graph: Noise -> Filter -> Gain -> Destination
      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(0);
    } catch (e) {
      console.warn('Web Audio synthesis not supported or permitted:', e);
    }
  };

  const togglePlay = () => {
    if (!audioCtxRef.current) {
      initAudio();
    }

    if (audioCtxRef.current) {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      if (isPlaying) {
        if (gainNodeRef.current) gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.2);
        setIsPlaying(false);
      } else {
        if (gainNodeRef.current) gainNodeRef.current.gain.setTargetAtTime(volume, audioCtxRef.current.currentTime, 0.2);
        setIsPlaying(true);
        window.dispatchEvent(new CustomEvent('alpine-toast', {
          detail: { message: '🔊 Mountain Wind Ambience Enabled', type: 'info' }
        }));
      }
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (gainNodeRef.current && audioCtxRef.current && isPlaying) {
      gainNodeRef.current.gain.setTargetAtTime(val, audioCtxRef.current.currentTime, 0.05);
    }
  };

  return (
    <div className="ambient-audio-widget" onMouseEnter={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)}>
      <button
        className={`ambient-toggle-btn ${isPlaying ? 'active' : ''}`}
        onClick={togglePlay}
        title={isPlaying ? 'Mute Mountain Ambience' : 'Play Mountain Wind Ambience (User Opt-in)'}
        aria-label="Toggle mountain wind sound"
      >
        <Wind size={15} className={isPlaying ? 'wind-swirl' : ''} />
        {isPlaying ? <Volume2 size={14} color="#d4af37" /> : <VolumeX size={14} />}
      </button>

      {showControls && (
        <div className="ambient-vol-popup">
          <span className="vol-caption">Alpine Wind: {Math.round(volume * 100)}%</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            aria-label="Ambience volume"
          />
        </div>
      )}
    </div>
  );
}
