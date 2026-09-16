# NŌTA homepage rebuild

A rebuild of the homepage of `https://nota.uprock.pro/`, driven entirely by a
self-hosted Strapi CMS and deployed on Railway. Built as an interview assignment
for Surge Global.

The design belongs to its original creators, **Alice & UPROCK Studio**. This
build carries a `noindex` tag and a `robots.txt` disallow, and comes down once
the interview round closes.

| | |
|---|---|
| **Live site** | https://web-production-d6789d.up.railway.app |
| **Strapi admin** | https://cms-production-4249.up.railway.app/admin |
| **Repository** | https://github.com/CDevmina/nota |

```
nota/
├── apps/web     Next.js 15 · App Router · TypeScript   → Railway service "web"
├── apps/cms     Strapi 5 · Postgres                    → Railway service "cms"
└── docs/        content model and Railway topology
```

---

## Why I chose this framework

**Next.js 15, App Router.** Three properties of the brief pointed at it.

*Publishing has to update the live site without a deploy.* Next's tag-based
revalidation does this exactly: every Strapi read is tagged `homepage`, and a
Strapi webhook calls `revalidateTag('homepage')` through `POST /api/revalidate`.
The page regenerates on the next request. No polling, no rebuild, and crucially
no `force-dynamic` — the site stays statically served and fast between edits.

*Nothing may be hardcoded, and the CMS token must not leak.* Server Components
fetch from Strapi on the server, so `STRAPI_API_TOKEN` never reaches the
browser. `'use client'` appears only where scroll or form state genuinely
require it, and those components receive their content as props.

*The page is one long scroll with heavy imagery.* Static generation plus
per-tag revalidation gives a CDN-speed first paint while keeping the content
editable, which a fully dynamic app would trade away.

I pinned **15** rather than 16 deliberately. `create-next-app@latest` installed
16, whose own generated notes warn that its APIs and conventions differ from
most published documentation. With a short deadline and a call where I have to
explain every line, being able to trust the documentation I look up was worth
more than being on the newest major.

**Supporting choices:** Tailwind v4 for layout, GSAP and Lenis for motion
(matching what the reference itself loads), react-hook-form with zod for the
one form — one schema shared by the browser and the server so validation cannot
diverge.

---

## How to run it locally

**Requirements:** Node 22.x (`.nvmrc` pins it) and Docker.

```bash
git clone https://github.com/CDevmina/nota.git
cd nota
```

**1. Database.** Postgres 16 in Docker, matching what Railway provisions —
developing on SQLite would let connection and migration bugs hide until
deployment.

```bash
docker compose up -d
```

**2. CMS** → http://localhost:1337/admin

```bash
cd apps/cms
cp .env.example .env     # then fill the secrets, see below
npm install
npm run develop
```

Generate the secrets:

```bash
node -e "console.log([...Array(4)].map(()=>require('crypto').randomBytes(16).toString('base64')).join(','))"   # APP_KEYS
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"                                     # each of the others
```

**3. Content.** Rather than typing two thousand words into the admin panel,
the content lives as data in the repo and a script loads it into any Strapi
instance:

```bash
npm run seed -- --media ../../../assets/reference/upload
```

It is idempotent — single types are replaced wholesale and media is
deduplicated by filename, so running it twice changes nothing. Everything it
writes stays fully editable in the admin panel afterwards; nothing reads that
file at runtime.

**4. Site** → http://localhost:3000

```bash
cd apps/web
cp .env.example .env.local     # add the Strapi API token
npm install
npm run dev
```

---

## Content model

A **single type** per concern, with the page itself built from a **dynamic
zone** rather than fixed fields. 23 components across 6 categories, 3 content
types.

### `homepage` (single type)

| Field | Type |
|---|---|
| `seo` | `shared.seo` |
| `sections` | **dynamic zone** of the nine section components |

The dynamic zone is the central decision. An editor can reorder the page, drop
a section, or add a second transition heading without a developer. Each entry
maps 1:1 to a React component resolved by `__component` in `SectionRenderer`,
so adding a section to the CMS means adding one file and one line.

