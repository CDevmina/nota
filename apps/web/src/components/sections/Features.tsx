import type { CSSProperties } from 'react';
import type { FeaturesSection } from '@/lib/types';
import SectionMedia from '../SectionMedia';
import ScrollStage from '../ScrollStage';

/**
 * Feature carousel — 6 screens, four slides.
 *
 * Measured: each slide's image scales 1.4 → 1 as it becomes active and
 * continues to 0.6 as it leaves, crossfading throughout — a zoom-through, not
 * a plain fade. At the very end of the section the headline, card and
 * pagination all fade out together.
 */
export default function Features({ section }: { section: FeaturesSection }) {
  const slides = section.slides;
  if (slides.length === 0) return null;

  return (
    <section id={section.anchorId ?? undefined} data-surface="dark" className="bg-black text-white">
      <ScrollStage screens={6}>
        <div className="camera">
          {slides.map((slide, i) => (
            <article
              key={slide.id}
              className="slide"
              style={{ ["--i"]: i, ["--last"]: slides.length - 1 } as CSSProperties}
            >
              <div className="absolute inset-0 overflow-hidden">
                <SectionMedia
                  media={slide.media}
                  className="slide-media h-full w-full object-cover opacity-80"
                />
              </div>

              <div className="stage-fade-out relative grid h-full grid-rows-[auto_1fr_auto] px-6 pb-16 pt-[calc(var(--header-h)+2rem)] md:px-12">
                <h3 className="display-mid max-w-[34%] text-balance">
                  <span className="block">{slide.headlineTop}</span>
                  {slide.headlineMiddle ? <span className="block">{slide.headlineMiddle}</span> : null}
                  {slide.headlineBottom ? <span className="block">{slide.headlineBottom}</span> : null}
                </h3>

                <div aria-hidden="true" />

                <div className="w-full bg-white/10 p-5 backdrop-blur-md md:ml-auto md:w-auto md:max-w-md md:p-6">
                  <h4 className="card-title">{slide.cardTitle}</h4>
                  <p className="spec-item mt-3 text-white/85">{slide.cardBody}</p>
                </div>
              </div>
            </article>
          ))}

          <div
            aria-hidden="true"
            className="stage-fade-out pointer-events-none absolute inset-x-0 bottom-6 flex justify-center gap-2 text-white"
          >
            {slides.map((s, i) => (
              <span
                key={s.id}
                className="seg"
                style={{ ["--i"]: i, ["--last"]: slides.length - 1 } as CSSProperties}
              />
            ))}
          </div>
        </div>
      </ScrollStage>
    </section>
  );
}
