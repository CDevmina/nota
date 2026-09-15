# Railway setup

One project, three services. The brief grades "Railway setup (services,
variables, networking)" — and the screen recording is specifically about
explaining this, so keep it tidy and deliberate.

## Services

### 1. Postgres
Railway's Postgres plugin. Exposes `DATABASE_URL`.

### 2. `cms` — Strapi 5
- Root directory: `apps/cms`
- **Volume mounted at `/app/public/uploads`** — this is what makes uploaded
  media survive a redeploy. Mount it *before* uploading anything.
- Public domain enabled (the admin panel has to be reachable by the reviewers).

Variables:

```
DATABASE_CLIENT=postgres
DATABASE_URL=${{Postgres.DATABASE_URL}}
DATABASE_SSL=false
NODE_OPTIONS=--max-old-space-size=2048
APP_KEYS=<4 comma-separated random base64 strings>
API_TOKEN_SALT=<random>
ADMIN_JWT_SECRET=<random>
TRANSFER_TOKEN_SALT=<random>
JWT_SECRET=<random>
ENCRYPTION_KEY=<random>
NODE_ENV=production
HOST=0.0.0.0
PORT=1337
```

### 3. `web` — Next.js
- Root directory: `apps/web`
- Public domain enabled (this is the live site URL you submit).

Variables:

```
STRAPI_INTERNAL_URL=http://${{cms.RAILWAY_PRIVATE_DOMAIN}}:1337
NEXT_PUBLIC_STRAPI_URL=https://<cms public domain>
STRAPI_API_TOKEN=<read-only token from Strapi admin>
REVALIDATE_SECRET=<random>
```

## Networking — the point worth making on camera

Server-side fetches go over Railway's **private network**
(`cms.railway.internal`), so CMS traffic never leaves the project, costs no
egress, and the CMS needs no public exposure for the site to render. The
**public** CMS domain is used for two things only: the admin panel, and the
image URLs the browser resolves. That split is the whole answer to "explain how
each component of the infrastructure works".

Use **reference variables** (`${{Postgres.DATABASE_URL}}`,
`${{cms.RAILWAY_PRIVATE_DOMAIN}}`) rather than pasted literals — it shows the
services are actually wired together rather than copy-pasted.

## Budget

The trial is $5. Three services running continuously for four days fits, but
not with room to spare. Don't create a second environment, don't enable
replicas, and check the usage page on Monday.

## Order of operations

1. Postgres first.
2. `cms` second — deploy, confirm the admin panel loads, create the admin user,
   **then** mount the volume and confirm an upload survives a redeploy.
3. `web` last — confirm it can reach `cms` over the private domain.
4. Only then start building.

## Before submitting

- [ ] Admin accounts created for `kavinda.kobbekaduwe@surge.global`,
      `kavisha@surge.global`, `samith@surge.global`
- [ ] An upload survives a redeploy (test it, don't assume)
- [ ] Publishing a change updates the live site with no deploy
- [ ] `noindex` present on the live site
- [ ] Both public domains recorded for the submission email
