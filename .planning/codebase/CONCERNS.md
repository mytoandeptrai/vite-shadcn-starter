# Codebase Concerns

**Analysis Date:** 2026-04-20

## Tech Debt

**Auth provider incomplete implementation:**
- Issue: `onRefetch` is TODO and `userData` is hardcoded to `undefined`
- Files: `src/integrations/auth/auth-provider.tsx`
- Impact: `auth.user` and “refetch session” flows are likely incomplete; features depending on user profile may be broken or stubbed
- Fix approach: implement `onRefetch` via `src/apis/auth/*` (e.g., `getUserInfo`) and populate context `user`

**QueryClient lifecycle mismatch risk:**
- Issue: `getContext()` creates a new `QueryClient` each call; `useSessionStore` and other modules call `getContext()` directly
- Files: `src/integrations/tanstack-query/root-provider.tsx`, `src/integrations/auth/auth-provider.tsx`
- Impact: risk of multiple QueryClient instances and inconsistent cache mutation/clearing
- Fix approach: ensure a single QueryClient instance is created once (e.g., in `src/main.tsx`) and passed down/injected rather than recreated ad-hoc

## Known Bugs

**Potential incorrect axios refresh endpoint composition:**
- Issue: refresh URL is built as `${baseURL}merchants/refresh-token` without guaranteeing trailing slash
- File: `src/apis/http-instance.ts`
- Impact: if `VITE_API_URL` lacks trailing `/`, request may become `https://api.example.commerchants/refresh-token`
- Fix approach: use URL join helper or enforce trailing slash normalization once

## Security Considerations

**Token storage and XSS surface:**
- Risk: access/refresh tokens are managed in Zustand store and used in client-side axios
- Files: `src/apis/http-instance.ts`, `src/stores/use-session-store`
- Impact: if tokens are persisted in localStorage, XSS can exfiltrate them (needs confirmation by inspecting store implementation)
- Recommendation: prefer httpOnly cookies for refresh tokens; at minimum confirm persistence strategy and audit for XSS injection points

## Performance Bottlenecks

**Aggressive query refetching defaults:**
- Issue: Query defaults `staleTime: 0`, `refetchOnMount: true` and no retries
- File: `src/integrations/tanstack-query/root-provider.tsx`
- Impact: can cause extra network traffic on navigation/mount; may degrade UX on slow networks
- Improvement path: tune defaults per query; set sensible stale times for stable resources

## Fragile Areas

**Axios interceptor refresh queue:**
- Why fragile: request replay + shared `failedRequests` queue can be tricky under concurrent refresh failures
- File: `src/apis/http-instance.ts`
- Safe modification: add unit tests around refresh concurrency and queue replay; ensure rejected requests propagate consistently

## Dependencies at Risk

**React 19 + ecosystem compatibility:**
- Risk: some third-party packages may not yet fully support React 19
- Impact: subtle runtime issues, peer dependency warnings
- Mitigation: keep deps updated; watch for React 19-specific migration notes when upgrading

## Test Coverage Gaps

**Auth refresh behavior:**
- What’s not tested: concurrent 401/TOKEN_EXPIRED leading to single refresh + queued replay behavior
- Files: `src/apis/http-instance.ts`
- Priority: High (auth failures break most flows)

---

*Concerns audit: 2026-04-20*
*Update as issues are fixed or new ones discovered*
# Codebase Concerns

**Analysis Date:** 2026-04-20

## Tech Debt

**Authentication context is stubbed / incomplete:**
- Issue: Auth state is effectively “token-present” only; user fetch + refetch is unimplemented.
- Files: `src/integrations/auth/auth-provider.tsx`
- Impact: Any code relying on `auth.user` or `auth.onRefetch()` will misbehave; “authenticated” UX can diverge from actual server session state.
- Fix approach: Implement `userData` retrieval (query + cache) and `onRefetch` (invalidate/refetch), and derive `isAuthenticating` from the query state.

