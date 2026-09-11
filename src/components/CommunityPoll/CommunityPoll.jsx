import React, { useState, useEffect } from 'react';
import pollData from '../../data/polls.json';
import { Vote, CheckCircle2, Mountain, Users, BarChart3 } from 'lucide-react';
import './CommunityPoll.css';

export default function CommunityPoll() {
  const [userVotedId, setUserVotedId] = useState(() => {
    try {
      return localStorage.getItem('alpine_poll_voted_id') || null;
    } catch {
      return null;
    }
  });

  const [votes, setVotes] = useState(() => {
    try {
      const savedVotes = localStorage.getItem('alpine_poll_tallies');
      if (savedVotes) return JSON.parse(savedVotes);
    } catch {
      // ignore
    }
    const initial = {};
    pollData.options.forEach(opt => {
      initial[opt.id] = opt.initialVotes;
    });
    return initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem('alpine_poll_tallies', JSON.stringify(votes));
      if (userVotedId) {
        localStorage.setItem('alpine_poll_voted_id', userVotedId);
      }
    } catch {
      // ignore
    }
  }, [votes, userVotedId]);

  const totalVotes = Object.values(votes).reduce((sum, v) => sum + v, 0);

  const handleVote = (optionId) => {
    if (userVotedId) return;

    setUserVotedId(optionId);
    setVotes(prev => ({
      ...prev,
      [optionId]: prev[optionId] + 1
    }));

    window.dispatchEvent(new CustomEvent('alpine-toast', {
      detail: {
        message: '🗳️ Ballot Cast: Community Summit Poll recorded!',
        type: 'success'
      }
    }));
  };

  return (
    <section id="community-poll" className="section community-poll-section">
      <div className="container">
        <div className="poll-card-container">
          <div className="poll-header-block">
            <span className="poll-eyebrow">
              <Vote size={14} style={{ display: 'inline', marginRight: '0.4rem' }} />
              ALPINIST COMMUNITY PULSE
            </span>
            <h3 className="poll-title">{pollData.question}</h3>
            <p className="poll-subtitle">{pollData.subtitle}</p>
            <div className="poll-meta-badge">
              <Users size={14} />
              <span>{totalVotes.toLocaleString()} Total Climber Ballots Recorded</span>
            </div>
          </div>

          <div className="poll-options-grid">
            {pollData.options.map(opt => {
              const optionVotes = votes[opt.id] || 0;
              const pct = totalVotes > 0 ? ((optionVotes / totalVotes) * 100).toFixed(1) : 0;
              const isSelected = userVotedId === opt.id;

              return (
                <div
                  key={opt.id}
                  className={`poll-option-row ${isSelected ? 'voted' : ''}`}
                  onClick={() => handleVote(opt.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleVote(opt.id);
                  }}
                  aria-label={`Vote for ${opt.mountain}`}
                >
                  <div className="poll-option-left">
                    <div className="poll-radio-indicator">
                      {isSelected ? <CheckCircle2 size={16} color="#d4af37" /> : <div className="poll-empty-dot" />}
                    </div>
                    <div>
                      <div className="poll-mountain-name">
                        <strong>{opt.mountain}</strong>
                        <span className="poll-alt-tag">{opt.elevation}</span>
                      </div>
                      <span className="poll-tag-label">{opt.tag} · {opt.region}</span>
                    </div>
                  </div>

                  <div className="poll-option-right">
                    <span className="poll-pct font-mono">{pct}%</span>
                    <span className="poll-count font-mono">({optionVotes.toLocaleString()} votes)</span>
                  </div>

                  {/* Animated Background Percentage Fill */}
                  <div
                    className="poll-fill-track"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              );
            })}
          </div>

          <div className="poll-footer-notice">
            <span>
              ℹ Interactive local community simulation. Votes are persisted in local expedition storage without external server telemetry.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
