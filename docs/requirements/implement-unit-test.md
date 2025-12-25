# Frontend Unit Test Requirements (Basic Scope)

## 1. Goal
- Add **basic unit tests** for frontend
- Use **Vitest** with **React + Vite + TypeScript**
- Test coverage is **limited and intentional**
- Folder structure and conventions are **defined in `Claude.md`**
- This document only defines **WHAT to test**, not structure

---

## 2. Test Scope (STRICT)

### ✅ Included
Only write unit tests for:
1. `src/utils/`
2. `src/components/ui/`

### ❌ Excluded
Do NOT write tests for:
- Feature modules (`modules/*`)
- Containers
- Hooks (business logic)
- Contexts
- API layer
- Stores (Zustand)
- Routes
- Integrations

If a file is outside `utils` or `components/ui`, **skip it**.

---

## 3. Utils Testing Rules

### What to test
- Pure functions only
- Deterministic logic

Each function must have tests for:
- Valid input (happy path)
- Edge cases
- Invalid input (if applicable)

Example:
- Empty string
- `null` / `undefined` (if allowed)
- Boundary values

### What NOT to test
- Side effects
- External dependencies
- Time-based or random behavior (unless mocked)

---

## 4. UI Components Testing Rules (`components/ui`)

### Component definition
- Presentational only
- No business logic
- Controlled by props

### What to test
- Component renders correctly with required props
- Conditional rendering based on props
- User interaction (click, input, etc.)
- Disabled / loading states (if any)
- Basic accessibility:
  - `role`
  - `aria-label` (if present)

### What NOT to test
- Styling details (CSS, Tailwind classes)
- Layout pixel correctness
- Parent container logic
- API calls
- Global state

---

## 5. Testing Principles

- Use **@testing-library/react**
- Test **behavior**, not implementation
- Prefer `getByRole`, `getByText`, `getByLabelText`
- Avoid snapshot tests unless explicitly necessary

---

## 6. Mocking Rules

- Minimal mocking only
- Mock only when required to isolate the unit
- Prefer:
  - `vi.fn`
  - `vi.spyOn`
  - `vi.mock` (module-level only)

Do NOT:
- Mock React internals
- Mock simple props-driven logic

---

## 7. Naming Convention

```ts
describe('Button', () => {
  it('should render label correctly', () => {})
  it('should call onClick when clicked', () => {})
})
