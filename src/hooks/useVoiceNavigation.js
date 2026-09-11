import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Web Speech API hook for voice-controlled alpine navigation.
 * Smoothly scrolls to target sections upon spoken commands.
 * Falls back gracefully when SpeechRecognition is unsupported.
 */
export function useVoiceNavigation() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript.toLowerCase();
        setTranscript(spokenText);
        handleVoiceCommand(spokenText);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const handleVoiceCommand = (cmd) => {
    let targetSelector = null;
    let targetName = '';

    if (cmd.includes('hazard') || cmd.includes('danger') || cmd.includes('safety')) {
      targetSelector = '#knowledge';
      targetName = 'Hazards & Mountaineering Knowledge';
    } else if (cmd.includes('mountain') || cmd.includes('peak') || cmd.includes('k2') || cmd.includes('everest')) {
      targetSelector = '#mountain-finder';
      targetName = 'Mountain Database & Peaks';
    } else if (cmd.includes('gallery') || cmd.includes('photo') || cmd.includes('picture')) {
      targetSelector = '#gallery';
      targetName = 'Photography Gallery';
    } else if (cmd.includes('expedition') || cmd.includes('package') || cmd.includes('tour')) {
      targetSelector = '#packages';
      targetName = 'Expeditions & Packages';
    } else if (cmd.includes('gilgit') || cmd.includes('hunza') || cmd.includes('skardu')) {
      targetSelector = '#gilgit-baltistan';
      targetName = 'Gilgit-Baltistan Flagship Section';
    } else if (cmd.includes('place') || cmd.includes('destination') || cmd.includes('city')) {
      targetSelector = '#places';
      targetName = 'Places & Destinations Ecosystem';
    } else if (cmd.includes('weather') || cmd.includes('wind') || cmd.includes('forecast')) {
      targetSelector = '#weather';
      targetName = 'Live Mountain Telemetry & Weather';
    } else if (cmd.includes('game') || cmd.includes('challenge') || cmd.includes('pack') || cmd.includes('gear')) {
      targetSelector = '#mini-games-hub';
      targetName = 'Expedition Mini-Games Hub';
    } else if (cmd.includes('video') || cmd.includes('film') || cmd.includes('cinema')) {
      targetSelector = '#videos';
      targetName = 'Cinematic Video Archives';
    } else if (cmd.includes('home') || cmd.includes('top') || cmd.includes('start')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      targetName = 'Alpine Ascents Summit Horizon';
    }

    if (targetSelector) {
      const el = document.querySelector(targetSelector);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }

    window.dispatchEvent(new CustomEvent('alpine-toast', {
      detail: {
        message: targetName ? `🎙️ Voice: Navigating to ${targetName}` : `🎙️ Heard: "${cmd}" (Try 'Show mountains', 'Go to gallery')`,
        type: targetName ? 'trip' : 'info'
      }
    }));
  };

  const startListening = useCallback(() => {
    if (!isSupported) {
      window.dispatchEvent(new CustomEvent('alpine-toast', {
        detail: {
          message: 'Voice navigation is not supported in this browser. Please use Chrome, Edge, or Safari.',
          type: 'warning'
        }
      }));
      return;
    }

    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        window.dispatchEvent(new CustomEvent('alpine-toast', {
          detail: {
            message: '🎙️ Listening for voice command... (e.g., "Show mountains", "Open gallery")',
            type: 'info'
          }
        }));
      } catch (e) {
        console.warn('Recognition start failed', e);
      }
    }
  }, [isSupported, isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening
  };
}

export default useVoiceNavigation;
