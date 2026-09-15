/**
 * Shapes returned by the Strapi REST API, mirroring the schemas in
 * `apps/cms/src/components` and `apps/cms/src/api`.
 *
 * Kept hand-written rather than generated because Strapi's generated types
 * describe the *server* model (including draft/publish plumbing and populated
 * relations we never ask for), while these describe exactly what our queries
 * return. When a schema changes, this file changes with it.
 */

export interface StrapiImage {
  url: string;
  width: number;
  height: number;
  alternativeText: string | null;
  mime: string;
}

/** A section's media slot. The reference art-directs per breakpoint. */
export interface Media {
  image: StrapiImage | null;
  alt: string;
  mobileImage: StrapiImage | null;
  video: StrapiImage | null;
  mobileVideo: StrapiImage | null;
  poster: StrapiImage | null;
}

export interface Link {
  id: number;
  label: string;
  href: string;
  isExternal: boolean;
}

export interface Cta {
  label: string;
  productName: string | null;
  price: number | null;
  currency: string | null;
}

export interface OrderModal {
  title: string;
  description: string | null;
  emailPlaceholder: string;
  submitLabel: string;
  closeLabel: string;
  successMessage: string;
  errorMessage: string;
  requiredMessage: string;
}

export interface Credit {
  id: number;
  label: string;
  href: string | null;
}

export interface Seo {
  metaTitle: string;
  metaDescription: string;
  ogImage: StrapiImage | null;
  canonicalUrl: string | null;
  noindex: boolean;
}

export interface SiteSettings {
  logo: StrapiImage | null;
  headerLinks: Link[];
  cta: Cta | null;
  orderModal: OrderModal | null;
  footerTagline: string | null;
  footerNavTitle: string | null;
  footerLinks: Link[];
  yearLabel: string | null;
  year: string | null;
  copyright: string | null;
  credits: Credit[];
  marqueeText: string | null;
}

/* ------------------------------------------------------------------ sections */

interface SectionBase {
  id: number;
  anchorId: string | null;
}

export interface PreloaderSection extends SectionBase {
  __component: 'sections.preloader';
  brandMark: StrapiImage | null;
  durationMs: number | null;
  suffix: string | null;
}

export interface HeroSection extends SectionBase {
  __component: 'sections.hero';
  headlineTop: string;
  headlineBottom: string;
  media: Media | null;
  /** Scroll-scrubbed sequence, in order. Empty falls back to the still image. */
  frames: StrapiImage[];
}

export interface SpecificationsSection extends SectionBase {
  __component: 'sections.specifications';
  eyebrow: string | null;
  title: string;
  media: Media | null;
  groups: { id: number; title: string; items: { id: number; label: string }[] }[];
}

export interface ManifestoSection extends SectionBase {
  __component: 'sections.manifesto';
  body: string;
  showRule: boolean;
}

export interface AudienceSection extends SectionBase {
  __component: 'sections.audience';
  label: string | null;
  intro: { id: number; paragraph: string }[];
  items: { id: number; title: string; body: string; indentLevel: number | null }[];
}

export interface TransitionSection extends SectionBase {
  __component: 'sections.transition';
  lineTop: string;
  lineBottom: string;
  mutedColor: string | null;
  theme: 'light' | 'dark' | null;
}

export interface FeaturesSection extends SectionBase {
  __component: 'sections.features';
  slides: {
    id: number;
    headlineTop: string;
    headlineMiddle: string | null;
    headlineBottom: string | null;
    cardTitle: string;
    cardBody: string;
    media: Media | null;
  }[];
}

export interface InsideBoxSection extends SectionBase {
  __component: 'sections.inside-box';
  titleTop: string | null;
  titleBottom: string;
  subtitle: string | null;
  description: string | null;
  longCopy: string | null;
  boxMedia: Media | null;
  products: { id: number; title: string; body: string; media: Media | null }[];
  tags: { id: number; label: string; media: Media | null }[];
}

export interface ColorwaysSection extends SectionBase {
  __component: 'sections.colorways';
  items: {
    id: number;
    name: string;
    tagline: string;
    gradientStart: string;
    gradientEnd: string;
    textColor: string;
    media: Media | null;
  }[];
}

/** Every entry the homepage dynamic zone can hold. */
export type Section =
  | PreloaderSection
  | HeroSection
  | SpecificationsSection
  | ManifestoSection
  | AudienceSection
  | TransitionSection
  | FeaturesSection
  | InsideBoxSection
  | ColorwaysSection;

export type SectionComponent = Section['__component'];

export interface Homepage {
  seo: Seo | null;
  sections: Section[];
}
