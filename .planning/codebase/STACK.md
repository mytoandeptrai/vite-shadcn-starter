# Technology Stack

**Analysis Date:** 2026-04-20

## Languages

**Primary:**
- TypeScript (ts/tsx) - all application code in `src/`

**Secondary:**
- JavaScript - scaffolding/tooling (`plopfile.js`)
- CSS - global styles in `src/styles.css`
- Markdown - docs in `docs/`

## Runtime

**Environment:**
- Browser SPA runtime (React) bundled by Vite
- Node.js runtime for tooling/build (Vite/Vitest/TypeScript)

**Package Manager:**
- pnpm (lockfile: `pnpm-lock.yaml`)

## Frameworks

**Core:**
- React `^19.2.1` - UI framework
- TanStack Router `^1.132.0` - file-based routing (generated route tree in `src/routeTree.gen.ts`)
- TanStack React Query `^5.66.5` - server-state caching (`src/integrations/tanstack-query/root-provider.tsx`)

**UI:**
- Radix UI primitives (multiple `@radix-ui/*` packages)
- Tailwind CSS `^4.0.6` + shadcn/ui conventions (`components.json`, styles in `src/styles.css`)

**Testing:**
- Vitest `^3.x` - unit/integration tests (configured in `vite.config.ts`)
- Testing Library (`@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`)

**Build/Dev:**
- Vite `^7.1.7` - dev server + bundler (`vite.config.ts`)
- TypeScript `^5.7.2` - type checking (`tsconfig.json`)
- Biome `2.2.4` - formatting + linting (`biome.json`)

## Key Dependencies

**Critical:**
- axios `^1.13.2` - HTTP client with interceptors (`src/apis/http-instance.ts`)
- zod `^4.1.11` - schema validation (used across app; search for `zod` usage in `src/`)
- zustand `^5.0.9` - client state store (`src/stores/`)
- i18next `^25.6.3` + `react-i18next` - localization (`src/integrations/i18n/`)
- next-themes `^0.4.6` - theming (dark/light)

## Configuration

**Environment:**
- Vite env vars accessed via `import.meta.env` and centralized in `src/constant/base.const.ts` (`env.API_URL`, `env.APP_URL`, etc.)

**Build:**
- `vite.config.ts` - Vite + TanStack Router plugin + Vitest config
- `tsconfig.json` - TS strictness and path alias `@/* -> src/*`

## Platform Requirements

**Development:**
- Node.js + pnpm
- Optional: Storybook (`npm run storybook`)

**Production:**
- Static assets output via `vite build` (`dist/`)
- Deployment configuration present: `vercel.json` (Vercel-ready)

---

*Stack analysis: 2026-04-20*
*Update after major dependency changes*
# Technology Stack

**Analysis Date:** 2026-04-20

## Languages

**Primary:**
- TypeScript - Application code in `src/**/*.ts` and `src/**/*.tsx` (configured in `tsconfig.json`)

**Secondary:**
- CSS - Global styles in `src/styles.css` and utility classes via Tailwind (see `package.json` deps `tailwindcss`, `@tailwindcss/vite`)
- HTML - App shell in `index.html`

## Runtime

**Environment:**
- Browser SPA (Vite-built) entry in `index.html` → `src/main.tsx`
- Node.js (dev/build tooling) - implied by Vite/TypeScript toolchain; `@types/node` declared in `package.json`

**Package Manager:**
- pnpm - lockfile `pnpm-lock.yaml` present (`lockfileVersion: 9.0`)
- Lockfile: present (`pnpm-lock.yaml`)

## Frameworks

**Core:**
- React `^19.2.1` - UI framework (`package.json`, entry `src/main.tsx`)
- TanStack Router `^1.132.0` - client-side routing (`package.json`, router created in `src/main.tsx`)
- TanStack Query `^5.66.5` - server state/data fetching (`package.json`, provider in `src/integrations/tanstack-query/root-provider.tsx`)

**Testing:**
- Vitest `^3.0.5` - test runner (`package.json` scripts `test*`, config embedded in `vite.config.ts`)
- Testing Library (`@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`) - UI testing utilities (`package.json`)
- jsdom `^27.0.0` - DOM environment for tests (`vite.config.ts` `test.environment = 'jsdom'`)

**Build/Dev:**
- Vite `^7.1.7` - dev server/bundler (`package.json`, config `vite.config.ts`)
- TypeScript `^5.7.2` - typechecking (`package.json`, `tsconfig.json`)
- Tailwind CSS `^4.0.6` - styling (`package.json`, Vite plugin `@tailwindcss/vite` in `vite.config.ts`)
- Storybook `^9.1.9` - component workshop (`package.json` scripts `storybook`, `build-storybook`)

## Key Dependencies

**Critical:**
- `axios` `^1.13.2` - HTTP client abstraction used by `src/apis/http-instance.ts`
- `zod` `^4.1.11` - schema validation (usage expected across forms/utilities; dependency in `package.json`)
- `zustand` `^5.0.9` - client state store (e.g. session store in `src/stores/use-session-store.ts`)
- `react-hook-form` `^7.62.0` + `@hookform/resolvers` `^5.2.2` - form state + validation integration (`package.json`)

**UI / UX:**
- Radix UI primitives (`@radix-ui/*`) - accessible components (used under `src/components/ui/*`)
- `class-variance-authority`, `clsx`, `tailwind-merge` - class composition utilities (`package.json`)
- `framer-motion` - animation (`package.json`)
- `sonner` - toast notifications (used in `src/apis/http-instance.ts`, `src/integrations/auth/auth-provider.tsx`)
- `lucide-react` - icons (`package.json`)

**Internationalization:**
- `i18next`, `react-i18next`, `i18next-http-backend`, `i18next-browser-languagedetector` - i18n setup in `src/integrations/i18n/config.ts`, translation files in `public/locales/**`

**Other notable:**
- `ethers` - used for address validation (`isAddress`) in `src/utils/common.ts`
- `react-google-recaptcha-v3` - reCAPTCHA provider in `src/integrations/recaptcha/recaptcha-provider.tsx`
- `react-helmet-async` - document head management (`src/main.tsx`)
- `web-vitals` - performance metrics loader (`src/reportWebVitals.ts`)

## Configuration

**Environment:**
- Vite env vars are read via `import.meta.env` in `src/constant/base.const.ts` and `src/constant/site.const.ts`
- Example env file present: `.env.example` (names only; actual values supplied per environment)

**Build:**
- Vite config: `vite.config.ts`
  - Path alias `@/*` → `src/*` (also in `tsconfig.json`)
  - TanStack Router Vite plugin with route tree generation (`@tanstack/router-plugin/vite`)
  - Tailwind plugin `@tailwindcss/vite`
  - SVGR plugin `vite-plugin-svgr`
  - Vitest config embedded under `test` key
- TypeScript config: `tsconfig.json`
- Lint/format: Biome config `biome.json` (scripts `format`, `lint`, `check` in `package.json`)

## Platform Requirements

**Development:**
- `pnpm install`
- `pnpm dev` (runs Vite dev server; port driven by `VITE_PORT` in `vite.config.ts`)

**Production:**
- Static SPA build via `pnpm build` (`vite build && tsc` in `package.json`)
- Vercel SPA rewrite configuration in `vercel.json`

---

*Stack analysis: 2026-04-20*

