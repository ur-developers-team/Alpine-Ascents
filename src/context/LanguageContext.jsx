import React, { createContext, useContext, useState, useEffect } from 'react';
import translationsData from '../data/translations.json';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('alpine_lang') || 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('alpine_lang', language);
    } catch (e) {
      console.warn('Unable to persist language:', e);
    }
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
    if (language === 'ur') {
      document.body.classList.add('lang-urdu');
    } else {
      document.body.classList.remove('lang-urdu');
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => {
      const next = prev === 'en' ? 'ur' : 'en';
      window.dispatchEvent(new CustomEvent('alpine-toast', {
        detail: {
          message: next === 'ur' ? 'اردو زبان منتخب کی گئی (Urdu Language Active)' : 'Language switched to English (EN)',
          type: 'language'
        }
      }));
      return next;
    });
  };

  const t = (section, key) => {
    const langDict = translationsData[language] || translationsData['en'];
    if (langDict && langDict[section] && langDict[section][key] !== undefined) {
      return langDict[section][key];
    }
    // Fallback to English
    const fallback = translationsData['en'];
    if (fallback && fallback[section] && fallback[section][key] !== undefined) {
      return fallback[section][key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
