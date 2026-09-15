import { NextResponse } from 'next/server';
import { subscribeSchema } from '@/lib/subscribe-schema';

/**
 * Writes an order-modal signup into Strapi's `subscriber` collection.
 *
 * Runs server-side so the browser never sees a Strapi token, and so the
 * honeypot and validation cannot be bypassed by editing the client.
 */
export async function POST(request: Request) {
  const parsed = subscribeSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ ok: false, reason: 'invalid' }, { status: 400 });
  }

  // Honeypot filled means a bot. Report success so it learns nothing.
  if (parsed.data.smartToken) {
    return NextResponse.json({ ok: true });
  }

  const base = process.env.STRAPI_INTERNAL_URL?.replace(/\/$/, '') ?? 'http://localhost:1337';
  const token = process.env.STRAPI_API_TOKEN;

  const res = await fetch(`${base}/api/subscribers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      data: {
        email: parsed.data.email,
        source: 'homepage-order-modal',
        userAgent: request.headers.get('user-agent')?.slice(0, 255) ?? null,
        submittedAt: new Date().toISOString(),
      },
    }),
    cache: 'no-store',
  });

  if (res.ok) return NextResponse.json({ ok: true });

  // `email` is unique in Strapi, so a repeat signup comes back as a 400.
  // That person is already subscribed — telling them something went wrong
  // would be a lie, and they would just try again.
  if (res.status === 400) {
    const body = await res.text().catch(() => '');
    if (body.includes('unique') || body.includes('taken')) {
      return NextResponse.json({ ok: true, alreadySubscribed: true });
    }
  }

  return NextResponse.json({ ok: false, reason: 'upstream' }, { status: 502 });
}
