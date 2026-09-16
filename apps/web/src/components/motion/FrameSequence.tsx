'use client';

import { useEffect, useRef, useState } from 'react';
import type { StrapiImage } from '@/lib/types';

/**
 * A scroll-scrubbed image sequence — the reference's hero, rebuilt.
 *
 * The reference ships this as a Lottie carrying 75 embedded WebP frames, played
 * by setting the frame index from scroll and never running the clip: measured,
 * `frame = round(progress * 75)`, exactly linear.
 *
 * Two things matter for this to feel smooth:
 *
 * 1. Nothing goes through React state while scrolling. Swapping the visible
 *    frame is two `style.display` writes against refs; driving it through
 *    `setState` re-rendered all seventy-five elements every frame, which is
 *    what made the hero stutter.
 * 2. Progress is measured from the stage's own geometry rather than read back
 *    from its `--p` property. Child effects mount before parent ones, so this
 *    component's callback runs before ScrollStage has written that value.
 *
 * Below 992px the reference freezes its sequence on frame 0, so only the first
 * frame is rendered at all and a phone never downloads the other seventy-four.
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
  const hostRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const shownRef = useRef(0);
  const [animated, setAnimated] = useState(false);
  const [ready, setReady] = useState(false);

  // Decided once, before any scrolling: whether this viewport animates at all.
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 992px)');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');
    const decide = () => setAnimated(desktop.matches && !still.matches);

    decide();
    desktop.addEventListener('change', decide);
    still.addEventListener('change', decide);
    return () => {
      desktop.removeEventListener('change', decide);
      still.removeEventListener('change', decide);
    };
  }, []);

  // Every frame is decoded before scrubbing begins. Without this the sequence
  // jumps to a frame the browser has fetched but not yet decoded, and paints
  // nothing — which reads as black flashes through the animation.
  useEffect(() => {
    if (!animated || frames.length < 2) return;
    let cancelled = false;

    Promise.allSettled(
      frames.map((f) => {
        const img = new Image();
        img.src = f.url;
        return img.decode === undefined ? Promise.resolve() : img.decode();
      }),
    ).then(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [animated, frames]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !animated || !ready || frames.length < 2) return;

    const stage = host.closest<HTMLElement>('.scroll-stage');
    if (!stage) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = stage.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = travel <= 0 ? 0 : Math.min(Math.max(-rect.top / travel, 0), 1);
      const next = Math.min(frames.length - 1, Math.round(p * (frames.length - 1)));

      if (next === shownRef.current) return;

      const previous = imgRefs.current[shownRef.current];
      const incoming = imgRefs.current[next];
      if (previous) previous.style.display = 'none';
      if (incoming) incoming.style.display = 'block';
      shownRef.current = next;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [animated, ready, frames.length]);

  if (frames.length === 0) return null;

  // Only the first frame exists until we know this viewport animates, so a
  // phone downloads one image instead of seventy-five.
  const rendered = animated ? frames : frames.slice(0, 1);

  return (
    <div ref={hostRef} className={className}>
      {rendered.map((f, i) => (
        // next/image is deliberately not used here. Strapi serves these from a
        // separate origin whose domain changes per environment, so the
        // optimiser would need a next.config allowlist tied to the deploy —
        // and these frames are pre-sized and swapped by display, which the
        // optimiser's lazy loading would fight.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={f.url}
          ref={(el) => {
            imgRefs.current[i] = el;
          }}
          src={f.url}
          alt={i === 0 ? alt : ''}
          aria-hidden={i === 0 ? undefined : true}
          width={f.width}
          height={f.height}
          // Frame 0 is the LCP candidate. The rest are fetched at low priority
          // so they are decoded and ready before the sequence reaches them —
          // lazy loading would leave gaps during a fast scroll.
          loading="eager"
          fetchPriority={i === 0 ? 'high' : 'low'}
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ display: i === 0 ? 'block' : 'none' }}
        />
      ))}
    </div>
  );
}
