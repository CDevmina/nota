'use client';

import { useEffect, useRef } from 'react';

/**
 * Fades and lifts its children in once, the first time they enter the viewport.
 *
 * `once: true` matches the reference, which never replays a reveal on the way
 * back up. Reduced motion is handled in CSS — the element simply starts in its
 * resting state — so this observer becomes a no-op rather than a special case.
 */
export default function Reveal({
  children,
  delayMs = 0,
  className = '',
}: {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-in');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add('is-in');
        observer.disconnect();
      },
      { rootMargin: '0px 0px -15% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delayMs}ms` }}>
      {children}
    </div>
  );
}
