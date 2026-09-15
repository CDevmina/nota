'use client';

import { useEffect } from 'react';

/**
 * Adds `is-in` to every element matching `selector` the first time it enters
 * the viewport, and never removes it — the reference does not replay these on
 * the way back up.
 *
 * One observer for a whole section beats a wrapper component per item: it adds
 * no DOM, and the elements keep their own layout classes.
 */
export default function RevealOnEnter({
  selector,
  staggerMs = 120,
}: {
  selector: string;
  staggerMs?: number;
}) {
  useEffect(() => {
    const nodes = [...document.querySelectorAll<HTMLElement>(selector)];
    if (nodes.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach((n) => n.classList.add('is-in'));
      return;
    }

    nodes.forEach((n, i) => {
      n.style.transitionDelay = `${i * staggerMs}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [selector, staggerMs]);

  return null;
}
