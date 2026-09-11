import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Mountain, MapPin, Compass, BookOpen, Users, ArrowRight, Mic, MicOff } from 'lucide-react';
import mountainsData from '../../data/mountains.json';
import destinationsData from '../../data/destinations.json';
import packagesData from '../../data/packages.json';
import guidesData from '../../data/guides.json';
import journalData from '../../data/journal.json';
import './GlobalSearchModal.css';

export default function GlobalSearchModal({ isOpen, onClose, onSelectItem }) {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      setSpeechSupported(true);
      const rec = new SpeechRec();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
      };

      rec.onerror = (err) => {
        console.warn('Speech recognition error', err);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert('Voice search is supported on Chromium and modern browsers. Please grant microphone permission if prompted.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Unable to start speech recognition', err);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onSelectItem ? null : null; // toggle handled in parent
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredMountains = q
    ? mountainsData.filter(m => m.name.toLowerCase().includes(q) || m.range.toLowerCase().includes(q) || m.country.toLowerCase().includes(q))
    : [];

  const filteredDestinations = q
    ? destinationsData.filter(d => d.name.toLowerCase().includes(q) || d.region.toLowerCase().includes(q) || d.country.toLowerCase().includes(q))
    : [];

  const filteredPackages = q
    ? packagesData.filter(p => p.name.toLowerCase().includes(q) || p.destinationName.toLowerCase().includes(q) || p.type.toLowerCase().includes(q))
    : [];

  const filteredGuides = q
    ? guidesData.filter(g => g.name.toLowerCase().includes(q) || g.region.toLowerCase().includes(q) || g.specialties.some(s => s.toLowerCase().includes(q)))
    : [];

  const filteredArticles = q
    ? journalData.filter(j => j.title.toLowerCase().includes(q) || j.excerpt.toLowerCase().includes(q) || j.tags.some(t => t.toLowerCase().includes(q)))
    : [];

  const totalResults = filteredMountains.length + filteredDestinations.length + filteredPackages.length + filteredGuides.length + filteredArticles.length;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="search-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-wrapper">
          <Search size={20} color="var(--accent)" />
          <input
            ref={inputRef}
            type="text"
            className="search-field"
            placeholder="Search mountains, expeditions, destinations, guides, articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search"
          />
          <button
            type="button"
            className={`btn btn-icon btn-sm ${isListening ? 'listening-pulse' : ''}`}
            onClick={toggleVoiceSearch}
            title={isListening ? "Listening... Speak now" : "Voice Search (Click to speak)"}
            aria-label="Voice Search"
            style={{
              background: isListening ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-tertiary)',
              border: isListening ? '1px solid #ef4444' : '1px solid var(--border-color)',
              color: isListening ? '#ef4444' : 'var(--accent-gold)'
            }}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
          <span className="search-shortcut-hint">ESC</span>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close search" style={{ position: 'static' }}>
            <X size={16} />
          </button>
        </div>

        <div className="search-results-container">
          {!q ? (
            <div style={{ padding: '1rem 0' }}>
              <div className="search-category-title">QUICK EXPLORATION TOPICS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {['K2 Summit', 'Hunza Valley', 'Passu Cones', 'Concordia', 'Nanga Parbat', 'Mont Blanc', 'Crevasse Rescue', 'Leave No Trace'].map(tag => (
                  <button
                    key={tag}
                    className="btn btn-outline btn-sm"
                    onClick={() => setQuery(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Tip: Type peak names, regions like "Gilgit-Baltistan", guides, or equipment topics.
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="search-empty-state">
              <Mountain size={36} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <h4>No matching alpine records found</h4>
              <p>Try searching for "K2", "Hunza", "Broad Peak", "Attabad", or "Expedition".</p>
            </div>
          ) : (
            <>
              {filteredMountains.length > 0 && (
                <div className="search-category-group">
                  <div className="search-category-title">MOUNTAINS ({filteredMountains.length})</div>
                  {filteredMountains.map(m => (
                    <button
                      key={m.id}
                      className="search-result-item"
                      onClick={() => {
                        onClose();
                        onSelectItem && onSelectItem('mountain', m);
                      }}
                    >
                      <div className="search-result-main">
                        <Mountain size={18} color="var(--accent)" />
                        <div className="search-result-info">
                          <h4>{m.name}</h4>
                          <p>{m.altitudeFormatted} · {m.range}, {m.country}</p>
                        </div>
                      </div>
                      <ArrowRight size={14} color="var(--text-muted)" />
                    </button>
                  ))}
                </div>
              )}

              {filteredDestinations.length > 0 && (
                <div className="search-category-group">
                  <div className="search-category-title">DESTINATIONS ({filteredDestinations.length})</div>
                  {filteredDestinations.map(d => (
                    <button
                      key={d.id}
                      className="search-result-item"
                      onClick={() => {
                        onClose();
                        onSelectItem && onSelectItem('destination', d);
                      }}
                    >
                      <div className="search-result-main">
                        <MapPin size={18} color="var(--accent)" />
                        <div className="search-result-info">
                          <h4>{d.name}</h4>
                          <p>{d.region}, {d.country} · {d.altitude}</p>
                        </div>
                      </div>
                      <ArrowRight size={14} color="var(--text-muted)" />
                    </button>
                  ))}
                </div>
              )}

              {filteredPackages.length > 0 && (
                <div className="search-category-group">
                  <div className="search-category-title">EXPEDITION PACKAGES ({filteredPackages.length})</div>
                  {filteredPackages.map(p => (
                    <button
                      key={p.id}
                      className="search-result-item"
                      onClick={() => {
                        onClose();
                        onSelectItem && onSelectItem('package', p);
                      }}
                    >
                      <div className="search-result-main">
                        <Compass size={18} color="var(--accent)" />
                        <div className="search-result-info">
                          <h4>{p.name}</h4>
                          <p>{p.type} · {p.duration} · ${p.price}</p>
                        </div>
                      </div>
                      <ArrowRight size={14} color="var(--text-muted)" />
                    </button>
                  ))}
                </div>
              )}

              {filteredGuides.length > 0 && (
                <div className="search-category-group">
                  <div className="search-category-title">EXPEDITION GUIDES ({filteredGuides.length})</div>
                  {filteredGuides.map(g => (
                    <button
                      key={g.id}
                      className="search-result-item"
                      onClick={() => {
                        onClose();
                        onSelectItem && onSelectItem('guide', g);
                      }}
                    >
                      <div className="search-result-main">
                        <Users size={18} color="var(--accent)" />
                        <div className="search-result-info">
                          <h4>{g.name}</h4>
                          <p>{g.role} · {g.region}</p>
                        </div>
                      </div>
                      <ArrowRight size={14} color="var(--text-muted)" />
                    </button>
                  ))}
                </div>
              )}

              {filteredArticles.length > 0 && (
                <div className="search-category-group">
                  <div className="search-category-title">JOURNAL ARTICLES ({filteredArticles.length})</div>
                  {filteredArticles.map(a => (
                    <button
                      key={a.id}
                      className="search-result-item"
                      onClick={() => {
                        onClose();
                        onSelectItem && onSelectItem('article', a);
                      }}
                    >
                      <div className="search-result-main">
                        <BookOpen size={18} color="var(--accent)" />
                        <div className="search-result-info">
                          <h4>{a.title}</h4>
                          <p>{a.category} · {a.readTime}</p>
                        </div>
                      </div>
                      <ArrowRight size={14} color="var(--text-muted)" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
