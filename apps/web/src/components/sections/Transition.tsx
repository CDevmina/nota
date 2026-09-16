import type { CSSProperties } from 'react';
import type { TransitionSection } from '@/lib/types';
import ScrollStage from '../ScrollStage';

/**
 * Oversized two-tone serif heading holding the whole viewport.
 *
 * On the reference this beat is pinned: the heading arrives centred, holds
 * while you keep scrolling, and then fades out in place leaving plain ground —
 * it never travels up and off the top. Ours scrolled past as ordinary content,
 * which is why it read as a screen of type drifting through rather than a
 * pause between two sections.
 *
 * Two screens of scroll: the first holds it, the second fades it. Below 992px
 * the stage collapses and this is a normal full-height block, as the reference
 * also does.
 */
export default function Transition({ section }: { section: TransitionSection }) {
  const dark = section.theme === 'dark';

  return (
    <section
      data-surface={dark ? 'dark' : 'light'}
      id={section.anchorId ?? undefined}
      className={dark ? 'bg-black text-white' : 'bg-white text-black'}
    >
      <ScrollStage screens={2}>
        <div className="camera transition-camera grid place-items-center px-6 md:px-12">
          <h2 className="display-lg transition-heading w-full text-center">
            <span className="block" style={{ color: section.mutedColor ?? 'var(--muted)' }}>
              {section.lineTop}
            </span>
            <span className="block">{section.lineBottom}</span>
          </h2>
        </div>
      </ScrollStage>
    </section>
  );
}
