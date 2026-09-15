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

**A seed script instead of hand-entering content.** Typing the copy into the
admin panel is slow, unrepeatable, and lost the moment the database is reset.
As data in the repo it is reviewable as a diff and survives a wipe. The cost is
one more moving part; the benefit is that a fresh environment is one command
away. It seeds an initial state only — nothing reads it at runtime.

**CSS sticky "cameras" rather than ScrollTrigger pinning.** I assumed the
reference pinned with GSAP and built it that way first. It does not:
`ScrollTrigger.getAll()` returns 0 at every scroll depth, and all fifteen of its
scroll effects are `position: sticky` containers inside taller sections with
negative top margins. Rebuilding to match removed a whole class of iOS
viewport-unit bugs, since there is no pin-spacer. GSAP still earns its place for
the scramble reveal.

**Every effect is a continuous function of scroll, with no transitions.** My
first attempt stepped between carousel slides and ran a timed CSS transition,
which lurched because the motion was detached from the wheel. Sampling the
reference mid-scroll showed intermediate values — those are functions of scroll
position, not transition midpoints. Opacity and scale are now computed from
progress directly, so motion tracks the wheel and reverses exactly.

**The hero as an image sequence rather than Lottie.** The reference's hero is a
1.7 MB Lottie containing 75 embedded WebP frames — an image sequence in a
wrapper, always paused, with scroll setting the frame index. I extracted the
frames, uploaded them to Strapi as an editable `frames` field, and scrub them
directly. Same motion, 1.25 MB, no Lottie runtime, and the sequence stays
editable like any other image.

**The private network, with a public fallback.** Reads prefer
`cms.railway.internal` so CMS traffic never leaves the project. But Railway's
*builder* cannot reach that address, so a build-time fetch always failed and
Next prerendered an empty page that stayed empty until a webhook rescued it.
Reads now fall back to the public domain, which only ever happens at build time.

**Media on a Railway volume rather than a CDN.** Object storage with a CDN in
front would be the production answer. A volume is what fits the trial budget,
and the brief's actual requirement is that uploads survive a redeploy, which a
volume satisfies.

---

## What I'd improve with more time

- **The audience section's scrubbed video.** The reference plays a clip there,
  scrolled rather than played. The asset is uploaded but not yet wired to that
  section — it needs a media field on the audience component.
- **Finish the remaining motion detail.** The pill-tag cards zoom further than
  ours do, and a few easing curves are approximations of the measured values
  rather than exact matches.
- **Real-device testing.** The responsive work follows the reference's own
  992px breakpoint and its collapse to a static mobile layout, but I verified it
  through emulation, not on hardware. `100svh` under iOS Safari's collapsing
  chrome is the thing I would check first.
- **Tests.** There are none. The revalidation contract and the subscribe route's
  duplicate-email handling are the two places I would start.
- **Image pipeline.** Frames are served at a single size; responsive `srcset`
  and AVIF would cut the hero's payload substantially.
- **Lighthouse and axe passes.** Neither has been run.

---

## AI tools used

**Claude Code (Claude Opus 5)** — used throughout, for effectively all of the
implementation. Specifically:

- Scaffolding both apps and the Railway configuration.
- Writing the Strapi content model, the seed script, and every React component.
- **Measuring the reference.** The most valuable use: a DOM probe that sampled
  computed styles at fixed scroll positions and reported only what changed.
  That is where the section geometry, the per-character colour values, the
  1.4→1→0.6 carousel scale and the frame-index mapping came from.
- Extracting the 75 hero frames from the reference's Lottie.
- Diagnosing bugs from recordings compared frame by frame.

I reviewed and directed all of it, and corrected it repeatedly — several rounds
were spent undoing work built on a wrong reading of the reference before I had
it measure properly rather than infer. I can explain any line in this repository
and why it is there.

**No other AI tools were used.** No site-cloning or export tools were used at
any point: the reference's images are reused, as the brief permits, and none of
its HTML, CSS or JavaScript is.
