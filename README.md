# Vite + Shadcn UI Starter Template

A modern, production-ready React starter with Vite, module-based architecture, TanStack Router/Query/Table, i18n, and shadcn/ui.

TypeScript remains on the **5.9.x** line deliberately — TypeScript 7 (`tsgo`) is deferred until ecosystem tooling is stable.

## Features

- **Vite 8** — Rolldown/Oxc-backed build and dev server
- **React 19.3** — Latest React with React Compiler support
- **shadcn/ui** — Accessible components on Radix UI
- **TanStack Router** — Type-safe file-based routing
- **TanStack Query** — Server/async state
- **TanStack Table v9** — Headless tables (`tableFeatures` / `useTable`)
- **i18n** — English & Vietnamese via i18next
- **Dark mode** — Theme switching with `next-themes`
- **Module-based architecture** — Feature folders under `src/modules`
- **Tailwind CSS 4** — CSS-first setup via `@tailwindcss/vite`
- **TypeScript 5.9.x** — Strict typing (TS 7 intentionally not adopted yet)
- **Biome 2.x** — Lint + format
- **Storybook 10** — Component workshop
- **Vitest 5** — Unit tests with jsdom 30

## Project Structure

```
src/
├── assets/           # Static assets (images, fonts, icons)
├── apis/             # API clients and query keys
├── components/       # Shared UI (shadcn + form fields + data-table)
├── constant/         # App-wide constants
├── contexts/         # React context providers
├── hooks/            # Shared hooks
├── integrations/     # i18n, query, theme, dialog, etc.
├── lib/              # Shared helpers (e.g. `cn`)
├── modules/          # Feature modules
│   └── feature-name/
│       ├── containers/   # Orchestrate hooks + components
│       ├── components/   # Presentational UI
│       ├── hooks/        # Feature business logic
│       ├── utils/
│       ├── types.ts
│       └── index.ts
├── routes/           # File routes → import containers only
├── styles/           # Global styles / fonts
├── utils/            # Shared utilities
├── workers/          # Web workers
└── main.tsx
```

### Module pattern

**Container → Components → Hooks**

- **Containers**: state, hooks, orchestration; pass props down
- **Components**: presentational only
- **Hooks**: business logic / data fetching

```typescript
// Route: src/routes/index.tsx
import { HomeContainer } from '@/modules/home';

export const Route = createFileRoute('/')({
  component: HomeContainer,
});

// Container: src/modules/home/containers/home-container.tsx
import { HeroSection } from '../components/hero-section';

export function HomeContainer() {
  return (
    <main>
      <HeroSection />
    </main>
  );
}
```

### Demo surfaces

- **Demo form** (`src/modules/demo-form`) — reusable form fields (RHF + Zod)
- **Demo table** (`demo-table.tsx`) — mock Users table on shared `DataTable` (search, `MultiSelectPicker` status filter, sorting, pagination)

## Tech Stack

| Area | Choice |
|---|---|
| Framework | React 19.3 |
| Build | Vite 8 + `@vitejs/plugin-react` 6 |
| Routing | TanStack Router 1.x |
| Data | TanStack Query 5.x |
| Tables | TanStack Table 9.x |
| Styling | Tailwind CSS 4.3 |
| UI | shadcn/ui (Radix) |
| Forms | React Hook Form + Zod 4 |
| Dates | `react-day-picker` 10 |
| Charts | Recharts 3 |
| i18n | i18next 26 + react-i18next 17 |
| Testing | Vitest 5 + Testing Library |
| Lint/format | Biome 2.5 |
| Docs UI | Storybook 10 |
| Package manager | pnpm |

### Intentionally deferred

Per the migration plan, **TypeScript 7** is not upgraded in this baseline. Stay on 5.9.x until Storybook / TanStack plugins confirm support for the Go-based compiler.

## Requirements

- **Node.js** `20.19+` or `22.12+` (Storybook 10); Node 22 recommended (`react-dropzone` 20)
- **pnpm**

## Installation

```bash
git clone <repository-url>
cd vite-shadcn-starter
pnpm install
pnpm dev
```

Open `http://localhost:5173`.

Copy `.env.example` → `.env` and fill values as needed.

## Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm build` | Production build + `tsc` |
| `pnpm serve` | Preview production build |
| `pnpm test` | Vitest (run once) |
| `pnpm test:watch` | Vitest watch |
| `pnpm test:ui` | Vitest UI |
| `pnpm test:coverage` | Coverage report |
| `pnpm lint` / `pnpm format` / `pnpm check` | Biome |
| `pnpm storybook` | Storybook on `:6006` |
| `pnpm build-storybook` | Static Storybook build |
| `pnpm generate` | Plop generators |

## Adding Components

### shadcn/ui

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
```

### Feature module

```bash
mkdir -p src/modules/my-feature/{containers,components,hooks}
# or
pnpm generate
```

## Internationalization

```
public/locales/
├── en/
│   ├── common.json
│   ├── validation.json
│   ├── navigation.json
│   ├── dashboard-page.json
│   ├── transactions-page.json
│   └── …
└── vi/
    └── …
```

```typescript
import { useTranslation } from '@/integrations/i18n';

function MyComponent() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button type="button" onClick={() => i18n.changeLanguage('vi')}>
        Switch to Vietnamese
      </button>
    </div>
  );
}
```

## Theme

```typescript
import { useTheme } from '@/integrations/theme';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  );
}
```

## Code Conventions

### Naming

- **Files / folders**: `kebab-case` (`user-profile.tsx`, `use-auth-state.ts`)
- **Components**: PascalCase (`UserProfile`, `LoginForm`)

### Create folders before files

```bash
mkdir -p src/modules/new-feature/containers
touch src/modules/new-feature/containers/new-container.tsx
```

### Routes import containers only

```typescript
// Good
import { FeatureContainer } from '@/modules/feature-name';

export const Route = createFileRoute('/feature')({
  component: FeatureContainer,
});
```

### Data tables (TanStack Table v9)

Shared table lives in `src/components/ui/data-table` and uses:

- `tableFeatures({ ... })` + `useTable({ features, ... })`
- Column typing: `ColumnDef<AppTableFeatures, TData>`
- Manual pagination / sorting / filtering at the container level (same pattern as `transactions` and `demo-table`)

Prefer composing filters with shared UI (`DebouncedInput`, `MultiSelectPicker`) as `DataTable` children.

## Configuration

- `vite.config.ts` — Vite 8, React plugin, TanStack Router plugin, Tailwind, SVGR
- `tsconfig.json` — TypeScript (`paths`: `@/*` → `./src/*`)
- `biome.json` — Lint / format
- `components.json` — shadcn/ui
- `vercel.json` — Deploy hints

## Learn More

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [TanStack Table](https://tanstack.com/table)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Storybook](https://storybook.js.org/)
- [Vitest](https://vitest.dev/)
- [i18next](https://www.i18next.com/)

## License

Private template for starting new projects.

## Author

**mytoandeptrai**
