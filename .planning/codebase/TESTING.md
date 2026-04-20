# Testing Patterns

**Analysis Date:** 2026-04-20

## Test Framework

**Runner:**
- Vitest `^3.x`
- Config: `vite.config.ts` (`test` block)

**Assertion Library:**
- Vitest built-in `expect`
- DOM matchers via `@testing-library/jest-dom`

**Run Commands:**
```bash
pnpm test                 # Run all tests once
pnpm test:watch           # Watch mode
pnpm test:ui              # Vitest UI
pnpm test:coverage        # Coverage report
```

## Test File Organization

**Setup:**
- Vitest globals enabled (`vite.config.ts`)
- Setup file: `src/test/setup.ts` (`vite.config.ts`)

**Location / naming:**
- Not fully mapped in this pass (recommend: keep tests near code or under `src/` with consistent `*.test.ts(x)` naming)

## Coverage

**Configuration:**
- Provider: v8 (`vite.config.ts`)
- Reporters: text/json/html
- Includes:
  - `src/utils/**/*.ts`
  - `src/components/ui/**/*.tsx`
- Excludes:
  - `src/utils/storage.ts`
  - `src/utils/index.ts`

## Mocking

**Framework:**
- Vitest `vi.*` mocking utilities (implied by Vitest usage)

## Test Types

**Unit/Component tests:**
- Intended coverage targets utilities and UI primitives (per include config)

**E2E tests:**
- Not present (no Playwright/Cypress dependency detected)

---

*Testing analysis: 2026-04-20*
*Update when test patterns change*
# Testing Patterns

**Analysis Date:** 2026-04-20

## Test Framework

**Runner:**
- **Vitest** (see `package.json` devDependencies)
- Config: `vite.config.ts` (`test` block)

**Assertion Library:**
- **Vitest expect** + **Testing Library matchers**
  - `@testing-library/jest-dom` loaded in `src/test/setup.ts`

**Run Commands:**

```bash
pnpm test              # Run all tests once (vitest run)
pnpm test:watch        # Watch mode
pnpm test:ui           # Vitest UI
pnpm test:coverage     # Coverage report
```

## Test File Organization

**Location:**
- Tests are primarily **co-located** with source under `src/`.
  - Examples:
    - `src/utils/common.array.test.ts` tests `src/utils/common.ts`
    - `src/components/ui/badge.test.tsx` tests `src/components/ui/badge.tsx`

**Naming:**
- `*.test.ts` / `*.test.tsx`
  - Examples: `src/utils/validations.test.ts`, `src/components/ui/badge.test.tsx`

**Structure:**

```
src/
  components/ui/
    button.tsx
    badge.tsx
    badge.test.tsx
  utils/
    common.ts
    common.array.test.ts
    common.format.test.ts
    common.validation.test.ts
  test/
    setup.ts
    fixtures/
      currency.ts
    utils/
      render-helpers.tsx
      query-wrapper.tsx
      mock-i18n.ts
      mock-file.ts
```

## Test Structure

**Suite Organization:**

```typescript
describe('ThingUnderTest', () => {
  describe('Feature/Scenario Group', () => {
    it('should [expected behavior] when [condition]', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

Concrete examples:
- UI component tests: `src/components/ui/badge.test.tsx`
- Utility tests: `src/utils/common.array.test.ts`, `src/utils/common.format.test.ts`

**Patterns:**
- **AAA / Arrange-Act-Assert** is common (and codified in `src/test/TEST-GUIDE.md`).
- Prefer semantic queries from Testing Library (`getByRole`, `getByLabelText`) per `src/test/TEST-GUIDE.md`.

## Mocking

**Framework:** Vitest (`vi`)

**Patterns:**
- Mock third-party modules for determinism.

```typescript
import { vi } from 'vitest';

vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mock-uuid-1234'),
}));
```

Example: `src/utils/common.validation.test.ts`

- Prefer typed mocking with `vi.mocked(...)` when mocking hook-based modules (documented in `src/test/TEST-GUIDE.md`).
- Reset mock state per test group:
  - `vi.clearAllMocks()` in `beforeEach` (documented in `src/test/TEST-GUIDE.md`)

**What to Mock:**
- Time, randomness, translations, file objects, and hook-based data sources.
  - i18n helpers: `src/test/utils/mock-i18n.ts`
  - File helpers: `src/test/utils/mock-file.ts`

**What NOT to Mock:**
- Avoid testing third-party internals; test behavior/integration points instead (guidance in `src/test/TEST-GUIDE.md`).

## Fixtures and Factories

**Test Data:**
- Use fixtures under `src/test/fixtures/`.
  - Example: `src/test/fixtures/currency.ts` used by `src/utils/common.format.test.ts`

**Location:**
- Fixtures: `src/test/fixtures/`
- Utilities/wrappers: `src/test/utils/`

## Coverage

**Requirements:** Configured (scope-limited), not global-all-files.

**Configuration:**
- `vite.config.ts`:
  - Provider: `v8`
  - Reporters: `text`, `json`, `html`
  - Include: `src/utils/**/*.ts`, `src/components/ui/**/*.tsx`
  - Exclude: `src/utils/storage.ts`, `src/utils/index.ts`

**View Coverage:**

```bash
pnpm test:coverage
```

## Test Types

**Unit Tests:**
- Utility functions (pure/deterministic) in `src/utils/` (examples: `src/utils/common.*.test.ts`, `src/utils/validations.test.ts`)

**Integration Tests:**
- Component-level behavior tests for presentational UI primitives in `src/components/ui/` (example: `src/components/ui/badge.test.tsx`)
- Container tests that mock TanStack Query hooks are an intended pattern (documented in `src/test/TEST-GUIDE.md`)

**E2E Tests:**
- Not detected (no `playwright.config.*` / `cypress.config.*` found in repo root as of this analysis).

## Common Patterns

**DOM/React Testing Library wrapper:**
- Use the shared re-export wrapper so tests import from one place.
  - `src/test/utils/render-helpers.tsx` exports `render` and re-exports Testing Library utilities.

**TanStack Query wrapper:**
- For components using React Query, create an isolated `QueryClient` per test.

```typescript
import { createTestQueryClient, createQueryWrapper } from '@/test/utils/query-wrapper';

const queryClient = createTestQueryClient();
const wrapper = createQueryWrapper(queryClient);
```

Implementation: `src/test/utils/query-wrapper.tsx`

**Async Testing:**
- Use `waitFor()` for async UI updates/mutations (documented in `src/test/TEST-GUIDE.md`).

**User Interaction:**
- Prefer `userEvent.setup()` over `fireEvent` (documented in `src/test/TEST-GUIDE.md`).

---

*Testing analysis: 2026-04-20*

