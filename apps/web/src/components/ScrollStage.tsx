'use client';

import { useEffect, useRef } from 'react';

/**
 * The sticky-camera primitive every scroll effect on this page is built from.
 *
 * A tall outer element scrolls past a `100svh` child that holds still. This
 * writes the outer element's scroll progress to `--p` (0 → 1) and, when the
 * stage has steps, the current step to `data-index`. Children animate from
 * those two values in CSS.
 *
 * This is how the reference does it — 15 sticky containers, no ScrollTrigger
 * pins anywhere on the page. No pin means no pin-spacer, no layout reflow on
 * refresh, and none of the iOS viewport-unit breakage pinning causes.
 *
 * Under reduced motion the stage collapses to its natural height and reports
 * itself finished, so every child renders in its resting state.
 */
export default function ScrollStage({
  screens,
  steps,
  className = '',
  children,
}: {
  /** Height of the stage in viewport-heights. More screens = slower playback. */
  screens: number;
  /** Optional step count; drives `data-index` for carousels. */
  steps?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--p', '1');
      el.dataset.index = '0';
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = travel <= 0 ? 0 : Math.min(Math.max(-rect.top / travel, 0), 1);

      el.style.setProperty('--p', progress.toFixed(4));

      if (steps && steps > 1) {
        // Bias slightly so a step holds through its own window rather than
        // flipping at the exact boundary.
        const index = Math.min(steps - 1, Math.floor(progress * steps * 0.999));
        if (el.dataset.index !== String(index)) el.dataset.index = String(index);
      }
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
  }, [steps]);

  return (
    <div
      ref={ref}
      data-index="0"
      className={`scroll-stage relative ${className}`}
      style={{ ['--screens' as string]: screens }}
    >
      {children}
    </div>
  );
}
