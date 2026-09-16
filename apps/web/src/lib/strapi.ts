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

function buildUrl(origin: string, path: string, params: Record<string, string>) {
  const url = new URL(`${origin}/api/${path}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  return url;
}

/**
 * Reads an endpoint, preferring the private network and falling back to the
 * public domain.
 *
 * The fallback is what makes builds produce real content: Railway's builder has
 * no route to cms.railway.internal, so a build-time fetch over the private
 * network always fails, and without this every deploy baked an empty page that
 * stayed empty until a webhook or ISR rescued it. At request time the private
 * hop succeeds and the fallback never runs, so live traffic still never leaves
 * the Railway project.
 */
async function get<T>(path: string, params: Record<string, string> = {}): Promise<T | null> {
  const token = process.env.STRAPI_API_TOKEN;
  const origins = INTERNAL_URL === PUBLIC_URL ? [INTERNAL_URL] : [INTERNAL_URL, PUBLIC_URL];

  let res: Response | null = null;
  let lastCause: unknown = null;

  for (const origin of origins) {
    try {
      res = await fetch(buildUrl(origin, path, params), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        next: { tags: [HOMEPAGE_TAG] },
      });
      break;
    } catch (cause) {
      lastCause = cause;
      res = null;
    }
  }

  if (!res) {
    // Strapi unreachable. This is normal during a Railway build — the builder
    // has no private-network route to the cms service, and cms may not even be
    // running yet. Returning null lets the build finish and produce a page that
    // fetches successfully at request time, instead of failing the deploy.
    console.error(`[strapi] no route to ${path} on ${origins.join(' or ')}:`, lastCause);
    return null;
  }

  // An unpublished or not-yet-created single type is a legitimate empty state,
  // not a failure — the site should still render its shell.
  if (res.status === 404) return null;

  if (!res.ok) {
    // Deliberately not thrown. A CMS error used to take the whole page down
    // with a 500; a live site showing its empty state is far better than one
    // showing an error, and the cause is logged in full for the server log.
    console.error(
      new StrapiError(path, res.status, await res.text().catch(() => res.statusText)),
    );
    return null;
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

/**
 * Strapi 5 populates a dynamic zone per component, through `on`, not with a
 * single shared `populate` — `populate[sections][populate]` is rejected as
 * "Invalid key populate at sections".
 *
 * Every component must be listed: `on` is an allowlist, so an omitted one is
 * dropped from the response entirely rather than returned unpopulated.
 */
const SECTION_POPULATE: Record<string, string[]> = {
  'sections.preloader': ['brandMark'],
  'sections.hero': ['media', 'frames'],
  'sections.specifications': ['media', 'groups.items'],
  'sections.manifesto': [],
  'sections.audience': ['intro', 'items', 'media'],
  'sections.transition': [],
  'sections.features': ['slides.media'],
  'sections.inside-box': ['boxMedia', 'products.media', 'tags.media'],
  'sections.colorways': ['items.media'],
};

function sectionParams(): Record<string, string> {
  const params: Record<string, string> = {};

  for (const [component, paths] of Object.entries(SECTION_POPULATE)) {
    const base = `populate[sections][on][${component}][populate]`;

    if (paths.length === 0) {
      params[base] = '*';
      continue;
    }

    for (const path of paths) {
      // "groups.items" -> [groups][populate][items][populate]
      const key = path
        .split('.')
        .map((segment) => `[${segment}][populate]`)
        .join('');
      params[`${base}${key}`] = '*';
    }
  }

  return params;
}

export async function getHomepage(): Promise<Homepage | null> {
  const data = await get<Homepage>('homepage', {
    'populate[seo][populate]': '*',
    ...sectionParams(),
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
