import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: 'fixed',
        bottom: '124px',
        right: '25px',
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        backgroundColor: 'var(--bg-card-solid)',
        border: '1px solid var(--border)',
        color: 'var(--accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-md)',
        zIndex: 800,
        transition: 'all 0.25s ease'
      }}
      title="Back to Top of Summit"
      aria-label="Back to Top"
    >
      <ArrowUp size={18} />
    </button>
  );
}
