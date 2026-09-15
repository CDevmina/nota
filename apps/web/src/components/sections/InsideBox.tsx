import type { InsideBoxSection } from '@/lib/types';
import SectionMedia from '../SectionMedia';
import ScrubReveal from '../motion/ScrubReveal';
import BlindReveal from '../motion/BlindReveal';
import DetailBento from '../DetailBento';

/** Split heading, box render, the long serif paragraph, products and pill tags. */
export default function InsideBox({ section }: { section: InsideBoxSection }) {
  return (
    <section
      data-surface="light" id={section.anchorId ?? undefined} className="bg-white text-black">
      <div className="px-6 py-24 md:px-12 md:py-32">
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
          <ScrubReveal
            text={section.longCopy}
            from="#e6e6e6"
            to="#000000"
            className="mx-auto mt-24 max-w-5xl text-center font-[family-name:var(--font-display)] text-[clamp(1.5rem,3.7vw,4rem)] leading-[1.1] tracking-[-0.03em]"
          />
        ) : null}

        <div className="mt-24 grid gap-10 md:grid-cols-2">
          {section.products.map((product) => (
            <article key={product.id} className="bg-[#f1f1f1] p-8">
              <h3 className="card-title">{product.title}</h3>
              <p className="spec-item mt-3 max-w-sm text-black/70">{product.body}</p>
              <div className="relative mt-8 overflow-hidden">
                <SectionMedia media={product.media} className="h-auto w-full object-cover" />
                <BlindReveal slats={10} />
              </div>
            </article>
          ))}
        </div>
      </div>

      {section.tags.length > 0 ? <DetailBento tags={section.tags} /> : null}
    </section>
  );
}
