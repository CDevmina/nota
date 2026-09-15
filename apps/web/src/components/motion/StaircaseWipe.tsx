import ScrollStage from '../ScrollStage';

/**
 * Six white columns sweeping up to cover the section before this one.
 *
 * Measured: the section is 1.8 screens with `margin-top: -100vh`, holding six
 * equal columns (1440 ÷ 6 = 240px each) that translate Y from 100% to 0 on a
 * stagger finishing at progress 0.5, 0.6, 0.7, 0.8, 0.9, 1.0. A black overlay
 * behind them fades to 0.75, darkening the outgoing section.
 *
 * The reference uses the same mechanism in both directions: white curtains
 * hand over from the dark hero into the white specifications, and black ones
 * hand over from the white transition into the dark slider. The dark variant is
 * pulled up 0.7 of a viewport rather than a full one, as measured.
 *
 * `direction` is which way the columns travel. The white staircase sweeps up
 * from the bottom edge; the dark one that follows "Works with smart paper"
 * wipes DOWN from the top, which is the opposite of what we had.
 *
 * Decorative only — it carries no content and is hidden from assistive tech.
 */
export default function StaircaseWipe({
  tone = 'light',
  direction = 'up',
}: {
  tone?: 'light' | 'dark';
  direction?: 'up' | 'down';
}) {
  return (
    <div aria-hidden="true" className="relative">
      <ScrollStage screens={1.8} pullUpVh={tone === 'dark' ? 0.7 : 1}>
        <div className="camera wipe-camera">
          {tone === 'light' ? <div className="stair-dim" /> : null}
          <div className="stair" data-tone={tone} data-direction={direction}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="stair-panel" style={{ ['--i' as string]: i }} />
            ))}
          </div>
        </div>
      </ScrollStage>
    </div>
  );
}
