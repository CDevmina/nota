import ScrollStage from '../ScrollStage';

/**
 * The black stepped tower that hands the white specifications over to the
 * dark manifesto — the reference's `who-transition`.
 *
 * Measured at 1440x900: a 1.8-screen section pulled up 70vh, holding a sticky
 * 100vh camera with four stacked black tiers. Their heights are fixed and fill
 * the camera exactly (129 + 257 x 3 = 900), and it is their *widths* that grow,
 * each tier wider than the one above it, so a centred ziggurat rises out of
 * where the pen was standing.
 *
 * Final widths, as a share of the viewport:
 *
 *   tier 0 (top)     124px   8.6%
 *   tier 1           206px  14.3%
 *   tier 2           401px  27.8%
 *   tier 3 (bottom)  777px  54.0%
 *
 * Sampled widths were 0 / 0 / 0 / 16 at p = 0.2, 5 / 27 / 87 / 228 at p = 0.6
 * and full by p = 0.8. The bottom tier leads and each tier above starts a
 * little later; the curve below is an eased fit to those samples, exact at the
 * endpoints and approximate in between.
 *
 * Decorative only — it carries no content and is hidden from assistive tech.
 */

/** height share of the camera, final width share of the viewport */
const TIERS = [
  { h: '14.33%', w: 8.6 },
  { h: '28.56%', w: 14.3 },
  { h: '28.56%', w: 27.8 },
  { h: '28.56%', w: 54.0 },
] as const;

export default function TowerWipe() {
  return (
    <div aria-hidden="true" className="relative">
      <ScrollStage screens={1.8} pullUpVh={0.7}>
        <div className="camera wipe-camera">
          <div className="tower">
            {TIERS.map((tier, i) => (
              <div
                key={i}
                className="tower-tier"
                style={{
                  height: tier.h,
                  ['--w' as string]: tier.w,
                  ['--i' as string]: i,
                }}
              />
            ))}
          </div>
        </div>
      </ScrollStage>
    </div>
  );
}
