# Coding Conventions

**Analysis Date:** 2026-04-20

## Naming Patterns

**Files:**
- TypeScript throughout (`.ts`, `.tsx`) under `src/`
- Routes use TanStack Router conventions including route groups like `(auth)` and `(private)` (see `src/routes/`)

**Functions / variables:**
- `camelCase` functions and variables
- Constants often `UPPER_SNAKE_CASE` in `src/constant/*` (e.g., `BASE_REFRESH_INTERVAL` in `src/constant/base.const.ts`)

**Types:**
- `PascalCase` type aliases and interfaces (example: `AuthContextState` in `src/integrations/auth/auth-provider.tsx`)

## Code Style

**Formatting:**
- Biome formatter enabled (`biome.json`)
- 2-space indentation, single quotes, semicolons required (see `biome.json`)
- Line width: 120 (`biome.json`)

**Linting:**
- Biome lint enabled with React + Next domains configured (`biome.json`)
- Key rules:
  - `correctness.noUnusedImports`: error
  - `security.noGlobalEval`: error
  - sorted classnames enforced via `nursery.useSortedClasses` for `className` and `cn`/`cx`

## Import Organization

**Path aliases:**
- `@/*` maps to `src/*` (`tsconfig.json`, Vite alias in `vite.config.ts`)
- shadcn alias set: `@/components`, `@/components/ui`, `@/lib/utils` (`components.json`)

**Type imports:**
- Project is configured to enforce `useImportType` in TS/TSX via Biome overrides (`biome.json`)

## Error Handling

**API layer:**
- Centralized axios interceptor handles:
  - toast-based user messaging (`sonner`)
  - token refresh queueing + replay (`src/apis/http-instance.ts`)
- Redirect to login on refresh failure: `window.location.href = ROUTES.LOGIN` (`src/apis/http-instance.ts`)

**UI layer:**
- Global error boundary used at app root (`src/components/ui/error-boundary.tsx` mounted in `src/main.tsx`)

## Logging

**Current approach:**
- Some `console.error` usage in query mutation `onError` (`src/integrations/tanstack-query/root-provider.tsx`)
- Prefer consistent logging strategy if app grows (no dedicated logger found in this pass)

## Comments

**Patterns:**
- Minimal inline commentary; prefer clear code
- TODO placeholders exist (example: `onRefetch` TODO in `src/integrations/auth/auth-provider.tsx`)

## Module Design

**Organization:**
- Feature modules in `src/modules/`
- Integrations isolated in `src/integrations/`
- API access isolated in `src/apis/`

---

*Convention analysis: 2026-04-20*
*Update when patterns change*
# Coding Conventions

**Analysis Date:** 2026-04-20

## Naming Patterns

**Files:**
- Prefer **kebab-case** for most React/component files and feature modules.
  - Examples: `src/components/ui/button.tsx`, `src/components/ui/permitted-button.tsx`, `src/modules/transaction-detail/containers/transaction-detail-container/transaction-detail-container.tsx`
- Use `index.ts` / `index.tsx` as barrel entry points in leaf folders.
  - Examples: `src/utils/index.ts`, `src/components/storybook/index.ts`, `src/modules/transaction-detail/index.ts`

**Functions:**
- Prefer **camelCase** for functions and exported utilities.
  - Examples: `src/utils/common.ts` (`shortenString`, `formatDate`, `handleToastError`)

**Variables:**
- Prefer **camelCase** for local variables and module-level constants.
- Use **UPPER_SNAKE_CASE** for constants that represent mappings/options or configuration.
  - Examples: `src/utils/common.ts` (`CHAIN_OPTIONS`, `CRYPTO_OPTIONS`)

**Types:**
- Prefer **PascalCase** for types/interfaces and generics.
  - Examples: `src/apis/transactions/requests.ts` (`GetTransactionListParams`, `GetTransactionListResponse`)

## Code Style

**Formatting:**
- Tool: **Biome**
  - Config: `biome.json`
  - VSCode formatter wiring: `.vscode/settings.json`
- Key settings (source of truth: `biome.json`):
  - Indentation: **2 spaces** (`formatter.indentStyle=space`, `indentWidth=2`)
  - Line width: **120**
  - Quotes: **single quotes** (`javascript.formatter.quoteStyle=single`, `jsxQuoteStyle=single`)
  - Semicolons: **always** (`javascript.formatter.semicolons=always`)
  - Trailing commas: **es5**

