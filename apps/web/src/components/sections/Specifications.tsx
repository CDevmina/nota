import type { SpecificationsSection } from '@/lib/types';
import SectionMedia from '../SectionMedia';
import Reveal from '../Reveal';

/** Split heading, rising nib render, and cards that expand into lists. */
export default function Specifications({ section }: { section: SpecificationsSection }) {
  return (
    <section
      data-surface="light"
      id={section.anchorId ?? undefined}
      className="relative bg-white pb-24 pt-[calc(var(--header-h)+4rem)] text-black md:pb-32"
    >
      <h2 className="display px-6 text-center md:px-12">
        {section.eyebrow ? (
          <span className="block" style={{ color: 'var(--muted)' }}>
            {section.eyebrow}
          </span>
        ) : null}
        <span className="block">{section.title}</span>
      </h2>

      {section.media?.image ? (
        <div className="mt-12 flex justify-center px-6">
          {/* The nib render is small and portrait — cap it by height and let the
              width follow, rather than stretching it to the container. */}
          <SectionMedia
            media={section.media}
            className="max-h-[52svh] w-auto object-contain"
          />
        </div>
      ) : null}

      <div className="mx-auto mt-16 grid max-w-6xl gap-px bg-black/10 px-6 md:grid-cols-3 md:px-12">
        {section.groups.map((group, i) => (
          <Reveal key={group.id} delayMs={i * 110} className="bg-white p-6">
          <div>
            <h3 className="card-title">{group.title}</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {group.items.map((item) => (
                <li key={item.id} className="spec-item border-t border-black/10 pt-3">
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
