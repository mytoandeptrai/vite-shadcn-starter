# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a merchant administration panel for PWC's payment processing system. Built with React 19 + Vite 7, featuring a module-based architecture, TanStack Router for file-based routing, TanStack Query for server state, and shadcn/ui components.

**Tech Stack:**
- Build: Vite 7
- Framework: React 19 + TypeScript
- Routing: TanStack Router (file-based, type-safe)
- State: Zustand (client state) + TanStack Query (server state)
- Styling: Tailwind CSS 4 + shadcn/ui
- Forms: React Hook Form + Zod validation
- i18n: i18next (English & Vietnamese)
- Testing: Vitest
- Linting: Biome

## Commands

### Development
```bash
pnpm dev          # Start dev server (http://localhost:5173)
pnpm build        # Build for production (runs tsc + vite build)
pnpm serve        # Preview production build
pnpm storybook    # Start Storybook on port 6006
```

### Code Quality
```bash
pnpm lint         # Lint code with Biome
pnpm format       # Format code with Biome
pnpm check        # Run linting and formatting checks
pnpm test         # Run tests with Vitest
```

### Code Generation
```bash
pnpm generate     # Generate components/modules using Plop
```

## Architecture

### Module-Based Structure

The project follows a **Container → Components → Hooks** pattern where business logic is separated from presentation.

**Key directories:**
- `src/modules/[feature]/` - Feature modules containing business logic
  - `containers/` - Smart components with logic (use hooks, pass props)
  - `components/` - Pure UI components (presentational only)
  - `hooks/` - Business logic, API calls, state management
  - `contexts/` - Module-specific contexts
- `src/routes/` - TanStack Router file-based routes (import containers)
- `src/apis/[domain]/` - API layer (keys, types, requests, queries)
- `src/components/` - Shared components (ui/, layouts/, shared/)
- `src/integrations/` - Third-party integrations (i18n, query, auth, theme)
- `src/stores/` - Global Zustand stores
- `src/hooks/` - Shared hooks
- `src/utils/` - Utility functions
- `src/constant/` - Constants and enums

### API Layer Pattern

Each API domain follows a 4-file pattern:

```typescript
// apis/merchants/keys.ts - Endpoint keys
export const KEYS = {
  MERCHANT_LIST: 'merchants/list',
};

// apis/merchants/types.ts - TypeScript interfaces
export interface GetMerchantsParams { page: number; }
export interface GetMerchantsResponse { data: Merchant[]; }

// apis/merchants/requests.ts - Raw API calls
export const getMerchants = (params, signal) => {
  return httpInstance.get(KEYS.MERCHANT_LIST, { params, signal });
};

// apis/merchants/queries.ts - TanStack Query hooks
export const useGetMerchants = (params, options) => {
  return useQuery({
    queryKey: [KEYS.MERCHANT_LIST, params],
    queryFn: ({ signal }) => getMerchants(params, signal),
    ...options,
  });
};
```

### Module Pattern

```typescript
// routes/(private)/merchants/index.tsx - Route imports container
import { MerchantContainer } from '@/modules/merchants';

export const Route = createFileRoute('/(private)/merchants/')({
  component: MerchantContainer,
});

// modules/merchants/hooks/use-merchant-container.ts - Business logic
export const useMerchantContainer = () => {
  const { t } = useTranslation('merchants-page');
  const search = Route.useSearch(); // URL params
  const { data, isLoading } = useGetMerchants(search);

  return { t, isLoading, data, /* handlers */ };
};

// modules/merchants/containers/merchant-container.tsx - Smart component
export const MerchantContainer = () => {
  const { t, isLoading, data } = useMerchantContainer();
  return <MerchantTable data={data} loading={isLoading} />;
};

// modules/merchants/components/merchant-table.tsx - Pure UI
export const MerchantTable = ({ data, loading }: Props) => {
  // Only rendering logic, no hooks except form hooks
  return <Table>{/* UI */}</Table>;
};
```

### Routing

TanStack Router with file-based routing and auto-generated type-safe routes.

**Route groups:**
- `(auth)/*` - Public authentication routes
- `(private)/*` - Protected routes with sidebar layout

**Route features:**
- Type-safe search params with Zod validation
- Auto code splitting
- Nested layouts
- Route protection via `beforeLoad` hook

```typescript
// Route with search params validation
export const Route = createFileRoute('/(private)/merchants/')({
  validateSearch: (search) => merchantsSearchSchema.parse(search),
  component: MerchantContainer,
});
```

Routes are auto-generated in `src/routeTree.gen.ts` by the TanStack Router plugin.

### State Management

**Multi-layered approach:**

1. **Server State:** TanStack Query
   - API data fetching and caching
   - Location: `src/apis/[domain]/queries.ts`
   - Default staleTime: 1 minute

