import type { AudienceSection } from '@/lib/types';
import RevealOnEnter from '../motion/RevealOnEnter';

/** Who it's for — intro paragraphs, then blocks each indented further right. */
export default function Audience({ section }: { section: AudienceSection }) {
  return (
    <section
      data-surface="dark"
      id={section.anchorId ?? undefined}
      className="bg-black px-6 pb-24 pt-[calc(var(--header-h)+4rem)] text-white md:px-10"
    >
      {section.label ? (
        <p className="label uppercase tracking-wide text-white/70">{section.label}</p>
      ) : null}

      <div className="mt-12 flex flex-col gap-6 md:ml-auto md:w-1/2 md:text-left">
        {section.intro.map((p) => (
          <p key={p.id} className="body-lead indent-[140px] text-white">
            {p.paragraph}
          </p>
        ))}
      </div>

      <RevealOnEnter selector=".audience-item" />

      <div className="mt-20 flex flex-col gap-14">
        {section.items.map((item) => (
          <article
            key={item.id}
            // The reference steps each block further right than the last.
            className="audience-item md:ml-auto md:w-1/2"
          >
            <h3 className="card-title">{item.title}</h3>
            <p className="body-lead mt-4 indent-[75px] text-white/90">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
