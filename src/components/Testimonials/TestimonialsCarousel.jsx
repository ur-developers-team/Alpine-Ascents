import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, MessageSquareQuote } from 'lucide-react';
import testimonialsData from '../../data/testimonials.json';
import { useLanguage } from '../../context/LanguageContext';
import './TestimonialsCarousel.css';

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { t } = useLanguage();
  const timerRef = useRef(null);

  const total = testimonialsData.length;

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + total) % total);
  };

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 5500);
    }
    return () => clearInterval(timerRef.current);
  }, [isPaused, currentIndex]);

  const current = testimonialsData[currentIndex];

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="site-container">
        <div className="section-header">
          <span className="section-eyebrow">
            <MessageSquareQuote size={14} style={{ display: 'inline', marginRight: '0.4rem' }} />
            {t('testimonials', 'badge')}
          </span>
          <h2 className="section-title">{t('testimonials', 'title')}</h2>
          <p className="section-subtitle">{t('testimonials', 'subtitle')}</p>
        </div>

        <div
          className="testimonials-carousel-wrap"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          role="region"
          aria-roledescription="carousel"
          aria-label="Expedition memoirs and testimonials"
        >
          <div className="testimonial-card-slide">
            <span className="testimonial-quote-icon">“</span>

            <div className="testimonial-stars" aria-label={`Rating: ${current.rating} out of 5 stars`}>
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} size={18} fill="currentColor" />
              ))}
            </div>

            <p className="testimonial-quote-text">
              "{current.quote}"
            </p>

            <div className="testimonial-author-row">
              <img
                src={current.avatar}
                alt={current.climber}
                className="testimonial-author-avatar"
                loading="lazy"
              />
              <div className="testimonial-author-meta">
                <h4>{current.climber}</h4>
                <p>{current.country} · {current.expedition} ({current.year})</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="carousel-controls">
            <button
              className="carousel-nav-btn"
              onClick={prevSlide}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="carousel-dots-list">
              {testimonialsData.map((_, idx) => (
                <button
                  key={idx}
                  className={`carousel-dot ${currentIndex === idx ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              className="carousel-nav-btn"
              onClick={nextSlide}
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
