import type { MetadataRoute } from 'next';

/**
 * Required by the brief: the design belongs to its original creators, so the
 * rebuild must not be indexed. This disallow and the noindex meta tag are both
 * deliberate and must not be removed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', disallow: '/' },
  };
}
