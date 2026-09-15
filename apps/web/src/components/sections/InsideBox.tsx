import type { InsideBoxSection } from '@/lib/types';
import SectionMedia from '../SectionMedia';
import BlindReveal from '../motion/BlindReveal';

/** Split heading, box render, the long serif paragraph, products and pill tags. */
export default function InsideBox({ section }: { section: InsideBoxSection }) {
  return (
    <section
      data-surface="light" id={section.anchorId ?? undefined} className="bg-white text-black">
      <div className="px-6 pb-24 pt-[calc(var(--header-h)+4rem)] md:px-12 md:pb-32">
        <h2 className="display-lg text-center">
          {section.titleTop ? (
            <span className="block" style={{ color: 'var(--muted-light)' }}>
              {section.titleTop}
            </span>
          ) : null}
          <span className="block">{section.titleBottom}</span>
        </h2>

        {section.boxMedia?.image ? (
          <div className="relative mx-auto mt-16 max-w-5xl overflow-hidden bg-[#f1f1f1]">
            <SectionMedia media={section.boxMedia} className="h-auto w-full object-cover" />
            <BlindReveal />
          </div>
        ) : null}

        {section.subtitle ? (
          <h3 className="card-title mt-16">{section.subtitle}</h3>
        ) : null}
        {section.description ? (
          <p className="spec-item mt-4 max-w-2xl text-black/70">{section.description}</p>
        ) : null}

        {section.longCopy ? (
          <p className="mx-auto mt-24 max-w-5xl text-center font-[family-name:var(--font-display)] text-[clamp(1.5rem,3.7vw,4rem)] leading-[1.1] tracking-[-0.03em]">
            {section.longCopy}
          </p>
        ) : null}

        <div className="mt-24 grid gap-10 md:grid-cols-2">
          {section.products.map((product) => (
            <article key={product.id}>
              <div className="overflow-hidden bg-[#f1f1f1]">
                <SectionMedia media={product.media} className="h-auto w-full object-cover" />
              </div>
              <h3 className="card-title mt-6">{product.title}</h3>
              <p className="spec-item mt-3 text-black/70">{product.body}</p>
            </article>
          ))}
        </div>
      </div>

      {section.tags.length > 0 ? (
        <div className="bg-black px-6 py-24 md:px-12 md:py-32">
          <div className="grid gap-6 md:grid-cols-2">
            {section.tags.map((tag) => (
              <figure key={tag.id} className="relative overflow-hidden rounded-2xl">
                <SectionMedia media={tag.media} className="h-auto w-full object-cover" />
                <figcaption className="label absolute bottom-5 left-5 rounded-full bg-white/15 px-4 py-2 text-white backdrop-blur-md">
                  {tag.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
