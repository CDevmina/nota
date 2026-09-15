'use client';

import { useEffect, useRef } from 'react';

/**
 * The sticky-camera primitive the whole page is built from.
 *
 * Measured off the reference: every animated section is a tall block, often
 * pulled up by exactly one viewport height so its camera overlaps the section
 * before it, containing a `position: sticky; top: 0; height: 100vh` child. The
 * section's scroll progress drives everything inside. There are no
 * ScrollTrigger pins on the reference at any scroll depth.
 *
 * Below 992px this does nothing at all. That is not a simplification — the
 * reference ships separate mobile markup with no cameras, no negative margins
 * and no scroll choreography whatsoever, and its hero sequence sits frozen on
 * frame 0. Matching that exactly is the point.
 */
export default function ScrollStage({
  screens,
  pullUpVh = 0,
  steps,
  className = '',
  children,
}: {
  /** Section height in viewport heights, from the measured spec. */
  screens: number;
  /** Negative top margin in viewport heights, so this camera overlaps the last. */
  pullUpVh?: number;
  /** Optional step count; drives `data-index` for stepped sections. */
  steps?: number;
  className?: string;
  children: React.ReactNode;
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
      const travel = rect.height - window.innerHeight;
      const progress = travel <= 0 ? 0 : Math.min(Math.max(-rect.top / travel, 0), 1);

      el.style.setProperty('--p', progress.toFixed(4));

      if (steps && steps > 1) {
        const index = Math.min(steps - 1, Math.floor(progress * steps * 0.999));
        if (el.dataset.index !== String(index)) el.dataset.index = String(index);
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    const apply = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      window.removeEventListener('scroll', onScroll);

      if (!desktop.matches || still.matches) {
        // Resting state: first step visible, effects at their finished value.
        el.style.setProperty('--p', still.matches ? '1' : '0');
        el.dataset.index = '0';
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
  }, [steps]);

  return (
    <div
      ref={ref}
      data-index="0"
      className={`scroll-stage relative ${className}`}
      style={{
        ['--screens' as string]: screens,
        ['--pull-up' as string]: pullUpVh,
      }}
    >
      {children}
    </div>
  );
}
