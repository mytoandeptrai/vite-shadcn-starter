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

**UI hint**: yes

---

## Phase 2: Implement Auth/Profile skeleton (code)

**Goal:** Chuyển design Phase 1 thành UI skeleton trong code: routes/auth (sign-in/up/forgot/reset/success) + profile, kết nối tối thiểu với session store + http instance (mock-first).

**Depends on:** Phase 1

---

