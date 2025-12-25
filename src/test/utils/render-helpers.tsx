/**
 * React Testing Library render utilities
 * Provides custom render function with necessary providers
 */
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';

/**
 * Custom render function that wraps components with necessary providers
 * For UI components in isolation, we use minimal wrapping
 * @param ui - React element to render
 * @param options - Render options
 * @returns Render result
 */
export const renderWithProviders = (ui: ReactElement, options?: RenderOptions) => {
	return render(ui, {
		...options,
	});
};

/**
 * Re-export everything from Testing Library
 * This allows tests to import all utilities from a single location
 */
export * from '@testing-library/react';
export { renderWithProviders as render };
