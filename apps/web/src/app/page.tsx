import { getHomepage, getSiteSettings } from '@/lib/strapi';
import SectionRenderer from '@/components/SectionRenderer';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import SmoothScroll from '@/components/SmoothScroll';

/**
 * Tag revalidation is the real mechanism — a Strapi webhook hits
 * /api/revalidate on publish and the page regenerates within a second.
 *
 * This periodic revalidate is a backstop for the one case tags cannot cover:
 * the build itself runs where Strapi is unreachable, so the first render is
 * baked without content. If the webhook were ever missing or misconfigured,
 * the page would otherwise stay empty indefinitely. It is a safety net, not
 * the mechanism, and it is not a substitute for the webhook.
 */
export const revalidate = 300;

export default async function Home() {
  const [homepage, settings] = await Promise.all([getHomepage(), getSiteSettings()]);

  // Before content exists in Strapi there is nothing to render. Say so plainly
  // rather than shipping a blank page that looks like a deploy failure.
  if (!homepage?.sections?.length) {
    return (
      <main className="grid min-h-screen place-items-center p-10 text-center">
        <p className="spec-item text-white/60">
          No homepage content published yet.
        </p>
      </main>
    );
  }

  return (
    <>
      <SmoothScroll />
      <SiteHeader settings={settings} />
      <main>
        <SectionRenderer sections={homepage.sections} />
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
