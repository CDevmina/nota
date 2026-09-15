'use client';

import { useEffect, useRef, useState } from 'react';
import type { StrapiImage } from '@/lib/types';

/**
 * A scroll-scrubbed image sequence — the reference's hero, rebuilt.
 *
 * The reference ships this as a Lottie containing 75 embedded WebP frames,
 * played by setting the frame index from scroll and never running the clip:
 * measured, `frame = round(progress * 75)`, exactly linear. Rendering the
 * frames ourselves costs one <img> swap instead of 1.7MB of JSON plus the
 * Lottie runtime, and each frame caches normally.
 *
 * Below 992px the reference freezes its sequence on frame 0 and never moves it.
 * We do the same, so a phone pays for one image rather than seventy-five.
 */
export default function FrameSequence({
  frames,
  alt,
  className = '',
}: {
  frames: StrapiImage[];
  alt: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || frames.length < 2) return;

    const desktop = window.matchMedia('(min-width: 992px)');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    const stage = el.closest<HTMLElement>('.scroll-stage');

    let frame = 0;

    const update = () => {
      frame = 0;
      const p = Number.parseFloat(stage?.style.getPropertyValue('--p') ?? '0') || 0;
      setIndex(Math.min(frames.length - 1, Math.round(p * (frames.length - 1))));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    const apply = () => {
      const on = desktop.matches && !still.matches;
      setAnimated(on);
      window.removeEventListener('scroll', onScroll);
      if (!on) {
        setIndex(0);
        return;
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      update();
    };

    apply();
    desktop.addEventListener('change', apply);
    still.addEventListener('change', apply);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      desktop.removeEventListener('change', apply);
      still.removeEventListener('change', apply);
    };
  }, [frames.length]);

  if (frames.length === 0) return null;

  return (
    <div ref={ref} className={className}>
      {/* Every frame is in the DOM but only the current one is painted.
          Toggling visibility beats swapping one img's src, which flashes
          empty on each change until the new frame decodes. */}
      {frames.map((f, i) => (
        <img
          key={f.url}
          src={f.url}
          alt={i === 0 ? alt : ''}
          aria-hidden={i === 0 ? undefined : true}
          width={f.width}
          height={f.height}
          loading={i === 0 ? 'eager' : 'lazy'}
          fetchPriority={i === 0 ? 'high' : 'low'}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ display: i === index || (!animated && i === 0) ? 'block' : 'none' }}
        />
      ))}
    </div>
  );
}
