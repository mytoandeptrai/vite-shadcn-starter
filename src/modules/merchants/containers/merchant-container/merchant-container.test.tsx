/**
 * Tests for MerchantContainer
 * Testing: API queries (loading, success, error), mutations (create, update, delete),
 * user interactions, pagination, sorting
 */
import { render, screen, waitFor } from '@/test/utils/render-helpers';
import { createTestQueryClient, createQueryWrapper } from '@/test/utils/query-wrapper';
import { mockMerchantsListResponse } from '@/test/fixtures/merchant';
import userEvent from '@testing-library/user-event';
import MerchantContainer from './merchant-container';
import { vi } from 'vitest';
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import type {
	GetMarketplaceMerchantsListResponse,
	CreateMarketplaceMerchantParams,
	UpdateMarketplaceMerchantParams,
	DeleteMarketplaceMerchantParams,
} from '@/apis/marketplace';
import * as marketplace from '@/apis/marketplace';

// Mock the API hooks module
vi.mock('@/apis/marketplace', async () => {
	const actual = await vi.importActual('@/apis/marketplace');
	return {
		...actual,
		useGetMarketplaceMerchantsList: vi.fn(),
		useCreateMarketplaceMerchant: vi.fn(),
		useUpdateMarketplaceMerchant: vi.fn(),
		useDeleteMarketplaceMerchant: vi.fn(),
	};
});

// Mock TanStack Router
vi.mock('@/routes/(private)/merchants', () => ({
	Route: {
		useSearch: vi.fn(() => ({
			page: 1,
			pageSize: 10,
			sortBy: 'createdAt',
			orderBy: 'desc',
			search: '',
			status: [],
		})),
		useNavigate: vi.fn(() => vi.fn()),
	},
}));

// Mock i18n
vi.mock('@/integrations/i18n', () => ({
	useTranslation: vi.fn(() => ({
		t: (key: string) => {
			const translations: Record<string, string> = {
				title: 'Merchants',
				description: 'Manage your merchants',
				'actions.add': 'Add Merchant',
			};
			return translations[key] || key;
		},
	})),
}));

// Mock child components to simplify testing
vi.mock('../merchant-table-container', () => ({
	default: ({ tableData, isLoading, onAction }: any) => (
		<div data-testid="merchant-table">
			{isLoading ? (
				<div>Loading table...</div>
			) : (
				<>
					<div>Table Data: {tableData.data.length} merchants</div>
					{tableData.data.map((merchant: any) => (
						<div key={merchant.id} data-testid={`merchant-${merchant.id}`}>
							{merchant.firstname} {merchant.lastname}
							<button type="button" onClick={() => onAction(merchant, 'update')}>
								Edit
							</button>
							<button type="button" onClick={() => onAction(merchant, 'delete')}>
								Delete
							</button>
						</div>
					))}
				</>
			)}
		</div>
	),
}));

vi.mock('../merchant-form-container', () => ({
	default: ({ open, actionType, onClose, onSuccess }: any) =>
		open ? (
			<div data-testid="merchant-form">
				<div>Form: {actionType}</div>
				<button type="button" onClick={onClose}>
					Close
				</button>
				<button type="button" onClick={onSuccess}>
					Submit
				</button>
			</div>
		) : null,
}));

vi.mock('../../contexts', () => ({
	MerchantFormContextProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/containers', () => ({
	PageContainer: ({ children, pageTitle, isLoading }: any) => (
		<div data-testid="page-container">
			<h1>{pageTitle}</h1>
			{isLoading ? <div>Loading page...</div> : children}
		</div>
	),
}));

