# External Integrations

**Analysis Date:** 2026-04-20

## APIs & External Services

**Backend API (primary):**
- Custom REST API (base URL from `VITE_API_URL`)
  - Client: Axios wrapper `src/apis/http-instance.ts`
  - Auth: Bearer access token attached in request interceptor (`Authorization: Bearer ...`)
  - Token refresh: automatic refresh on `TOKEN_EXPIRED` errors via `POST {API_URL}merchants/refresh-token` in `src/apis/http-instance.ts`

**Realtime / sockets:**
- Socket endpoint configured via `VITE_SOCKET_URL` (see `src/constant/base.const.ts`)
  - Implementation details likely under `src/integrations/` or `src/workers/` (not fully mapped in this pass)

**CAPTCHA:**
- Google reCAPTCHA v3
  - Library: `react-google-recaptcha-v3`
  - Config: `VITE_RECAPTCHA_SITE_KEY` (`src/constant/base.const.ts`)

## Data Storage

**Databases:**
- Not directly present in this repo (frontend-only SPA). Data access is via the backend API.

**File Storage / uploads:**
- Not clearly identified in codebase map; likely handled by backend API.

**Caching:**
- Client-side caching via TanStack React Query (`src/integrations/tanstack-query/root-provider.tsx`)

## Authentication & Identity

**Auth pattern (frontend):**
- Session tokens stored in Zustand store `src/stores/use-session-store` (referenced by `src/apis/http-instance.ts` and `src/integrations/auth/auth-provider.tsx`)
- Access token added to all requests; refresh token used to refresh
- Redirect-on-refresh-failure: `window.location.href = ROUTES.LOGIN` in `src/apis/http-instance.ts`

## Monitoring & Observability

**Web Vitals:**
- `web-vitals` package referenced via `src/reportWebVitals.ts` and invoked from `src/main.tsx`

**UI notifications:**
- `sonner` toaster (`<Toaster />` in `src/main.tsx`; `toast.*` used in auth/HTTP error flows)

## CI/CD & Deployment

**Hosting:**
- Vercel config present (`vercel.json`)
- Build output: `dist/` from Vite (`npm run build`)

**Containerization:**
- Docker assets present (`docker/`, `docker-compose.yml`, `docker-compose.source.yml`) for local/prod workflows

## Environment Configuration

**Development:**
- `.env` present (do not commit secrets)
- Key Vite env vars (names only, see `src/constant/base.const.ts`):
  - `VITE_APP_URL`, `VITE_API_URL`, `VITE_SOCKET_URL`
  - `VITE_APP_SUPPORT_EMAIL`, `VITE_ENV`
  - `VITE_RECAPTCHA_SITE_KEY`, `VITE_SDK_LIST`
  - Optional: `VITE_PORT` (read in `vite.config.ts`)

## Webhooks & Callbacks

- None in this repo (frontend-only). Any webhooks would be implemented in the backend service.

---

*Integration audit: 2026-04-20*
*Update when adding/removing external services*
# External Integrations

**Analysis Date:** 2026-04-20

## APIs & External Services

**Backend API (application server):**
- Custom HTTP API - app talks to a backend via Axios
  - Client: `axios` wrapped by `src/apis/http-instance.ts`
  - Base URL: `VITE_API_URL` (read in `src/constant/base.const.ts` → `env.API_URL`)
  - Auth: Bearer token attached from Zustand session store (`src/apis/http-instance.ts` reads `useSessionStore.getState().accessToken`)
  - Token refresh endpoint: `POST {VITE_API_URL}merchants/refresh-token` (`src/apis/http-instance.ts`)
  - Auth endpoints (relative paths): `src/apis/auth/requests.ts` (login/register/forgot/reset/verify/2FA/setup/disable/signout)

**Google Analytics (gtag):**
- Google Analytics - page/event tracking injected dynamically
  - Implementation: `src/components/ui/google-analytics.tsx` loads `https://www.googletagmanager.com/gtag/js`
  - Config: `VITE_GA_ID` (read in `src/constant/site.const.ts` as `siteConfig.googleAnalyticsId`)

