import type { SiteSettings } from '@/lib/types';
import HeaderChrome from './HeaderChrome';
import ScrambleText from './motion/ScrambleText';
import MobileMenu from './MobileMenu';
import OrderModal from './OrderModal';

/**
 * Fixed header.
 *
 * Matching the reference: a small sans wordmark on the left with the nav links
 * immediately after it — left-aligned, not centred — and a solid white widget
 * on the right holding the brand mark and the black Order button. No background
 * bar and no divider rule.
 *
 * It hides on scroll down and returns on scroll up. That is the reference's own
 * behaviour, and it also removes a whole class of collisions: with no
 * background, any content passing beneath a permanently visible header runs
 * straight through the links.
 */
export default function SiteHeader({ settings }: { settings: SiteSettings | null }) {
  if (!settings) return null;

  const { headerLinks, cta, orderModal } = settings;
  const price =
    cta?.price != null ? `${cta.currency ?? '$'}${Number(cta.price).toFixed(0)}` : null;

  return (
    <>
      <HeaderChrome />
      <header className="site-header fixed inset-x-0 top-0 z-[100]">
        <div className="flex items-start justify-between px-6 pt-6 md:px-10">
          <div className="flex items-center gap-10">
            <a href="#top" className="wordmark" aria-label="NŌTA, home">
              Nōta
            </a>

            <nav className="hidden items-center gap-[49px] lg:flex" aria-label="Primary">
              {headerLinks.map((link, i) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="nav-link"
                  {...(link.isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                  <ScrambleText text={link.label} delayMs={i * 70} />
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {cta && orderModal ? (
              <div className="header-widget hidden lg:flex">
                <span className="brand-mark" aria-hidden="true" />
                <OrderModal cta={cta} price={price} content={orderModal} />
              </div>
            ) : null}
            <MobileMenu settings={settings} price={price} />
          </div>
        </div>
      </header>
    </>
  );
}
