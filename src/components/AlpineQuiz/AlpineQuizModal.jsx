import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, AlertTriangle, ArrowRight, RotateCcw, X, ShieldCheck } from 'lucide-react';
import quizData from '../../data/quiz.json';
import { useUserProfile } from '../../context/UserProfileContext';
import { useLanguage } from '../../context/LanguageContext';
import './AlpineQuiz.css';

export default function AlpineQuizModal({ isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const { unlockBadge } = useUserProfile();
  const { t } = useLanguage();

  if (!isOpen) return null;

  const currentQ = quizData[currentIndex];
  const letters = ['A', 'B', 'C', 'D'];

  const handleSelectOption = (idx) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    setUserAnswers(prev => [...prev, {
      questionId: currentQ.id,
      selected: selectedOption,
      isCorrect: selectedOption === currentQ.correctIndex
    }]);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < quizData.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finished
      setShowResult(true);
      const correctTotal = userAnswers.filter(a => a.isCorrect).length;
      const scoreRatio = (correctTotal / quizData.length) * 100;
      if (scoreRatio >= 80) {
        unlockBadge('quiz_ace');
      }
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers([]);
    setShowResult(false);
  };

  const correctAnswersCount = userAnswers.filter(a => a.isCorrect).length;
  const percentage = Math.round((correctAnswersCount / quizData.length) * 100);
  const isPassed = percentage >= 80;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close quiz"
        >
          <X size={18} />
        </button>

        {!showResult ? (
          <div>
            {/* Progress Bar */}
            <div className="quiz-progress-bar-wrap">
              <div
                className="quiz-progress-bar-fill"
                style={{ width: `${((currentIndex + 1) / quizData.length) * 100}%` }}
              />
            </div>

            {/* Header */}
            <div className="quiz-question-header">
              <span className="hud-tag">
                {currentQ.category} · Question {currentIndex + 1} of {quizData.length}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Target: 80% to Unlock Gold Badge
              </span>
            </div>

            {/* Question */}
            <h3 className="quiz-question-text">{currentQ.question}</h3>

            {/* Options */}
            <div className="quiz-options-list">
              {currentQ.options.map((opt, idx) => {
                let btnClass = 'quiz-option-btn';
                if (selectedOption === idx) btnClass += ' selected';
                if (isAnswerSubmitted) {
                  if (idx === currentQ.correctIndex) {
                    btnClass += ' correct';
                  } else if (selectedOption === idx) {
                    btnClass += ' incorrect';
                  }
                }

                return (
                  <button
                    key={idx}
                    className={btnClass}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswerSubmitted}
                  >
                    <span className="quiz-option-letter">{letters[idx]}</span>
                    <span style={{ flex: 1 }}>{opt}</span>
                    {isAnswerSubmitted && idx === currentQ.correctIndex && (
                      <CheckCircle2 size={18} color="#10b981" />
                    )}
                    {isAnswerSubmitted && selectedOption === idx && idx !== currentQ.correctIndex && (
                      <XCircle size={18} color="#ef4444" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answer is submitted */}
            {isAnswerSubmitted && (
              <div className="quiz-explanation-box">
                <strong>Alpine Protocol Explanation:</strong>
                {currentQ.explanation}
              </div>
            )}

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              {!isAnswerSubmitted ? (
                <button
                  className="btn btn-primary"
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                >
                  Verify Answer
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={handleNextQuestion}
                >
                  {currentIndex + 1 < quizData.length ? 'Next Question' : 'Complete Accreditation'} <ArrowRight size={15} />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Result Screen */
          <div className="quiz-result-hero">
            <div className="quiz-result-badge-icon">
              {isPassed ? <Award size={36} /> : <AlertTriangle size={36} />}
            </div>

            <span className="section-eyebrow">ACCREDITATION OUTCOME</span>
            <div className="quiz-result-score">{percentage}%</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              {isPassed ? 'Official Alpine Safety Ace Accredited' : 'Review Safety Guidelines & Retry'}
            </h3>

            <p style={{ color: 'var(--text-secondary)', maxWidth: '460px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
              {isPassed
                ? 'Congratulations! You demonstrated mastery over altitude sickness response, glacier roping spacing, barometric storm indications, and Leave No Trace ethics. Your "Alpine Safety Ace" badge is now permanently unlocked on your profile.'
                : 'You answered ' + correctAnswersCount + ' of ' + quizData.length + ' correctly. A minimum score of 80% (4 correct answers) is required to receive the official badge.'}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-outline" onClick={handleRetakeQuiz}>
                <RotateCcw size={15} /> Retake Quiz
              </button>
              <button className="btn btn-primary" onClick={onClose}>
                View Profile & Badges
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