**Google reCAPTCHA v3:**
- reCAPTCHA v3 - bot protection for forms/actions
  - SDK/Client: `react-google-recaptcha-v3`
  - Provider: `src/integrations/recaptcha/recaptcha-provider.tsx`
  - Config: `VITE_RECAPTCHA_SITE_KEY` (read in `src/constant/base.const.ts` as `env.RECAPTCHA_SITE_KEY`)

**Internationalization asset loading (no external service):**
- i18n translation files are loaded over HTTP from the app’s own static assets
  - Client: `i18next-http-backend`
  - Config: `src/integrations/i18n/config.ts` uses `backend.loadPath = '/locales/{{lng}}/{{ns}}.json'`
  - Assets: `public/locales/**`

## Data Storage

**Databases:**
- Not detected in this repository (no ORM/client packages like Prisma/Drizzle/Supabase client found in `package.json`; no schema directories like `prisma/` detected)

**File Storage:**
- Local/static assets only (e.g. `public/`, `src/assets/`); no external blob/storage SDK detected

**Caching:**
- None detected (no Redis/client-side cache service SDK). In-app caching uses TanStack Query (`@tanstack/react-query`) with an in-memory query cache (provider in `src/integrations/tanstack-query/root-provider.tsx`).

## Authentication & Identity

**Auth Provider:**
- Custom backend auth (not a hosted identity provider SDK)
  - Session storage: access/refresh tokens stored in Zustand (`src/stores/use-session-store.ts`) and referenced by HTTP layer (`src/apis/http-instance.ts`)
  - 2FA: backend-driven endpoints used in `src/apis/auth/requests.ts` (e.g. `setupTwoFa`, `verifyTwoFa`, `disabledTwoFa`)
  - App-level auth context: `src/integrations/auth/auth-provider.tsx` (signout clears query cache + session store)

## Monitoring & Observability

**Error Tracking:**
- Not detected (no Sentry/Datadog/etc SDK usage found under `src/`)

**Logs:**
- Browser console + in-app toasts
  - Console: e.g. `src/apis/http-instance.ts`, `src/components/ui/google-analytics.tsx`
  - Toast notifications: `sonner` used in `src/apis/http-instance.ts` and `src/integrations/auth/auth-provider.tsx`

## CI/CD & Deployment

**Hosting:**
- Vercel (SPA rewrite defined in `vercel.json`)

**CI Pipeline:**
- Not detected in repo contents scanned (no GitHub Actions/CI configs identified during this audit)

## Environment Configuration

**Required env vars (by code reference):**
- `VITE_API_URL` - backend API base URL (`src/constant/base.const.ts`)
- `VITE_ENV` - environment flag for i18n debug (`src/constant/base.const.ts`, `src/integrations/i18n/config.ts`)
- `VITE_RECAPTCHA_SITE_KEY` - Google reCAPTCHA site key (`src/constant/base.const.ts`, `src/integrations/recaptcha/recaptcha-provider.tsx`)
- `VITE_GA_ID` - Google Analytics measurement ID (`src/constant/site.const.ts`, `src/components/ui/google-analytics.tsx`)

**Optional / referenced env vars:**
- `VITE_APP_URL` - app canonical URL (`src/constant/base.const.ts`)
- `VITE_SOCKET_URL` - socket base URL (referenced in `src/constant/base.const.ts`; no WebSocket client usage detected in `src/`)
- `VITE_APP_SUPPORT_EMAIL` - support contact (`src/constant/base.const.ts`)
- `VITE_SDK_LIST` - feature/config list placeholder (`src/constant/base.const.ts`; usage not detected in `src/`)
- `VITE_PORT` - dev server port (`vite.config.ts`, `.env.example`)

**Secrets location:**
- Environment variables via Vite (`import.meta.env`). Example names are listed in `.env.example` (values provided outside git).

## Webhooks & Callbacks

**Incoming:**
- Not applicable in this client-only SPA repository (no server endpoints present)

**Outgoing:**
- Not detected (no direct webhook emission logic found in `src/`; outbound calls are standard API requests via `src/apis/http-instance.ts`)

---

*Integration audit: 2026-04-20*

