import type { TransitionSection } from '@/lib/types';

/**
 * Oversized two-tone serif heading filling the viewport.
 *
 * On the reference this is a full screen of type — the oversized display tier
 * at 10.42vw with line-height 0.8 — not a band with padding around it. It is
 * the beat between two sections, so it holds the whole viewport.
 */
export default function Transition({ section }: { section: TransitionSection }) {
  const dark = section.theme === 'dark';

  return (
    <section
      data-surface={dark ? 'dark' : 'light'}
      id={section.anchorId ?? undefined}
      className={`grid min-h-[100svh] place-items-center px-6 md:px-12 ${
        dark ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      <h2 className="display-lg w-full text-center">
        <span className="block" style={{ color: section.mutedColor ?? 'var(--muted)' }}>
          {section.lineTop}
        </span>
        <span className="block">{section.lineBottom}</span>
      </h2>
    </section>
  );
}
