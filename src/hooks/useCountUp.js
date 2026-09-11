import { useState, useEffect, useRef } from 'react';

/**
 * Animated counter hook that triggers when the element enters the viewport.
 * Uses requestAnimationFrame and easeOutExpo for smooth deceleration.
 * Respects prefers-reduced-motion.
 * 
 * @param {number} targetValue - The final number to reach
 * @param {Object} options
 * @param {number} options.duration - Duration in ms (default: 1800)
 * @param {number} options.start - Start value (default: 0)
 * @param {string} options.separator - Thousands separator (default: ',')
 * @returns {{ count: string, ref: React.RefObject, hasTriggered: boolean }}
 */
export function useCountUp(targetValue, { duration = 1800, start = 0, separator = ',' } = {}) {
  const [count, setCount] = useState(start);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCount(targetValue);
      setHasTriggered(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggered) {
            setHasTriggered(true);

            const startTime = performance.now();
            const numericTarget = typeof targetValue === 'number' ? targetValue : parseFloat(targetValue) || 0;
            const numericStart = typeof start === 'number' ? start : parseFloat(start) || 0;

            const update = (now) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              
              // easeOutExpo
              const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
              const currentVal = Math.round(numericStart + (numericTarget - numericStart) * easedProgress);

              setCount(currentVal);

              if (progress < 1) {
                requestAnimationFrame(update);
              } else {
                setCount(numericTarget);
              }
            };

            requestAnimationFrame(update);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [targetValue, duration, start, hasTriggered]);

  const formattedCount = typeof count === 'number' && separator 
    ? count.toLocaleString('en-US') 
    : count;

  return { count: formattedCount, rawCount: count, ref: elementRef, hasTriggered };
}

export default useCountUp;
