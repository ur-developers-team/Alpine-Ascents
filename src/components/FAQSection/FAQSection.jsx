import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Search } from 'lucide-react';
import faqsData from '../../data/faqs.json';
import { useLanguage } from '../../context/LanguageContext';
import './FAQSection.css';

export default function FAQSection() {
  const [openId, setOpenId] = useState(faqsData[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useLanguage();

  const toggleFAQ = (id) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  const filteredFaqs = faqsData.filter(faq => {
    const q = searchQuery.toLowerCase();
    return faq.question.toLowerCase().includes(q) ||
           faq.answer.toLowerCase().includes(q) ||
           faq.category.toLowerCase().includes(q);
  });

  return (
    <section id="faq" className="faq-section">
      <div className="site-container">
        <div className="section-header">
          <span className="section-eyebrow">
            <HelpCircle size={14} style={{ display: 'inline', marginRight: '0.4rem' }} />
            {t('faq', 'badge')}
          </span>
          <h2 className="section-title">{t('faq', 'title')}</h2>
          <p className="section-subtitle">{t('faq', 'subtitle')}</p>
        </div>

        {/* Search FAQ */}
        <div className="faq-search-wrap">
          <Search size={18} className="faq-search-icon" />
          <input
            type="text"
            className="faq-search-input"
            placeholder="Filter questions by permits, gear, safety, prices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* FAQs Accordion */}
        <div className="faq-list">
          {filteredFaqs.map(faq => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button
                  className="faq-question-btn"
                  onClick={() => toggleFAQ(faq.id)}
                  aria-expanded={isOpen}
                >
                  <div>
                    <span className="faq-category-tag">{faq.category}</span>
                    <span>{faq.question}</span>
                  </div>
                  <ChevronDown size={18} className={`faq-chevron ${isOpen ? 'rotated' : ''}`} />
                </button>

                {isOpen && (
                  <div className="faq-answer-panel">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No frequently asked questions match "{searchQuery}".
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
