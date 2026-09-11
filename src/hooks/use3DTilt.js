import { useRef, useEffect } from 'react';

/**
 * Hook to add subtle, high-performance 3D tilt interaction to cards.
 * Automatically disabled on mobile/touch devices and when prefers-reduced-motion is active.
 * 
 * @param {Object} options
 * @param {number} options.max - Maximum rotation in degrees (default: 8)
 * @param {number} options.perspective - CSS perspective (default: 1000px)
 * @param {number} options.scale - Subtle scale on hover (default: 1.02)
 * @param {number} options.speed - Transition speed in ms (default: 350)
 * @returns {React.RefObject}
 */
export function use3DTilt({ max = 8, perspective = 1000, scale = 1.02, speed = 350 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check if device supports fine pointer (mouse) and user hasn't requested reduced motion
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canHover || prefersReducedMotion) return;

    let rafId = null;

    const handleMouseMove = (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within element
        const y = e.clientY - rect.top;  // y position within element
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -max;
        const rotateY = ((x - centerX) / centerX) * max;

        el.style.transform = `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;
        el.style.transition = 'transform 80ms ease-out';
        el.style.willChange = 'transform';
      });
    };

    const handleMouseLeave = () => {
      if (rafId) cancelAnimationFrame(rafId);
      el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      el.style.transition = `transform ${speed}ms cubic-bezier(0.23, 1, 0.32, 1)`;
    };

    const handleMouseEnter = () => {
      el.style.transition = 'transform 100ms ease-out';
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.style.transform = '';
      el.style.transition = '';
      el.style.willChange = '';
    };
  }, [max, perspective, scale, speed]);

  return ref;
}

export default use3DTilt;
