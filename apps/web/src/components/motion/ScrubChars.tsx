import type { CSSProperties } from 'react';

/**
 * Splits text into per-character spans for a scroll-driven colour wipe, while
 * keeping the paragraph able to wrap.
 *
 * The wrapping is the whole reason this is its own component. A space wrapped
 * in its own `<span>` is both the leading and trailing content of that inline
 * box, so CSS collapses it away entirely — the paragraph becomes one
 * unbreakable word and runs off the screen. Spaces have to be bare text nodes
 * between the spans.
 *
 * Characters carry `--i` and the paragraph carries `--chars`; the colour is one
 * `color-mix` per character driven by the stage's `--p`, so nothing here is
 * touched by JavaScript while scrolling.
 */
export default function ScrubChars({
  text,
  className = '',
  style,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
}) {
  const chars = [...text];

  return (
    <p
      className={className}
      style={{ ['--chars' as string]: chars.length, ...style } as CSSProperties}
    >
      {chars.map((char, i) =>
        char === ' ' ? (
          // A bare string, which React renders as a text node. This is the
          // only break opportunity the paragraph has; a span here collapses.
          ' '
        ) : (
          <span key={i} className="scrub-char" style={{ ['--i' as string]: i } as CSSProperties}>
            {char}
          </span>
        ),
      )}
    </p>
  );
}
