/**
 * i18n mocking utilities for testing
 */
import type { TFunction } from 'i18next';

/**
 * Creates a mock TFunction for testing
 * @param translations - Optional translation map for specific keys
 * @returns Mock TFunction
 */
export const createMockTFunction = (translations?: Record<string, string>): TFunction => {
	return ((key: string) => translations?.[key] || key) as TFunction;
};

/**
 * Mock translations for time units
 */
export const mockTimeUnitsTranslations = {
	'time-units.day': 'day',
	'time-units.days': 'days',
	'time-units.hour': 'hour',
	'time-units.hours': 'hours',
	'time-units.minute': 'minute',
	'time-units.minutes': 'minutes',
	'time-units.second': 'second',
	'time-units.seconds': 'seconds',
};

/**
 * Mock translations for chains
 */
export const mockChainTranslations = {
	'chains.ETH': 'Ethereum',
	'chains.BNB': 'BNB Chain',
	'chains.POLYGON': 'Polygon',
};

/**
 * Mock translations for crypto tokens
 */
export const mockCryptoTranslations = {
	'tokens.USDT': 'Tether USD',
	'tokens.USDC': 'USD Coin',
	'tokens.BTC': 'Bitcoin',
};
