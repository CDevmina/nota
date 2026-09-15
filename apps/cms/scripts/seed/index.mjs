#!/usr/bin/env node
/**
 * Loads the homepage's initial content into a Strapi instance.
 *
 *   STRAPI_URL=https://cms-xxxx.up.railway.app \
 *   STRAPI_SEED_TOKEN=<full-access token> \
 *   node scripts/seed/index.mjs [--media ../../assets/reference] [--dry-run]
 *
 * Idempotent: single types are replaced wholesale, so running it twice leaves
 * the same result. Everything it writes stays fully editable in the admin panel
 * afterwards — this seeds a starting point, it is not a runtime dependency.
 *
 * Plain .mjs rather than TypeScript on purpose: this is a build tool, not
 * application code, and it runs with bare `node` without a compile step.
 */

import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { siteSettings, homepage } from './content.mjs';

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const MEDIA_DIR = (() => {
  const i = args.indexOf('--media');
  return i !== -1 && args[i + 1] ? path.resolve(args[i + 1]) : null;
})();

const URL_BASE = (process.env.STRAPI_URL ?? 'http://localhost:1337').replace(/\/$/, '');
const TOKEN = process.env.STRAPI_SEED_TOKEN;

if (!TOKEN && !DRY_RUN) {
  console.error(
    'STRAPI_SEED_TOKEN is required.\n' +
      'Create one in Strapi → Settings → API Tokens → Create:\n' +
      '  name: seed · type: Full access · duration: Unlimited',
  );
  process.exit(1);
}

const log = {
  step: (m) => console.log(`\n\x1b[1m${m}\x1b[0m`),
  ok: (m) => console.log(`  \x1b[32m✓\x1b[0m ${m}`),
  warn: (m) => console.log(`  \x1b[33m!\x1b[0m ${m}`),
  fail: (m) => console.log(`  \x1b[31m✗\x1b[0m ${m}`),
};

async function api(pathname, { method = 'GET', body, query = '' } = {}) {
  const res = await fetch(`${URL_BASE}/api/${pathname}${query}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }

  if (!res.ok) {
    const errors = json?.error?.details?.errors;
    const detail = errors
      ? `\n` + errors.slice(0, 6).map((e) => `      ${e.path?.join(".")}: ${e.message}`).join("\n") +
        (errors.length > 6 ? `\n      … and ${errors.length - 6} more` : "")
      : (json?.error?.message ?? text.slice(0, 300));
    throw new Error(`${method} ${pathname} → ${res.status}: ${detail}`);
  }
  return json;
}

/* ------------------------------------------------------------------ media */

/**
 * Uploads every file in the media directory once and returns filename → id.
 * Files already in Strapi are reused rather than duplicated, so re-running the
 * seed does not fill the volume with copies — which matters on Railway's
 * 0.5 GB Trial volume.
 */
async function uploadMedia() {
  if (!MEDIA_DIR) {
    log.warn('No --media directory given; sections will be seeded without imagery.');
    return new Map();
  }
  if (!existsSync(MEDIA_DIR)) {
    log.warn(`Media directory not found: ${MEDIA_DIR}`);
    return new Map();
  }

  const files = (await readdir(MEDIA_DIR)).filter((f) => !f.startsWith('.'));
  if (files.length === 0) {
    log.warn(`No files in ${MEDIA_DIR}`);
    return new Map();
  }

  const existing = await api('upload/files?pagination[pageSize]=500').catch(() => []);
  const byName = new Map(
    (Array.isArray(existing) ? existing : []).map((f) => [f.name, f.id]),
  );

  const map = new Map();

  for (const file of files) {
    if (byName.has(file)) {
      map.set(file, byName.get(file));
      log.ok(`${file} (already uploaded)`);
      continue;
    }

    if (DRY_RUN) {
      log.ok(`${file} (dry run)`);
      continue;
    }

    const buffer = await readFile(path.join(MEDIA_DIR, file));
    const form = new FormData();
    form.append('files', new Blob([buffer]), file);

    const res = await fetch(`${URL_BASE}/api/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: form,
    });

    if (!res.ok) {
      log.fail(`${file}: ${res.status} ${await res.text().catch(() => '')}`);
      continue;
    }

    const [uploaded] = await res.json();
    map.set(file, uploaded.id);
    log.ok(`${file} → id ${uploaded.id}`);
  }

  return map;
}

