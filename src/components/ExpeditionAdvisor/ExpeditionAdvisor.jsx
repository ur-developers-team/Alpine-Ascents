import React, { useState } from 'react';
import packagesData from '../../data/packages.json';
import destinationsData from '../../data/destinations.json';
import advisorQuestionsData from '../../data/advisorQuestions.json';
import { Compass, Sparkles, Check, ArrowRight, RotateCcw } from 'lucide-react';
import './ExpeditionAdvisor.css';

export default function ExpeditionAdvisor({ onSelectPackage, onSelectDestination }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({
    adventureType: '',
    duration: '',
    difficulty: '',
    travelStyle: ''
  });
  const [showResults, setShowResults] = useState(false);

  const questions = advisorQuestionsData;

  const handleSelectOption = (key, val) => {
    const updated = { ...answers, [key]: val };
    setAnswers(updated);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers({
      adventureType: '',
      duration: '',
      difficulty: '',
      travelStyle: ''
    });
    setShowResults(false);
  };

  // Deterministic matching based on answers
  const matchedPackages = packagesData.filter(pkg => {
    if (answers.travelStyle && pkg.type.toUpperCase() === answers.travelStyle.toUpperCase()) {
      return true;
    }
    if (answers.difficulty && pkg.difficulty.toLowerCase().includes(answers.difficulty.toLowerCase())) {
      return true;
    }
    return false;
  }).slice(0, 3);

  const finalPackages = matchedPackages.length > 0 ? matchedPackages : packagesData.slice(0, 2);

  return (
    <section id="advisor" className="section advisor-section">
      <div className="container">
        <div className="section-header">
          <div className="section-eyebrow">
            <Sparkles size={14} />
            <span>INTERACTIVE EXPEDITION ADVISOR</span>
          </div>
          <h2 className="section-title">NOT SURE WHERE TO GO?</h2>
          <p className="section-subtitle">
            Answer 4 quick questions about your mountain ambition, timeframe, and climbing style. Our recommendation engine suggests matching expeditions.
          </p>
        </div>

        <div className="advisor-card">
          {!showResults ? (
            <div className="advisor-question-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span className="hud-tag">QUESTION 0{currentQuestion + 1} OF 04</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Deterministic Recommendation</span>
              </div>

              <h3>{questions[currentQuestion].title}</h3>

              <div className="advisor-options">
                {questions[currentQuestion].options.map((opt) => (
                  <button
                    key={opt.val}
                    className="advisor-opt-btn"
                    onClick={() => handleSelectOption(questions[currentQuestion].id, opt.val)}
                  >
                    <span>{opt.label}</span>
                    <ArrowRight size={16} color="var(--accent)" />
                  </button>
                ))}
              </div>

              {currentQuestion > 0 && (
                <div style={{ marginTop: '2rem' }}>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  >
                    Back to previous question
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="advisor-matches-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span className="hud-tag" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', borderColor: '#059669' }}>
                    RECOMMENDATIONS COMPUTED
                  </span>
                  <h3 style={{ marginTop: '0.35rem' }}>Your Curated Expedition Matches</h3>
                </div>
                <button className="btn btn-outline btn-sm" onClick={handleReset}>
                  <RotateCcw size={14} />
                  <span>Start Over</span>
                </button>
              </div>

              <div>
                {finalPackages.map(pkg => (
                  <div key={pkg.id} className="advisor-match-card">
                    <div>
                      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.3rem' }}>
                        <span className="hud-tag">{pkg.type}</span>
                        <span className="hud-tag">{pkg.duration}</span>
                      </div>
                      <h4 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{pkg.name}</h4>
                      <p style={{ fontSize: '0.85rem' }}>{pkg.destinationName} · {pkg.difficulty}</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent)' }}>${pkg.price}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Sample Demo Price</span>
                      </div>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onSelectPackage && onSelectPackage(pkg)}
                      >
                        <span>View Details</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
