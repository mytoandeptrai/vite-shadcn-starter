# Phase 2: Implement Auth/Profile skeleton (code) - Context

**Gathered:** 2026-04-20  
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement UI (code) **bám theo design Phase 1 đã locked** trong `base-design.pen` (Pencil là source of truth).

Scope chính:
- Landing / Getting Started
- Auth (login / register / forgot / reset / success)
- App shell + Profile (đưa Profile vào Settings)
- Transactions (update sang mock data)

Out-of-scope:
- Real backend integration (mock-first)
- RBAC / multi-tenant (để v2)

</domain>

<decisions>
## Implementation Decisions

### Routing + Entry flow
- **D-01:** Chưa login thì user ở **`/getting-started`** (không vào `/`).
- **D-02:** Fake sign-in sẽ redirect về **`/dashboard`**.
- **D-03:** Profile canonical route chuyển về **Settings Profile** (ưu tiên `/(private)/settings/profile`) thay vì `/profile`.

### Session / auth (fake)
- **D-04:** Fake sign-in lưu token vào localStorage thông qua `useSessionStore` (`src/stores/use-session-store.ts`).
- **D-05:** Token fake hardcode:
  - `accessToken = "mock_access"`
  - `refreshToken = "mock_refresh"`

### Navigation placement
- **D-06:** Profile nằm ở **footer sidebar** (theo pattern `AppSidebar`) thay vì top-level nav item.

### Code organization (module pattern)
- **D-07:** Tách theo đúng pattern module hiện có: **container → hook → ui** (giống `transactions` / `dashboard`).
  - Routes render module containers, không nhét feature logic trực tiếp trong route.

### Mock data strategy (Phase 2)
- **D-08:** Dev **luôn dùng mock data** (chưa cần env switch). Vẫn tạo các “apis” trong `src/apis/<domain>/...` theo pattern hiện có, nhưng implementation trả mock.
- **D-09:** Mock API dùng `new Promise((resolve) => setTimeout(() => resolve(...), 800))` để giả lập network và test loading state.
- **D-10:** Áp dụng mock cho **transactions và auth** (update các requests/queries tương ứng).

### Claude's Discretion
- Chọn shape mock response phù hợp với types hiện có trong `src/apis/**/types.ts` để React Query + UI chạy đúng.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design source of truth
- `base-design.pen` — Pencil wireframes (Light/Dark, 1440×900), locked workflow: implement UI from this.

### Routing / layouts
- `src/constant/route.const.ts` — route constants (`ROUTES.*`)
- `src/routes/(private)/layout.tsx` — auth guard + app shell (sidebar/header)
- `src/routes/(auth)/layout.tsx` — auth layout (full-screen)
- `src/routes/(auth)/getting-started.tsx` — getting-started route (currently placeholder; implement per design)

### Sidebar footer placement
- `src/components/layouts/app-sidebar/app-sidebar.tsx` — footer dropdown menu (Profile/Signout placement)

### Session + auth wiring
- `src/stores/use-session-store.ts` — token persistence (`__session_storage`)
- `src/apis/http-instance.ts` — attaches Bearer token from session store; handles refresh queueing

### Transactions API pattern to mirror (but mocked)
- `src/apis/transactions/requests.ts`
- `src/apis/transactions/queries.ts`
- `src/apis/transactions/types.ts`

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/layouts/app-sidebar/*` + `src/components/layouts/app-header/*` — app shell layout
- `src/components/containers/page-container.tsx` — page wrapper pattern (used by private pages)
- `src/components/ui/*` — shadcn primitives (Card/Input/Button/Dropdown/Sidebar...)

### Established Patterns
- Route guards dùng `beforeLoad` + `redirect` trong TanStack Router layouts (`/(private)` và `/(auth)`).
- Data fetching theo React Query: `src/apis/<domain>/queries.ts` gọi `requests.ts` (nên mock ở requests layer để giữ query contracts).

### Integration Points
- Fake sign-in/out: `useSessionStore` + auth provider + route guards
- Sidebar footer: update link Profile đúng settings/profile

</code_context>

<specifics>
## Specific Ideas

- Mock-first: giữ đúng cấu trúc `src/apis/**` để sau này thay mock bằng real API dễ.

</specifics>

<deferred>
## Deferred Ideas

- None — decisions stay within Phase 2 scope

</deferred>

---

*Phase: 02-implement-auth-profile-skeleton-code*  
*Context gathered: 2026-04-20*

