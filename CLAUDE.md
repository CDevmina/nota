# CLAUDE.md — NŌTA homepage rebuild

Working agreement for Claude Code on this repo. The repo sits inside a
workspace folder that holds the working docs; read `../docs/PLAN.md` and
`../docs/reference-inventory.md` before writing any component.

## What this is

A rebuild of the homepage of `https://nota.uprock.pro/` as an interview
assignment for Surge Global (Senior Web Developer). Due **09:00 Asia/Colombo,
Wed 16 Sep 2026**. The brief names four assessment criteria, without weighting
them: visual/interaction accuracy, Strapi content modelling and editing
experience, code quality and structure, Railway setup (services, variables,
networking). Assume all four matter; two of them — the content model and the
infrastructure — are far cheaper to earn than pixel-perfect scroll animation.

## Hard rules — these are pass/fail

1. **No hardcoded content. Ever.** Every string, image, link, price, nav item
   and SEO field renders from Strapi. If you are about to type user-facing copy
   into a `.tsx` file, stop — it belongs in a Strapi field. The only literals
   allowed in components are CSS class names, ARIA labels and dev-only fallbacks
   clearly marked `// DEV FALLBACK`.
2. **Publishing in Strapi must update the live site with no redeploy.** Every
   Strapi read is tagged `next: { tags: ['homepage'] }`; a Strapi webhook hits
   `POST /api/revalidate` which calls `revalidateTag`. Never "fix" a staleness
   bug with `export const dynamic = 'force-dynamic'`.
3. **Write our own code.** Reusing the reference's *images* is explicitly
   permitted. Copying its HTML, CSS or JS is not. No site-cloning or export
   tools. Do not paste markup or styles lifted from the reference.
4. **`noindex` stays on.** The design belongs to UPROCK Studio. The robots meta
   and `robots.txt` disallow are required by the brief and must not be removed.
5. **Uploaded media must survive a redeploy.** Strapi uploads live on a Railway
   volume mounted at `/app/public/uploads`. Never store uploads in the
   container filesystem or commit them to git.

## Layout

```
nota-homepage/              workspace — not a git repo
├── docs/                   working docs, NOT submitted
│   ├── PLAN.md
│   ├── reference-inventory.md
│   └── getting-started.md
├── assets/reference/       harvested reference imagery, pre-upload
└── nota/                   THE GIT REPO — this is what gets submitted
    ├── README.md           the six sections the brief names
    ├── CLAUDE.md           this file
    ├── docs/
    │   ├── content-model.md
    │   └── railway-setup.md
    ├── apps/web            Next.js 15, App Router, TS → Railway service "web"
    └── apps/cms            Strapi 5                   → Railway service "cms"
```

Only the repo is submitted. Anything a reviewer should not see — the schedule,
the reference transcript, the harvested assets — stays in the workspace above
it.

## Stack decisions (already made — do not relitigate)

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 15 App Router | tag revalidation, RSC keeps the Strapi token server-side |
| Styling | Tailwind v4 + CSS Modules where animation needs precision | |
| Scroll choreography | CSS `position: sticky` "camera" containers, driven by scroll progress | this is what the reference actually does — see below |
| Animation | GSAP 3, ScrollTrigger for enter-triggers only | tweening and one-shot reveals; **not** for pinning |
| Smooth scroll | Lenis, desktop only (≥992px) | matches the reference exactly, including the breakpoint |
| Forms | react-hook-form + zod, one schema shared client/server | |
| CMS | Strapi 5, self-hosted, Postgres | required by the brief |
| Host | Railway, two services + Postgres + volume | required by the brief |

## How the reference actually scrolls — do not build this with ScrollTrigger pins

Verified against the live site: `ScrollTrigger.getAll()` returns **0** at every
scroll depth. GSAP is loaded, but the reference uses it for exactly one thing —
a per-letter scramble reveal on the nav links and the hero headline. Every big
effect is CSS.

The pattern is a **sticky camera**: a tall outer section, and inside it a child
of `height: 100vh; position: sticky; top: 0`. The child holds still while the
parent scrolls past, and the parent's scroll progress drives transforms on the
child's contents. The reference has 15 of these, named `*__camera`, plus
sections with negative top margins so one camera can overlap the next. That is
the whole mechanism behind the staircase wipe, the spec-card expansion, the
manifesto scrub, the "pinned" feature carousel, the circular mask, the venetian
blind and the colourway morph.

Build it the same way:

- Section height sets the duration. A camera whose parent is `300vh` tall gets
  three screens of scroll to play in.
- Read progress once per frame from a single scroll listener (or one
  `ScrollTrigger` in `onUpdate` mode with no `pin`), and write it to a CSS
  custom property on the section. Drive the visuals from that property.
- Never pass `pin: true`. No pin means no pin-spacer, no layout reflow on
  refresh, and none of the iOS Safari viewport-unit breakage that pinning
  causes.
