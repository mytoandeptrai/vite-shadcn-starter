# Phase 2: Implement Auth/Profile skeleton (code) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-20T14:55:14.046Z  
**Phase:** 02-implement-auth-profile-skeleton-code  
**Areas discussed:** Entry flow, fake auth/session, profile placement, module structure, mock API strategy

---

## Entry flow (unauthenticated)

| Option | Description | Selected |
|--------|-------------|----------|
| `/` | Landing is entry route | |
| `/getting-started` | Unauthenticated users start at Getting Started | ✓ |

**User's choice:** Unauthenticated users stay at `/getting-started`.  
**Notes:** Private root should redirect unauthenticated to getting-started.

---

## Fake sign-in behavior

| Option | Description | Selected |
|--------|-------------|----------|
| UI-only (no state) | Render form only, no session persistence | |
| Fake sign-in | Persist tokens to localStorage and treat as authenticated | ✓ |

**User's choice:** Fake sign-in, redirect to `/dashboard`, persist to `useSessionStore`.  
**Notes:** Tokens hardcoded: `mock_access` / `mock_refresh`.

---

## Profile route + placement

| Option | Description | Selected |
|--------|-------------|----------|
| `/profile` | Top-level private route | |
| `/(private)/settings/profile` | Settings page, footer sidebar placement | ✓ |

**User's choice:** Move profile to settings profile, link from footer sidebar.  
**Notes:** Align `AppSidebar` footer dropdown Profile link accordingly.

---

## Module organization

| Option | Description | Selected |
|--------|-------------|----------|
| Route-only | Implement directly in route components | |
| Module pattern | container → hook → ui (mirror transactions/dashboard) | ✓ |

**User's choice:** Always use module pattern, follow existing folder structure strictly.  
**Notes:** Route should render module containers.

---

## Mock API strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Real API | Call backend via axios | |
| Always mock in dev | `src/apis/**` returns mock promises; no env switch yet | ✓ |

**User's choice:** Always mock in dev; still keep `src/apis/**` structure.  
**Notes:** Use `new Promise(resolve => setTimeout(() => resolve(...), 800))`. Apply to transactions + auth.

