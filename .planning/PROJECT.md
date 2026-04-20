# Admin Dashboard Base (Vite + shadcn + TanStack)

## What This Is

Một **source base admin dashboard** (repo này là sản phẩm) để bạn tái sử dụng cho nhiều dự án về sau. Codebase dùng TanStack Router (file-based routes) + React Query + Axios layer + i18n + theme, với layout sidebar/header kiểu dashboard.

## Core Value

Tạo được một nền tảng dashboard **dễ mở rộng module** (list/detail/form) và **dễ reuse** giữa các repo, với UX/UI nhất quán.

## Requirements

### Validated

- ✓ Routing + layout private/auth đã có sẵn (TanStack Router + sidebar/header) — existing
- ✓ Data table + pattern URL search state (transactions) đã có sẵn — existing
- ✓ i18n (en/vi) + theme (light/dark) đã có sẵn — existing

### Active

- [ ] Có bộ **design Pencil** chuẩn cho toàn bộ base (light+dark, 1440×900) để làm “source of truth” khi phát triển UI
- [ ] Có feature nền tảng: **login / logout / profile** (ưu tiên flow cơ bản, tái sử dụng được)
- [ ] Có landing + getting-started page (marketing + hướng dẫn dùng repo)

### Out of Scope

- RBAC/multi-tenant/org switcher — để sau (giữ đơn giản giai đoạn đầu)
- Backend thật / tích hợp production API — mock-first, backend sau

## Context

- Router: TanStack Router file-based routes sinh `src/routeTree.gen.ts` từ `src/routes/**` (không sửa file gen).
- Layout private hiện dùng sidebar width ~16rem + content phần còn lại.
- Design Phase 1 dùng Pencil file `base-design.pen` và palette/tokens trong `src/styles.css`.

## Constraints

- **UI tokens**: bám theo `src/styles.css` (màu primary `#675dff`, background/foreground/border/radius + dark theme variables)
- **Design tool**: dùng Pencil `.pen` (không chuyển sang Figma trong phase này)
- **Scope**: đơn giản trước, ưu tiên reuse

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Phase 1 làm design bằng Pencil (light+dark) | Có “nguồn chuẩn” để phát triển UI nhất quán | — Pending |
| Frame chuẩn Pencil: 1440×900 | Phù hợp admin dashboard + sidebar 16rem | — Pending |
| Landing gồm marketing + getting-started | Vừa giới thiệu base, vừa hướng dẫn dùng repo | — Pending |
| Logout có confirm dialog | Tránh thao tác nhầm | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-20 after initialization*

