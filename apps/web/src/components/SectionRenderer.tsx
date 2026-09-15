import type { Section } from '@/lib/types';

import Preloader from './sections/Preloader';
import Hero from './sections/Hero';
import Specifications from './sections/Specifications';
import Manifesto from './sections/Manifesto';
import Audience from './sections/Audience';
import Transition from './sections/Transition';
import Features from './sections/Features';
import InsideBox from './sections/InsideBox';
import Colorways from './sections/Colorways';

/**
 * Resolves each dynamic-zone entry to its React component by `__component`.
 *
 * Adding a section to the CMS means adding one file and one line here. The
 * order on the page is whatever order the editor put the sections in — nothing
 * about the page's sequence is encoded in code.
 */

/** Narrows the union to the one member a given __component value identifies. */
type SectionOf<K extends Section['__component']> = Extract<Section, { __component: K }>;

type Registry = {
  [K in Section['__component']]: React.ComponentType<{ section: SectionOf<K> }>;
};

const REGISTRY: Registry = {
  'sections.preloader': Preloader,
  'sections.hero': Hero,
  'sections.specifications': Specifications,
  'sections.manifesto': Manifesto,
  'sections.audience': Audience,
  'sections.transition': Transition,
  'sections.features': Features,
  'sections.inside-box': InsideBox,
  'sections.colorways': Colorways,
};

export default function SectionRenderer({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section) => {
        // Each entry is correctly typed in the registry; the lookup is the one
        // place the union collapses, so widen it back to the union here.
        const Component = REGISTRY[section.__component] as React.ComponentType<{
          section: Section;
        }>;

        // A section published in Strapi before its component exists here should
        // degrade to nothing rather than crashing the whole page.
        if (!Component) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`No component registered for "${section.__component}"`);
          }
          return null;
        }

        return <Component key={`${section.__component}-${section.id}`} section={section} />;
      })}
    </>
  );
}
