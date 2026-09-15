import type { AudienceSection } from '@/lib/types';

/** Who it's for — intro paragraphs, then blocks each indented further right. */
export default function Audience({ section }: { section: AudienceSection }) {
  return (
    <section
      data-surface="dark"
      id={section.anchorId ?? undefined}
      className="bg-black px-6 py-24 text-white md:px-12 md:py-32"
    >
      {section.label ? (
        <p className="label uppercase tracking-wide text-white/70">{section.label}</p>
      ) : null}

      <div className="mt-12 flex flex-col gap-6 md:ml-auto md:max-w-3xl md:text-right">
        {section.intro.map((p) => (
          <p key={p.id} className="spec-item indent-16 text-white/85">
            {p.paragraph}
          </p>
        ))}
      </div>

      <div className="mt-20 flex flex-col gap-14">
        {section.items.map((item) => (
          <article
            key={item.id}
            className="md:max-w-2xl"
            // The reference steps each block further right than the last.
            style={{ marginInlineStart: `min(${(item.indentLevel ?? 0) * 8}vw, 33%)` }}
          >
            <h3 className="card-title">{item.title}</h3>
            <p className="spec-item mt-4 indent-16 text-white/80">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
