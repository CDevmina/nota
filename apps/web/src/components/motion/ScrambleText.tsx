'use client';

import { useEffect, useRef } from 'react';

/**
 * Resolves text character by character out of noise, once, on first sight.
 *
 * The reference runs this on the four nav links and both hero headline lines,
 * desktop only — below 992px it simply sets the text visible. Matching that
 * breakpoint matters: on a phone the effect reads as a rendering fault rather
 * than an intro.
 *
 * The real text is rendered server-side and only replaced once the animation
 * starts, so it is present for search engines, for anyone with JavaScript off,
 * and for the whole of the first paint.
 */

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/** Per-character reveal delay. The reference steps at 50ms. */
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
    let observer: IntersectionObserver | null = null;

    const characters = [...text];
    // Whitespace never scrambles — letters jumping around a moving space
    // reads as broken rather than deliberate.
    const startAt = characters.map((c, i) => (c === ' ' ? 0 : delayMs + i * STEP_MS));

    const run = () => {
      const began = performance.now();

      const tick = (now: number) => {
        const elapsed = now - began;
        let settled = 0;

        const out = characters.map((char, i) => {
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

        if (settled < characters.filter((c) => c !== ' ').length) {
          frame = requestAnimationFrame(tick);
        } else {
          el.textContent = text;
        }
      };

      frame = requestAnimationFrame(tick);
    };

    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer?.disconnect();
        run();
      },
      { rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(el);

    return () => {
      observer?.disconnect();
      if (frame) cancelAnimationFrame(frame);
      el.textContent = text;
    };
  }, [text, delayMs]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLSpanElement & HTMLDivElement>}
      className={className}
      // The animation swaps characters of equal count, so the box never
      // reflows mid-run and neighbouring layout stays still.
      style={{ display: 'inline-block' }}
    >
      {text}
    </Tag>
  );
}
