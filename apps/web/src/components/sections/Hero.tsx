import type { HeroSection } from '@/lib/types';
import SectionMedia from '../SectionMedia';

/** Full-bleed pen render with a two-line display headline. */
export default function Hero({ section }: { section: HeroSection }) {
  return (
    <section
      id={section.anchorId ?? undefined}
      className="relative min-h-[100svh] overflow-hidden bg-[#2a2c30]"
    >
      <div className="absolute inset-0">
        <SectionMedia
          media={section.media}
          priority
          className="h-full w-full object-cover"
        />
      </div>

      {/* Bottom-left on desktop, centred on mobile — matching the reference. */}
      <h1 className="display absolute inset-x-0 bottom-[8svh] px-6 text-center text-white md:bottom-16 md:px-12 md:text-left">
        <span className="block">{section.headlineTop}</span>
        <span className="block">{section.headlineBottom}</span>
      </h1>
    </section>
  );
}