**Session tokens persisted in `localStorage` (XSS blast radius):**
- Issue: `accessToken` and `refreshToken` are stored via Zustand `persist` in `localStorage`.
- Files: `src/stores/use-session-store.ts`
- Impact: Any XSS can exfiltrate tokens; refresh token storage increases account takeover severity.
- Fix approach: Prefer httpOnly secure cookies for refresh tokens; if tokens must be client-side, limit scope/lifetime and add CSP + robust HTML sanitization (see other concerns).

**HTTP auth refresh flow is tightly coupled and has rough edges:**
- Issue: Refresh endpoint is hardcoded as `${baseURL}merchants/refresh-token`, non-null assertions used for returned tokens, and redirect uses `window.location.href`.
- Files: `src/apis/http-instance.ts`, `src/apis/auth/keys.ts`
- Impact: Runtime crashes if refresh response lacks tokens; hard reload loses in-memory state; endpoint concatenation is fragile if `env.API_URL` lacks trailing slash.
- Fix approach: Use a single source of truth for endpoint paths, validate refresh response before updating store, and prefer router navigation (or a dedicated “session expired” flow) over `window.location.href`.

**Hard-coded URL/error suppression logic is fragile:**
- Issue: Error-toast suppression is encoded as a list of url/errorCode pairs with mixed empty-string semantics.
- Files: `src/apis/http-instance.helper.ts`, `src/constant/base.const.ts`, `src/constant/route.const.ts`
- Impact: Incorrectly suppresses or shows errors as routes evolve; string-typed URLs drift from actual routing; some condition URLs don’t exist in `ROUTES`.
- Fix approach: Normalize on `ROUTES` (or route IDs) and typed error codes, and consolidate suppression rules close to the feature routes they apply to.

**Type-safety gaps via `any` in router match data and storage events:**
- Issue: `as any` used to access loader data crumbs; storage utilities mutate `Event` with `(event as any)`.
- Files: `src/components/ui/path-breadscrumb.tsx`, `src/utils/storage.ts`
- Impact: Refactors break silently; consumers rely on untyped fields; makes testing and maintenance harder.
- Fix approach: Define typed loader data contracts (crumb type) and define a typed `CustomEvent` payload instead of mutating `Event`.

## Known Bugs

**Object URL lifecycle leaks for file previews when files change:**
- Symptoms: `URL.createObjectURL` previews are only revoked on unmount, not when a file is removed/replaced.
- Files: `src/components/ui/input-file-dropzone.tsx`
- Trigger: Upload/remove multiple files during a single mount; large image previews.
- Workaround: Refresh the page (unmount).

**Stepper trigger registration/removal looks inconsistent and is likely broken:**
- Symptoms: Trigger nodes may accumulate or not unregister correctly; effect dependencies are globally disabled.
- Files: `src/components/ui/stepper.tsx`
- Trigger: Stepper mounts/unmounts items dynamically; re-renders with changing children.
- Workaround: Avoid dynamic step changes; remount the entire Stepper.

## Security Considerations

**`dangerouslySetInnerHTML` used to inject CSS:**
- Risk: If chart config keys/colors become user-controlled (API-driven, querystring-driven), this can enable CSS injection, data exfil via CSS side channels, or UI redress.
- Files: `src/components/ui/chart.tsx`
- Current mitigation: Values appear developer-provided via `ChartConfig`, but there’s no runtime validation/sanitization.
- Recommendations: Constrain keys/colors to safe patterns (e.g., `^[a-zA-Z0-9_-]+$` for keys, strict color whitelist) before embedding into CSS, or generate styles via CSSOM instead of raw HTML.

