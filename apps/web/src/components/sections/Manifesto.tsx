import type { ManifestoSection } from '@/lib/types';
import ScrollStage from '../ScrollStage';

/**
 * The manifesto lightens word by word as you scroll.
 *
 * Each word carries its index and the whole paragraph knows the word count, so
 * the colour is one `color-mix` per word driven by the stage's progress — no
 * per-frame JavaScript touches any of these nodes.
 */
export default function Manifesto({ section }: { section: ManifestoSection }) {
  const words = section.body.split(/\s+/).filter(Boolean);

  return (
    <section data-surface="dark" id={section.anchorId ?? undefined} className="bg-black">
      <ScrollStage screens={2}>
        <div className="camera flex flex-col justify-center px-6 md:px-12">
          <p
            className="display mx-auto max-w-6xl"
            style={{ ['--words' as string]: words.length }}
          >
            {words.map((word, i) => (
              <span
                key={`${word}-${i}`}
                className="scrub-word"
                style={{ ['--i' as string]: i }}
              >
                {word}{' '}
              </span>
            ))}
          </p>

          {section.showRule ? (
            <hr className="mx-auto mt-16 w-full max-w-6xl border-white/20" />
          ) : null}
        </div>
      </ScrollStage>
    </section>
  );
}
