import type { ManifestoSection } from '@/lib/types';
import ScrollStage from '../ScrollStage';
import ScrubChars from '../motion/ScrubChars';

/**
 * The manifesto lightens character by character as it scrolls.
 *
 * Measured on the reference: one span per character, #666666 to #ffffff, with
 * the wipe completing over roughly the first 17% of the section.
 */
export default function Manifesto({ section }: { section: ManifestoSection }) {
  return (
    <section data-surface="dark" id={section.anchorId ?? undefined} className="bg-black">
      <ScrollStage screens={1.8}>
        <div className="camera flex flex-col justify-center px-6 md:px-10">
          <ScrubChars text={section.body} className="display-mid max-w-[75%]" />

          {section.showRule ? <hr className="mt-12 w-full border-white/25" /> : null}
        </div>
      </ScrollStage>
    </section>
  );
}
