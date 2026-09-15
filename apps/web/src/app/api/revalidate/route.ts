import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { HOMEPAGE_TAG } from '@/lib/strapi';

/**
 * Strapi webhook target.
 *
 * This is the half of the contract that makes publishing update the live site
 * without a code deploy: every Strapi read is tagged `homepage`, and this route
 * drops that tag so the next request refetches.
 *
 * Configure in Strapi → Settings → Webhooks with a header of
 * `x-revalidate-secret: <REVALIDATE_SECRET>`, firing on entry.publish,
 * entry.update, entry.unpublish, media.create and media.update.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;

  // Fail closed. An unset secret would otherwise leave the route open to anyone.
  if (!secret) {
    return NextResponse.json({ revalidated: false, reason: 'not configured' }, { status: 500 });
  }

  if (request.headers.get('x-revalidate-secret') !== secret) {
    return NextResponse.json({ revalidated: false, reason: 'bad secret' }, { status: 401 });
  }

  revalidateTag(HOMEPAGE_TAG);

  return NextResponse.json({ revalidated: true, tag: HOMEPAGE_TAG, at: Date.now() });
}
