import type { SiteSettings } from '@/lib/types';

export default function SiteFooter({ settings }: { settings: SiteSettings | null }) {
  if (!settings) return null;

  return (
    <footer className="bg-black px-6 pt-24 text-white md:px-12">
      <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
        {settings.footerTagline ? (
          <p className="spec-item max-w-md text-white/80">{settings.footerTagline}</p>
        ) : null}

        {settings.footerLinks.length > 0 ? (
          <nav aria-label="Footer">
            <h2 className="label text-white/50">{settings.footerNavTitle}</h2>
            <ul className="mt-4 flex flex-col gap-2">
              {settings.footerLinks.map((link) => (
                <li key={link.id}>
                  <a href={link.href} className="spec-item hover:opacity-60">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        {settings.year ? (
          <div>
            <h2 className="label text-white/50">{settings.yearLabel}</h2>
            <p className="spec-item mt-4">{settings.year}</p>
          </div>
        ) : null}
      </div>

      <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 py-6">
        {settings.copyright ? (
          <p className="label text-white/60">{settings.copyright}</p>
        ) : null}
        <ul className="flex flex-wrap gap-5">
          {settings.credits.map((credit) => (
            <li key={credit.id}>
              {credit.href ? (
                <a
                  href={credit.href}
                  target="_blank"
                  rel="noreferrer"
                  className="label text-white/60 hover:text-white"
                >
                  {credit.label}
                </a>
              ) : (
                <span className="label text-white/60">{credit.label}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {settings.marqueeText ? (
        <div className="overflow-hidden border-t border-white/15 py-3" aria-hidden="true">
          <div className="flex whitespace-nowrap">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="label px-6 text-white/40">
                {settings.marqueeText}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </footer>
  );
}
