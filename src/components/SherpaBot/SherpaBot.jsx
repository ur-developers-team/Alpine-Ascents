import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, RotateCcw, Compass, ArrowUpRight, Sparkles, Minus, MapPin, Mountain, CheckCircle2, ChevronRight } from 'lucide-react';
import chatbotData from '../../data/chatbot.json';
import mountainsData from '../../data/mountains.json';
import destinationsData from '../../data/destinations.json';
import videosData from '../../data/videos.json';
import './SherpaBot.css';

export default function SherpaBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [contextTopic, setContextTopic] = useState(null); // 'k2', 'everest', 'nanga-parbat', 'hunza', 'skardu'

  const defaultWelcome = {
    id: 1,
    sender: 'bot',
    text: chatbotData.sherpaProfile.welcomeMessage || chatbotData.sherpaProfile.bio,
    time: 'Just now',
    suggestions: chatbotData.quickSuggestions || [
      'Explore K2',
      'Beginner Mountains',
      'Compare Peaks',
      'Packing Checklist',
      'Watch Videos',
      'Explore Pakistan',
      'Plan a Trip'
    ]
  };

  const [messages, setMessages] = useState([defaultWelcome]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, isMinimized]);

  // Handle smooth scroll to section with golden highlight ring
  const handleActionClick = (action) => {
    if (!action || !action.target) return;
    const el = document.querySelector(action.target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      el.classList.add('sherpa-target-highlight');
      setTimeout(() => {
        el.classList.remove('sherpa-target-highlight');
      }, 2600);
      // On narrow mobile devices, minimize after navigating
      if (window.innerWidth < 640) {
        setIsMinimized(true);
      }
    }
  };

  // Intelligent Context-Aware Intent Matching Engine
  const findIntentResponse = (rawInput) => {
    const text = rawInput.toLowerCase().trim();

    // 1. Direct Site Navigation Commands
    if (text.includes('open gallery') || text.includes('show gallery') || text.includes('photos') || text.includes('pictures')) {
      return {
        response: "Taking you directly to the High-Resolution Alpine Photography Gallery.",
        action: { type: 'scroll', target: '#gallery', label: 'Go to Photography Gallery' },
        suggestions: ['Watch Videos', 'Explore Mountains', 'Plan a Trip']
      };
    }
    if (text.includes('open video') || text.includes('watch video') || text.includes('cinema') || text.includes('documentary')) {
      return {
        response: "Opening the Expedition Documentary Cinema archives. All featured 4K films are playable with technical climbing masterclasses.",
        action: { type: 'scroll', target: '#videos', label: 'Go to Expedition Cinema' },
        suggestions: ['Watch K2 Film', 'Explore Hunza Valley', 'Open Gallery']
      };
    }
    if (text.includes('show mountain') || text.includes('mountain database') || text.includes('peak finder') || text.includes('directory')) {
      return {
        response: "Opening our Peak Directory with high-altitude orographic telemetry and elevation filters.",
        action: { type: 'scroll', target: '#mountain-finder', label: 'Open Peak Directory' },
        suggestions: ['Explore K2', 'Compare Peaks', 'Beginner Mountains']
      };
    }
    if (text.includes('take me to expedition') || text.includes('show packages') || text.includes('open packages') || text.includes('plan a trip')) {
      return {
        response: "Navigating to our curated all-inclusive alpine expeditions and custom expedition builder.",
        action: { type: 'scroll', target: '#packages', label: 'Browse Featured Expeditions' },
        suggestions: ['Build Custom Itinerary', 'Check Seasonal Discounts', 'Compare Packages']
      };
    }
    if (text.includes('compare peak') || text.includes('compare') || text.includes('radar') || text.includes('converter')) {
      return {
        response: "Opening the Alpine Tools Suite: Multi-axis Radar Summit Matrix, Haversine Geo-Distance, and Meters-to-Feet Altitude Converter.",
        action: { type: 'scroll', target: '#alpine-tools', label: 'Open Alpine Tools Suite' },
        suggestions: ['Explore K2', 'Beginner Mountains', 'Take Safety Quiz']
      };
    }
    if (text.includes('history') || text.includes('timeline') || text.includes('chronology')) {
      return {
        response: "Here is the interactive horizontal chronology of mountaineering history from Balmat & Paccard in 1786 to present-day high-altitude records.",
        action: { type: 'scroll', target: '#knowledge', label: 'Open History Timeline' },
        suggestions: ['Who was George Mallory?', 'First 8,000m summit', 'K2 1954 Ascent']
      };
    }
    if (text.includes('packing checklist') || text.includes('equipment') || text.includes('gear')) {
      return {
        response: "High-altitude climbing requires certified 3-layer thermal insulation, 12-point chromoly crampons, technical ice axes, and avalanche rescue transceivers.",
        action: { type: 'scroll', target: '#equipment', label: 'Open Equipment Checklist' },
        suggestions: ['Play Pack Your Gear Game', 'Safety Guidelines', 'Explore K2']
      };
    }
    if (text.includes('explore pakistan') || text.includes('gilgit') || text.includes('baltistan') || text.includes('karakoram')) {
      return {
        response: "Pakistan's Gilgit-Baltistan is the crown of high Asia, where the Karakoram, Himalaya, and Hindu Kush ranges converge, boasting 5 of the world's 14 eight-thousanders.",
        action: { type: 'scroll', target: '#gilgit-baltistan', label: 'Open Gilgit-Baltistan Experience' },
        suggestions: ['Where is Hunza Valley?', 'Skardu Gateway', 'K2 Base Camp Trek']
      };
    }

    // 2. Session Context Memory Handling (e.g. "How high is it?", "What is its difficulty?", "Where is it?")
    if (contextTopic) {
      if (text.includes('how high') || text.includes('altitude') || text.includes('elevation') || text.includes('height') || text.includes('how tall') || text === 'it' || text.includes('its altitude')) {
        const peak = mountainsData.find(m => m.id === contextTopic);
        if (peak) {
          return {
            response: `${peak.name} stands at an impressive ${peak.altitudeFormatted || `${peak.altitude}m`} above sea level in the ${peak.range} range (${peak.location}).`,
            action: { type: 'scroll', target: '#mountain-finder', label: `View ${peak.name} in Directory` },
            mountainCard: peak,
            suggestions: ['Compare Peaks', 'What gear do I need?', 'Best Climbing Season']
          };
        }
      }
      if (text.includes('difficulty') || text.includes('how hard') || text.includes('technical') || text.includes('its challenge')) {
        const peak = mountainsData.find(m => m.id === contextTopic);
        if (peak) {
          return {
            response: `${peak.name} is classified as ${peak.difficulty?.toUpperCase()} difficulty. It requires advanced rope management, disciplined acclimatization, and high-altitude endurance.`,
            action: { type: 'scroll', target: '#mountain-finder', label: `Inspect ${peak.name} Specs` },
            mountainCard: peak,
            suggestions: ['Compare Peaks', 'Packing Checklist']
          };
        }
      }
      if (text.includes('weather') || text.includes('wind') || text.includes('temperature') || text.includes('conditions')) {
        return {
          response: `Live summit conditions for ${contextTopic.toUpperCase()} can fluctuate rapidly. We provide real-time Open-Meteo telemetry with wind speed and temperature below.`,
          action: { type: 'scroll', target: '#weather', label: 'Check Live Summit Weather' },
          suggestions: ['Check K2 Wind Speed', 'Best Climbing Season']
        };
      }
      if (text.includes('route') || text.includes('path') || text.includes('climb it') || text.includes('how to climb')) {
        return {
          response: `Classic ascent routes on ${contextTopic.toUpperCase()} require acclimatization rotations through high camps and fixed-rope management. Inspect our 3D route topography tool!`,
          action: { type: 'scroll', target: '#route-3d', label: 'Inspect 3D Peak Profile' },
          suggestions: ['Explore K2', 'Packing Checklist']
        };
      }
    }

    // 3. Dynamic Peak Lookup from mountains.json
    for (const peak of mountainsData) {
      const pName = peak.name.toLowerCase();
      const pId = peak.id.toLowerCase();
      if (text.includes(pName) || text.includes(pId) || (peak.localName && text.includes(peak.localName.toLowerCase()))) {
        setContextTopic(peak.id);
        return {
          response: `${peak.name} (${peak.altitudeFormatted || `${peak.altitude}m`}) is situated in the ${peak.range} range, ${peak.location}. Ranked difficulty: ${peak.difficulty}. ${peak.description || ''}`,
          action: { type: 'scroll', target: '#mountain-finder', label: `View ${peak.name} Profile` },
          mountainCard: peak,
          suggestions: ['How high is it?', 'What is its difficulty?', 'Compare Peaks', 'Packing Checklist']
        };
      }
    }

    // 4. Dynamic Destination Lookup from destinations.json
    for (const dest of destinationsData) {
      const dName = dest.name.toLowerCase();
      const dId = dest.id.toLowerCase();
      if (text.includes(dName) || text.includes(dId)) {
        setContextTopic(dest.id);
        return {
          response: `${dest.name} (${dest.region || 'Gilgit-Baltistan'}): ${dest.description || 'A premier gateway to legendary high-altitude ascents and cultural trails.'}`,
          action: { type: 'scroll', target: '#places', label: `Explore ${dest.name} Gateway` },
          suggestions: ['Explore Pakistan', 'Plan a Trip', 'Watch Videos']
        };
      }
    }

    // 5. Dynamic Video Lookup from videos.json
    if (text.includes('k2 film') || text.includes('k2 video')) {
      const vid = videosData.find(v => v.id.includes('k2'));
      if (vid) {
        return {
          response: `I recommend watching '${vid.title}' (${vid.duration}) filmed at ${vid.location}. You will learn: ${vid.whatYouWillLearn?.join(' · ') || 'High altitude expedition climbing tactics'}.`,
          action: { type: 'scroll', target: '#videos', label: 'Watch K2 Documentary' },
          suggestions: ['Watch Videos', 'Explore K2']
        };
      }
    }

    // 6. Intent matching from chatbotData.intents
    for (const item of (chatbotData.intents || [])) {
      if (item.patterns && item.patterns.some(pattern => text.includes(pattern))) {
        // Track topic if relevant
        if (item.intent === 'mountain_info' || text.includes('k2')) {
          setContextTopic('k2');
        } else if (text.includes('everest')) {
          setContextTopic('everest');
        } else if (text.includes('hunza')) {
          setContextTopic('hunza-valley');
        }

        let mCard = null;
        if (text.includes('k2')) {
          mCard = mountainsData.find(m => m.id === 'k2');
        } else if (text.includes('everest')) {
          mCard = mountainsData.find(m => m.id === 'everest');
        } else if (text.includes('nanga parbat')) {
          mCard = mountainsData.find(m => m.id === 'nanga-parbat');
        }

        return {
          response: item.response,
          action: item.action || null,
          mountainCard: mCard,
          suggestions: item.suggestions || chatbotData.quickSuggestions.slice(0, 4)
        };
      }
    }

    // 7. Fallback Response
    const fallback = (chatbotData.intents || []).find(i => i.intent === 'unknown' || i.intent === 'fallback');
    return {
      response: fallback?.response || "That is an intriguing mountaineering inquiry. As an alpine guide, I can provide beta on mountains, destinations, packages, gear requirements, safety protocols, live summit weather, or navigate you anywhere on Alpine Ascents.",
      suggestions: chatbotData.quickSuggestions || ['Explore K2', 'Beginner Mountains', 'Packing Checklist', 'Watch Videos', 'Plan a Trip']
    };
  };

  const handleSend = (textToSend) => {
    const query = typeof textToSend === 'string' ? textToSend : inputVal;
    if (!query || !query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Realistic thoughtful guide response delay (500ms - 750ms)
    setTimeout(() => {
      const match = findIntentResponse(query);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: match.response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: match.action || null,
        suggestions: match.suggestions || chatbotData.quickSuggestions.slice(0, 4),
        mountainCard: match.mountainCard || null
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 550);
  };

  const handleResetChat = () => {
    setContextTopic(null);
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: "Namaste! Chat memory cleared. How may I assist your high-altitude expedition aspirations today?",
        time: 'Just now',
        suggestions: chatbotData.quickSuggestions || [
          'Explore K2',
          'Beginner Mountains',
          'Compare Peaks',
          'Packing Checklist',
          'Watch Videos'
        ]
      }
    ]);
  };

  return (
    <>
      {/* Floating Launcher Button - Prominently Visible in Safe Screen Corner */}
      {!isOpen && (
        <button
          className="sherpa-floating-btn"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          aria-label="Open Ask Sherpa Virtual Mountain Guide"
          title="Ask Sherpa · AI Mountain Guide & Expedition Sirdar"
        >
          <div className="sherpa-btn-avatar-wrap">
            <img
              src={chatbotData.sherpaProfile.avatar}
              alt={chatbotData.sherpaProfile.name}
              className="sherpa-btn-avatar"
            />
            <span className="sherpa-status-dot" />
          </div>
          <div className="sherpa-btn-text">
            <span className="sherpa-btn-title">
              <span className="sherpa-compass-icon" role="img" aria-label="compass">🧭</span> Ask Sherpa
            </span>
            <span className="sherpa-btn-subtitle">AI Mountain Guide · Online</span>
          </div>
        </button>
      )}

      {/* Interactive Chat Window */}
      {isOpen && (
        <div
          className={`sherpa-chat-window ${isMinimized ? 'minimized' : ''}`}
          role="dialog"
          aria-label="Ask Sherpa AI Mountain Guide"
        >
          {/* Header */}
          <div className="sherpa-chat-header">
            <div className="sherpa-header-info">
              <div className="sherpa-header-avatar-wrap">
                <img
                  src={chatbotData.sherpaProfile.avatar}
                  alt={chatbotData.sherpaProfile.name}
                  className="sherpa-header-avatar"
                />
                <span className="sherpa-status-dot" />
              </div>
              <div className="sherpa-header-meta">
                <h4>
                  {chatbotData.sherpaProfile.name}
                  <Sparkles size={13} color="var(--accent)" />
                </h4>
                <p>Virtual Mountain Guide · Basecamp Ready</p>
              </div>
            </div>

            <div className="sherpa-header-actions">
              <button
                className="sherpa-icon-btn"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Expand Chat" : "Minimize Chat"}
                aria-label={isMinimized ? "Expand Chat" : "Minimize Chat"}
              >
                <Minus size={15} />
              </button>
              <button
                className="sherpa-icon-btn"
                onClick={handleResetChat}
                title="Reset Conversation"
                aria-label="Reset Conversation"
              >
                <RotateCcw size={15} />
              </button>
              <button
                className="sherpa-icon-btn"
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                aria-label="Close Chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Feed */}
              <div className="sherpa-messages-list">
                {messages.map((msg) => (
                  <div key={msg.id} className={`sherpa-message-row ${msg.sender}`}>
                    {msg.sender === 'bot' && (
                      <img
                        src={chatbotData.sherpaProfile.avatar}
                        alt="Sherpa"
                        className="sherpa-bubble-avatar"
                      />
                    )}
                    <div className="sherpa-message-bubble">
                      <div className="sherpa-bubble-text">{msg.text}</div>

                      {/* Mini Mountain Result Card if peak was referenced */}
                      {msg.mountainCard && (
                        <div className="sherpa-mountain-mini-card">
                          {msg.mountainCard.image && (
                            <img
                              src={msg.mountainCard.image}
                              alt={msg.mountainCard.name}
                              className="sherpa-mountain-mini-img"
                              loading="lazy"
                            />
                          )}
                          <div className="sherpa-mountain-mini-body">
                            <div className="sherpa-mountain-mini-name">{msg.mountainCard.name}</div>
                            <div className="sherpa-mountain-mini-meta">
                              {msg.mountainCard.altitudeFormatted || `${msg.mountainCard.altitude}m`} · {msg.mountainCard.range}
                            </div>
                            <div className="sherpa-mountain-mini-diff">
                              <span className="diff-tag">{msg.mountainCard.difficulty}</span> · {msg.mountainCard.location}
                            </div>
                            <button
                              className="sherpa-mountain-mini-btn"
                              onClick={() => handleActionClick({ target: '#mountain-finder', label: `Explore ${msg.mountainCard.name}` })}
                            >
                              <Compass size={13} />
                              <span>Explore Peak in Directory</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Contextual Action Button */}
                      {msg.action && (
                        <button
                          className="sherpa-action-btn"
                          onClick={() => handleActionClick(msg.action)}
                        >
                          <ArrowUpRight size={14} />
                          <span>{msg.action.label}</span>
                        </button>
                      )}

                      <div className="sherpa-msg-time">{msg.time}</div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="sherpa-message-row bot">
                    <img
                      src={chatbotData.sherpaProfile.avatar}
                      alt="Sherpa"
                      className="sherpa-bubble-avatar"
                    />
                    <div className="sherpa-typing">
                      <span className="sherpa-typing-dot" />
                      <span className="sherpa-typing-dot" />
                      <span className="sherpa-typing-dot" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestions Chips Bar */}
              {messages.length > 0 && messages[messages.length - 1].suggestions && (
                <div className="sherpa-suggestions-bar">
                  {messages[messages.length - 1].suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      className="sherpa-chip"
                      onClick={() => handleSend(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Input Bar */}
              <form
                className="sherpa-chat-input-bar"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputVal);
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  className="sherpa-input-field"
                  placeholder="Ask Sherpa about K2, gear, weather, routes..."
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                />
                <button
                  type="submit"
                  className="sherpa-send-btn"
                  disabled={!inputVal.trim()}
                  aria-label="Send message to Sherpa"
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
