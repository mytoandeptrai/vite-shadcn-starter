/**
 * Currency test fixtures
 * Mock currency data for testing formatting functions
 */
import type { Currency } from '@/stores/use-base-store';

/**
 * US Dollar currency fixture
 */
export const mockUSDCurrency: Currency = {
	code: 'USD',
	symbol: '$',
	locale: 'en-US',
	decimalPlaces: 2,
};

/**
 * Vietnamese Dong currency fixture
 */
export const mockVNDCurrency: Currency = {
	code: 'VND',
	symbol: '₫',
	locale: 'vi-VN',
	decimalPlaces: 0,
};

/**
 * Thai Baht currency fixture
 */
export const mockTHBCurrency: Currency = {
	code: 'THB',
	symbol: '฿',
	locale: 'th-TH',
	decimalPlaces: 2,
};

/**
 * Euro currency fixture
 */
export const mockEURCurrency: Currency = {
	code: 'EUR',
	symbol: '€',
	locale: 'de-DE',
	decimalPlaces: 2,
};
