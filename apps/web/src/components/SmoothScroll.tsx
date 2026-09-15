'use client';

import { useEffect } from 'react';

/**
 * Lenis, desktop only.
 *
 * The reference gates smooth scroll at 992px and leaves touch devices on native
 * scrolling — matching that exactly, including the breakpoint. Loaded lazily so
 * mobile never pays for the bytes.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.innerWidth < 992) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let frame = 0;
    let cancelled = false;

    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return;

      // Values read off the reference's own Lenis config.
      lenis = new Lenis({
        duration: 1.2,
        lerp: 0.08,
        wheelMultiplier: 1,
        smoothWheel: true,
        touchMultiplier: 1,
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      lenis?.destroy();
    };
  }, []);

  return null;
}
