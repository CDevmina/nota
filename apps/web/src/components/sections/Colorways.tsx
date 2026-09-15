import type { ColorwaysSection } from '@/lib/types';
import SectionMedia from '../SectionMedia';
import ScrollStage from '../ScrollStage';

/**
 * Sticky-camera morph between colourway states. Each state carries its own
 * gradient and headline colour; crossfading whole panels rather than tweening
 * the gradient keeps it to one compositor-friendly property.
 */
export default function Colorways({ section }: { section: ColorwaysSection }) {
  const items = section.items;
  if (items.length === 0) return null;

  return (
    <section id={section.anchorId ?? undefined} data-surface="dark">
      <ScrollStage screens={items.length + 1} steps={items.length}>
        <div className="camera">
          {items.map((item, i) => (
            <div
              key={item.id}
              data-step={i}
              className="stage-slide grid place-items-center"
              style={{
                background: `linear-gradient(160deg, ${item.gradientStart} 0%, ${item.gradientEnd} 100%)`,
                color: item.textColor,
              }}
            >
              <div className="grid w-full gap-6 px-6 md:px-12">
                <h2 className="display text-center">
                  <span className="block">{item.name}</span>
                  <span className="block opacity-70">{item.tagline}</span>
                </h2>

                {item.media?.image ? (
                  <SectionMedia
                    media={item.media}
                    className="mx-auto max-h-[32svh] w-auto object-contain md:max-h-[42svh]"
                  />
                ) : null}
              </div>
            </div>
          ))}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center gap-2 text-white"
          >
            {items.map((s, i) => (
              <span key={s.id} data-step={i} className="seg" />
            ))}
          </div>
        </div>
      </ScrollStage>
    </section>
  );
}
