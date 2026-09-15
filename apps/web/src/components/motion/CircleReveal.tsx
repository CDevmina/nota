import ScrollStage from '../ScrollStage';

/**
 * A white disc growing from the centre to hand over from a dark section to a
 * light one.
 *
 * Measured: 2.3 screens with `margin-top: -100vh`, and a scaled div — not a
 * clip-path — running scale 0 → 4.5 on an eased curve that saturates around
 * progress 0.8. Scaling an element keeps the whole thing on the compositor.
 */
export default function CircleReveal() {
  return (
    <div aria-hidden="true" className="relative">
      <ScrollStage screens={2.3} pullUpVh={1}>
        <div className="camera">
          <div className="disc" />
        </div>
      </ScrollStage>
    </div>
  );
}
