import ScrollStage from '../ScrollStage';

/**
 * Vertical panels sweeping up to cover the previous section with white.
 *
 * Each panel reads its own index, so the leading edge fans out diagonally
 * instead of the whole wall arriving at once — that diagonal is what makes the
 * reference's transition read as a wipe rather than a fade.
 *
 * Purely decorative: it carries no content and is hidden from assistive tech.
 */
export default function StaircaseWipe({ panels = 6 }: { panels?: number }) {
  return (
    <div aria-hidden="true" className="relative bg-black">
      <ScrollStage screens={1.6}>
        <div className="camera !p-0">
          <div className="stair" style={{ ['--panels' as string]: panels }}>
            {Array.from({ length: panels }).map((_, i) => (
              <div key={i} className="stair-panel" style={{ ['--i' as string]: i }} />
            ))}
          </div>
        </div>
      </ScrollStage>
    </div>
  );
}
