import type { TransitionSection } from '@/lib/types';

/** Oversized two-tone serif heading spanning the viewport. */
export default function Transition({ section }: { section: TransitionSection }) {
  const dark = section.theme === 'dark';

  return (
    <section
      id={section.anchorId ?? undefined}
      data-surface={dark ? 'dark' : 'light'}
      className={`grid min-h-[70svh] place-items-center px-6 py-24 md:px-12 ${
        dark ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      <h2 className="display-lg text-center">
        <span className="block" style={{ color: section.mutedColor ?? 'var(--muted)' }}>
          {section.lineTop}
        </span>
        <span className="block">{section.lineBottom}</span>
      </h2>
    </section>
  );
}
