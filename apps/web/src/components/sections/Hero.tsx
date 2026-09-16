import type { HeroSection } from '@/lib/types';
import SectionMedia from '../SectionMedia';
import ScrollStage from '../ScrollStage';
import FrameSequence from '../motion/FrameSequence';
import ScrambleText from '../motion/ScrambleText';

/**
 * Hero — a scroll-scrubbed frame sequence behind a two-line display headline.
 *
 * 2.7 screens, matching the reference's `cover` section. The sequence runs its
 * full length across that scroll; the headline stays put in the camera.
 */
export default function Hero({ section }: { section: HeroSection }) {
  const frames = section.frames ?? [];

  return (
    <section
      id={section.anchorId ?? undefined}
      data-surface="dark"
      className="bg-[#2a2c30]"
    >
      <ScrollStage screens={2.7}>
        <div className="camera">
          {frames.length > 1 ? (
            <FrameSequence
              frames={frames}
              alt={section.media?.alt ?? ''}
              className="absolute inset-0"
            />
          ) : (
            <SectionMedia media={section.media} priority className="h-full w-full object-cover" />
          )}

          <h1 className="display absolute inset-x-0 bottom-[5svh] px-6 text-center text-white md:bottom-8 md:px-12 md:text-left">
            <ScrambleText as="div" text={section.headlineTop} />
            <ScrambleText as="div" text={section.headlineBottom} delayMs={140} />
          </h1>
        </div>
      </ScrollStage>
    </section>
  );
}
