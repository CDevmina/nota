import type { CSSProperties } from 'react';
import type { ColorwaysSection } from '@/lib/types';
import SectionMedia from '../SectionMedia';
import ScrollStage from '../ScrollStage';

/**
 * Colourways — 3.5 screens, five states.
 *
 * Measured: a pure opacity crossfade, no transforms at all. The background and
 * the headline are offset from one another — the incoming background reaches
 * full opacity while the outgoing headline is still fading — which is what
 * reads as the two halves of the headline swapping independently.
 */
export default function Colorways({ section }: { section: ColorwaysSection }) {
  const items = section.items;
  if (items.length === 0) return null;

  return (
    <section id={section.anchorId ?? undefined} data-surface="dark">
      <ScrollStage screens={3.5}>
        <div className="camera">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="slide grid place-items-center"
              style={{
                background: `linear-gradient(160deg, ${item.gradientStart} 0%, ${item.gradientEnd} 100%)`,
                color: item.textColor,
                ["--i"]: i,
                ["--last"]: items.length - 1,
              } as CSSProperties}
            >
              <div
                className="slide-trail grid w-full gap-6 px-6 md:px-12"
                style={{ ["--i"]: i, ["--last"]: items.length - 1 } as CSSProperties}
              >
                <h2 className="display text-center">
                  <span className="block">{item.name}</span>
                  <span className="block opacity-70">{item.tagline}</span>
                </h2>

                {item.media?.image ? (
                  <SectionMedia
                    media={item.media}
                    className="mx-auto max-h-[34svh] w-auto object-contain md:max-h-[42svh]"
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
              <span
                key={s.id}
                className="seg"
                style={{ ["--i"]: i, ["--last"]: items.length - 1 } as CSSProperties}
              />
            ))}
          </div>
        </div>
      </ScrollStage>
    </section>
  );
}
