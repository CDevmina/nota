import type { FeaturesSection } from '@/lib/types';
import SectionMedia from '../SectionMedia';

/**
 * Sticky-camera carousel. Each slide is a full-height panel; the camera holds
 * still while the tall parent scrolls, so slides advance without a pin.
 */
export default function Features({ section }: { section: FeaturesSection }) {
  return (
    <section id={section.anchorId ?? undefined} className="bg-black text-white">
      {section.slides.map((slide, i) => (
        <div key={slide.id} className="relative min-h-[100svh]">
          <div className="camera grid grid-rows-[auto_1fr_auto] gap-6 p-6 md:p-12">
            <h3 className="display">
              <span className="block">{slide.headlineTop}</span>
              {slide.headlineMiddle ? <span className="block">{slide.headlineMiddle}</span> : null}
              {slide.headlineBottom ? <span className="block">{slide.headlineBottom}</span> : null}
            </h3>

            <div className="relative overflow-hidden">
              <SectionMedia
                media={slide.media}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="ml-auto max-w-md rounded-sm bg-white/10 p-6 backdrop-blur-md">
              <h4 className="card-title">{slide.cardTitle}</h4>
              <p className="spec-item mt-3 text-white/80">{slide.cardBody}</p>
            </div>
          </div>

          {/* Segmented progress, one segment per slide. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center gap-2"
          >
            {section.slides.map((s, j) => (
              <span
                key={s.id}
                className={`h-[2px] w-10 ${j === i ? 'bg-white' : 'bg-white/30'}`}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
