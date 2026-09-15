import type { ColorwaysSection } from '@/lib/types';
import SectionMedia from '../SectionMedia';

/**
 * Sticky-camera morph between colourway states. Each state is a full-height
 * panel carrying its own gradient, so the background changes as you scroll
 * without any JS driving it.
 */
export default function Colorways({ section }: { section: ColorwaysSection }) {
  return (
    <section id={section.anchorId ?? undefined}>
      {section.items.map((item, i) => (
        <div key={item.id} className="relative min-h-[100svh]">
          <div
            className="camera grid place-items-center"
            style={{
              background: `linear-gradient(160deg, ${item.gradientStart} 0%, ${item.gradientEnd} 100%)`,
              color: item.textColor,
            }}
          >
            <div className="grid w-full gap-8 px-6 md:px-12">
              <h2 className="display text-center">
                <span className="block">{item.name}</span>
                <span className="block opacity-70">{item.tagline}</span>
              </h2>

              {item.media?.image ? (
                <div className="mx-auto max-h-[45svh] w-full max-w-3xl">
                  <SectionMedia
                    media={item.media}
                    className="mx-auto max-h-[45svh] w-auto object-contain"
                  />
                </div>
              ) : null}
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center gap-2"
            >
              {section.items.map((s, j) => (
                <span
                  key={s.id}
                  className="h-[2px] w-10"
                  style={{
                    background: item.textColor,
                    opacity: j === i ? 1 : 0.3,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
