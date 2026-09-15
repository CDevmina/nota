import type { HeroSection } from '@/lib/types';
import SectionMedia from '../SectionMedia';
import ScrollStage from '../ScrollStage';
import ScrubbedVideo from '../motion/ScrubbedVideo';
import ScrambleText from '../motion/ScrambleText';

/**
 * Full-bleed pen render with a two-line display headline.
 *
 * When the editor supplied a video it is scrubbed by scroll rather than played,
 * matching the reference's camera move over the pen. The stage is deliberately
 * short — two screens — because the hero is the first thing a visitor meets and
 * a long scroll before anything changes reads as a stall.
 */
export default function Hero({ section }: { section: HeroSection }) {
  const video = section.media?.video?.url;
  const poster = section.media?.poster?.url ?? section.media?.image?.url ?? undefined;

  return (
    <section id={section.anchorId ?? undefined} data-surface="dark" className="bg-[#2a2c30]">
      <ScrollStage screens={video ? 2.5 : 1}>
        <div className="camera !p-0">
          <div className="absolute inset-0">
            {video ? (
              <ScrubbedVideo
                src={video}
                poster={poster}
                label={section.media?.alt}
                className="h-full w-full object-cover"
              />
            ) : (
              <SectionMedia media={section.media} priority className="h-full w-full object-cover" />
            )}
          </div>

          <h1 className="display absolute inset-x-0 bottom-[8svh] px-6 text-center text-white md:bottom-16 md:px-12 md:text-left">
            <ScrambleText as="div" text={section.headlineTop} />
            <ScrambleText as="div" text={section.headlineBottom} delayMs={140} />
          </h1>
        </div>
      </ScrollStage>
    </section>
  );
}
