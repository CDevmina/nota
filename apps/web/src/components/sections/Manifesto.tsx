import type { ManifestoSection } from '@/lib/types';
import ScrollStage from '../ScrollStage';

/**
 * The manifesto lightens character by character as it scrolls.
 *
 * Measured on the reference: one span per character — spaces included, they
 * carry a `space-char` class — animating #666666 to #ffffff, with the wipe
 * completing over roughly the first 17% of the section.
 *
 * One `color-mix` per character driven by the stage's progress does the whole
 * effect; `color-mix` clamps out-of-range percentages, so no clamping
 * arithmetic is needed and no JavaScript touches these nodes per frame.
 */
export default function Manifesto({ section }: { section: ManifestoSection }) {
  const chars = [...section.body];

  return (
    <section data-surface="dark" id={section.anchorId ?? undefined} className="bg-black">
      <ScrollStage screens={1.8}>
        <div className="camera flex flex-col justify-center px-6 md:px-10">
          <p
            className="display-mid max-w-[75%]"
            style={{ ['--chars' as string]: chars.length }}
          >
            {chars.map((char, i) => (
              <span
                key={i}
                className="scrub-char"
                style={{ ['--i' as string]: i }}
                aria-hidden={i > 0 ? true : undefined}
              >
                {char === ' ' ? ' ' : char}
              </span>
            ))}
            <span className="sr-only">{section.body}</span>
          </p>

          {section.showRule ? (
            <hr className="mt-12 w-full border-white/25" />
          ) : null}
        </div>
      </ScrollStage>
    </section>
  );
}
