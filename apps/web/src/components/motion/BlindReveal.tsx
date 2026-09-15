'use client';

import { useEffect, useRef } from 'react';

/**
 * Horizontal slats retracting to uncover whatever sits beneath.
 *
 * Measured on the reference: each `inside__blinds-item` carries **25** slats of
 * equal height (820px / 25 = 32.8px), full width, and they thin out rather than
 * sliding away — the image appears in bands that widen until they meet.
 *
 * This belongs to a single element rather than a scroll stage, so it measures
 * its own approach to centre screen: the render should uncover as it arrives,
 * not as a separate scroll beat.
 *
 * `diagonal` offsets each slat's start by its index instead of retracting them
 * together, so the uncovered edge travels across the card at an angle. The
 * reference uses that variant on the two product cards and the flat one on the
 * full-width box photo.
 */
export default function BlindReveal({
  slats = 25,
  diagonal = false,
}: {
  slats?: number;
  diagonal?: boolean;
}) {
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
    <div
      ref={ref}
      aria-hidden="true"
      className="blind"
      data-diagonal={diagonal ? '' : undefined}
      style={{ ['--slats' as string]: slats }}
    >
      {Array.from({ length: slats }).map((_, i) => (
        <div key={i} className="blind-slat" style={{ ['--i' as string]: i }} />
      ))}
    </div>
  );
}
