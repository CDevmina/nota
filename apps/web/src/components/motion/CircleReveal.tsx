import ScrollStage from '../ScrollStage';

/**
 * A white disc expanding from the centre until it fills the viewport, used to
 * hand over from a dark section to a light one.
 *
 * `clip-path: circle()` keeps the whole thing on the compositor — no layout,
 * no paint of the covered section, and it reverses exactly on scroll up.
 */
export default function CircleReveal() {
  return (
    <div aria-hidden="true" className="relative bg-black">
      <ScrollStage screens={1.4}>
        <div className="camera !p-0">
          <div className="disc" />
        </div>
      </ScrollStage>
    </div>
  );
}
