import type { SiteSettings } from '@/lib/types';
import HeaderTheme from './HeaderTheme';
import MobileMenu from './MobileMenu';
import OrderModal from './OrderModal';

/**
 * Fixed header. Desktop shows the nav inline and the Order pill; below 992px
 * both collapse into a full-screen menu, matching the reference.
 */
export default function SiteHeader({ settings }: { settings: SiteSettings | null }) {
  if (!settings) return null;

  const { headerLinks, cta, orderModal } = settings;
  const price =
    cta?.price != null ? `${cta.currency ?? '$'}${Number(cta.price).toFixed(0)}` : null;

  return (
    <>
      <HeaderTheme />
      <header className="site-header fixed inset-x-0 top-0 z-[100] h-[var(--header-h)]">
      <div className="header-rule mx-auto flex h-full items-center justify-between gap-6 border-b px-6 md:px-12">
        <a href="#top" className="display text-[1.6rem] leading-none">
          Nōta
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {headerLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="label opacity-90 transition-opacity hover:opacity-60"
              {...(link.isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {cta && orderModal ? (
            <OrderModal
              cta={cta}
              price={price}
              content={orderModal}
              className="hidden lg:flex"
            />
          ) : null}
          <MobileMenu settings={settings} price={price} />
        </div>
      </div>
      </header>
    </>
  );
}
