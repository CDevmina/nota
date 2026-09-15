'use client';

import { useEffect, useRef } from 'react';

/**
 * Text that writes itself in character by character as it passes the viewport.
 *
 * The reference uses this twice with different palettes: the manifesto lightens
 * from #666666 to white on black, and the "inside the box" paragraph resolves
 * from near-white to black on white. Same mechanism, swapped colours.
 *
 * Unlike the manifesto, this one is not inside a scroll stage, so it measures
 * its own position: progress runs from the moment the element enters the bottom
 * of the viewport to the moment it reaches the upper third. One rAF-throttled
 * scroll listener writes `--p`; the colour of every character is a `color-mix`
 * driven by it, so no JavaScript touches the spans per frame.
 */
export default function ScrubReveal({
  text,
  from,
  to,
  className = '',
}: {
  text: string;
  /** Colour before a character resolves. */
  from: string;
  /** Colour once it has. */
  to: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

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
      const end = window.innerHeight * 0.3;
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

  const chars = [...text];

  return (
    <p
      ref={ref}
      className={className}
      style={
        {
          '--chars': chars.length,
          '--scrub-from': from,
          '--scrub-to': to,
        } as React.CSSProperties
      }
    >
      {chars.map((char, i) => (
        <span key={i} className="scrub-char" style={{ ['--i' as string]: i }} aria-hidden={i > 0}>
          {char}
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </p>
  );
}
