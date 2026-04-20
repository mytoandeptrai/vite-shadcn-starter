# Roadmap: Admin Dashboard Base (Vite + shadcn + TanStack)

**Created:** 2026-04-20

## Phase 1: Pencil Base Design + Auth/Profile/Landing

**Goal:** Có bộ design Pencil (light+dark, 1440×900) cho toàn bộ base dashboard, bám theo tokens trong `src/styles.css`, dựa trên modules hiện có (transactions + transaction detail) và bổ sung các màn auth/profile/landing để làm nền reuse.

**Requirements:**
- DSGN-01, DSGN-02, DSGN-03
- AUTH-01, AUTH-02
- PROF-01
- LAND-01, LAND-02
- REF-01, REF-02

**Success Criteria:**
1. `base-design.pen` chứa đủ frames cho 10 hạng mục (mỗi hạng mục có Light + Dark) theo naming convention rõ ràng.
2. Palette trong design khớp tokens chính trong `src/styles.css` (primary `#675dff`, background/foreground/border/radius, dark theme equivalents).
3. Có 2 màn tham chiếu (Transactions list + Transaction detail) thể hiện đúng pattern table/detail của codebase.
4. Có full auth set (sign-in/forgot/reset/success) + logout confirm + profile + landing + getting-started.
5. Có checklist verification để người khác mở `.pen` và kiểm tra nhanh “đủ màn/đủ theme/đúng kích thước”.
6. Wireframe dùng **real elements** của Pencil (`rectangle`, `text`, …), không dùng “frame blocks” để giả lập UI.

**UI hint**: yes

---

## Phase 2: Implement Auth/Profile skeleton (code)

**Goal:** Implement UI từ design Phase 1 đã **locked** (Pencil là source of truth). Làm theo thứ tự: Landing/Getting Started → Auth → App shell/Profile → Transactions refs. Không “đi trước” design.

**Depends on:** Phase 1

**Plans:** 10 plans

Plans:
- [x] `02-01-PLAN.md` — Entry flow wiring: ROUTES + private guards/index + `/` redirect + thin `/landing` route file (D-01)
- [x] `02-09-PLAN.md` — Getting Started + Landing module containers/UI (D-01, D-07) (depends on `02-01`)
- [x] `02-02-PLAN.md` — Auth module skeleton (container→hook→ui) + Login UI moved into module ui layer (D-07) (depends on `02-01`)
- [x] `02-08-PLAN.md` — Auth UI components: Register/Forgot/Reset/Success (module `ui/**`) (D-07) (depends on `02-02`)
- [ ] `02-10-PLAN.md` — Auth containers + module exports for Register/Forgot/Reset/Success (D-07) (depends on `02-08`)
- [ ] `02-03-PLAN.md` — Thin auth routes + `(auth)` layout redirect to `ROUTES.DASHBOARD` (D-02, D-07) (depends on `02-10`)
- [ ] `02-04-PLAN.md` — Settings/Profile canonical route + sidebar footer Profile link (D-03, D-06, D-07)
- [ ] `02-05-PLAN.md` — Fake session persistence (mock tokens) + AuthProvider signout/refetch completion (D-01, D-02, D-04, D-05)
- [ ] `02-07-PLAN.md` — Logout confirm dialog + wire sidebar footer Sign out to require confirm (locked Pencil; D-06 placement)
- [ ] `02-06-PLAN.md` — Mock auth + transactions APIs with 800ms delay; wire AuthProvider user bootstrap (D-08..D-10)

---

