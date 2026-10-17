# Owner Checklist: Connect GitHub ↔ Vercel (Public Demo Projects)

Use this checklist when linking SiteForge demos so factory-reported URLs are real, public, and match live deployments.

## Verified public production surfaces (2026-10-16)

| Surface | Public URL | Status |
|---|---|---|
| SiteForge factory portal | https://siteforge-chi-nine.vercel.app | HTTP 200, no SSO |
| PlantCare Academy | https://plantcare-academy-web.vercel.app | HTTP 200, no SSO |
| PlantCare (GitHub Pages fallback) | https://josecarlospm.github.io/plantcare-academy-web/ | HTTP 200 |

Avoid reporting these as production unless they also return public HTTP 200:

- `https://plantcare-academy.vercel.app` — historical placeholder (HTTP 404 / `DEPLOYMENT_NOT_FOUND`)
- `https://siteforge-josecarlospm.vercel.app` and deployment hosts under `*-josecarlospm.vercel.app` — often redirected to Vercel SSO when Deployment Protection is on

## 1. Create a capable Vercel token

1. Open [Vercel Account Tokens](https://vercel.com/account/tokens).
2. Create a token scoped to the team/account that owns the demo projects.
3. Required capabilities: **create projects**, **deploy**, **read projects**, **assign domains/aliases**.
4. Store it as `VERCEL_TOKEN` in the environment (never commit it). Prefer env over `vercel login` tokens scoped to unrelated hobby projects.

```bash
export VERCEL_TOKEN=vcp_...   # or personal token with project create
export VERCEL_ORG_ID=team_... # optional team scope
```

Confirm:

```bash
vercel whoami
vercel project ls
```

You should see `siteforge` / `plantcare-academy-web` (or be able to create them). A token that only sees an unrelated project (e.g. `homefinder`) will fail project create — SiteForge will **error** instead of inventing a fake `*.vercel.app` URL.

## 2. Connect the GitHub repositories

For each demo repo (`josecarlospm/siteforge`, `josecarlospm/plantcare-academy-web`):

1. Vercel Dashboard → **Add New Project** → Import from GitHub (or confirm the existing project Git link).
2. Framework preset: **Angular**.
3. Root directory:
   - PlantCare standalone repo: `/` (uses repo `vercel.json`)
   - SiteForge monorepo factory UI: `starter-workspace` (or the directory that contains the deployable Angular app)
4. Production branch: `main`.
5. Ensure the Vercel GitHub App is installed on `josecarlospm` with access to those repos.

## 3. Disable Deployment Protection for public demos

For each demo project (`siteforge`, `plantcare-academy-web`):

1. Project → **Settings** → **Deployment Protection**.
2. Set **Vercel Authentication** to **Off** for Production (and Preview if demos must be shareable without login).
3. Save. Re-check with an incognito/curl request (no Vercel session cookies):

```bash
curl -sI https://plantcare-academy-web.vercel.app | head -5
curl -sI https://siteforge-chi-nine.vercel.app | head -5
# Expect HTTP/2 200 — not location: https://vercel.com/sso-api?...
```

## 4. Assign / verify production aliases

1. Project → **Settings** → **Domains**.
2. Ensure the production domain matches the factory payload `integrations.vercel.projectName`:
   - PlantCare payload uses `plantcare-academy-web` → `https://plantcare-academy-web.vercel.app`
   - SiteForge production alias currently verified as `https://siteforge-chi-nine.vercel.app` (set GitHub repo homepage to the same)
3. Do **not** advertise `{wishful-name}.vercel.app` unless Domains shows it assigned and curl returns 200 without SSO.
4. Optional: add a clean alias (e.g. `plantcare-academy.vercel.app`) only after it is claimed on the correct project.

## 5. Align SiteForge payload + GitHub homepage

1. Payload `integrations.vercel.projectName` must equal the Vercel project slug that owns the public alias.
2. Payload `integrations.github.repoName` must equal the GitHub repo name.
3. Set the GitHub repo **Homepage** URL to the verified public Vercel alias (not an SSO-protected deployment URL).

## 6. Factory / CI smoke check

```bash
# From siteforge monorepo (Node ^22.22.3 || ^24.15.0 || >=26)
npm ci
npm test          # builds library workspaces first, then runs all package tests
npm run deploy:vercel -- --payload ./samples/plantcare-academy.payload.json --dry-run
```

A successful non-dry-run deploy must print a `Live HTTPS URL` that already returns public HTTP 200. The pipeline refuses 403 sandbox fallbacks and rejects SSO/404 aliases.
