import type { ManifestoSection } from '@/lib/types';

/** Large serif statement on black. */
export default function Manifesto({ section }: { section: ManifestoSection }) {
  return (
    <section
      id={section.anchorId ?? undefined}
      className="bg-black py-28 text-white md:py-40"
    >
      <p className="display mx-auto max-w-6xl px-6 md:px-12">{section.body}</p>
      {section.showRule ? (
        <hr className="mx-6 mt-20 border-white/20 md:mx-12" />
      ) : null}
    </section>
  );
}