2. **Client State:** Zustand (with persistence)
   - `use-session-store.ts` - Access/refresh tokens
   - `use-base-store.ts` - Currency settings

3. **Context State:** React Context
   - Auth state: `src/integrations/auth/auth-provider.tsx`
   - Module-specific contexts in module folders

4. **URL State:** TanStack Router search params
   - Table filters, pagination, sorting

### HTTP Client

Location: `src/apis/http-instance.ts`

Features:
- Automatic token injection from Zustand
- Token refresh logic (ready but commented)
- Automatic error toasts with i18n
- Query param serialization with qs
- Empty param cleanup
- 10s timeout

### i18n

Translation files: `public/locales/{en,vi}/[namespace].json`

```typescript
const { t } = useTranslation('merchants-page');
t('title'); // from merchants-page.json
```

## Naming Conventions

**CRITICAL:** Always use these naming patterns:

- **Files/Folders:** `kebab-case` (user-profile.tsx, use-auth.ts)
- **Components:** `PascalCase` (UserProfile, LoginForm)
- **Hooks:** `camelCase` with `use` prefix (useAuth, useMerchantContainer)
- **Constants:** `UPPER_SNAKE_CASE` (API_URL, MAX_RETRIES)

**When creating new files:**
1. Create the folder structure first: `mkdir -p src/modules/feature/containers`
2. Then create files: `touch src/modules/feature/containers/feature-container.tsx`
3. Never create files in non-existent directories

## Development Workflow

### Adding a New Feature

1. **Create API layer** in `src/apis/[domain]/`:
   - `keys.ts` - endpoint keys
   - `types.ts` - TypeScript interfaces
   - `requests.ts` - raw API calls
   - `queries.ts` - TanStack Query hooks

2. **Create module** in `src/modules/[feature-name]/`:
   - `hooks/` - business logic hooks + schema.ts for Zod validation
   - `containers/` - smart components that use hooks
   - `components/` - presentational UI components
   - `index.ts` - export container

3. **Create route** in `src/routes/[path].tsx`:
   - Import container from module
   - Add route validation if needed
   - Keep routes minimal - just route config + container import

4. **Add translations** in `public/locales/{en,vi}/[feature]-page.json`

5. **Update constants:**
   - Add route to `src/constant/route.const.ts` if needed
   - Add to sidebar config in `src/components/layouts/app-sidebar/` if needed

### Form Validation Pattern

```typescript
// modules/merchants/hooks/schema.ts
import { z } from 'zod';

export const merchantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
});

// In component
const form = useForm({
  resolver: zodResolver(merchantSchema),
  defaultValues: { name: '', email: '' },
});
```

### Important Utilities

**Lodash:** Import specific functions to minimize bundle size
```typescript
import groupBy from 'lodash/groupBy'; // Good
import _ from 'lodash'; // Bad
```

**Date formatting:** Use `date-fns` or `dayjs` (both available)

**Currency formatting:** Use `formatCurrency()` from `src/utils/common.ts`

**Numbers:** Use `formatNaturalNumber()` from `src/utils/common.ts`

## Key Configuration Files

- `vite.config.ts` - Vite config with TanStack Router plugin
- `tsconfig.json` - TypeScript with path alias `@/*` → `./src/*`
- `biome.json` - Linting and formatting rules
- `components.json` - shadcn/ui configuration
- `.cursor/rules/` - Cursor AI rules (module structure, hooks, utilities)

## Environment Variables

All environment variables must be prefixed with `VITE_`.

Access via: `import { env } from '@/constant/base.const'`

## Critical Rules from Cursor Config

1. **Module Pattern:** Routes import containers, containers use hooks, hooks contain logic, components are pure UI

2. **File Creation:** Always create folders before files

3. **No Logic in Routes:** Routes should only import and compose containers

4. **Container vs Component:**
   - Containers: Use hooks, handle logic, pass props to components
   - Components: Pure presentation, receive props, render UI

5. **Hooks:** Use `use` prefix, keep focused on single responsibility

6. **Shared vs Module-specific:**
   - Shared code → top-level directories
   - Module-specific → inside module directory

## Common Patterns

### Protected Routes
```typescript
// (private)/layout.tsx
beforeLoad: ({ context }) => {
  if (!context.auth.isAuthenticated) {
    throw redirect({ to: ROUTES.LOGIN });
  }
}
```

### Provider Composition
```typescript
// Compose providers cleanly
export const InfraProviders = compose([
  ThemeProvider,
  DialogProvider,
  AuthProvider
]);
```

### Path Aliases
```typescript
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constant/route.const';
```

## Testing

Run tests: `pnpm test`

Note: No test files currently exist in src/ - tests would go alongside source files with `.test.ts(x)` extension.

## Code Generation with Plop

Use `pnpm generate` to scaffold new components/modules using templates in `plop-templates/`.
