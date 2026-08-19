# 1PayRouter — public site

Payment orchestration marketing site and public API, built to the product
specification in [`payrouter_bd_openrouter_inspired_landing_page.md`](payrouter_bd_openrouter_inspired_landing_page.md).

Laravel 12 · React 19 · TypeScript · Tailwind CSS v4 · Vite

---

## Getting started

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm run dev          # in one terminal
php artisan serve    # in another
```

`DB_CONNECTION=sqlite` keeps local setup zero-config. For staging and production,
switch the commented MySQL block in `.env`.

### Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production asset build |
| `npm test` | React component tests (Vitest) |
| `npx tsc --noEmit` | TypeScript check |
| `php artisan test` | Laravel feature tests |

---

## How it fits together

Public pages are served by a **Laravel-rendered shell** (`resources/views/app.blade.php`)
that carries the title, description, canonical URL, and OpenGraph tags for that route.
React mounts into it and takes over client-side navigation. That keeps SEO metadata in
the initial HTML response instead of behind JavaScript.

```
routes/web.php        → SpaController → app.blade.php (+ PageMeta) → React
                      → /api/auth/*      → register, login, logout, me (session + CSRF)
                      → /api/dashboard/* → API key issue / list / revoke (auth)
routes/api.php        → /api/public/* → providers, pricing, status, rankings, faqs, contact-sales
```

### Frontend layout

```
resources/js/
├── app/          App shell, router, scroll + meta behaviour
├── pages/        One file per public route (all lazy-loaded except home)
├── components/   layout · home · providers · developer · ui
├── hooks/        useApi, useReveal, useCopyToClipboard, useDebouncedValue
├── lib/          api, brand, analytics, highlight, snippets, status, format
└── types/        provider, pricing, status, faq, rankings
```

### Configuration

| Where | What |
| --- | --- |
| `config/marketing.php` | Product name, emails, pricing, footer/social links, hero metrics, rankings demo flag |
| `config/faqs.php` | FAQ content |
| `resources/css/app.css` | Design tokens (`@theme`) — the only place colours are defined |

**Links only render once they exist.** Footer entries and the docs URL come from
`config/marketing.php`; a `null` href is dropped server-side, and a column with nothing
published disappears entirely. That is why the footer currently has no Legal column — set
`LEGAL_PRIVACY_URL` and friends in `.env` and it appears. "Docs" points at the built-in
quickstart at `/docs`; set `DOCS_URL` and every docs link defers to your external site
instead.

The product name is a working name. Change `PRODUCT_NAME` in `.env` and it updates
everywhere: navbar, footer, page titles, FAQ copy, and metadata.

---

## Rules this codebase enforces

These come from the specification and are worth keeping when extending it.

- **No invented numbers.** Launch metrics describe the product, not volume or uptime.
  Pricing values that are unset render as "Configurable" rather than a made-up rate.
- **No fabricated status.** Component health comes from the `system_components` table
  via `/api/public/platform-status`. When status cannot be read, the hero badge is
  omitted rather than claiming "all systems operational".
- **Provider health defaults to `unknown`** until a real snapshot is recorded.
- **Seeded providers are integration targets, not partnerships.** Nothing ships as
  `available` — statuses are `coming_soon` / `merchant_connection_required` / `private_beta`.
- **No secrets in frontend code.** Snippets use `pr_live_xxxxxxxxx` placeholders; a test
  asserts this.
- **Routing fallback is scoped.** The UI states plainly that an already-authorized payment
  is never re-attempted, and that `unknown` is resolved by querying the provider.
- **Commercial rates are never public.** The provider API resource has no fee fields.
- **No dead links.** Nothing renders a link to a page that has not been published.
- **Rankings are measured, never estimated.** `/rankings` reads `provider_metric_daily`,
  written from real traffic and real health probes. An unmeasured metric renders as an em
  dash, not a zero. `unknown` outcomes are tracked separately from failures, because
  folding them into "failed" would hide the exact risk they represent.
- **Provider logos are never scraped.** `logo_path` stays null until you supply an approved
  asset; the UI shows a tinted monogram, which is a valid permanent state.
- **Provider type is not a licensing claim.** `pso` records a grouping, not that a licence
  is current. Re-confirm with Bangladesh Bank before publishing the directory.

## Security

`app/Http/Middleware/SecurityHeaders.php` applies CSP, `X-Frame-Options`,
`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and HSTS over TLS.
The single inline script (brand config) carries a per-request nonce, so production CSP
does not need `unsafe-inline` for scripts.

Public write endpoints are rate limited (`throttle:5,1` on contact-sales, `60,1` on reads),
validated through form requests, and protected by a honeypot field. Lead IPs are stored
as a SHA-256 hash, not in plaintext.

---

## Provider logos

Logos are not in this repository and must not be added by scraping. Once a provider gives
you an approved asset, name it after the provider slug and run:

```bash
php artisan providers:import-logos ~/path/to/brand-kits --dry-run
```

Drop `--dry-run` to copy the files into `public/brand/providers` and set `logo_path` on each
matching record. Providers without a file keep their monogram.

## Rankings and benchmarks

`/rankings` ranks connected providers on measured availability, success, unknown rate, and
routing decision latency; `/benchmarks` publishes the methodology behind every one of those
figures. With no measurements recorded, `/rankings` shows an honest empty state.

Two views over the same rollups:

- **Overall** — one row per provider, summed across every method.
- **By wallet** — a matrix of operators against payment methods, answering "how does bKash
  perform *through this PSO*?" Switch the cell measure between success rate and availability.

The metrics grain is `(provider, method, date)`, so provider totals are always a sum across
methods and can never double-count. A pairing that was never measured is an em dash, never a
zero — and a method with no data at all does not become a column.

For design review, `RANKINGS_DEMO_DATA=true` renders deterministic synthetic rows behind a
permanent "Demo data" banner. It is force-disabled in production regardless of the flag, and
a test asserts that.

## Accounts and API keys

Registration creates a user and their organization in one transaction and signs them in.
Sessions are same-origin cookies with CSRF — no token is ever handed to JavaScript, so
there is no credential in the browser to steal.

API keys are hashed with SHA-256 and the plaintext is returned by exactly one response,
the one that creates it. There is no column that could hold it, so a database dump cannot
leak a working credential. Keys carry a label, an environment visible in the prefix
(`pr_test_` / `pr_live_`), a last-used timestamp, and can be revoked. One organization can
neither list nor revoke another's keys — a test asserts both.

Login is rate limited to 5 attempts per minute, and a wrong password is indistinguishable
from an unknown account so the endpoint cannot be used to enumerate registered emails.

## Not built yet

The specification covers phases beyond the public site. Deliberately absent:

- The wider merchant dashboard — transactions, settlements, reconciliation, routing rules.
  Only the API key surface exists today.
- Provider and admin dashboards, and roles beyond `owner`. The `organization_user` pivot
  carries a role column ready for them.
- The `/v1` payment API (payments, refunds, webhooks, settlements). It is documented on
  the developers page as the intended surface — only `/api/public/*` actually exists.
- Documentation beyond the quickstart. `/docs` covers first payment through go-live; a
  full reference site can take over by setting `DOCS_URL`.
- The job that writes `provider_metric_daily`. The table, API, and pages exist, but nothing
  populates it until real payments and health probes run.