**Linting:**
- Tool: **Biome**
  - Run via `pnpm lint` / `pnpm check` (see `package.json`)
- Notable enforced rules (see `biome.json`):
  - **No unused imports**: `correctness.noUnusedImports=error`
  - **No parameter reassignment**: `style.noParameterAssign=error`
  - **Prefer type-only imports/exports**: `style.useImportType=error`, `style.useExportType=error` (TS/TSX overrides)
  - **No `==`**: `suspicious.noDoubleEquals=error`
  - **Tailwind class sorting**: `nursery.useSortedClasses=error` for `className` and helper fns `cx` / `cn`
  - **A11y checks** (TSX override enables stricter anchor/click-key rules)

## Import Organization

**Order:**
1. **External packages**
2. **Internal absolute imports** via `@/…`
3. **Relative imports** (`./…`, `../…`)
4. **Type-only imports** using `import type …`

Examples:
- `src/components/ui/button.tsx`:
  - external (`@radix-ui/react-slot`, `class-variance-authority`)
  - internal (`@/lib/utils`)
  - type-only (`import type * as React from 'react'`, `type VariantProps`)
- `src/utils/common.ts`:
  - external (`dayjs`, `ethers`, `sonner`, `uuid`)
  - internal (`@/constant`, `@/types`, `@/stores/use-base-store`)
  - type-only (`import type { … } from …`, `import type { TFunction } from 'i18next'`)

**Path Aliases:**
- Use `@/*` for imports rooted at `src/` (configured in `tsconfig.json` and `vite.config.ts`).
  - Examples: `src/components/ui/button.tsx` (`@/lib/utils`), `src/utils/common.validation.test.ts` (`@/test/utils/mock-file`)

## Error Handling

**Patterns:**
- Prefer returning **safe fallbacks** for invalid input rather than throwing for UI-facing utilities.
  - Examples: `src/utils/common.ts`
    - `shortenString()` returns `''` for falsy input
    - `formatCurrency()` returns `'0'` for `NaN`
    - `getCountdownToTime()` returns `'00:00'` / `'00:00:00'` for invalid dates
- For user-visible errors, use toast notifications where appropriate.
  - Example: `src/utils/common.ts` `handleToastError()` uses `sonner` (`toast.error(...)`)

## Logging

**Framework:** `console` (selectively), plus toast notifications for user-facing errors.

**Patterns:**
- Prefer structured/intentional console output only where needed (examples found in):
  - `src/apis/http-instance.ts` (request error logging)
  - `src/components/ui/error-boundary.tsx` (caught error logging)
  - `src/components/ui/google-analytics.tsx` (configuration/integration logging)
  - `src/workers/my.worker.ts` (worker message logging)

## Comments

**When to Comment:**
- Use file headers for test intent and scope.
  - Examples: `src/components/ui/badge.test.tsx`, `src/utils/common.validation.test.ts`

**JSDoc/TSDoc:**
- Used sparingly; sometimes for non-obvious utilities and test helpers.
  - Examples: `src/test/utils/render-helpers.tsx`, `src/test/utils/query-wrapper.tsx`

## Function Design

**Size:** Utilities tend to be small and composable; long formatting/utility functions are grouped in `src/utils/common.ts`.

**Parameters:**
- Provide defaults for optional inputs where appropriate.
  - Examples: `src/utils/common.ts` (`shortenString(str?, length=10)`, `validateFileSize(file, size=10)`)

**Return Values:**
- Prefer **total functions** (defined behavior for invalid/empty inputs) to reduce UI crash risk.

## Module Design

**Exports:**
- Mix of **named exports** (common in UI primitives and utils) and **default exports** (used in some components/containers).
  - Named exports: `src/components/ui/button.tsx` (`export { Button, buttonVariants, type ButtonProps }`)
  - Default exports exist (examples): `src/components/ui/data-table/data-table.tsx`, `src/modules/dashboard/containers/dashboard-container/dashboard-container.tsx`

**Barrel Files:**
- Used for re-exporting module APIs, especially in `utils` and feature/module boundaries.
  - Example: `src/utils/index.ts`

---

*Convention analysis: 2026-04-20*

