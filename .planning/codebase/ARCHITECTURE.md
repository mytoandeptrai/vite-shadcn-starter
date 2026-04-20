# Architecture

**Analysis Date:** 2026-04-20

## Pattern Overview

**Overall:** Vite-powered React SPA with module-based feature organization and file-based routing.

**Key Characteristics:**
- Client-rendered app bootstrapped from `src/main.tsx`
- File-based routing using TanStack Router with generated route tree (`src/routeTree.gen.ts`)
- Centralized API layer wrapping Axios with auth + token refresh (`src/apis/http-instance.ts`)
- Server-state caching via TanStack React Query provider (`src/integrations/tanstack-query/root-provider.tsx`)
- Cross-cutting “integrations” layer for app-wide concerns (`src/integrations/`)

## Layers

**App Entry / Composition:**
- Purpose: compose global providers, router, error boundaries
- Contains: app bootstrap and provider wiring
- Examples: `src/main.tsx`, `src/integrations/infra-providers.tsx`

**Routing Layer:**
- Purpose: map URLs to route components
- Contains: route files + generated tree
- Examples: `src/routes/**`, `src/routeTree.gen.ts`

**Feature / Module Layer:**
- Purpose: feature-specific UI and logic
- Contains: feature modules organized under `src/modules/`
- Examples: `src/modules/dashboard/`, `src/modules/transactions/`, `src/modules/transaction-detail/`

**API / Data Access Layer:**
- Purpose: backend communication and request concerns (auth headers, retries/refresh)
- Contains: axios instance, request/keys/query wrappers
- Examples: `src/apis/http-instance.ts`, `src/apis/auth/*`, `src/apis/transactions/*`

**State Layer:**
- Purpose: client session and app state
- Contains: Zustand stores
- Examples: `src/stores/use-session-store` (referenced by HTTP + auth provider)

**UI / Design System Layer:**
- Purpose: shared UI primitives and composition
- Contains: shadcn-style UI components + shared components
- Examples: `src/components/ui/*`, `src/components/shared/*`

## Data Flow

**Typical authenticated page load (SPA navigation):**
1. App boots in `src/main.tsx`, creates TanStack Router with typed `context` (includes `auth`)
2. Providers mount (i18n, React Query, Helmet, infra providers, error boundary)
3. Route matches from `src/routes/**` via generated `src/routeTree.gen.ts`
4. Route components call API wrappers (e.g. `src/apis/transactions/requests.ts`)
5. `src/apis/http-instance.ts` attaches `Authorization` header from Zustand session store
6. On `TOKEN_EXPIRED`, HTTP layer refreshes token and replays queued requests

**State Management:**
- Session tokens: Zustand (`src/stores/use-session-store`)
- Server state: TanStack Query (`QueryClient` in `src/integrations/tanstack-query/root-provider.tsx`)

## Key Abstractions

**HTTP client wrapper (Axios + interceptors):**
- Purpose: uniform API access and auth lifecycle management
- Example: `src/apis/http-instance.ts`

**Integrations “root providers”:**
- Purpose: isolate setup for cross-cutting libs (i18n/query/auth)
- Examples: `src/integrations/i18n/root-provider.tsx`, `src/integrations/tanstack-query/root-provider.tsx`

## Entry Points

**SPA entry:**
- Location: `src/main.tsx`
- Triggers: Vite loads `index.html` and the bundle
- Responsibilities: build router, mount providers, render app into `#app`

## Error Handling

**Strategy:** central UI error boundary + toast-based user feedback.

**Patterns:**
- UI errors: `src/components/ui/error-boundary.tsx` (wired in `src/main.tsx`)
- API errors: `src/apis/http-instance.ts` shows localized toast messages and handles auth refresh

## Cross-Cutting Concerns

**Logging:**
- Mostly `console.error` in query mutation onError (`src/integrations/tanstack-query/root-provider.tsx`)

**Validation:**
- zod present as dependency; validations likely at form boundaries (search usage in `src/`)

**Authentication:**
- Auth context: `src/integrations/auth/auth-provider.tsx`
- Token lifecycle: `src/apis/http-instance.ts`

---

*Architecture analysis: 2026-04-20*
*Update when major patterns change*
# Architecture

**Analysis Date:** 2026-04-20

## Pattern Overview

**Overall:** Vite + React SPA with TanStack Router file-based routing, TanStack Query for server-state, and a “module-based” feature organization (routes map to module containers; modules encapsulate UI + hooks + feature logic).

