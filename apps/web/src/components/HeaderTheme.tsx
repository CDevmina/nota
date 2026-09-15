'use client';

import { useEffect } from 'react';

/**
 * Inverts the header's colour over light sections.
 *
 * The reference does this desktop-only, switching the nav, the wordmark and the
 * icons as you scroll. Rather than hard-coding scroll offsets the way it does —
 * which breaks the moment an editor reorders the dynamic zone — this reads the
 * `data-surface` of whatever section currently sits under the header, so the
 * behaviour follows the content.
 *
 * Writes a class on <html> instead of React state so the header itself stays a
 * Server Component and no section re-renders on scroll.
 */
export default function HeaderTheme() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;

    const update = () => {
      frame = 0;
      const headerHeight = parseInt(
        getComputedStyle(root).getPropertyValue('--header-h') || '113',
        10,
      );

      // Sample just below the header's own bottom edge, inset from the left so
      // we never hit a centred element that happens to overhang.
      const el = document.elementFromPoint(24, headerHeight + 8);
      const surface = el?.closest<HTMLElement>('[data-surface]')?.dataset.surface;

      root.classList.toggle('header-on-light', surface === 'light');
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
      root.classList.remove('header-on-light');
    };
  }, []);

  return null;
}