/* ---------------------------------------------------------------- shaping */

const MULTI_MEDIA_FIELDS = ['frames'];

const MEDIA_FIELDS = [
  'image',
  'mobileImage',
  'video',
  'mobileVideo',
  'poster',
  'brandMark',
  'ogImage',
  'logo',
];

/**
 * Swaps every `{ image: 'file.jpg' }` for the uploaded media id.
 *
 * `shared.media.image` is required, so a media component whose image has not
 * been uploaded cannot be written at all — Strapi rejects the whole document
 * with "image must be defined". Such a component is dropped entirely rather
 * than sent half-empty, which lets the seed run before the imagery exists and
 * lets the section render without it.
 */
function resolveMedia(value, media) {
  if (Array.isArray(value)) return value.map((v) => resolveMedia(v, media));
  if (!value || typeof value !== 'object') return value;

  const out = {};
  let missingRequiredImage = false;

  for (const [key, raw] of Object.entries(value)) {
    // A multiple-media field: an array of filenames becomes an array of ids,
    // dropping any that were never uploaded rather than sending nulls.
    if (Array.isArray(raw) && MULTI_MEDIA_FIELDS.includes(key)) {
      out[key] = raw.map((name) => media.get(name)).filter((id) => id !== undefined);
      continue;
    }

    if (typeof raw === 'string' && MEDIA_FIELDS.includes(key)) {
      const id = media.get(raw);
      if (id === undefined) {
        if (key === 'image') missingRequiredImage = true;
        out[key] = null;
      } else {
        out[key] = id;
      }
      continue;
    }

    out[key] = resolveMedia(raw, media);
  }

  // A shared.media component is identifiable by carrying both image and alt.
  if (missingRequiredImage && 'alt' in out) return null;

  return out;
}

/* ----------------------------------------------------------------- write */

/**
 * Strapi 5 writes to the draft by default. `status=published` asks it to write
 * straight to the published version; if the running version rejects that, the
 * content still lands as a draft and one click in the admin publishes it.
 */
async function putSingleType(name, data) {
  if (DRY_RUN) {
    log.ok(`${name} (dry run, ${JSON.stringify(data).length} bytes)`);
    return;
  }

  try {
    await api(name, { method: 'PUT', body: { data }, query: '?status=published' });
    log.ok(`${name} written and published`);
  } catch (error) {
    if (!/status/i.test(String(error))) throw error;
    await api(name, { method: 'PUT', body: { data } });
    log.warn(`${name} written as a draft — publish it once in the admin panel`);
  }
}

/* ------------------------------------------------------------------ main */

async function main() {
  console.log(`\nSeeding ${URL_BASE}${DRY_RUN ? '  (dry run)' : ''}`);

  log.step('1. Media');
  const media = await uploadMedia();

  log.step('2. Site settings');
  await putSingleType('site-setting', resolveMedia(siteSettings, media));

  log.step('3. Homepage');
  await putSingleType('homepage', resolveMedia(homepage, media));

  log.step('Done');
  console.log(
    `  ${homepage.sections.length} sections · ${media.size} media files\n` +
      '  Check the live site. If nothing changed, publish both single types\n' +
      '  in the admin panel and confirm the revalidate webhook returned 200.\n',
  );
}

main().catch((error) => {
  console.error(`\n\x1b[31mSeed failed:\x1b[0m ${error.message}\n`);
  process.exit(1);
});
