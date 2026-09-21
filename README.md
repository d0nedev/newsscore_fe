# NEWSSCORE (Nuxt frontend)

Frontend-only Nuxt 4 app for a live-scores site (static slice, dummy data). It is a client-rendered SPA, built to static files, and talks to a separate Go REST API over HTTP/JSON. Nuxt/Nitro is **not** a backend here: no server routes, no DB access.

```text
Browser -> static host / CDN (this app) -> HTTPS -> Go REST API -> PostgreSQL
```

## Architecture

```text
page -> composable (TanStack Vue Query) -> service -> apiFetch() -> $fetch -> Go API
```

```text
app/
├── pages/          route composition only (skor, kompetisi, tim, pemain, pertandingan)
├── layouts/        default (header, sport nav, competitions, footer)
├── components/     MatchList, MatchRow, MatchStats, StandingsTable, SquadTable, TabNav, TeamBadge, ErrorState
├── data/           leagues.ts, matches.ts, teams.ts (dummy data for the static slice)
├── services/       api-client.ts (apiFetch)
├── schemas/        Zod schemas (UX validation only; Go stays authoritative)
├── types/          API contract + domain types
├── utils/          ApiError mapping, user-facing messages, form helpers
└── plugins/        vue-query.ts (QueryClient, global 401 handling, logging)
test/unit/          Vitest (utils, schemas)
test/e2e/           Playwright against the production build
```

- **Server state** lives only in TanStack Vue Query. No Pinia: there is no global client state yet; add it when there is.
- **API contract**: `{ data }`, `{ data, meta: { nextCursor } }`, `{ error: { code, message, details } }`. Lists use `useInfiniteQuery` with the opaque cursor (`?limit=20&cursor=...`).
- **Errors**: every failure becomes an `ApiError` with a `kind` (`validation | unauthorized | forbidden | not_found | conflict | network | server | unknown`). `errorMessage()` never shows raw 5xx/network text. `VALIDATION_ERROR` details map onto form fields. Queries retry only network/5xx errors.

## Requirements

Node 24+, pnpm 11+.

## Development

```bash
pnpm install
cp .env.example .env     # point at your local Go API
pnpm dev                 # http://localhost:3000
```

The Go API must allow the dev origin via CORS **with credentials** (see Authentication).

## Environment variables

| Variable                   | Description                                                         |
| -------------------------- | ------------------------------------------------------------------- |
| `NUXT_PUBLIC_API_BASE_URL` | Go API origin, e.g. `https://api.example.com`. Empty = same origin. |

The app is static, so this value is **baked in at build time**: build once per environment (dev/staging/production). Everything under `runtimeConfig.public` is visible in the browser; never put secrets there.

## Quality checks

```bash
pnpm lint           # ESLint
pnpm format         # Prettier (format:check in CI)
pnpm typecheck      # vue-tsc, strict
pnpm test           # Vitest unit tests
pnpm test:e2e       # Playwright (builds, serves .output/public, mocks the API)
```

First E2E run: `pnpm exec playwright install chromium`.

## Production build & deployment

```bash
NUXT_PUBLIC_API_BASE_URL=https://api.example.com pnpm build
# output: .output/public (upload to any static host / CDN)
```

Static host requirements:

- **SPA fallback**: unknown paths must serve `200.html` (e.g. nginx `try_files $uri $uri/ /200.html;`, Netlify `/* /200.html 200`).
- **Cache**: `/_nuxt/*` is content-hashed, so `Cache-Control: public, max-age=31536000, immutable`; HTML files `no-cache`.
- **HTTPS only**, plus security headers at the host (`Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `frame-ancestors 'none'`). A CSP must allow Nuxt's inline config script (hash or nonce) and `connect-src` for the API origin.
- Client source maps are not emitted in production builds.

## Authentication

The Go API auth contract is **not specified yet**. The frontend assumes the safest common option, and all of it lives in `app/services/auth.service.ts`, so changing it is local:

- `POST /api/auth/login { email, password }` sets an **HttpOnly, Secure, SameSite** session cookie and returns `{ data: User }`.
- `POST /api/auth/logout` clears it (204).
- `GET /api/auth/me` returns `{ data: User }` or 401.
- All requests send `credentials: "include"`. JavaScript never sees a token, so XSS cannot steal it. No tokens in `localStorage`.
- Any 401 clears the cached user and redirects to `/login?redirect=<path>` (redirect is restricted to same-app paths).
- The route middleware is UX only. **Authorization is enforced by the Go API.**

To confirm with the backend team:

1. Cookie session vs. bearer tokens (if tokens: access-token lifetime, refresh flow, where the refresh token lives).
2. Cookie attributes and domain. If app and API are on different sites, cookies need `SameSite=None; Secure` and the API **must** add CSRF protection (token header or double-submit). Same-site deployment with `SameSite=Lax/Strict` is preferred.
3. CORS: exact allowed origins (no `*`) with `Access-Control-Allow-Credentials: true`; expose `X-Request-ID` if the frontend should log it.
4. Session expiry/idle timeout and the `User` shape returned by `/me`.