It also drives behaviour, not just order: `SectionRenderer` inserts the
full-viewport hand-over wipes wherever the page crosses between a dark and a
light section. Reorder the zone and the transitions follow.

### `site-setting` (single type)

Header links, the `Order / Nota One / $300` CTA, the order modal's copy, the
footer, the credit links and the marquee — the chrome every page shares.

The order modal lives here rather than in the dynamic zone because on the
reference it is global chrome opened from the header, with no position in the
page flow. Putting it in the zone would let someone drag a modal between the
hero and the specifications.

### `subscriber` (collection type)

The order modal's target. `email` is unique; `draftAndPublish` is off, because
a signup is not a draft.

### Components

| Category | Components |
|---|---|
| `shared` | `seo`, `link`, `cta`, `media`, `order-modal`, `credit` |
| `sections` | `preloader`, `hero`, `specifications`, `manifesto`, `audience`, `transition`, `features`, `inside-box`, `colorways` |
| `spec` | `group`, `item` |
| `audience` | `intro`, `item` |
| `feature` | `slide` |
| `colorway` | `item` |
| `inside` | `product`, `tag` |

**Modelled for an editor, not for the developer.** Repeatable items everywhere
a list exists, never one large rich-text field. Nearly every field carries a
`description` that renders as help text in the admin panel. Colour fields are
regex-constrained to hex so nobody can type "dark blue" into a value the CSS
consumes. Every section carries an `anchorId` so the four nav links keep working
when a section is renamed or moved.

`shared.media` carries `image`, `mobileImage`, `video`, `mobileVideo`, `poster`
and `alt`, because the reference art-directs per breakpoint rather than scaling
— only 13 of its 44 images render on a phone.

### Permissions

- Public role: **create only** on `subscriber`. Never `find` or `findOne`,
  or anyone could download the mailing list.
- Reads use a **read-only API token**, held server-side in `STRAPI_API_TOKEN`.

---

## Key trade-offs

**I unpacked the hero animation rather than shipping the format it came in.**
The reference's hero is a 1.7 MB Lottie file, but there is no vector animation
inside it — it is 75 photographs, and scrolling just picks which one to show.
So I pulled the frames out and show them directly. Same result, smaller, no
extra library, and the frames sit in Strapi where someone can swap them.

**The site talks to the CMS over Railway's private network, with one
exception.** Keeping that traffic internal is the right default. But the
machine that *builds* the site can't reach the private address, so the first
build produced an empty page that stayed empty. It now falls back to the
public address, which in practice only ever happens during a build.

**Images live on a Railway disk rather than a CDN.** For a real product I would
use object storage with a CDN in front. For a trial project on a small budget,
a disk does the one thing that actually matters here: uploads survive a
redeploy.

---

## What I'd improve with more time

The honest list, roughly in the order I would pick it up.

- **Hold the sections still.** The reference keeps several sections fixed on
  screen while their animation plays — the specifications, the manifesto, the
  pen card. Mine scroll past while animating. It is the largest remaining
  difference and the one I would fix first.
- **The slide-to-slide transitions in the smart-paper carousel.** Old and new
  text overlap for slightly too long, so you catch both at once.
- **Try it on real phones.** I followed the reference's own breakpoint and
  checked every size in the browser, but not on actual hardware. Safari on iOS
  moves the address bar around while you scroll, and that is the first thing I
  would want to see with my own eyes.
- **Write some tests.** There are none. I would start with the two things that
  would quietly break without anyone noticing: content publishing reaching the
  live site, and a repeat email signup being handled gracefully.
- **Serve smaller images.** Every hero frame is sent at one size to everyone.
  Phones are downloading far more than they need.
- **Run Lighthouse and an accessibility check.** I have not run either, and I
  would rather say so than guess at the scores.

---

## AI tools used

**Claude Code (Claude Opus 5)** — used throughout, Specifically:

- Scaffolding both apps and the Railway configurations.
- Writing the Strapi content model, the seed script, and React components.
- Extracting the 75 hero frames from the reference page.
- Diagnosing bugs from recordings compared frame by frame.

I reviewed and directed all of it, and corrected it repeatedly.
