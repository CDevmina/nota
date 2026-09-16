import type { SpecificationsSection } from '@/lib/types';
import SectionMedia from '../SectionMedia';
import ScrollStage from '../ScrollStage';

/**
 * Specifications — 3 screens, pulled up one so the staircase hands over into it.
 *
 * Measured movements: the heading rises 269px while fading in, the nib rises
 * 728px (translate only, it does not scale), and the three cards rise 419px
 * each, staggered, starting after progress 0.25.
 */
export default function Specifications({ section }: { section: SpecificationsSection }) {
  return (
    <section
      id={section.anchorId ?? undefined}
      data-surface="light"
      className="bg-white text-black"
    >
      <ScrollStage screens={3} pullUpVh={1}>
        <div className="camera flex flex-col justify-between px-6 pb-10 pt-[calc(var(--header-h)+3rem)] md:px-12">
          <h2 className="spec-head display text-center">
            {section.eyebrow ? (
              <span className="block" style={{ color: 'var(--muted)' }}>
                {section.eyebrow}
              </span>
            ) : null}
            <span className="block">{section.title}</span>
          </h2>

          {section.media?.image ? (
            <div className="spec-nib pointer-events-none absolute inset-x-0 bottom-0 z-0 flex h-[62svh] justify-center">
              <SectionMedia media={section.media} className="h-full w-auto object-contain" />
            </div>
          ) : null}

          {/*
            Each column is two boxes on the reference, not one: a header box
            holding only the title, and a body box under it, about 8px apart.
            The column group spans 7%-93% of the viewport with a 20px gutter.
          */}
          <div className="spec-grid relative z-10">
            {section.groups.map((group, i) => (
              <div
                key={group.id}
                className="spec-card"
                style={{ ['--i' as string]: i }}
                data-frosted={i === 1 ? 'true' : undefined}
              >
                <div className="spec-card__head">
                  <h3 className="card-title">{group.title}</h3>
                </div>
                <ul className="spec-card__body">
                  {group.items.map((item) => (
                    <li key={item.id} className="spec-item spec-row">
                      <span>{item.label}</span>
                      <span aria-hidden="true" className="spec-row__dot" />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </ScrollStage>
    </section>
  );
}
