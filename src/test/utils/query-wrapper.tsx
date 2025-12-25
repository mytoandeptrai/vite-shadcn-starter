/**
 * Test wrapper for components using TanStack Query
 * Provides QueryClient setup for testing with proper configuration
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';

/**
 * Creates a new QueryClient for testing with disabled retries and caching
 */
export const createTestQueryClient = () => {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: false, // Disable retries in tests
				gcTime: 0, // Disable garbage collection
				staleTime: 0, // Data is immediately stale
			},
			mutations: {
				retry: false,
			},
		},
	});
};

/**
 * Wrapper component that provides QueryClient to children
 */
export const createQueryWrapper = (queryClient: QueryClient) => {
	return ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

/**
 * Render component with QueryClient wrapper
 * Creates a new QueryClient for each test to ensure isolation
 */
export const renderWithQuery = (ui: ReactElement, options?: RenderOptions) => {
	const queryClient = createTestQueryClient();
	const wrapper = createQueryWrapper(queryClient);

	return {
		...render(ui, { wrapper, ...options }),
		queryClient,
	};
};
