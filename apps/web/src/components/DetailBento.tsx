import type { Media } from '@/lib/types';
import SectionMedia from './SectionMedia';

/**
 * The detail bento — six cards of deliberately unequal shape on black.
 *
 * Measured on the reference at 1440x900, and the measurement overturned two
 * things we had built:
 *
 * 1. **There is no camera here.** `section.details` is 2.79 screens of ordinary
 *    scroll with no sticky child. We had wrapped it in a 100vh camera, so a
 *    1825px-tall grid was clipped 462px off the top and the bottom — the black
 *    voids and half-cards in that section.
 * 2. **Nothing animates.** Sampling `transform` and `opacity` on every card at
 *    p = 0, 0.25, 0.5, 0.75 and 1 returns `none` / `1` every time. The inner
 *    image sits at a permanent `scale(1.3)`: a fixed crop, not a scroll zoom.
 *    Our version tried to animate a scale that the reference never animates.
 *
 * The layout is three stacked blocks inside a 1360px column (1440 less 40px
 * gutters), with a 20px gutter throughout:
 *
 *   row 1, centred     [ 680x577 square-cut ]   [                  ]
 *                      [ 330x273 stadium    ]   [ 660x870 arch     ]
 *   video, full width  [ 1360x860, near-stadium                    ]
 *   row 2, top-aligned [ 1010x664 square-cut     ] [ 330x430 stadium ]
 *
 * Widths are percentages of that column and heights come from `aspect-ratio`,
 * so the whole thing scales without a single fixed pixel. Card shape is a
 * property of the slot, not of the content: an editor swaps the image and the
 * card keeps its shape. A seventh card and beyond falls into a plain grid
 * underneath rather than distorting the composition.
 */

type Tag = { id: number; label: string | null; media: Media | null };

/**
 * Slot geometry, as measured. `w` is a share of the slot's own parent — the
 * first two sit in the 680px stack, the rest in the 1360px column — so each
 * pair sums to 98.53% and the remaining 1.47% is the 20px gutter.
 */
const SLOTS = [
  { w: '100%', ratio: '680 / 577', radius: 'none' },
  { w: '48.53%', ratio: '330 / 273', radius: 'sm' },
  { w: '48.53%', ratio: '660 / 870', radius: 'lg' },
  { w: '100%', ratio: '1360 / 860', radius: 'xl' },
  { w: '74.26%', ratio: '1010 / 664', radius: 'none' },
  { w: '24.26%', ratio: '330 / 430', radius: 'sm' },
] as const;

function Card({ tag, slot, priority }: { tag: Tag; slot: (typeof SLOTS)[number]; priority?: boolean }) {
  return (
    <figure
      className="detail-card"
      data-radius={slot.radius}
      style={{ width: slot.w, aspectRatio: slot.ratio }}
    >
      <SectionMedia media={tag.media} className="detail-card__media" priority={priority} />
      {tag.label ? <figcaption className="detail-card__label label">{tag.label}</figcaption> : null}
    </figure>
  );
}

export default function DetailBento({ tags }: { tags: Tag[] }) {
  // Pad to six so a partially-filled CMS still lays out, and keep the overflow
  // separate rather than forcing extra cards into slots that do not exist.
  const slotted = SLOTS.map((_, i) => tags[i] ?? null);
  const overflow = tags.slice(SLOTS.length);

  return (
    <div data-surface="dark" className="detail-bento bg-black">
      <div className="detail-bento__column">
        <div className="detail-bento__row detail-bento__row--center">
          {/* The two left cards share a column so the tall arch beside them can
              set the row's height; that is why they are nested rather than
              being three siblings. */}
          <div className="detail-bento__stack">
            {slotted[0] ? <Card tag={slotted[0]} slot={SLOTS[0]} /> : null}
            {slotted[1] ? <Card tag={slotted[1]} slot={SLOTS[1]} /> : null}
          </div>
          {slotted[2] ? <Card tag={slotted[2]} slot={SLOTS[2]} /> : null}
        </div>

        {slotted[3] ? (
          <div className="detail-bento__video">
            <Card tag={slotted[3]} slot={SLOTS[3]} />
          </div>
        ) : null}

        <div className="detail-bento__row detail-bento__row--top">
          {slotted[4] ? <Card tag={slotted[4]} slot={SLOTS[4]} /> : null}
          {slotted[5] ? <Card tag={slotted[5]} slot={SLOTS[5]} /> : null}
        </div>

        {overflow.length > 0 ? (
          <div className="detail-bento__overflow">
            {overflow.map((tag) => (
              <Card key={tag.id} tag={tag} slot={SLOTS[0]} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
