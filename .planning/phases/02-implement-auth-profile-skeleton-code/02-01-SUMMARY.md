---
phase: 02-implement-auth-profile-skeleton-code
plan: 01
subsystem: routing
tags: [tanstack-router, react, typescript, routes, constants]

# Dependency graph
requires: []
provides:
  - ROUTES.LANDING constant in route.const.ts
  - ROUTES.GETTING_STARTED confirmed as unauthenticated entry point (D-01)
  - Private layout guard confirmed redirecting unauth users to /getting-started
  - Private index confirmed redirecting unauth to /getting-started, auth to /dashboard
affects:
  - 02-02 (landing module — uses ROUTES.LANDING)
  - all plans that reference ROUTES.* constants

# Tech tracking
tech-stack:
  added: []
  patterns:
    - TanStack Router pathless group (private) owns the root / path via index.tsx
    - Route constants centralized in src/constant/route.const.ts as ROUTES.*

key-files:
  created: []
  modified:
    - src/constant/route.const.ts

key-decisions:
  - "ROUTES.LANDING = '/landing' added as constant; route file deferred to later plan"
  - "src/routes/(private)/index.tsx IS the root / route in TanStack Router (pathless group behavior)"
  - "No separate src/routes/index.tsx needed — would conflict with (private)/index.tsx"

patterns-established:
  - "Root / handled by /(private)/index.tsx in TanStack Router pathless group pattern"
  - "Route constants always centralized — no duplicated literal URLs"

requirements-completed: []

# Metrics
duration: 15min
completed: 2026-04-20
---

# Phase 02 Plan 01: Entry Flow Wiring Summary

**Route constants normalized: ROUTES.LANDING added, /getting-started guard confirmed correct per D-01 across private layout and private index**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-04-20T16:10:00Z
- **Completed:** 2026-04-20T16:25:00Z
- **Tasks:** 3
- **Files modified:** 1

## Accomplishments
- Confirmed `/(private)/layout.tsx` guards unauthenticated users to `ROUTES.GETTING_STARTED` (D-01 compliant)
- Confirmed `/(private)/index.tsx` redirects unauth to `ROUTES.GETTING_STARTED`, auth to `ROUTES.DASHBOARD`
- Added `ROUTES.LANDING = '/landing'` constant for use by future landing module plan

## Task Commits

Each task was committed atomically:

1. **Task 1: Normalize route constants for entry pages** - verified existing files already correct (no file change)
2. **Task 2: Ensure `/` redirects to `/getting-started`** - handled by existing `/(private)/index.tsx` (deviation documented)
3. **Task 3: Add ROUTES.LANDING constant** - `28cfbd2` (feat)

**Plan metadata:** (docs commit pending)

## Files Created/Modified
- `src/constant/route.const.ts` - Added `LANDING: '/landing'` constant

## Decisions Made
- Did not create `src/routes/index.tsx` — TanStack Router's pathless group `(private)` makes `/(private)/index.tsx` the effective `/` route. A separate `src/routes/index.tsx` causes a "Conflicting configuration paths" build error.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed conflicting src/routes/index.tsx**
- **Found during:** Task 2 (ensure / redirects to /getting-started)
- **Issue:** Creating `src/routes/index.tsx` with `createFileRoute('/')` caused TanStack Router to error: "Conflicting configuration paths were found for the following routes: '/', '/'" — both `src/routes/index.tsx` and `src/routes/(private)/index.tsx` claimed path `/`. The (private) group is pathless, so `/(private)/index.tsx` is the root index.
- **Fix:** Removed the conflicting file. The existing `/(private)/index.tsx` already implements exactly the required redirect behavior (`ROUTES.GETTING_STARTED` for unauth, `ROUTES.DASHBOARD` for auth).
- **Files modified:** `src/routes/index.tsx` (created then deleted — no net change)
- **Verification:** `npm run build` succeeds without errors after removal
- **Committed in:** 28cfbd2 (not included in commit, file was deleted before commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - bug from conflicting route path)
**Impact on plan:** The acceptance criteria (/ redirects to /getting-started) is fully met by the existing private index route. No functionality lost.

## Issues Encountered
- TanStack Router pathless group behavior: `(private)` group is pathless, meaning `/(private)/index.tsx` registers at path `/` (not `/(private)/`). This is correct and expected per TanStack Router docs.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Route constants complete: `ROUTES.GETTING_STARTED`, `ROUTES.LANDING`, `ROUTES.DASHBOARD` all defined
- Auth guard behavior confirmed correct per D-01
- Ready for 02-02 (landing module) and subsequent auth page plans

## Threat Surface Scan
No new network endpoints, auth paths, file access patterns, or schema changes introduced.

---
*Phase: 02-implement-auth-profile-skeleton-code*
*Completed: 2026-04-20*
