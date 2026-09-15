import type { Homepage, SiteSettings, StrapiImage } from './types';

/**
 * Server-side Strapi client.
 *
 * Reads go over Railway's private network (`STRAPI_INTERNAL_URL`), so CMS
 * traffic never leaves the project and the API token never reaches the browser.
 * Image URLs are rewritten to the public domain because the *browser* resolves
 * those, and it cannot see the private network.
 *
 * Every read is tagged `homepage`. A Strapi webhook hits `/api/revalidate`,
 * which calls `revalidateTag('homepage')` — that is what makes publishing
 * update the live site with no redeploy.
 */

export const HOMEPAGE_TAG = 'homepage';

const INTERNAL_URL =
  process.env.STRAPI_INTERNAL_URL?.replace(/\/$/, '') ?? 'http://localhost:1337';

const PUBLIC_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, '') ?? 'http://localhost:1337';

class StrapiError extends Error {
  constructor(
    public readonly path: string,
    public readonly status: number,
    message: string,
  ) {
    super(`Strapi ${status} on ${path}: ${message}`);
    this.name = 'StrapiError';
  }
}

async function get<T>(path: string, params: Record<string, string> = {}): Promise<T | null> {
  const url = new URL(`${INTERNAL_URL}/api/${path}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

  const token = process.env.STRAPI_API_TOKEN;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      next: { tags: [HOMEPAGE_TAG] },
    });
  } catch (cause) {
    // Strapi unreachable. This is normal during a Railway build — the builder
    // has no private-network route to the cms service, and cms may not even be
    // running yet. Returning null lets the build finish and produce a page that
    // fetches successfully at request time, instead of failing the deploy.
    console.warn(`[strapi] unreachable at ${INTERNAL_URL}/api/${path}:`, cause);
    return null;
  }

  // An unpublished or not-yet-created single type is a legitimate empty state,
  // not a failure — the site should still render its shell.
  if (res.status === 404) return null;

  if (!res.ok) {
    throw new StrapiError(path, res.status, await res.text().catch(() => res.statusText));
  }

  const json = (await res.json()) as { data: T | null };
  return json.data ?? null;
}

/**
 * Strapi returns media paths relative to its own origin when using local
 * upload storage. The browser needs the public domain; the private one is
 * unreachable from outside the Railway project.
 */
function absolutise<T>(value: T): T {
  if (typeof value === 'string') {
    return (value.startsWith('/uploads/') ? `${PUBLIC_URL}${value}` : value) as T;
  }
  if (Array.isArray(value)) return value.map(absolutise) as T;
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = absolutise(v);
    return out as T;
  }
  return value;
}

/** `populate=*` stops at one level; the dynamic zone needs the deep form. */
const DEEP = { 'populate[sections][populate]': '*', 'populate[seo][populate]': '*' };

export async function getHomepage(): Promise<Homepage | null> {
  const data = await get<Homepage>('homepage', {
    ...DEEP,
    'populate[sections][populate][media][populate]': '*',
    'populate[sections][populate][groups][populate]': '*',
    'populate[sections][populate][items][populate]': '*',
    'populate[sections][populate][intro][populate]': '*',
    'populate[sections][populate][slides][populate]': '*',
    'populate[sections][populate][products][populate]': '*',
    'populate[sections][populate][tags][populate]': '*',
    'populate[sections][populate][boxMedia][populate]': '*',
    'populate[sections][populate][brandMark][populate]': '*',
  });
  return data ? absolutise(data) : null;
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const data = await get<SiteSettings>('site-setting', {
    'populate[logo][populate]': '*',
    'populate[headerLinks][populate]': '*',
    'populate[footerLinks][populate]': '*',
    'populate[credits][populate]': '*',
    'populate[cta][populate]': '*',
    'populate[orderModal][populate]': '*',
  });
  return data ? absolutise(data) : null;
}

/** Public base URL, for the few places the browser builds its own media URL. */
export function mediaUrl(image: StrapiImage | null | undefined): string | null {
  if (!image?.url) return null;
  return image.url.startsWith('http') ? image.url : `${PUBLIC_URL}${image.url}`;
}
