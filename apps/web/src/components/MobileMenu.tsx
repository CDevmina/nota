'use client';

import { useEffect, useState } from 'react';
import type { SiteSettings } from '@/lib/types';
import OrderModal from './OrderModal';

/** Dot-grid button opening a full-screen menu. Below 992px, as on the reference. */
export default function MobileMenu({
  settings,
  price,
}: {
  settings: SiteSettings;
  price: string | null;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = open ? 'hidden' : previous;
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="grid h-10 w-10 grid-cols-3 place-content-center gap-[3px] p-2"
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="h-[3px] w-[3px] rounded-full bg-white" />
        ))}
      </button>

      {open ? (
        <div className="fixed inset-0 z-[250] flex flex-col bg-black px-6 pb-10 pt-[var(--header-h)] text-white">
          <nav aria-label="Mobile" className="mt-10 flex flex-col gap-6">
            {settings.headerLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setOpen(false)}
                className="display text-[2.5rem]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-6">
            {settings.cta && settings.orderModal ? (
              <OrderModal
                cta={settings.cta}
                price={price}
                content={settings.orderModal}
                className="inline-flex self-start"
              />
            ) : null}
            <ul className="flex flex-wrap gap-4">
              {settings.credits.map((credit) => (
                <li key={credit.id}>
                  {credit.href ? (
                    <a href={credit.href} target="_blank" rel="noreferrer" className="label text-white/60">
                      {credit.label}
                    </a>
                  ) : (
                    <span className="label text-white/60">{credit.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
