import type { SpecificationsSection } from '@/lib/types';
import SectionMedia from '../SectionMedia';

/** Split heading, rising nib render, and cards that expand into lists. */
export default function Specifications({ section }: { section: SpecificationsSection }) {
  return (
    <section
      id={section.anchorId ?? undefined}
      className="relative bg-white py-24 text-black md:py-32"
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
        <div className="mx-auto mt-12 max-w-4xl px-6">
          <SectionMedia media={section.media} className="mx-auto h-auto w-full object-contain" />
        </div>
      ) : null}

      <div className="mx-auto mt-16 grid max-w-6xl gap-px bg-black/10 px-6 md:grid-cols-3 md:px-12">
        {section.groups.map((group) => (
          <div key={group.id} className="bg-white p-6">
            <h3 className="card-title">{group.title}</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {group.items.map((item) => (
                <li key={item.id} className="spec-item border-t border-black/10 pt-3">
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
