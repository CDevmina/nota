import type { CSSProperties } from 'react';
import type { ColorwaysSection } from '@/lib/types';
import SectionMedia from '../SectionMedia';
import ScrollStage from '../ScrollStage';

/**
 * Colourways — 3.5 screens, five states.
 *
 * The pen stands upright in the centre of the viewport and the headline sits
 * *around* it: the name to its left, the tagline to its right. That split is
 * the whole composition — stacking the two lines above the pen loses it.
 *
 * Measured: a pure opacity crossfade between states, no transforms. The
 * background leads and the headline trails slightly, which is what reads as
 * the two halves swapping independently.
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
              className="slide"
              style={
                {
                  background: `linear-gradient(180deg, ${item.gradientStart} 0%, ${item.gradientEnd} 100%)`,
                  color: item.textColor,
                  '--i': i,
                  '--last': items.length - 1,
                } as CSSProperties
              }
            >
              {/* The pen is the centre column; the headline flanks it. */}
              <div className="colorway-grid">
                <h2
                  className="slide-trail display colorway-name"
                  style={{ ['--i' as string]: i, ['--last' as string]: items.length - 1 } as CSSProperties}
                >
                  {item.name}
                </h2>

                {item.media?.image ? (
                  <SectionMedia
                    media={item.media}
                    className="colorway-pen h-full w-auto object-contain"
                  />
                ) : (
                  <div aria-hidden="true" />
                )}

                <h2
                  className="slide-trail display colorway-tagline"
                  style={{ ['--i' as string]: i, ['--last' as string]: items.length - 1 } as CSSProperties}
                >
                  {item.tagline}
                </h2>
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
                style={{ ['--i' as string]: i, ['--last' as string]: items.length - 1 } as CSSProperties}
              />
            ))}
          </div>
        </div>
      </ScrollStage>
    </section>
  );
}
