import { useEffect, useState, useRef } from 'react';

export function useKeyboardShortcuts({
  onOpenSearch,
  onOpenProfile,
  onOpenWishlist,
  onOpenHelp,
  onOpenLostClimber,
  onCloseAll
}) {
  const [lastKey, setLastKey] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is currently typing in an input, textarea or contentEditable element
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable) {
        if (e.key === 'Escape') {
          e.target.blur();
          if (onCloseAll) onCloseAll();
        }
        return;
      }

      // 1. Single Key Shortcuts
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        if (onOpenHelp) onOpenHelp();
        return;
      }

      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (onOpenSearch) onOpenSearch();
        return;
      }

      if (e.key === 'Escape') {
        if (onCloseAll) onCloseAll();
        return;
      }

      // 2. Sequence Shortcuts ("g then ...")
      const key = e.key.toLowerCase();

      if (lastKey === 'g') {
        if (key === 'h') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (key === 'e') {
          document.querySelector('#packages')?.scrollIntoView({ behavior: 'smooth' });
        } else if (key === 'm') {
          document.querySelector('#mountain-finder')?.scrollIntoView({ behavior: 'smooth' });
        } else if (key === 't') {
          document.querySelector('#alpine-tools')?.scrollIntoView({ behavior: 'smooth' });
        } else if (key === 'p') {
          document.querySelector('#places')?.scrollIntoView({ behavior: 'smooth' });
        } else if (key === 'v') {
          document.querySelector('#videos')?.scrollIntoView({ behavior: 'smooth' });
        } else if (key === 'g') {
          document.querySelector('#gallery')?.scrollIntoView({ behavior: 'smooth' });
        } else if (key === 'k') {
          document.querySelector('#knowledge')?.scrollIntoView({ behavior: 'smooth' });
        } else if (key === '4') {
          if (onOpenLostClimber) onOpenLostClimber();
        }
        setLastKey(null);
        clearTimeout(timerRef.current);
        return;
      }

      if (key === 'g') {
        setLastKey('g');
        clearTimeout(timerRef.current);
        // Wait 1.5s for the second key in the sequence
        timerRef.current = setTimeout(() => {
          setLastKey(null);
        }, 1500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timerRef.current);
    };
  }, [lastKey, onOpenSearch, onOpenProfile, onOpenWishlist, onOpenHelp, onOpenLostClimber, onCloseAll]);

  return { lastKey };
}
