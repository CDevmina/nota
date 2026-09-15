import type { Metadata } from 'next';
import { Instrument_Serif, Inter } from 'next/font/google';
import { getHomepage } from '@/lib/strapi';
import './globals.css';

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

/**
 * SEO comes from Strapi, including the robots directive.
 *
 * `noindex` defaults to true and stays on: the design belongs to UPROCK Studio
 * and the brief requires the tag. The CMS field exists so it is auditable, not
 * so it gets switched off.
 */
export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepage();
  const seo = homepage?.seo;
  const noindex = seo?.noindex ?? true;

  return {
    title: seo?.metaTitle ?? 'NŌTA',
    description: seo?.metaDescription ?? undefined,
    alternates: seo?.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    robots: noindex
      ? { index: false, follow: false, nocache: true }
      : { index: true, follow: true },
    openGraph: seo?.ogImage?.url
      ? {
          title: seo.metaTitle,
          description: seo.metaDescription,
          images: [{ url: seo.ogImage.url }],
        }
      : undefined,
  };
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
