'use client';

import { useEffect, useRef } from 'react';

/**
 * Resolves text character by character out of noise, once, on first sight.
 *
 * The reference runs this on the four nav links and both hero headline lines,
 * building `scramble-base` / `scramble-ghost` / `scramble-ghost2` layers per
 * element. Below 992px it sets the text visible and marks it done without ever
 * animating — on a phone the effect reads as a rendering fault, not an intro.
 *
 * The real text renders server-side and is only replaced once the animation
 * starts, so it is present for search engines, for JavaScript-off readers, and
 * throughout the first paint.
 */

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const STEP_MS = 50;
const SETTLE_MS = 260;

export default function ScrambleText({
  text,
  className = '',
  delayMs = 0,
  as: Tag = 'span',
}: {
  text: string;
  className?: string;
  delayMs?: number;
  as?: 'span' | 'div';
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.innerWidth < 992) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const chars = [...text];
    const startAt = chars.map((c, i) => (c === ' ' ? 0 : delayMs + i * STEP_MS));
    const settleCount = chars.filter((c) => c !== ' ').length;

    const run = () => {
      const began = performance.now();
      const tick = (now: number) => {
        const elapsed = now - began;
        let settled = 0;
        const out = chars.map((char, i) => {
          if (char === ' ') return ' ';
          const age = elapsed - startAt[i];
          if (age >= SETTLE_MS) {
            settled += 1;
            return char;
          }
          if (age < 0) return ' ';
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        });
        el.textContent = out.join('');
        if (settled < settleCount) frame = requestAnimationFrame(tick);
        else el.textContent = text;
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        run();
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
      el.textContent = text;
    };
  }, [text, delayMs]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLSpanElement & HTMLDivElement>}
      className={className}
      // A div line is block so consecutive lines stack; a span stays inline so
      // it can sit inside running text. Both were inline-block, which ran the
      // two hero lines together into "Smart penfor real thinking".
      style={{ display: Tag === 'div' ? 'block' : 'inline-block' }}
    >
      {text}
    </Tag>
  );
}
