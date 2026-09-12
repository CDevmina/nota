# Strapi content model

The brief: *"All homepage content is managed in Strapi: copy, images, links,
pricing, navigation, and SEO meta. Nothing hardcoded. Model content for an
editor: components and repeatable items, not one large rich text field."*

The shape below is designed so a non-technical editor could reword, reorder or
remove any part of the page without a developer.

## Single type: `homepage`

| Field | Type |
|---|---|
| `seo` | component `shared.seo` |
| `sections` | **dynamic zone** of the section components below |

A dynamic zone rather than ten fixed fields — that is what lets an editor
reorder sections, and it is the clearest signal of content-modelling judgement.
Each entry maps 1:1 to a React component, resolved by `__component` in
`SectionRenderer`.

### Every section component carries `anchorId`

A `string`, optional, rendered as the `id` on the section's outer element. The
reference's nav is four in-page anchors (Specifications, Who it's for, About,
Inside the box), so without this the nav has nothing to point at and the links
are dead — an editor who reorders or renames a section must be able to keep its
anchor working. `shared.link.href` then holds `#specifications` and the like,
and the header resolves it through Lenis rather than native scroll.

Leave it blank on sections nothing links to. Validate it as a slug so an editor
cannot type a space.

## Single type: `site-settings`

`logo` · `headerLinks` (repeatable `shared.link`) · `cta` (`shared.cta`) ·
`orderModal` (`shared.order-modal`) · `footerTagline` · `footerNavTitle` ·
`footerLinks` (repeatable `shared.link`) · `yearLabel` · `year` · `copyright` ·
`credits` (repeatable `{ label, href }`) · `marqueeText`

`credits` holds real outbound links on the reference — Alice →
`behance.net/alicem`, UPROCK → `uprock.ru`, Taptop → `taptop.pro` — and the
same list appears in the footer *and* inside the mobile menu. One field feeds
both.

## Shared components

| Component | Fields |
|---|---|
| `shared.seo` | metaTitle, metaDescription, ogImage, canonicalUrl, **noindex (boolean, default true)** |
| `shared.link` | label, href, isExternal |
| `shared.cta` | label, productName, price (decimal), currency |
| `shared.media` | image, alt, video (optional), poster (optional), mobileImage (optional) |
| `shared.order-modal` | title, description, emailPlaceholder, submitLabel, successMessage, errorMessage, requiredMessage, closeLabel |

`shared.media.mobileImage` exists because the reference is art-directed per
breakpoint, not merely scaled.

## Section components

| Component | Fields |
|---|---|
| `sections.preloader` | brandMark, durationMs |
| `sections.hero` | headlineTop, headlineBottom, media |
| `sections.specifications` | eyebrow, title, media, `groups` → repeatable `spec.group` { title, `items` → repeatable `spec.item` { label } } |
| `sections.manifesto` | body (text), rule (boolean) |
| `sections.audience` | label, `intro` → repeatable { paragraph }, `items` → repeatable `audience.item` { title, body, indentLevel } |
| `sections.transition` | lineTop, lineBottom, theme (enum light/dark) |
| `sections.features` | `slides` → repeatable `feature.slide` { headlineTop, headlineBottom, cardTitle, cardBody, media } |
| `sections.insideBox` | titleTop, titleBottom, subtitle, description, longCopy, boxMedia, `products` → repeatable { title, body, media }, `tags` → repeatable { label, media } |
| `sections.colorways` | `items` → repeatable `colorway.item` { name, tagline, gradientStart, gradientEnd, textColor, media } |

`sections.colorways` carries the default state ("Impossible to overthink") as
its first item, so all five states are editor-managed.

### Why the order modal is not a section

It was originally modelled as `sections.orderForm` inside the dynamic zone.
That is wrong: on the reference the modal is global chrome, opened by the
`Order` pill in the header, and it has no position in the page flow. Putting it
in the dynamic zone would let an editor drag a modal between the hero and the
specifications, or delete the header's CTA target without realising. It lives
in `site-settings.orderModal` instead, next to the `cta` that opens it.

The reference's own copy, for reference: title *Stay ahead*, description
*Launching soon. Get early access and insider updates*, placeholder *E-mail*,
submit *Notify me •*, success *All set. We'll keep you posted*, error
*Something went wrong! Try again*, close *Close*. The required-field message
ships in Russian on the reference; ours is English.

## Collection type: `subscriber`

The Order modal writes here.

| Field | Type |
|---|---|
| `email` | email, required, unique |
| `source` | string, default `homepage-order-modal` |
| `userAgent` | string, optional |
| `submittedAt` | datetime |

`email` is unique, so a repeat submission comes back as a Strapi 400. Catch
that case in the route handler and return the success state — someone who signs
up twice has still signed up, and showing them *Something went wrong! Try
again* for it is a bug, not validation. Any other failure gets the error
state.

The reference also ships a `smart-token` honeypot field. Keep the equivalent:
a visually hidden input that must stay empty, rejected server-side. It needs no
CMS field.

## Permissions

- Public role: **create only** on `subscriber`. Never `find` or `findOne` —
  otherwise anyone can read the mailing list.
- Reads use a **read-only API token** scoped to `homepage` and `site-settings`.
- The token lives in `STRAPI_API_TOKEN` on the web service and is never exposed
  to the browser.

## Revalidation contract

1. Every Strapi read in Next passes `next: { tags: ['homepage'] }`.
2. `POST /api/revalidate` on the web service checks a shared secret header,
   then calls `revalidateTag('homepage')`.
3. Strapi → Settings → Webhooks → one webhook firing on `entry.publish`,
   `entry.update`, `entry.unpublish`, `media.create`, `media.update`, pointing
   at that route with the secret header.

Verify by editing the price in `site-settings`, publishing, and refreshing the
live site. This is worth demonstrating on camera in the Railway walkthrough.
