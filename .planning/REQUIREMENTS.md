# Requirements: Admin Dashboard Base (Vite + shadcn + TanStack)

**Defined:** 2026-04-20  
**Core Value:** Tạo được một nền tảng dashboard dễ mở rộng module (list/detail/form) và dễ reuse giữa các repo, với UX/UI nhất quán.

## v1 Requirements

### Design (Pencil)

- [ ] **DSGN-01**: Có file `base-design.pen` chứa đầy đủ thiết kế cho base dashboard ở desktop 1440×900
- [ ] **DSGN-02**: Mỗi màn có đủ **Light + Dark** theme (2 frames/màn) dùng đúng tokens trong `src/styles.css`
- [ ] **DSGN-03**: Có quy ước đặt tên frames + reusable components trong `.pen` để copy/extend nhanh

### Auth

- [ ] **AUTH-01**: Có design cho Sign-in + Forgot password + Reset password + Success notification (light+dark)
- [ ] **AUTH-02**: Có design cho Logout confirm dialog (light+dark)

### Profile

- [ ] **PROF-01**: Có design cho Profile page (ít nhất 1 state view + 1 state edit) (light+dark)

### Landing / Getting Started

- [ ] **LAND-01**: Có design cho Landing marketing page (hero + features + CTA) (light+dark)
- [ ] **LAND-02**: Có design cho Getting Started page (hướng dẫn dùng repo + link sign-in) (light+dark)

### Reference (existing modules)

- [ ] **REF-01**: Có design tham chiếu Transactions list (table + filters) (light+dark)
- [ ] **REF-02**: Có design tham chiếu Transaction detail (overview/timeline/raw) (light+dark)

## v2 Requirements

### Permissions / Multi-tenant

- **RBAC-01**: Role/permission model + enforcement (beyond UI visibility)
- **TEN-01**: Org switcher + tenant-scoped data

## Out of Scope

| Feature | Reason |
|---------|--------|
| Backend thật + tích hợp production API | mock-first, backend sau |
| Multi-tenant + RBAC enforcement | giữ đơn giản để reuse, để v2 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DSGN-01 | Phase 1 | Pending |
| DSGN-02 | Phase 1 | Pending |
| DSGN-03 | Phase 1 | Pending |
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| PROF-01 | Phase 1 | Pending |
| LAND-01 | Phase 1 | Pending |
| LAND-02 | Phase 1 | Pending |
| REF-01 | Phase 1 | Pending |
| REF-02 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 10 total
- Mapped to phases: 10
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-20*
*Last updated: 2026-04-20 after initial definition*