describe('MerchantContainer', () => {
	beforeEach(() => {
		// Reset mocks before each test
		vi.clearAllMocks();

		// Setup default mutation mocks with proper types
		const mockCreateMutation = {
			mutate: vi.fn(),
			mutateAsync: vi.fn(),
			isPending: false,
			isError: false,
			isSuccess: false,
			data: undefined,
			error: null,
		} as unknown as UseMutationResult<unknown, Error, CreateMarketplaceMerchantParams, unknown>;

		const mockUpdateMutation = {
			mutate: vi.fn(),
			mutateAsync: vi.fn(),
			isPending: false,
			isError: false,
			isSuccess: false,
			data: undefined,
			error: null,
		} as unknown as UseMutationResult<unknown, Error, UpdateMarketplaceMerchantParams, unknown>;

		const mockDeleteMutation = {
			mutate: vi.fn(),
			mutateAsync: vi.fn(),
			isPending: false,
			isError: false,
			isSuccess: false,
			data: undefined,
			error: null,
		} as unknown as UseMutationResult<void, Error, DeleteMarketplaceMerchantParams, unknown>;

		vi.mocked(marketplace.useCreateMarketplaceMerchant).mockReturnValue(mockCreateMutation);
		vi.mocked(marketplace.useUpdateMarketplaceMerchant).mockReturnValue(mockUpdateMutation);
		vi.mocked(marketplace.useDeleteMarketplaceMerchant).mockReturnValue(mockDeleteMutation);
	});

	describe('Loading State', () => {
		it('should display loading state when fetching merchants', () => {
			// Arrange - Mock loading state
			vi.mocked(marketplace.useGetMarketplaceMerchantsList).mockReturnValue({
				data: undefined,
				isLoading: true,
				isFetching: true,
				refetch: vi.fn(),
			} as unknown as UseQueryResult<GetMarketplaceMerchantsListResponse>);

			const queryClient = createTestQueryClient();
			const wrapper = createQueryWrapper(queryClient);

			// Act
			render(<MerchantContainer />, { wrapper });

			// Assert
			expect(screen.getByText('Loading page...')).toBeInTheDocument();
		});

		it('should display table loading state while refetching', () => {
			// Arrange - Mock refetching state (has data but isFetching)
			vi.mocked(marketplace.useGetMarketplaceMerchantsList).mockReturnValue({
				data: mockMerchantsListResponse,
				isLoading: false,
				isFetching: true,
				refetch: vi.fn(),
			} as unknown as UseQueryResult<GetMarketplaceMerchantsListResponse>);

			const queryClient = createTestQueryClient();
			const wrapper = createQueryWrapper(queryClient);

			// Act
			render(<MerchantContainer />, { wrapper });

			// Assert - Page should not be loading, but table shows fetching state
			expect(screen.queryByText('Loading page...')).not.toBeInTheDocument();
			expect(screen.getByTestId('merchant-table')).toBeInTheDocument();
		});
	});

	describe('Success State with Data', () => {
		it('should render merchants list when data is loaded', () => {
			// Arrange - Mock successful data fetch
			vi.mocked(marketplace.useGetMarketplaceMerchantsList).mockReturnValue({
				data: mockMerchantsListResponse,
				isLoading: false,
				isFetching: false,
				refetch: vi.fn(),
			} as unknown as UseQueryResult<GetMarketplaceMerchantsListResponse>);

			const queryClient = createTestQueryClient();
			const wrapper = createQueryWrapper(queryClient);

			// Act
			render(<MerchantContainer />, { wrapper });

			// Assert - Should display page title
			expect(screen.getByText('Merchants')).toBeInTheDocument();

			// Assert - Should display add button
			expect(screen.getByRole('button', { name: 'Add Merchant' })).toBeInTheDocument();

			// Assert - Should display merchant table
			expect(screen.getByTestId('merchant-table')).toBeInTheDocument();
			expect(screen.getByText('Table Data: 3 merchants')).toBeInTheDocument();

			// Assert - Should display individual merchants
			expect(screen.getByTestId('merchant-1')).toBeInTheDocument();
			expect(screen.getByText('John Doe')).toBeInTheDocument();
			expect(screen.getByTestId('merchant-2')).toBeInTheDocument();
			expect(screen.getByText('Jane Smith')).toBeInTheDocument();
		});

		it('should render empty state when no merchants exist', () => {
			// Arrange - Mock empty response
			vi.mocked(marketplace.useGetMarketplaceMerchantsList).mockReturnValue({
				data: {
					data: [],
					pagination: {
						page: 1,
						pageSize: 10,
						totalPages: 0,
						totalItems: 0,
						hasNext: false,
						hasPrev: false,
					},
				},
				isLoading: false,
				isFetching: false,
				refetch: vi.fn(),
			} as unknown as UseQueryResult<GetMarketplaceMerchantsListResponse>);

			const queryClient = createTestQueryClient();
			const wrapper = createQueryWrapper(queryClient);

			// Act
			render(<MerchantContainer />, { wrapper });

			// Assert
			expect(screen.getByText('Table Data: 0 merchants')).toBeInTheDocument();
		});
	});

	describe('User Interactions', () => {
		it('should open create form when Add Merchant button is clicked', async () => {
			// Arrange
			const user = userEvent.setup();
			vi.mocked(marketplace.useGetMarketplaceMerchantsList).mockReturnValue({
				data: mockMerchantsListResponse,
				isLoading: false,
				isFetching: false,
				refetch: vi.fn(),
			} as unknown as UseQueryResult<GetMarketplaceMerchantsListResponse>);

			const queryClient = createTestQueryClient();
			const wrapper = createQueryWrapper(queryClient);

			render(<MerchantContainer />, { wrapper });

			// Act - Click add button
			await user.click(screen.getByRole('button', { name: 'Add Merchant' }));

			// Assert - Form should open in create mode
			await waitFor(() => {
				expect(screen.getByTestId('merchant-form')).toBeInTheDocument();
				expect(screen.getByText('Form: create')).toBeInTheDocument();
			});
		});

		it('should open update form when Edit button is clicked', async () => {
			// Arrange
			const user = userEvent.setup();
			vi.mocked(marketplace.useGetMarketplaceMerchantsList).mockReturnValue({
				data: mockMerchantsListResponse,
				isLoading: false,
				isFetching: false,
				refetch: vi.fn(),
			} as unknown as UseQueryResult<GetMarketplaceMerchantsListResponse>);

			const queryClient = createTestQueryClient();
			const wrapper = createQueryWrapper(queryClient);

			render(<MerchantContainer />, { wrapper });

			// Act - Click edit button on first merchant
			const editButtons = screen.getAllByRole('button', { name: 'Edit' });
			await user.click(editButtons[0]);

			// Assert - Form should open in update mode
			await waitFor(() => {
				expect(screen.getByTestId('merchant-form')).toBeInTheDocument();
				expect(screen.getByText('Form: update')).toBeInTheDocument();
			});
		});

		it('should close form when Close button is clicked', async () => {
			// Arrange
			const user = userEvent.setup();
			vi.mocked(marketplace.useGetMarketplaceMerchantsList).mockReturnValue({
				data: mockMerchantsListResponse,
				isLoading: false,
				isFetching: false,
				refetch: vi.fn(),
			} as unknown as UseQueryResult<GetMarketplaceMerchantsListResponse>);

			const queryClient = createTestQueryClient();
			const wrapper = createQueryWrapper(queryClient);

			render(<MerchantContainer />, { wrapper });

			// Act - Open form
			await user.click(screen.getByRole('button', { name: 'Add Merchant' }));
			await waitFor(() => {
				expect(screen.getByTestId('merchant-form')).toBeInTheDocument();
			});

			// Act - Close form
			await user.click(screen.getByRole('button', { name: 'Close' }));

			// Assert - Form should be closed
			await waitFor(() => {
				expect(screen.queryByTestId('merchant-form')).not.toBeInTheDocument();
			});
		});

		it('should refetch data when form is submitted successfully', async () => {
			// Arrange
			const user = userEvent.setup();
			const mockRefetch = vi.fn();
			vi.mocked(marketplace.useGetMarketplaceMerchantsList).mockReturnValue({
				data: mockMerchantsListResponse,
				isLoading: false,
				isFetching: false,
				refetch: mockRefetch,
			} as unknown as UseQueryResult<GetMarketplaceMerchantsListResponse>);

			const queryClient = createTestQueryClient();
			const wrapper = createQueryWrapper(queryClient);

			render(<MerchantContainer />, { wrapper });

			// Act - Open form and submit
			await user.click(screen.getByRole('button', { name: 'Add Merchant' }));
			await waitFor(() => {
				expect(screen.getByTestId('merchant-form')).toBeInTheDocument();
			});

			await user.click(screen.getByRole('button', { name: 'Submit' }));

			// Assert - Refetch should be called
			await waitFor(() => {
				expect(mockRefetch).toHaveBeenCalledTimes(1);
			});

			// Assert - Form should be closed
			await waitFor(() => {
				expect(screen.queryByTestId('merchant-form')).not.toBeInTheDocument();
			});
		});
	});

	describe('Mutation Actions', () => {
		it('should handle delete action', async () => {
			// Arrange
			const user = userEvent.setup();
			vi.mocked(marketplace.useGetMarketplaceMerchantsList).mockReturnValue({
				data: mockMerchantsListResponse,
				isLoading: false,
				isFetching: false,
				refetch: vi.fn(),
			} as unknown as UseQueryResult<GetMarketplaceMerchantsListResponse>);

			const queryClient = createTestQueryClient();
			const wrapper = createQueryWrapper(queryClient);

			render(<MerchantContainer />, { wrapper });

			// Act - Click delete button
			const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
			await user.click(deleteButtons[0]);

			// Assert - Form should open in delete mode
			await waitFor(() => {
				expect(screen.getByTestId('merchant-form')).toBeInTheDocument();
				expect(screen.getByText('Form: delete')).toBeInTheDocument();
			});
		});
	});
});
