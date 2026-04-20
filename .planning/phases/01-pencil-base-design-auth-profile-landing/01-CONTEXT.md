# Phase 1: Pencil Base Design + Auth/Profile/Landing - Context

**Gathered:** 2026-04-20  
**Status:** Ready for planning  
**Source:** /gsd-discuss-phase 1 (conversation)

<domain>
## Phase Boundary

Phase 1 tập trung vào **design bằng Pencil** (file `.pen`) làm “nguồn chuẩn” cho UI base admin dashboard.

Phạm vi:
- Desktop frame chuẩn **1440×900**
- Mỗi màn có đủ **Light + Dark**
- Dựa theo tokens/palette hiện tại trong `src/styles.css`
- Tham chiếu modules hiện có: **Transactions list** + **Transaction detail**
- Bổ sung design cho feature mới: **login / logout / profile**
- Bổ sung design cho landing: **marketing landing + getting-started**

</domain>

<decisions>
## Implementation Decisions (Locked)

### Design tool & output
- Design được lưu trong file: `base-design.pen`
- Format `.pen` là JSON (version 2.11)

### Frames cần có (mỗi màn Light + Dark)
- Landing marketing (hero + features + CTA)
- Getting Started (hướng dẫn dùng repo + link sign-in)
- Sign-in
- Forgot password
- Reset password
- Success notification
- App shell (sidebar 16rem + header + content)
- Profile (ít nhất view + edit state)
- Logout confirm dialog (Yes/Cancel)
- Reference: Transactions list (table + filters)
- Reference: Transaction detail (overview/timeline/raw)

### Design fidelity
- Mid-fi, bám tokens trong `src/styles.css` (primary `#675dff`, background/foreground/border/radius + dark variables)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design source
- `base-design.pen` — file Pencil hiện tại (sẽ được mở rộng trong Phase 1)

### UI tokens
- `src/styles.css` — tokens CSS variables (light/dark) để dùng làm palette khi thiết kế

### Layout & modules tham chiếu
- `src/routes/(private)/layout.tsx` — layout private (sidebar + header)
- `src/components/layouts/app-sidebar/app-sidebar.tsx` — sidebar pattern + logout action
- `src/components/layouts/app-header/app-header.tsx` — header pattern
- `src/components/containers/page-container.tsx` — pattern loading/error/access
- `src/routes/(private)/transactions/index.tsx` — list route (search params pattern)
- `src/modules/transactions/containers/transaction-container/transaction-container.tsx` — tabs layout
- `src/routes/(private)/transactions/$transactionId.tsx` — detail route
- `src/modules/transaction-detail/containers/transaction-detail-container/transaction-detail-container.tsx` — detail layout blocks

### Auth pages đã scaffold
- `src/routes/(auth)/sign-in.tsx`
- `src/routes/(auth)/sign-up.tsx`
- `src/routes/(auth)/forgot-password.tsx`
- `src/routes/(auth)/reset-password.tsx`
- `src/routes/(auth)/success-notification.tsx`

</canonical_refs>

<specifics>
## Specific Ideas

- Sidebar width ~16rem (256px) và content chiếm phần còn lại; header fixed 64px.
- Logout cần dialog confirm (Yes/Cancel).
</specifics>

<deferred>
## Deferred Ideas

- RBAC enforcement + multi-tenant/org switcher (v2)
- Backend thật (mock-first)
</deferred>

---
*Phase: 01-pencil-base-design-auth-profile-landing*
*Context gathered: 2026-04-20 via discuss-phase*