**Refresh token stored client-side + automatic refresh logic:**
- Risk: Token theft via XSS is especially damaging; refresh token makes access persistent.
- Files: `src/stores/use-session-store.ts`, `src/apis/http-instance.ts`
- Current mitigation: Not detected (no CSP, no HTML sanitization, no httpOnly cookies).
- Recommendations: Move refresh token to httpOnly cookie; rotate refresh tokens; add CSP; audit any HTML parsing/rendering usage.

**Debug logging in production paths:**
- Risk: Console logs can leak identifiers and internal state; also hurts performance.
- Files: `src/apis/http-instance.ts`, `src/components/ui/error-boundary.tsx`, `src/components/ui/google-analytics.tsx`, `src/workers/my.worker.ts`
- Current mitigation: Not detected (logs are unconditional).
- Recommendations: Gate logs by `env.ENVIRONMENT` or a debug flag; avoid serializing entire Axios errors.

## Performance Bottlenecks

**Preload splash enforces an artificial 3s delay:**
- Problem: `setTimeout(..., 3000)` delays rendering even if assets are loaded quickly.
- Files: `src/components/ui/preload.tsx`
- Cause: Fixed minimum delay.
- Improvement path: Make delay conditional (only if loading exceeds threshold), clear timeout on unmount, and avoid blocking initial route rendering when possible.

**Large utility grab-bag risks bundle bloat and cold-start cost:**
- Problem: `src/utils/common.ts` is a large, mixed-responsibility module imported in multiple UI components.
- Files: `src/utils/common.ts`
- Cause: Centralized “kitchen sink” utilities can pull heavy deps (e.g., `ethers`, `dayjs` plugins) into more entrypoints than needed.
- Improvement path: Split into focused modules (`utils/date`, `utils/crypto`, `utils/files`) and ensure heavy deps are imported only where required.

## Fragile Areas

**Theme provider assumes `localStorage` exists at initialization:**
- Files: `src/integrations/theme/theme-provider.tsx`
- Why fragile: Direct `localStorage.getItem` inside state initializer can throw in constrained runtimes and complicates non-browser rendering/tests.
- Safe modification: Guard storage access (`typeof window !== 'undefined'`) and provide a resilient fallback.
- Test coverage: Not detected.

**Generated router tree bypasses typechecking and linting:**
- Files: `src/routeTree.gen.ts`, `biome.json`
- Why fragile: File uses `// @ts-nocheck` and is excluded from Biome; mistakes in generation or plugin updates can break builds at runtime without static checks.
- Safe modification: Treat as generated-only; validate generation in CI and keep plugin versions pinned/compatible.
- Test coverage: Not detected.

## Scaling Limits

**Client-side error suppression rules do not scale with feature count:**
- Current capacity: A single linear list of URL/errorCode conditions.
- Limit: Becomes unmaintainable as routes/features grow; hard to audit correctness.
- Scaling path: Move suppression to feature modules, use typed route IDs, and add unit tests for the suppression matrix.

## Dependencies at Risk

**Multiple date libraries + heavy crypto dependency increase bundle size risk:**
- Risk: Duplicate functionality and larger bundles (`dayjs` + `date-fns` + `ethers`).
- Impact: Slower initial load, especially on mobile.
- Migration plan: Standardize on one date library; isolate `ethers` usage behind lazy-loaded feature boundaries.

## Missing Critical Features

**No end-to-end token/session validation path:**
- Problem: App treats “has token in storage” as authenticated; no boot-time `me`/session check in `AuthProvider`.
- Blocks: Reliable private-route gating; consistent user identity; robust sign-out/invalidation.

## Test Coverage Gaps

**Coverage scope excludes most business logic and modules:**
- What's not tested: Most `src/modules/**`, auth/session flows, API integration behavior.
- Files: `vite.config.ts` (coverage include/exclude), `src/integrations/auth/auth-provider.tsx`, `src/apis/http-instance.ts`
- Risk: Auth/refresh regressions ship unnoticed; route-level behavior changes without tests.
- Priority: High

---

*Concerns audit: 2026-04-20*