- Mobile collapses rather than pins: the reference drops from 27.3 screens at
  1456px to 15.3 at 375px. Shorten the outer sections at narrow widths and let
  the camera become a normal static block.
- Use `100svh`, not `100vh`, for camera heights so mobile browser chrome does
  not shift them.

GSAP still earns its place for tweening, the scramble reveal and enter-triggers.
Keep that work inside `gsap.context()`.

## Typography (measured off the reference at 1456px — use these exactly)

- Display serif: **Instrument Serif**, weight 400. Google Fonts, free.
  Two tiers:
  - Standard: `6.67vw`, `line-height: 1`, `letter-spacing: -0.04em`. Used for
    "Nota pen / Specifications", the colourway headlines and the order modal's
    "Stay ahead".
  - Oversized: `10.42vw`, `line-height: 0.8`, `letter-spacing: -0.05em`. Used
    for the full-bleed transition headings — "Works with / smart paper" and
    "Inside / the box".
- UI sans: **Inter**. The reference also loads YS Text for some UI; Inter is the
  substitute and is close enough.
- Split-heading grey (the muted line of a two-tone heading): `#666666` — except
  "Inside", which is `#999999`. Both greys are real; don't unify them.
- Section card titles: Inter 600, `1.53vw`, `line-height: 1`,
  `letter-spacing: -0.07em`. Covers spec-group titles, audience titles, product
  card titles and "A complete, ready-to-use set".
- Small labels and nav: Inter 500, `1.11vw`, `letter-spacing: -0.04em`,
  `line-height: 1`. Spec list items are the same size at
  `letter-spacing: -0.05em`, `line-height: 1.3`.
- Header height: `113px` desktop, `76px` mobile.

Every figure above was measured in the browser at a 1456px viewport. If you
re-measure, record the viewport width alongside the pixel value — the original
numbers in this file were px at 1512px divided by 1456, which is how they came
out ~4% too large.

## Code conventions

- TypeScript strict. No `any` — generate types from the Strapi schema.
- Server Components by default. `'use client'` only where GSAP, Lenis or form
  state genuinely require it. Animation lives in leaf client components; data
  fetching stays on the server.
- One React component per Strapi section component, resolved by `__component`
  in `SectionRenderer`. Adding a section to the CMS should mean adding one file.
- All GSAP work inside `gsap.context()` with cleanup in the effect return.
  Call `ScrollTrigger.refresh()` after fonts load and on resize.
- Scroll listeners are passive, read layout once per frame, and write only CSS
  custom properties — never read `offsetTop` inside a scroll handler.
- Respect `prefers-reduced-motion`: cameras stop tracking scroll and their
  contents render in the final state, stacked.
- Never commit `.env`. Keep `.env.example` current whenever you add a variable.

## Definition of done for a section

A section is finished when: it renders entirely from Strapi, it matches the
reference at 1440 / 1024 / 768 / 390, its interaction works both scrolling down
and back up, it degrades sanely with reduced motion, and nothing in it is
hardcoded.

## Git workflow

**Never commit directly to `main`.** Every change lands through a branch, even
a one-line fix. `main` stays deployable at all times because Railway builds
from it — a broken commit on `main` is a broken live site, and they review the
last deployment before the deadline.

Branch names are `<type>/<short-kebab-summary>`, using the same types as the
commit prefixes: `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`. One concern
per branch — `feat/colourway-section`, not `feat/tuesday-work`.

The loop:

```bash
git checkout main && git pull
git checkout -b feat/colourway-section
# ... work, committing as you go ...
git push -u origin feat/colourway-section
gh pr create --fill                  # opens the PR
gh pr merge --merge --delete-branch  # merge commit, not squash
```

Merge with a **merge commit** (`--no-ff` locally, `--merge` via `gh`), never
squash or rebase-merge. The branch topology is the record of how the build was
sequenced, and that is worth more to a reviewer than a flat line of commits.
Delete the branch after merging.

Rules that don't bend: never force-push `main`, never commit `.env` or
`node_modules`, and never merge a branch whose `npm run build` fails in either
app. If a branch turns out to be a dead end, delete it rather than merging it
half-finished.

Self-merging your own PRs is fine here — it is a solo repo, and the PR exists
for the paper trail and the diff, not for approval.

## Commit style

Conventional-ish, present tense, scoped: `feat(web): add colourway camera`,
`feat(cms): add colorway component`, `chore(railway): add uploads volume`.
Commit often — they review the last commit before the deadline.

Write the body for someone reading it cold in six months: what changed and
*why*, not a restatement of the diff. Skip the body only when the subject line
genuinely says everything.

## Things that will lose marks

- A string in the JSX that should have been a CMS field.
- A publish that needs a redeploy to show up.
- Uploads that vanish after a redeploy.
- A sticky camera that breaks on a phone, or a `pin: true` anywhere.
- A string measured off the reference at the wrong viewport width.
- A README missing any of the six required sections.
- Pasted CSS from the reference.
