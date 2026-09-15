import ScrollStage from '../ScrollStage';

/**
 * Six white columns sweeping up to cover the section before this one.
 *
 * Measured: the section is 1.8 screens with `margin-top: -100vh`, holding six
 * equal columns (1440 ÷ 6 = 240px each) that translate Y from 100% to 0 on a
 * stagger finishing at progress 0.5, 0.6, 0.7, 0.8, 0.9, 1.0. A black overlay
 * behind them fades to 0.75, darkening the outgoing section.
 *
 * Decorative only — it carries no content and is hidden from assistive tech.
 */
export default function StaircaseWipe() {
  return (
    <div aria-hidden="true" className="relative">
      <ScrollStage screens={1.8} pullUpVh={1}>
        <div className="camera">
          <div className="stair-dim" />
          <div className="stair">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="stair-panel" style={{ ['--i' as string]: i }} />
            ))}
          </div>
        </div>
      </ScrollStage>
    </div>
  );
}
