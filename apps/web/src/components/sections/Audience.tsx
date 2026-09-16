import type { AudienceSection } from '@/lib/types';
import RevealOnEnter from '../motion/RevealOnEnter';
import PenCard from '../motion/PenCard';

/** Who it's for — intro paragraphs, then blocks each indented further right. */
export default function Audience({ section }: { section: AudienceSection }) {
  return (
    <section
      data-surface="dark"
      id={section.anchorId ?? undefined}
      className="bg-black px-6 pb-24 pt-[calc(var(--header-h)+4rem)] text-white md:px-10"
    >
      {/*
        The label sits on the same line as the first line of copy, and the two
        paragraphs run on with no gap — on the reference the second one starts
        on the very next line, with a deeper first-line indent than the first.
      */}
      <div className="audience-intro">
        {section.label ? (
          <p className="label uppercase tracking-wide text-white/70">{section.label}</p>
        ) : null}
        <div className="audience-intro__copy">
          {section.intro.map((p, i) => (
            <p key={p.id} className="body-lead text-white" data-indent={i === 0 ? 'first' : 'rest'}>
              {p.paragraph}
            </p>
          ))}
        </div>
      </div>

      <RevealOnEnter selector=".audience-item" />

      {/*
        The list is its own, narrower column further right than the paragraphs:
        titles start at 67% of the viewport and descriptions at 73%, hanging
        under the title rather than indenting only their first line.
      */}
      <div className="audience-list">
        {section.items.map((item) => (
          <article key={item.id} className="audience-item">
            <h3 className="card-title">{item.title}</h3>
            <p className="audience-item__body">{item.body}</p>
          </article>
        ))}
      </div>

      <PenCard media={section.media} />
    </section>
  );
}
