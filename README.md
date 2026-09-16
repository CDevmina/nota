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
npm run seed
```

It is idempotent — single types are replaced wholesale and media is
deduplicated by filename, so running it twice changes nothing. Everything it
writes stays fully editable in the admin panel afterwards; nothing reads that
file at runtime.

**On imagery.** The reference's renders are not committed here — they are
someone else's artwork, and a public repo is not the place to redistribute
them. So a local seed gives you all the copy and structure with empty media
fields, which is enough to work on the CMS or the layout. Point the script at
a folder of images to fill them in:

```bash
npm run seed -- --media /path/to/images
```

Filenames have to match the ones in `scripts/seed/content.mjs`. The deployed
site's media is already uploaded and lives on the Railway volume, so this only
matters for a local copy.

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
zone** rather than fixed fields. 23 components across 7 categories, 3 content
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

The brief names four things it assesses, and with a fixed deadline they
compete. Where they did, here is what I chose and what it cost.

**I put the content model and the infrastructure first, and some of the
animation second.** Those two are the parts a reviewer can check properly, and
they are the parts a real team would have to live with. So the Strapi model and
the Railway setup are finished, and a handful of the reference's smaller motion
details are not — a couple of image sequences, and a transition or two that
behave more simply than the original's. The page reads and scrolls correctly
throughout; what is missing is polish, not function.

**I shipped without tests.** There are none, and I would rather say that than
pad the repo with a few token ones. Given the time, I spent it on making the
thing work and on writing down why it is built the way it is.

**I did not optimise loading.** Images go out at a single size to every device,
and I have not run Lighthouse or an accessibility audit. The site is
statically served and fast enough to demo, but I have not measured it, so I am
not going to claim a number.

**I verified in the browser, not on hardware.** Every size was checked against
the reference's own breakpoint, but on a desktop browser rather than a real
phone.

---

## What I'd improve with more time

- **Cleaner animations.** Finish the motion details that are missing or
  simplified, and smooth the transitions that are closest to the reference but
  not yet identical to it.
- **UI refinements.** A pass over the remaining spacing and alignment
  differences, and the smaller interaction states.
- **Tests.** Starting with the two things that would break quietly: content
  publishing reaching the live site, and a repeat email signup.
- **Speed and loading.** Responsive image sizes, a smaller hero payload, and a
  proper Lighthouse and accessibility pass.

---

## AI tools used

**Claude Code (Claude Opus 5)** — used throughout, Specifically:

- Scaffolding both apps and the Railway configurations.
- Writing the Strapi content model, the seed script, and React components.
- Extracting the 75 hero frames from the reference page.
- Diagnosing bugs from recordings compared frame by frame.

I reviewed and directed all of it, and corrected it repeatedly.
