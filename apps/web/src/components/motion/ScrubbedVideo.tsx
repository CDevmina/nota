'use client';

import { useEffect, useRef } from 'react';

/**
 * A video whose playhead is driven by scroll rather than by time.
 *
 * This is how the reference moves its hero: the clip never plays on its own,
 * `currentTime` is set from the enclosing stage's progress, so scrolling down
 * pans the camera over the pen and scrolling back up reverses it exactly.
 *
 * Falls back to an ordinary autoplaying loop when there is no stage to read,
 * and to the poster alone under reduced motion — scrubbing is motion tied
 * directly to input, which is the kind most likely to cause discomfort.
 */
export default function ScrubbedVideo({
  src,
  poster,
  className = '',
  label,
}: {
  src: string;
  poster?: string;
  className?: string;
  label?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const stage = video.closest<HTMLElement>('.scroll-stage');
    if (!stage) {
      void video.play().catch(() => {});
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const progress = Number.parseFloat(stage.style.getPropertyValue('--p')) || 0;
      const { duration } = video;
      if (!Number.isFinite(duration) || duration === 0) return;

      // Stop a hair short: seeking exactly to duration makes some browsers
      // fire `ended` and blank the frame.
      video.currentTime = Math.min(duration - 0.05, progress * duration);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    video.addEventListener('loadedmetadata', update);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      video.removeEventListener('loadedmetadata', update);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      className={className}
      muted
      playsInline
      preload="auto"
      aria-label={label}
    />
  );
}
