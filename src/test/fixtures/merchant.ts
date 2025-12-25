/**
 * Mock data fixtures for merchant API responses
 */
import type { GetMarketplaceMerchantsListResponse, IMerchant } from '@/apis/marketplace';

export const mockMerchant: IMerchant = {
	id: 1,
	firstname: 'John',
	lastname: 'Doe',
	email: 'john.doe@example.com',
	status: 'active',
	type: 'individual',
	balance: 1000.5,
	createdAt: '2024-01-15T10:00:00Z',
	walletAddresses: [
		{
			id: '1',
			address: '0x1234567890abcdef',
			chain: 'ethereum',
			crypto: 'ETH',
			label: 'Main Wallet',
			merchantId: 1,
			isActive: true,
			createdAt: '2024-01-15T10:00:00Z',
			updatedAt: '2024-01-15T10:00:00Z',
		},
	],
};

export const mockMerchantList: IMerchant[] = [
	mockMerchant,
	{
		id: 2,
		firstname: 'Jane',
		lastname: 'Smith',
		email: 'jane.smith@example.com',
		status: 'inactive',
		type: 'business',
		balance: 5000.0,
		createdAt: '2024-01-16T10:00:00Z',
		walletAddresses: [],
	},
	{
		id: 3,
		firstname: 'Bob',
		lastname: 'Johnson',
		email: 'bob.johnson@example.com',
		status: 'active',
		type: 'individual',
		balance: 250.75,
		createdAt: '2024-01-17T10:00:00Z',
		walletAddresses: [],
	},
];

export const mockMerchantsListResponse: GetMarketplaceMerchantsListResponse = {
	data: mockMerchantList,
	pagination: {
		page: 1,
		pageSize: 10,
		totalPages: 1,
		totalCount: 3,
		hasNext: false,
		hasPrev: false,
	},
};

export const mockEmptyMerchantsListResponse: GetMarketplaceMerchantsListResponse = {
	data: [],
	pagination: {
		page: 1,
		pageSize: 10,
		totalPages: 0,
		totalCount: 0,
		hasNext: false,
		hasPrev: false,
	},
};
