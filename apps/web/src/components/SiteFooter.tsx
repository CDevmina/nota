import type { SiteSettings } from '@/lib/types';

type CreditItem = SiteSettings['credits'][number];

function Credit({ credit }: { credit: CreditItem }) {
  if (credit.href) {
    return (
      <a
        href={credit.href}
        target="_blank"
        rel="noreferrer"
        className="label text-white/60 hover:text-white"
      >
        {credit.label}
      </a>
    );
  }
  return <span className="label text-white/60">{credit.label}</span>;
}

export default function SiteFooter({ settings }: { settings: SiteSettings | null }) {
  if (!settings) return null;

  return (
    <footer className="bg-black px-4 pt-24 text-white md:px-[2.78vw]">
      <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
        {settings.footerTagline ? (
          <p className="footer-tagline text-white">{settings.footerTagline}</p>
        ) : null}

        {settings.footerLinks.length > 0 ? (
          <nav aria-label="Footer" className="footer-nav">
            <h2 className="label text-white/50">{settings.footerNavTitle}</h2>
            <ul className="mt-4 flex flex-col gap-1">
              {settings.footerLinks.map((link) => (
                <li key={link.id}>
                  <a href={link.href} className="spec-item text-white hover:opacity-60">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        {settings.year ? (
          <div className="md:text-right">
            <h2 className="label text-white/50">{settings.yearLabel}</h2>
            <p className="spec-item mt-4">{settings.year}</p>
          </div>
        ) : null}
      </div>

      {/*
        Three groups on the same 2fr/1fr/1fr grid as the columns above, so the
        middle one lines up under "Navigation" exactly as on the reference:
        copyright left, the build credits centre, the design credit right. The
        first two credits are the build pair and carry a dot between them; any
        beyond that sit in the right-hand group.
      */}
      <div className="mt-20 grid gap-4 py-6 md:grid-cols-[2fr_1fr_1fr]">
        {settings.copyright ? (
          <p className="label text-white/60">{settings.copyright}</p>
        ) : null}
        <ul className="flex flex-wrap items-center gap-2">
          {settings.credits.slice(0, 2).map((credit, i) => (
            <li key={credit.id} className="flex items-center gap-2">
              {i > 0 ? <span aria-hidden="true" className="label text-white/40">&bull;</span> : null}
              <Credit credit={credit} />
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap gap-5 md:justify-end">
          {settings.credits.slice(2).map((credit) => (
            <li key={credit.id}>
              <Credit credit={credit} />
            </li>
          ))}
        </ul>
      </div>

          </footer>
  );
}
