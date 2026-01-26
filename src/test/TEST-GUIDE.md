# Testing Guide

A comprehensive guide for writing unit tests in this project.

## Table of Contents

- [Overview](#overview)
- [Testing Utility Functions](#testing-utility-functions)
- [Testing UI Components](#testing-ui-components)
- [Testing Components with API Requests](#testing-components-with-api-requests)
- [Testing Patterns](#testing-patterns)
- [What NOT to Test](#what-not-to-test)
- [Available Test Utilities](#available-test-utilities)

---

## Overview

### Test Scope

**✅ DO Test:**
- `src/utils/` - Pure utility functions only
- `src/components/ui/` - Presentational UI components only
- `src/modules/*/containers/` - Containers that use API requests (with mocked hooks)

**❌ DO NOT Test:**
- Raw API layer (`src/apis/*/requests.ts`)
- Stores (`src/stores/`)
- Routes (`src/routes/`)
- Functions with side effects (localStorage, DOM manipulation, timers)

### Running Tests

```bash
# Run all tests once
pnpm test

# Watch mode (auto-rerun on changes)
pnpm test:watch

# Browser UI visualization
pnpm test:ui

# Generate coverage report
pnpm test:coverage
```

---

## Testing Utility Functions

### When to Test Utils

Test utility functions that are:
- ✅ **Pure functions** (same input = same output)
- ✅ **Deterministic** (no randomness, no time dependency)
- ✅ **Stateless** (no external state modification)

### What to Test

For each utility function, write tests for:

#### 1. **Valid Input (Happy Path)**
Test the function works correctly with expected inputs.

```typescript
describe('formatCurrency', () => {
  it('should format USD with 2 decimal places', () => {
    // Arrange
    const amount = 1234.56;
    const currency = mockUSDCurrency;

    // Act
    const result = formatCurrency(amount, currency);

    // Assert
    expect(result).toBe('$1,234.56');
  });
});
```

#### 2. **Edge Cases**
Test boundary conditions and special values.

```typescript
it('should handle zero value', () => {
  expect(formatCurrency(0, mockUSDCurrency)).toBe('$0.00');
});

it('should handle negative values', () => {
  expect(formatCurrency(-100, mockUSDCurrency)).toBe('-$100.00');
});

it('should return empty string for empty input', () => {
  expect(shortenString(undefined)).toBe('');
});
```

Common edge cases to test:
- `null` / `undefined` inputs
- Empty strings / arrays / objects
- Zero values
- Negative values
- Maximum / minimum boundary values

#### 3. **Invalid Input**
Test how the function handles incorrect input types.

```typescript
it('should return "0" for NaN input', () => {
  expect(formatCurrency('invalid', mockUSDCurrency)).toBe('0');
});

it('should return true for invalid file type (edge case)', () => {
  expect(validateFileFormat('string' as any)).toBe(true);
});
```

#### 4. **Type Coercion**
Test functions that accept multiple input types.

```typescript
it('should handle string number input', () => {
  expect(formatCurrency('1000', mockUSDCurrency)).toBe('$1,000.00');
});
```

### Utils Test Template

```typescript
/**
 * Tests for [function name]
 * Description of what the function does
 */
import { functionName } from './module';

describe('functionName', () => {
  it('should [expected behavior] when [condition]', () => {
    // Arrange - Set up test data
    const input = 'test input';
    const expected = 'expected output';

    // Act - Execute the function
    const result = functionName(input);

    // Assert - Verify the result
    expect(result).toBe(expected);
  });

  it('should handle empty input', () => {
    expect(functionName('')).toBe('');
  });

  it('should handle null/undefined', () => {
    expect(functionName(null)).toBe(null);
    expect(functionName(undefined)).toBe(undefined);
  });
});
```

### Mocking Dependencies

#### When to Mock
Mock external dependencies like:
- **Date/Time libraries** (dayjs) - for time-dependent functions
- **UUID generators** - for predictable IDs
- **i18n functions** - for translation-dependent functions

#### How to Mock

**Mock dayjs:**
```typescript
vi.mock('dayjs', async () => {
  const actual = await vi.importActual('dayjs');
  return {
    default: vi.fn((date) => {
      if (date) return actual.default(date);
      return actual.default('2024-01-01T12:00:00'); // Fixed "now"
    }),
  };
});
```

**Mock uuid:**
```typescript
vi.mock('uuid', () => ({
  v4: vi.fn(() => 'mock-uuid-1234'),
}));
```

**Mock i18n:**
```typescript
import { createMockTFunction, mockTimeUnitsTranslations } from '@/test/utils/mock-i18n';

const t = createMockTFunction(mockTimeUnitsTranslations);
const result = formatTimeFromSeconds(90, t);
```

**Mock File objects:**
```typescript
import { createMockFile, createOversizedFile } from '@/test/utils/mock-file';

const file = createMockFile('test.png', 1024, 'image/png');
expect(validateFileFormat(file)).toBe(true);
```

---

## Testing UI Components

### When to Test UI Components

Test components that are:
- ✅ **Presentational** (no business logic)
- ✅ **Controlled by props** (no complex state management)
- ✅ **Reusable** (used across the application)

### What to Test

For each UI component, write tests for:

#### 1. **Rendering**
Test the component renders correctly with required props.

```typescript
describe('Button', () => {
  it('should render button with text content', () => {
    // Arrange & Act
    render(<Button>Click me</Button>);

    // Assert
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });
});
```

#### 2. **Variants/Props**
Test all variant combinations and prop configurations.

```typescript
it('should render default variant', () => {
  render(<Button>Default</Button>);
  const button = screen.getByRole('button');

  expect(button).toHaveClass('bg-primary');
});

it('should render destructive variant', () => {
  render(<Button variant="destructive">Delete</Button>);
  const button = screen.getByRole('button');

  expect(button).toHaveClass('bg-destructive');
});
```

#### 3. **User Interactions**
Test click handlers, input changes, and other user events.

```typescript
it('should call onClick when clicked', async () => {
  // Arrange
  const user = userEvent.setup();
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click</Button>);

  // Act
  await user.click(screen.getByRole('button'));

  // Assert
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

**Always use `userEvent.setup()`** - more realistic than `fireEvent`.

#### 4. **Conditional Rendering**
Test visibility changes based on props or state.

```typescript
it('should not call onClick when disabled', async () => {
  const user = userEvent.setup();
  const handleClick = vi.fn();
  render(<Button onClick={handleClick} disabled>Click</Button>);

  await user.click(screen.getByRole('button'));

  expect(handleClick).not.toHaveBeenCalled();
});
```

#### 5. **States**
Test disabled, loading, error, and other state variations.

```typescript
it('should render disabled state', () => {
  render(<Button disabled>Disabled</Button>);

  expect(screen.getByRole('button')).toBeDisabled();
});
```

#### 6. **Basic Accessibility**
Test ARIA attributes and keyboard navigation.

```typescript
it('should be focusable when enabled', () => {
  render(<Button>Focus me</Button>);
  const button = screen.getByRole('button');

  button.focus();

  expect(button).toHaveFocus();
});

it('should have correct aria attributes', () => {
  render(<Button aria-label="Submit form">Submit</Button>);

  expect(screen.getByLabelText('Submit form')).toBeInTheDocument();
});
```

### UI Component Test Template

```typescript
/**
 * Tests for [Component Name]
 * Testing: rendering, variants, interactions, accessibility
 */
import { render, screen } from '@/test/utils/render-helpers';
import userEvent from '@testing-library/user-event';
import { ComponentName } from './component-name';

describe('ComponentName', () => {
  describe('Basic Rendering', () => {
    it('should render with text content', () => {
      render(<ComponentName>Content</ComponentName>);

      expect(screen.getByText('Content')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should render default variant', () => {
      render(<ComponentName>Default</ComponentName>);

      expect(screen.getByText('Default')).toHaveClass('default-class');
    });
  });

  describe('Interactions', () => {
    it('should call onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<ComponentName onClick={handleClick}>Click</ComponentName>);

      await user.click(screen.getByText('Click'));

      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard accessible', () => {
      render(<ComponentName>Accessible</ComponentName>);
      const element = screen.getByText('Accessible');

      element.focus();

      expect(element).toHaveFocus();
    });
  });
});
```

### Query Priority

Use queries in this order (most preferred first):

1. **`getByRole`** - Most accessible, semantic
   ```typescript
   screen.getByRole('button', { name: 'Submit' })
   screen.getByRole('checkbox')
   screen.getByRole('heading', { level: 1 })
   ```

2. **`getByLabelText`** - For form inputs
   ```typescript
   screen.getByLabelText('Email address')
   ```

3. **`getByPlaceholderText`** - For inputs without labels
   ```typescript
   screen.getByPlaceholderText('Enter your name')
   ```

4. **`getByText`** - For non-interactive content
   ```typescript
   screen.getByText('Welcome message')
   ```

**Avoid:** `getByTestId` - Use semantic queries instead.

---

## Testing Components with API Requests

### When to Test API Components

Test containers and components that:
- ✅ **Use TanStack Query hooks** (useQuery, useMutation)
- ✅ **Fetch data from APIs** and display it
- ✅ **Submit forms** that trigger API mutations
- ✅ **Handle loading and error states**

### What to Test

For each API component, write tests for:

#### 1. **Loading State**
Test the component displays loading indicators while data is being fetched.

```typescript
describe('Loading State', () => {
  it('should display loading state when fetching data', () => {
    // Arrange - Mock loading state
    vi.mocked(marketplace.useGetMerchantsList).mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
      refetch: vi.fn(),
    } as unknown as UseQueryResult<GetMerchantsResponse>);

    const queryClient = createTestQueryClient();
    const wrapper = createQueryWrapper(queryClient);

    // Act
    render(<MerchantContainer />, { wrapper });

    // Assert
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
```

#### 2. **Success State with Data**
Test the component renders correctly with successful API response.

```typescript
it('should render data when loaded successfully', () => {
  // Arrange - Mock successful response
  vi.mocked(marketplace.useGetMerchantsList).mockReturnValue({
    data: mockMerchantsResponse,
    isLoading: false,
    isFetching: false,
    refetch: vi.fn(),
  } as unknown as UseQueryResult<GetMerchantsResponse>);

  const queryClient = createTestQueryClient();
  const wrapper = createQueryWrapper(queryClient);

  // Act
  render(<MerchantContainer />, { wrapper });

  // Assert
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText('Jane Smith')).toBeInTheDocument();
});
```

#### 3. **Empty State**
Test the component handles empty data gracefully.

```typescript
it('should render empty state when no data exists', () => {
  // Arrange
  vi.mocked(marketplace.useGetMerchantsList).mockReturnValue({
    data: { data: [], pagination: {...} },
    isLoading: false,
    isFetching: false,
    refetch: vi.fn(),
  } as unknown as UseQueryResult<GetMerchantsResponse>);

  // Act & Assert
  render(<MerchantContainer />, { wrapper });
  expect(screen.getByText('No data available')).toBeInTheDocument();
});
```

#### 4. **Mutation Actions**
Test create, update, and delete actions.

```typescript
describe('Mutations', () => {
  it('should handle create action', async () => {
    // Arrange
    const user = userEvent.setup();
    const mockMutation = {
      mutate: vi.fn(),
      mutateAsync: vi.fn().mockResolvedValue({}),
      isPending: false,
    } as unknown as UseMutationResult;

    vi.mocked(marketplace.useCreateMerchant).mockReturnValue(mockMutation);

    // Act
    render(<MerchantForm />, { wrapper });
    await user.click(screen.getByRole('button', { name: 'Create' }));

    // Assert
    await waitFor(() => {
      expect(mockMutation.mutateAsync).toHaveBeenCalledWith({...});
    });
  });
});
```

#### 5. **Refetch on Success**
Test that data is refetched after successful mutations.

```typescript
it('should refetch data after successful mutation', async () => {
  // Arrange
  const mockRefetch = vi.fn();
  vi.mocked(marketplace.useGetMerchantsList).mockReturnValue({
    data: mockData,
    isLoading: false,
    refetch: mockRefetch,
  } as unknown as UseQueryResult);

  // Act - Perform mutation and trigger success callback
  render(<MerchantContainer />, { wrapper });
  await user.click(screen.getByRole('button', { name: 'Submit' }));

  // Assert
  await waitFor(() => {
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });
});
```

### Mocking TanStack Query Hooks

#### Setup Mock Strategy

**1. Import the module to mock:**
```typescript
import * as marketplace from '@/apis/marketplace';

vi.mock('@/apis/marketplace', async () => {
  const actual = await vi.importActual('@/apis/marketplace');
  return {
    ...actual,
    useGetMerchantsList: vi.fn(),
    useCreateMerchant: vi.fn(),
    useUpdateMerchant: vi.fn(),
    useDeleteMerchant: vi.fn(),
  };
});
```

**2. Setup default mocks in beforeEach:**
```typescript
beforeEach(() => {
  vi.clearAllMocks();

  // Default mutation mock
  const mockMutation = {
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isPending: false,
    isError: false,
    isSuccess: false,
  } as unknown as UseMutationResult;

  vi.mocked(marketplace.useCreateMerchant).mockReturnValue(mockMutation);
});
```

**3. Override mocks per test:**
```typescript
it('should handle loading state', () => {
  vi.mocked(marketplace.useGetMerchantsList).mockReturnValue({
    data: undefined,
    isLoading: true,
    isFetching: true,
    refetch: vi.fn(),
  } as unknown as UseQueryResult);

  // Test implementation...
});
```

### QueryClient Wrapper

Always wrap components that use TanStack Query with QueryClientProvider:

```typescript
import { createTestQueryClient, createQueryWrapper } from '@/test/utils/query-wrapper';

it('should render with query client', () => {
  // Create isolated QueryClient for this test
  const queryClient = createTestQueryClient();
  const wrapper = createQueryWrapper(queryClient);

  // Render with wrapper
  render(<Component />, { wrapper });
});
```

### Mocking Child Components

For complex containers, mock child components to isolate testing:

```typescript
vi.mock('../merchant-table-container', () => ({
  default: ({ tableData, onAction }: any) => (
    <div data-testid="merchant-table">
      {tableData.data.map((merchant: any) => (
        <div key={merchant.id}>
          {merchant.name}
          <button onClick={() => onAction(merchant, 'edit')}>Edit</button>
        </div>
      ))}
    </div>
  ),
}));
```

This allows you to:
- Focus on the container's logic
- Verify correct props are passed to children
- Simulate child component interactions

### API Component Test Template

```typescript
/**
 * Tests for ContainerName
 * Testing: queries, mutations, loading states, user interactions
 */
import { render, screen, waitFor } from '@/test/utils/render-helpers';
import { createTestQueryClient, createQueryWrapper } from '@/test/utils/query-wrapper';
import { mockApiResponse } from '@/test/fixtures/api-data';
import userEvent from '@testing-library/user-event';
import * as apiModule from '@/apis/module';
import { vi } from 'vitest';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import ContainerName from './container-name';

// Mock API hooks
vi.mock('@/apis/module', async () => {
  const actual = await vi.importActual('@/apis/module');
  return {
    ...actual,
    useGetData: vi.fn(),
    useCreateData: vi.fn(),
  };
});

// Mock other dependencies (router, i18n, child components)
vi.mock('@/routes/...', () => ({...}));
vi.mock('@/integrations/i18n', () => ({...}));

describe('ContainerName', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mutation mocks
    const mockMutation = {
      mutate: vi.fn(),
      mutateAsync: vi.fn(),
      isPending: false,
    } as unknown as UseMutationResult;

    vi.mocked(apiModule.useCreateData).mockReturnValue(mockMutation);
  });

  describe('Loading State', () => {
    it('should display loading indicator', () => {
      vi.mocked(apiModule.useGetData).mockReturnValue({
        data: undefined,
        isLoading: true,
        refetch: vi.fn(),
      } as unknown as UseQueryResult);

      const queryClient = createTestQueryClient();
      const wrapper = createQueryWrapper(queryClient);

      render(<ContainerName />, { wrapper });

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Success State', () => {
    it('should render data correctly', () => {
      vi.mocked(apiModule.useGetData).mockReturnValue({
        data: mockApiResponse,
        isLoading: false,
        refetch: vi.fn(),
      } as unknown as UseQueryResult);

      const queryClient = createTestQueryClient();
      const wrapper = createQueryWrapper(queryClient);

      render(<ContainerName />, { wrapper });

      expect(screen.getByText('Expected Content')).toBeInTheDocument();
    });
  });

  describe('Mutations', () => {
    it('should handle create action', async () => {
      const user = userEvent.setup();
      const mockMutateAsync = vi.fn().mockResolvedValue({});

      vi.mocked(apiModule.useCreateData).mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: false,
      } as unknown as UseMutationResult);

      const queryClient = createTestQueryClient();
      const wrapper = createQueryWrapper(queryClient);

      render(<ContainerName />, { wrapper });

      await user.click(screen.getByRole('button', { name: 'Create' }));

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledWith({...});
      });
    });
  });
});
```

### Common Patterns

#### Pattern 1: Test Query States
```typescript
// Loading
vi.mocked(useQuery).mockReturnValue({ isLoading: true, data: undefined });

// Success
vi.mocked(useQuery).mockReturnValue({ isLoading: false, data: mockData });

// Refetching (has data but fetching)
vi.mocked(useQuery).mockReturnValue({ isLoading: false, isFetching: true, data: mockData });
```

#### Pattern 2: Test Mutation States
```typescript
// Idle
vi.mocked(useMutation).mockReturnValue({ isPending: false });

// Pending
vi.mocked(useMutation).mockReturnValue({ isPending: true });

// Success
vi.mocked(useMutation).mockReturnValue({ isSuccess: true, data: result });

// Error
vi.mocked(useMutation).mockReturnValue({ isError: true, error: new Error('...') });
```

#### Pattern 3: Mock Router Hooks
```typescript
vi.mock('@/routes/(private)/merchants', () => ({
  Route: {
    useSearch: vi.fn(() => ({
      page: 1,
      pageSize: 10,
      sortBy: 'createdAt',
    })),
    useNavigate: vi.fn(() => vi.fn()),
  },
}));
```

#### Pattern 4: Mock i18n
```typescript
vi.mock('@/integrations/i18n', () => ({
  useTranslation: vi.fn(() => ({
    t: (key: string) => {
      const translations = {
        'title': 'Page Title',
        'actions.create': 'Create New',
      };
      return translations[key] || key;
    },
  })),
}));
```

### Important Notes

- **Isolation:** Each test should have its own QueryClient instance (created by `createTestQueryClient()`)
- **Mock Cleanup:** Always call `vi.clearAllMocks()` in `beforeEach` to reset mocks
- **Type Safety:** Use `as unknown as UseQueryResult` to satisfy TypeScript when mocking hooks
- **Async Actions:** Use `waitFor()` when testing async operations like mutations
- **User Events:** Always use `userEvent.setup()` before simulating user interactions

---

## Testing Patterns

### AAA Pattern (Arrange-Act-Assert)

Structure every test following AAA:

```typescript
it('should format currency correctly', () => {
  // Arrange - Set up test data
  const amount = 1234.56;
  const currency = mockUSDCurrency;

  // Act - Execute the function/interaction
  const result = formatCurrency(amount, currency);

  // Assert - Verify the outcome
  expect(result).toBe('$1,234.56');
});
```

### Test Naming Convention

Use descriptive names following this format:

```typescript
it('should [expected behavior] when [condition]', () => {});
```

**Good examples:**
- ✅ `should return true when password meets all requirements`
- ✅ `should format currency with 2 decimal places`
- ✅ `should toggle password visibility when eye icon is clicked`
- ✅ `should not call onClick when button is disabled`

**Bad examples:**
- ❌ `works`
- ❌ `password validation`
- ❌ `test formatCurrency function`

### Grouping Tests

Use `describe` blocks to organize related tests:

```typescript
describe('ComponentName or functionName', () => {
  describe('Feature Group 1', () => {
    it('should do something', () => {});
  });

  describe('Feature Group 2', () => {
    it('should do something else', () => {});
  });
});
```

---

## What NOT to Test

### Don't Test These:

❌ **Implementation Details**
```typescript
// Bad - testing internal state
expect(component.state.count).toBe(5);

// Good - testing behavior
expect(screen.getByText('Count: 5')).toBeInTheDocument();
```

❌ **CSS/Styling Details**
```typescript
// Bad - testing exact pixel values
expect(element).toHaveStyle('padding: 16px');

// Good - testing that classes are applied
expect(element).toHaveClass('p-4');
```

❌ **Third-Party Library Internals**
```typescript
// Bad - testing Radix UI behavior
expect(radixPrimitive.someInternalMethod()).toBe(true);

// Good - testing integration points
expect(screen.getByRole('checkbox')).toBeChecked();
```

❌ **Functions with Side Effects**
- Toast notifications
- localStorage operations
- DOM manipulation (downloadFile, createElement)
- setTimeout/setInterval
- API calls

❌ **Business Logic in Containers/Hooks**
- Test these at integration level, not unit level

---

## Available Test Utilities

### Location: `src/test/`

#### 1. Mock Helpers

**`mock-i18n.ts`** - i18n mocking
```typescript
import { createMockTFunction, mockTimeUnitsTranslations } from '@/test/utils/mock-i18n';

const t = createMockTFunction(mockTimeUnitsTranslations);
```

**`mock-file.ts`** - File object creation
```typescript
import { createMockFile, createOversizedFile, createInvalidFormatFile } from '@/test/utils/mock-file';

const file = createMockFile('test.png', 1024, 'image/png');
```

**`render-helpers.tsx`** - React Testing Library wrapper
```typescript
import { render, screen } from '@/test/utils/render-helpers';

render(<Component />);
```

**`query-wrapper.tsx`** - TanStack Query wrapper for API components
```typescript
import { createTestQueryClient, createQueryWrapper } from '@/test/utils/query-wrapper';

const queryClient = createTestQueryClient();
const wrapper = createQueryWrapper(queryClient);

render(<Component />, { wrapper });
```

#### 2. Test Fixtures

**`currency.ts`** - Currency test data
```typescript
import { mockUSDCurrency, mockVNDCurrency } from '@/test/fixtures/currency';
```

**`merchant.ts`** - Merchant API response data
```typescript
import { mockMerchant, mockMerchantList, mockMerchantsListResponse } from '@/test/fixtures/merchant';
```

---

## Quick Reference

### Common Test Assertions

```typescript
// Existence
expect(element).toBeInTheDocument()
expect(element).not.toBeInTheDocument()

// Text content
expect(element).toHaveTextContent('text')

// Attributes
expect(element).toHaveAttribute('href', '/path')
expect(element).toHaveClass('className')

// State
expect(element).toBeDisabled()
expect(element).toBeChecked()
expect(element).toHaveFocus()

// Values
expect(result).toBe('exact match')
expect(result).toEqual({ object: 'match' })
expect(array).toContain('item')
expect(array).toHaveLength(5)

// Functions
expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledTimes(2)
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
expect(mockFn).not.toHaveBeenCalled()
```

### User Interactions

```typescript
const user = userEvent.setup();

await user.click(element)
await user.type(input, 'text')
await user.clear(input)
await user.tab()
await user.hover(element)
```

---

## Examples

### Example 1: Testing a Formatting Function

```typescript
// src/utils/format.test.ts
import { formatNumber } from './format';

describe('formatNumber', () => {
  it('should format number with thousands separator', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('should handle zero', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('should handle negative numbers', () => {
    expect(formatNumber(-1234)).toBe('-1,234');
  });

  it('should handle decimal numbers', () => {
    expect(formatNumber(1234.56)).toBe('1,234.56');
  });
});
```

### Example 2: Testing a Button Component

```typescript
// src/components/ui/button.test.tsx
import { render, screen } from '@/test/utils/render-helpers';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('should call onClick handler', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Click</Button>);

    await user.click(screen.getByRole('button'));

    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

---

## Need Help?

- 📚 [Vitest Documentation](https://vitest.dev/)
- 🧪 [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- 🎯 [Common Testing Library Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Remember:** Write tests that give you confidence in your code, not just to reach coverage targets. Focus on behavior, not implementation!
