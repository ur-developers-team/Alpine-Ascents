import React from 'react';
import useVoiceNavigation from '../../hooks/useVoiceNavigation';
import { Mic, MicOff } from 'lucide-react';

export default function VoiceNavButton() {
  const { isListening, isSupported, startListening, stopListening } = useVoiceNavigation();

  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <button
      className={`btn btn-sm nav-voice-btn ${isListening ? 'btn-primary' : 'btn-outline'}`}
      onClick={handleToggle}
      title={isListening ? 'Listening for commands... click to stop' : 'Voice Navigation (Speak "Show mountains", "Go to gallery")'}
      aria-label="Voice Navigation"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.4rem 0.65rem'
      }}
    >
      {isListening ? (
        <>
          <Mic size={14} className="spin" color="#0b111e" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Listening...</span>
        </>
      ) : (
        <>
          <Mic size={14} />
          <span className="hide-on-mobile" style={{ fontSize: '0.75rem' }}>Voice</span>
        </>
      )}
    </button>
  );
}
