import React, { useState } from 'react';
import storyData from '../../data/routesStory.json';
import { useGamification } from '../../context/GamificationContext';
import { Compass, Mountain, ChevronRight, RotateCcw, Trophy, Award, MapPin, Sparkles } from 'lucide-react';
import './RouteStoryAdventure.css';

export default function RouteStoryAdventure() {
  const { completeMiniGame } = useGamification();
  const [currentSceneId, setCurrentSceneId] = useState(storyData.startSceneId);
  const [history, setHistory] = useState([storyData.startSceneId]);

  const currentScene = storyData.scenes[currentSceneId] || storyData.scenes[storyData.startSceneId];

  const handleSelectChoice = (choice) => {
    const nextId = choice.nextSceneId;
    setCurrentSceneId(nextId);
    setHistory(prev => [...prev, nextId]);

    const nextScene = storyData.scenes[nextId];
    if (nextScene?.isEnding) {
      if (nextScene.outcome === 'VICTORY') {
        completeMiniGame('route', 'route_master');
      } else {
        completeMiniGame('route');
      }
    }
  };

  const handleRestart = () => {
    setCurrentSceneId(storyData.startSceneId);
    setHistory([storyData.startSceneId]);
  };

  return (
    <div className="route-story-container">
      <div className="route-story-header">
        <div>
          <span className="route-story-eyebrow">
            <Compass size={14} style={{ display: 'inline', marginRight: '0.4rem' }} />
            BRANCHING EXPEDITION NARRATIVE
          </span>
          <h3>{storyData.title}</h3>
        </div>
        <button className="btn btn-outline btn-sm" onClick={handleRestart}>
          <RotateCcw size={14} />
          <span>Restart Odyssey</span>
        </button>
      </div>

      <div className="story-scene-card">
        {/* Stage Indicator Bar */}
        <div className="story-stage-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} color="var(--accent, #d4af37)" />
            <strong>{currentScene.stage || currentScene.title}</strong>
          </div>
          {currentScene.altitude && (
            <span className="story-alt-pill font-mono">{currentScene.altitude}</span>
          )}
        </div>

        {/* Narrative Prose */}
        <div className="story-prose-box">
          <p>{currentScene.story}</p>
        </div>

        {/* Ending Screen / Debrief */}
        {currentScene.isEnding ? (
          <div className={`story-ending-debrief ${currentScene.outcome.toLowerCase()}`}>
            <div className="ending-badge-row">
              <div className="ending-icon">
                {currentScene.outcome === 'VICTORY' ? (
                  <Trophy size={32} color="#d4af37" />
                ) : (
                  <Award size={32} color="#38bdf8" />
                )}
              </div>
              <div>
                <span className="ending-status-tag">{currentScene.outcome}</span>
                <h4>{currentScene.title}</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Climber Score: <strong>{currentScene.score} / 100</strong> · Badge Awarded: <strong>{currentScene.badge}</strong>
                </div>
              </div>
            </div>

            <div className="story-restart-actions">
              <button className="btn btn-primary btn-sm" onClick={handleRestart}>
                <RotateCcw size={14} />
                <span>Try Alternate Route Line</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Decision Choices */
          <div className="story-choices-container">
            <span className="choices-prompt-label">Select Your Tactical Alpine Decision:</span>
            <div className="story-choices-grid">
              {currentScene.choices.map((choice, idx) => (
                <button
                  key={idx}
                  className="story-choice-card"
                  onClick={() => handleSelectChoice(choice)}
                >
                  <div className="choice-strategy-tag">{choice.strategy}</div>
                  <div className="choice-text-row">
                    <span>{choice.text}</span>
                    <ChevronRight size={18} className="choice-arrow" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