**Key Characteristics:**
- Route-first composition: route files in `src/routes/` define URL shape, guards, and search validation; they render module containers (e.g. `src/routes/(private)/transactions/index.tsx` → `src/modules/transactions/...`).
- Provider “integrations” layer: cross-cutting infrastructure (auth, i18n, theme, dialog, query client) is composed in `src/main.tsx` via `src/integrations/*`.
- API layer + query hooks: HTTP concerns centralized in `src/apis/http-instance.ts`; feature data access is exposed as `useQuery` hooks in `src/apis/**/queries.ts` and consumed by module hooks/containers.

## Layers

**App Bootstrap (entry/runtime):**
- Purpose: Mount the React app and compose global providers.
- Location: `index.html`, `src/main.tsx`
- Contains: DOM mount (`#app`), router instantiation, provider stack, global error boundary/suspense, global UI like toaster.
- Depends on: `src/routeTree.gen.ts`, `src/integrations/*`, `src/components/ui/error-boundary.tsx`
- Used by: Browser runtime.

**Routing (URL → page/component):**
- Purpose: Define route tree, layouts, guards, and search validation; connect URLs to UI.
- Location: `src/routes/`, generated `src/routeTree.gen.ts`
- Contains:
  - Root route shell: `src/routes/__root.tsx` (SEO meta + devtools + outlet)
  - Layout routes: `src/routes/(private)/layout.tsx`, `src/routes/(auth)/layout.tsx`
  - Leaf routes: e.g. `src/routes/(private)/transactions/index.tsx`, `src/routes/(private)/transactions/$transactionId.tsx`
- Depends on: TanStack Router (`@tanstack/react-router`), auth context via router context (`src/main.tsx` + `src/integrations/auth/auth-provider.tsx`)
- Used by: `RouterProvider` in `src/main.tsx`

**Feature Modules (domain UI + logic):**
- Purpose: Implement “pages” and feature surfaces as composable containers + components + hooks.
- Location: `src/modules/`
- Contains:
  - Containers (page-level composition): e.g. `src/modules/transactions/containers/transaction-container/transaction-container.tsx`
  - Feature hooks (state, orchestration): e.g. `src/modules/transactions/hooks/use-payments-container.ts`
  - Feature components (UI pieces): e.g. `src/modules/transaction-detail/components/...`
- Depends on: `src/routes/*` (for URL/search + navigation), `src/apis/*` (data), `src/components/*` (shared UI), `src/integrations/i18n/*` (translations)
- Used by: Route components in `src/routes/*`

**API + Server State (data access):**
- Purpose: Centralize HTTP configuration and expose typed query hooks per domain.
- Location: `src/apis/`
- Contains:
  - HTTP client + interceptors: `src/apis/http-instance.ts`, helpers in `src/apis/http-instance.helper.ts`
  - Domain API modules: e.g. `src/apis/transactions/*` (`requests.ts`, `queries.ts`, `types.ts`, `keys.ts`)
- Depends on:
  - Axios (`axios`) via `src/apis/http-instance.ts`
  - TanStack Query (`@tanstack/react-query`) via `src/apis/**/queries.ts`
  - Session/auth storage (`src/stores/use-session-store.ts`)
  - i18n (`src/integrations/i18n/index.ts`) for translated error messages
- Used by: Module hooks/containers (e.g. `src/modules/transactions/hooks/use-payments-container.ts`)

**Client State (session + app state):**
- Purpose: Store long-lived client state (not server data), such as tokens.
- Location: `src/stores/`
- Contains: Zustand stores with persistence (e.g. `src/stores/use-session-store.ts`)
- Depends on: `zustand`, `zustand/middleware`
- Used by:
  - Auth integration: `src/integrations/auth/auth-provider.tsx`
  - HTTP client interceptors: `src/apis/http-instance.ts`

**Integrations (cross-cutting providers):**
- Purpose: Provide infra concerns as composable React providers.
- Location: `src/integrations/`
- Contains:
  - Provider composition: `src/integrations/infra-providers.tsx` (Theme + Dialog + Auth)
  - Auth context: `src/integrations/auth/auth-provider.tsx`
  - Query client: `src/integrations/tanstack-query/root-provider.tsx`
  - i18n setup/providers: `src/integrations/i18n/*`
- Depends on: React context/providers, TanStack Query, i18next, Zustand stores.
- Used by: `src/main.tsx`

## Data Flow

**Route → Feature container → Query → HTTP:**

