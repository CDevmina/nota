'use client';

import { useEffect, useRef } from 'react';

/**
 * Horizontal slats retracting to uncover whatever sits beneath.
 *
 * This belongs to a single element rather than a scroll stage, so it measures
 * its own approach to centre screen: the render should uncover as it arrives,
 * not as a separate scroll beat. Staggering each slat by its index reveals the
 * image in bands rather than all at once.
 */
export default function BlindReveal({ slats = 8 }: { slats?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const desktop = window.matchMedia('(min-width: 992px)');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const start = window.innerHeight;
      const end = window.innerHeight * 0.35;
      const p = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);
      el.style.setProperty('--p', p.toFixed(4));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    const apply = () => {
      window.removeEventListener('scroll', onScroll);
      if (!desktop.matches || still.matches) {
        el.style.setProperty('--p', '1');
        return;
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      update();
    };

    apply();
    desktop.addEventListener('change', apply);
    still.addEventListener('change', apply);
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      desktop.removeEventListener('change', apply);
      still.removeEventListener('change', apply);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="blind" style={{ ['--slats' as string]: slats }}>
      {Array.from({ length: slats }).map((_, i) => (
        <div key={i} className="blind-slat" style={{ ['--i' as string]: i }} />
      ))}
    </div>
  );
}
