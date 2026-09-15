import type { PreloaderSection } from '@/lib/types';
import Counter from './PreloaderCounter';

/** Full-screen 0–100 counter that lifts to reveal the hero. */
export default function Preloader({ section }: { section: PreloaderSection }) {
  return (
    <Counter
      durationMs={section.durationMs ?? 1400}
      suffix={section.suffix ?? '%'}
      anchorId={section.anchorId}
    />
  );
}
