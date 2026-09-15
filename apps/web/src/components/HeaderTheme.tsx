'use client';

import { useEffect } from 'react';

/**
 * Inverts the header's colour over light sections.
 *
 * The reference does this desktop-only, driving it from overall scroll
 * percentage. Reading the `data-surface` of whatever section currently sits
 * under the header gives the same result without hard-coding offsets, so it
 * keeps working when an editor reorders the dynamic zone — which is the whole
 * reason the zone exists.
 *
 * Writes a class on <html> rather than React state, so the header stays a
 * Server Component and nothing re-renders on scroll.
 */
export default function HeaderTheme() {
  useEffect(() => {
    const root = document.documentElement;
    const desktop = window.matchMedia('(min-width: 992px)');
    let frame = 0;

    const update = () => {
      frame = 0;
      const headerHeight = parseInt(
        getComputedStyle(root).getPropertyValue('--header-h') || '113',
        10,
      );
      const el = document.elementFromPoint(24, headerHeight + 8);
      const surface = el?.closest<HTMLElement>('[data-surface]')?.dataset.surface;
      root.classList.toggle('header-on-light', surface === 'light');
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    const apply = () => {
      window.removeEventListener('scroll', onScroll);
      if (!desktop.matches) {
        root.classList.remove('header-on-light');
        return;
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      update();
    };

    apply();
    desktop.addEventListener('change', apply);
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      desktop.removeEventListener('change', apply);
      root.classList.remove('header-on-light');
    };
  }, []);

  return null;
}
