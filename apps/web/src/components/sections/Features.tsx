import type { FeaturesSection } from '@/lib/types';
import SectionMedia from '../SectionMedia';
import ScrollStage from '../ScrollStage';

/**
 * Sticky-camera carousel: one stage, one camera, slides crossfading as the
 * stage's scroll progress steps through them. The reference gives each slide
 * roughly a screen of scroll, with the camera held still throughout.
 */
export default function Features({ section }: { section: FeaturesSection }) {
  const slides = section.slides;
  if (slides.length === 0) return null;

  return (
    <section id={section.anchorId ?? undefined} data-surface="dark" className="bg-black text-white">
      <ScrollStage screens={slides.length + 1} steps={slides.length}>
        <div className="camera">
          {slides.map((slide, i) => (
            <article key={slide.id} data-step={i} className="stage-slide">
              <div className="absolute inset-0">
                <SectionMedia media={slide.media} className="h-full w-full object-cover opacity-70" />
              </div>

              <div className="relative grid h-full grid-rows-[auto_1fr_auto] p-6 md:p-12">
                <h3 className="display max-w-4xl text-balance">
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
            className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center gap-2 text-white"
          >
            {slides.map((s, i) => (
              <span key={s.id} data-step={i} className="seg" />
            ))}
          </div>
        </div>
      </ScrollStage>
    </section>
  );
}
