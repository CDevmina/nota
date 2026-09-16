'use client';

import { useEffect } from 'react';

/**
 * Two header behaviours the reference has and we did not.
 *
 * It hides on scroll down and comes back on scroll up. Beyond matching, this
 * removes most of the overlap problems on its own: the header has no background
 * bar, so anything scrolling beneath a permanently visible one runs through the
 * links.
 *
 * And it flips between light and dark by reading the `data-surface` of whatever
 * section sits under it — a hard switch rather than a fade, since fading leaves
 * the wordmark half-transparent and invisible over white.
 *
 * Both write classes on <html>, so the header stays a Server Component and
 * nothing re-renders while scrolling.
 */
export default function HeaderChrome() {
  useEffect(() => {
    const root = document.documentElement;
    const desktop = window.matchMedia('(min-width: 992px)');

    let frame = 0;
    let lastY = window.scrollY;

    const update = () => {
      frame = 0;
      const y = window.scrollY;

      // Hide going down, show going up. The 6px dead zone stops trackpad
      // jitter from flapping the header at rest.
      if (Math.abs(y - lastY) > 6) {
        const hide = y > lastY && y > 160;
        root.classList.toggle('header-hidden', hide);
        lastY = y;
      }

      const headerHeight = parseInt(
        getComputedStyle(root).getPropertyValue('--header-h') || '96',
        10,
      );
      // elementsFromPoint, not elementFromPoint: the header is fixed at the top,
      // so a hit test at this point returns the header itself, which carries no
      // `data-surface`. That read `undefined` every time and left the links
      // white on white sections. Take the first hit that is not the header.
      const header = root.querySelector('.site-header');
      const behind = document
        .elementsFromPoint(28, headerHeight / 2)
        .find((node) => !header?.contains(node));
      const surface = behind?.closest<HTMLElement>('[data-surface]')?.dataset.surface;
      root.classList.toggle('header-on-light', surface === 'light');
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    const apply = () => {
      window.removeEventListener('scroll', onScroll);
      root.classList.remove('header-hidden');
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
      root.classList.remove('header-hidden', 'header-on-light');
    };
  }, []);

  return null;
}
