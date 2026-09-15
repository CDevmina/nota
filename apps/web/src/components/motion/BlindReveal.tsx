'use client';

import { useEffect, useRef } from 'react';

/**
 * Horizontal slats retracting left to right to uncover whatever sits beneath.
 *
 * Unlike the full-viewport wipes this one belongs to a single element rather
 * than a scroll stage, so it drives its own progress from that element's
 * position — the box render should uncover as it arrives, not as a separate
 * scroll beat.
 */
export default function BlindReveal({ slats = 8 }: { slats?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--p', '1');
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      // Runs across the last third of the element's approach to centre screen.
      const start = window.innerHeight;
      const end = window.innerHeight * 0.35;
      const progress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);
      el.style.setProperty('--p', progress.toFixed(4));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
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
