# Vite + Shadcn UI Starter Template

A modern, production-ready React starter template built with Vite, featuring a module-based architecture, TanStack Router, React Query, i18n support, and beautiful UI components from shadcn/ui.

## 🚀 Features

- ⚡ **Vite** - Lightning fast build tool and dev server
- ⚛️ **React 19** - Latest React with modern features
- 🎨 **shadcn/ui** - Beautiful, accessible component library
- 🎯 **TanStack Router** - Type-safe file-based routing
- 🔄 **TanStack Query** - Powerful data synchronization
- 🌍 **i18n** - Multi-language support (English & Vietnamese)
- 🎭 **Dark Mode** - Built-in theme switching
- 📦 **Module-Based Architecture** - Scalable project structure
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🔧 **TypeScript** - Full type safety
- ✅ **Biome** - Fast linter and formatter
- 📚 **Storybook** - Component development environment
- 🧪 **Vitest** - Fast unit testing framework
- 🎨 **Custom Fonts** - SF Pro Text font family included

## 📁 Project Structure

This template follows a **module-based architecture** for better scalability and maintainability:

```
src/
├── assets/           # Static assets (images, fonts, etc.)
├── components/       # Shared UI components used across modules
├── constant/         # Application-wide constants and enums
├── contexts/         # React context providers
├── data/             # Mock data, fixtures, and static data
├── hooks/            # Shared React hooks used across modules
├── integrations/     # Application-level integrations (i18n, query, theme, etc.)
├── lib/              # Shared library utilities and helpers
├── modules/          # Feature modules (business logic organized by feature)
│   └── feature-name/
│       ├── containers/   # Container components (orchestrate hooks and components)
│       ├── components/   # Presentational components (UI only, no logic)
│       ├── hooks/        # Module-specific hooks (business logic)
│       ├── utils/        # Module-specific utilities
│       ├── constants.ts  # Module-specific constants
│       ├── types.ts      # Module-specific TypeScript types
│       └── index.ts      # Module exports
├── routes/           # Route definitions that import from modules
├── styles/           # Global styles and fonts
├── utils/            # Utility functions and helpers
└── main.tsx          # Application entry point
```

### Module Architecture Pattern

Each feature module follows the **Container → Components → Hooks** pattern:

- **Containers**: Handle logic, state management, and orchestration. They use hooks and pass data/props to presentational components.
- **Components**: Pure presentational components that only handle rendering. They receive props and render UI.
- **Hooks**: Contain business logic, API calls, and state management that containers consume.

**Example:**
```typescript
// Route: src/routes/index.tsx
import { HomeContainer } from '@/modules/home';

export const Route = createFileRoute('/')({
  component: HomeContainer,
});

// Container: src/modules/home/containers/home-container.tsx
import { HeroSection } from '../components/hero-section';
import { FeaturesSection } from '../components/features-section';

export function HomeContainer() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
    </main>
  );
}
```

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Routing**: TanStack Router
- **State Management**: TanStack Query
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI)
- **Form Handling**: React Hook Form + Zod
- **i18n**: i18next + react-i18next
- **Testing**: Vitest
- **Linting/Formatting**: Biome
- **Package Manager**: pnpm

## 📦 Installation

1. **Clone or use this template:**
   ```bash
   git clone <repository-url>
   cd vite-shadcn-starter
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Start development server:**
   ```bash
   pnpm dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## 🎯 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm serve` - Preview production build
- `pnpm test` - Run tests
- `pnpm lint` - Lint code
- `pnpm format` - Format code
- `pnpm check` - Run linting and formatting checks
- `pnpm storybook` - Start Storybook
- `pnpm generate` - Generate components using Plop

## 🎨 Adding Components

### Using shadcn/ui

Add components from shadcn/ui:

```bash
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
```

### Creating Custom Components

Follow the module-based structure:

```bash
# Create module structure
mkdir -p src/modules/my-feature/{containers,components,hooks}

# Or use Plop generator
pnpm generate
```

## 🌍 Internationalization (i18n)

This template includes i18n support with English and Vietnamese translations.

**Translation files location:**
```
public/locales/
├── en/
│   ├── common.json
│   ├── validation.json
│   └── navigation.json
└── vi/
    ├── common.json
    ├── validation.json
    └── navigation.json
```

**Usage:**
```typescript
import { useTranslation } from '@/integrations/i18n';

function MyComponent() {
  const { t, i18n } = useTranslation();
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('navigation:home')}</p>
      <button onClick={() => i18n.changeLanguage('vi')}>
        Switch to Vietnamese
      </button>
    </div>
  );
}
```

## 🎭 Theme Support

Dark mode is built-in and can be toggled:

```typescript
import { useTheme } from '@/integrations/theme';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  );
}
```

## 📝 Code Conventions

### Naming Conventions

- **Files and Folders**: Always use `kebab-case`
  - ✅ `user-profile.tsx`, `use-auth-state.ts`
  - ❌ `UserProfile.tsx`, `useAuthState.ts`

- **Components**: PascalCase for component names
  - ✅ `UserProfile`, `LoginForm`
  - ❌ `user-profile`, `login-form`

### Creating New Files

**CRITICAL**: Always create the folder first, then create files:

```bash
# ✅ Good
mkdir -p src/modules/new-feature/containers
touch src/modules/new-feature/containers/new-container.tsx

# ❌ Bad - Will fail if folder doesn't exist
touch src/modules/new-feature/containers/new-container.tsx
```

### Routes Pattern

Routes should only import containers from modules:

```typescript
// ✅ Good
import { FeatureContainer } from '@/modules/feature-name';

export const Route = createFileRoute('/feature')({
  component: FeatureContainer,
});

// ❌ Bad - Don't implement logic in routes
export const Route = createFileRoute('/feature')({
  component: () => {
    const [data, setData] = useState(); // Logic should be in container
    return <div>{/* UI */}</div>;
  },
});
```

## 🧪 Testing

Run tests with Vitest:

```bash
pnpm test
```

## 📚 Storybook

Start Storybook for component development:

```bash
pnpm storybook
```

Access Storybook at `http://localhost:6006`

## 🔧 Configuration Files

- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration (if needed)
- `biome.json` - Biome linter/formatter configuration
- `components.json` - shadcn/ui configuration
- `.cursor/rules/` - Cursor AI rules for project conventions

## 📖 Learn More

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [i18next](https://www.i18next.com/)

## 📄 License

This template is private and intended for use as a starting point for new projects.

## 👤 Author

**mytoandeptrai**

---

**Happy Coding! 🚀**
