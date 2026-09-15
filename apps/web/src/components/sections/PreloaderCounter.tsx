'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Counts 0 → 100 then lifts away. The reference runs 1400ms on easeInOutQuart
 * and renders the value with a space before the percent sign.
 *
 * Under reduced motion it never shows — there is nothing to communicate to
 * someone who has asked for no animation, and a curtain that has to lift is
 * worse than no curtain.
 */
export default function PreloaderCounter({
  durationMs,
  suffix,
  anchorId,
}: {
  durationMs: number;
  suffix: string;
  anchorId: string | null;
}) {
  const [value, setValue] = useState(0);
  const [gone, setGone] = useState(false);
  const frame = useRef<number>(0);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setGone(true);
      return;
    }

    const start = performance.now();
    // easeInOutQuart, matching the reference's counter config.
    const ease = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);

    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      setValue(Math.round(ease(t) * 100));
      if (t < 1) {
        frame.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setGone(true), 220);
      }
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [durationMs]);

  if (gone) return null;

  return (
    <div
      id={anchorId ?? undefined}
      aria-hidden="true"
      className="fixed inset-0 z-[200] grid place-items-center transition-transform duration-500 ease-out"
      style={{
        background: 'radial-gradient(circle at 50% 45%, #4a4a4a 0%, #1a1a1a 70%)',
        transform: value >= 100 ? 'translateY(-100%)' : 'translateY(0)',
      }}
    >
      <span className="display text-white tabular-nums">
        {value} {suffix}
      </span>
    </div>
  );
}
