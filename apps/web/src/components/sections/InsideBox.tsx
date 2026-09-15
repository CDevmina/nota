import type { InsideBoxSection, Media } from '@/lib/types';
import SectionMedia from '../SectionMedia';
import ScrubReveal from '../motion/ScrubReveal';
import BlindReveal from '../motion/BlindReveal';
import DetailBento from '../DetailBento';

/**
 * Split heading, the box render, the long serif paragraph, the two product
 * cards and the detail bento.
 *
 * The three image panels share one shape, measured on the reference at
 * 1440x900: a 20px-inset caption block in the top-right corner, 360px wide,
 * whose description hangs a further 60px in at 300px wide. The box photo is
 * the full 1360px content width and the product cards are 670px each, all of
 * them 820px tall, and all of them uncovered by blinds rather than simply
 * scrolling in.
 */
function Panel({
  media,
  title,
  body,
  ratio,
  diagonal = false,
  priority = false,
}: {
  media: Media | null;
  title?: string | null;
  body?: string | null;
  ratio: string;
  diagonal?: boolean;
  priority?: boolean;
}) {
  return (
    <figure className="inside-panel">
      {/* The ratio lives on the frame, not the figure, so the caption can drop
          below the image on a phone without fighting a fixed aspect box. */}
      <div className="inside-panel__frame" style={{ aspectRatio: ratio }}>
        <SectionMedia media={media} className="inside-panel__media" priority={priority} />
        <BlindReveal diagonal={diagonal} />
      </div>
      {title || body ? (
        <figcaption className="inside-panel__caption">
          {title ? <h3 className="card-title">{title}</h3> : null}
          {body ? <p className="inside-panel__body">{body}</p> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

export default function InsideBox({ section }: { section: InsideBoxSection }) {
  return (
    <section
      data-surface="light"
      id={section.anchorId ?? undefined}
      className="bg-white text-black"
    >
      <div className="inside-column">
        <h2 className="display-lg text-center">
          {section.titleTop ? (
            <span className="block" style={{ color: 'var(--muted-light)' }}>
              {section.titleTop}
            </span>
          ) : null}
          <span className="block">{section.titleBottom}</span>
        </h2>

        {section.boxMedia?.image ? (
          <div className="mt-16">
            <Panel
              media={section.boxMedia}
              title={section.subtitle}
              body={section.description}
              ratio="1360 / 820"
            />
          </div>
        ) : null}

        {section.longCopy ? (
          <ScrubReveal
            text={section.longCopy}
            from="#e6e6e6"
            to="#000000"
            /* 1152px of 1440 on the reference — four lines, not five. */
            className="mx-auto mt-24 w-[80%] text-center font-[family-name:var(--font-display)] text-[3.7vw] leading-[1.13] tracking-[-0.03em]"
          />
        ) : null}

        <div className="inside-products">
          {section.products.map((product) => (
            <Panel
              key={product.id}
              media={product.media}
              title={product.title}
              body={product.body}
              ratio="670 / 820"
              diagonal
            />
          ))}
        </div>
      </div>

      {section.tags.length > 0 ? <DetailBento tags={section.tags} /> : null}
    </section>
  );
}