1. URL matches a file route from `src/routes/` (compiled into `src/routeTree.gen.ts` by the TanStack Router Vite plugin in `vite.config.ts`).
2. Layout guard runs before rendering:
   - Private routes: `src/routes/(private)/layout.tsx` uses `beforeLoad` and redirects if `context.auth.isAuthenticated` is false.
   - Auth routes: `src/routes/(auth)/layout.tsx` redirects away if already authenticated.
3. Route validates and normalizes search params (when used):
   - Example: `src/routes/(private)/transactions/index.tsx` uses Zod in `validateSearch` to set defaults.
4. Module container reads URL state via the route object:
   - Example: `src/modules/transactions/containers/transaction-container/transaction-container.tsx` uses `Route.useSearch()` and `Route.useNavigate()` to drive tabs and filters.
5. Module hooks compose derived filters and fetch server state:
   - Example: `src/modules/transactions/hooks/use-payments-container.ts` builds `filters` and calls `useGetTransactionList(...)` from `src/apis/transactions/queries.ts`.
6. Query hook calls request function (via `queryFn`) which uses the shared HTTP client:
   - HTTP client: `src/apis/http-instance.ts` adds `Authorization` from `useSessionStore.getState()` and handles token-expired retry/refresh logic.

**State Management:**
- Server-state: TanStack Query via `QueryClientProvider` in `src/main.tsx` (`src/integrations/tanstack-query/root-provider.tsx`).
- Client-state: Zustand stores in `src/stores/` (notably `src/stores/use-session-store.ts` for tokens).
- URL-state: TanStack Router search params, validated in routes (e.g. `src/routes/(private)/transactions/index.tsx`) and consumed in modules (e.g. `Route.useSearch()`).

## Key Abstractions

**Router context (auth + query client):**
- Purpose: Provide route loaders/guards with access to auth + query infrastructure.
- Examples: `src/main.tsx` (router creation + context), `src/routes/__root.tsx` (`createRootRouteWithContext`).
- Pattern: Typed router context; auth is inserted at runtime by `RouterProvider` in `src/main.tsx`.

**Feature “Container + hook” pattern:**
- Purpose: Keep route components thin; move orchestration to module containers and hooks.
- Examples:
  - Container: `src/modules/transactions/containers/transaction-container/transaction-container.tsx`
  - Hook: `src/modules/transactions/hooks/use-payments-container.ts`
- Pattern: Containers compose UI and call hooks; hooks depend on `src/apis/*` and route search/navigation.

**HTTP client with interceptors:**
- Purpose: Centralize base URL, auth header injection, query param serialization, and token refresh flow.
- Example: `src/apis/http-instance.ts`
- Pattern: Axios instance wrapper with request/response interceptors + refresh queue.

## Entry Points

**HTML entry:**
- Location: `index.html`
- Triggers: Browser loads HTML; Vite injects module scripts.
- Responsibilities: Defines mount node (`<div id="app"></div>`) and loads `src/main.tsx`.

**React entry:**
- Location: `src/main.tsx`
- Triggers: Imported by `index.html`.
- Responsibilities:
  - Creates TanStack Router instance with `routeTree` from `src/routeTree.gen.ts`
  - Composes providers: i18n (`src/integrations/i18n/root-provider.tsx`), query (`src/integrations/tanstack-query/root-provider.tsx`), infra (`src/integrations/infra-providers.tsx`), Helmet, ErrorBoundary, Suspense
  - Injects auth into router context via `RouterProvider` (`useAuthContext()` from `src/integrations/auth/auth-provider.tsx`)

## Error Handling

**Strategy:** Centralized UI boundary + request-level error mapping.

**Patterns:**
- UI boundary: `src/main.tsx` wraps app in `src/components/ui/error-boundary.tsx`.
- Suspense fallback: `src/main.tsx` uses `Suspense` with `src/components/shared/loading-spinner/loading-spinner.tsx`.
- HTTP errors: `src/apis/http-instance.ts` maps server error codes to i18n keys (via `src/integrations/i18n`) and shows toast notifications (`sonner`).

## Cross-Cutting Concerns

**Logging:** Primarily `console.error` for mutation errors in `src/integrations/tanstack-query/root-provider.tsx` and request errors in `src/apis/http-instance.ts`.
**Validation:** Zod for route search validation in `src/routes/*` (e.g. `src/routes/(private)/transactions/index.tsx`).
**Authentication:** Route guards in `src/routes/(private)/layout.tsx` and token/session state in `src/stores/use-session-store.ts`; HTTP attaches tokens and refreshes in `src/apis/http-instance.ts`.

---

*Architecture analysis: 2026-04-20*
