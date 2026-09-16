import type { Media } from '@/lib/types';
import SectionMedia from '../SectionMedia';
import ScrollStage from '../ScrollStage';

/**
 * The pen clip that grows to fill the screen at the end of "Who it's for".
 *
 * Measured on the reference's `who__video-camera` at 1440x900. The wrapper is a
 * fixed 1360x900 box the whole way; what moves is the video inside it:
 *
 *   p     scale    translateY   opacity
 *   0.00  0.5000   -83.7        1
 *   0.40  0.5000   -83.7        1
 *   0.55  0.5735   -71.4        1
 *   0.70  0.9188   -13.6        1
 *   0.85  0.9927    +1.9        0.98
 *   1.00  0.8956   +27.3        0.74
 *
 * So it holds at half size while the audience list plays, grows to full
 * between 0.4 and 0.85, then eases back a little and fades as the next
 * section's curtain takes over. Reproduced as three straight segments, which
 * lands within a percent of every sample above.
 *
 * Rendered only when an editor has supplied a clip; the section reads fine
 * without one.
 */
export default function PenCard({ media }: { media: Media | null }) {
  if (!media?.video?.url && !media?.image?.url) return null;

  return (
    <ScrollStage screens={2.4}>
      <div className="camera pen-card">
        <div className="pen-card__frame">
          <SectionMedia media={media} className="pen-card__media" />
        </div>
      </div>
    </ScrollStage>
  );
}
