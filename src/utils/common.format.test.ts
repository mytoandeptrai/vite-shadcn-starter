/**
 * Tests for formatting utility functions
 * Testing: formatDate, formatBytes, formatCurrencyUSD, formatCurrency,
 * formatCurrencyWithDecimals, formatAddress, shortenString, numberFormatter,
 * kebabToTitleCase, formatToTitleCase, capitalizeFirstLetter,
 * getCountdownToTime, formatTimeFromSeconds
 */
import {
	formatDate,
	formatBytes,
	formatCurrencyUSD,
	formatCurrency,
	formatCurrencyWithDecimals,
	formatAddress,
	shortenString,
	numberFormatter,
	kebabToTitleCase,
	formatToTitleCase,
	capitalizeFirstLetter,
	getCountdownToTime,
	formatTimeFromSeconds,
} from './common';
import { mockUSDCurrency, mockVNDCurrency } from '@/test/fixtures/currency';
import { createMockTFunction, mockTimeUnitsTranslations } from '@/test/utils/mock-i18n';

describe('formatDate', () => {
	it('should format date with default format', () => {
		// Arrange
		const date = '2024-01-15T14:30:00';

		// Act
		const result = formatDate(date);

		// Assert
		expect(result).toBe('15/01/2024 14:30:00');
	});

	it('should format date with custom format', () => {
		const date = '2024-01-15T14:30:00';
		expect(formatDate(date, 'YYYY-MM-DD')).toBe('2024-01-15');
	});

	it('should format date with time only', () => {
		const date = '2024-01-15T14:30:45';
		expect(formatDate(date, 'HH:mm:ss')).toBe('14:30:45');
	});

	it('should handle different date formats', () => {
		const date = '2024-01-15T14:30:00';
		expect(formatDate(date, 'DD MMM YYYY')).toBe('15 Jan 2024');
	});
});

describe('formatBytes', () => {
	it('should format zero bytes', () => {
		expect(formatBytes(0)).toBe('0 Byte');
	});

	it('should format bytes to KB', () => {
		expect(formatBytes(1024)).toBe('1 KB');
	});

	it('should format bytes to MB', () => {
		expect(formatBytes(1024 * 1024)).toBe('1 MB');
	});

	it('should format bytes to GB', () => {
		expect(formatBytes(1024 * 1024 * 1024)).toBe('1 GB');
	});

	it('should format with decimals', () => {
		expect(formatBytes(1536, { decimals: 2 })).toBe('1.50 KB');
	});

	it('should use accurate size type (KiB, MiB)', () => {
		expect(formatBytes(1024, { sizeType: 'accurate' })).toBe('1 KiB');
	});

	it('should handle large numbers', () => {
		const result = formatBytes(5 * 1024 * 1024 * 1024);
		expect(result).toBe('5 GB');
	});
});

describe('formatCurrencyUSD', () => {
	it('should format positive number as USD', () => {
		expect(formatCurrencyUSD(1234.56)).toBe('$1,234.56');
	});

	it('should format negative number as USD', () => {
		expect(formatCurrencyUSD(-100)).toBe('-$100.00');
	});

	it('should format zero as USD', () => {
		expect(formatCurrencyUSD(0)).toBe('$0.00');
	});

	it('should format string number as USD', () => {
		expect(formatCurrencyUSD('1000')).toBe('$1,000.00');
	});

	it('should handle large numbers', () => {
		expect(formatCurrencyUSD(1000000)).toBe('$1,000,000.00');
	});
});

describe('formatCurrency', () => {
	it('should format USD with 2 decimal places', () => {
		// Arrange
		const amount = 1234.56;

		// Act
		const result = formatCurrency(amount, mockUSDCurrency);

		// Assert
		expect(result).toBe('$1,234.56');
	});

	it('should format VND with 0 decimal places', () => {
		const amount = 1234.56;
		const result = formatCurrency(amount, mockVNDCurrency);

		// VND rounds to nearest whole number and uses vi-VN locale (symbol after number)
		// Using regex to handle non-breaking space
		expect(result).toMatch(/1\.235\s₫/);
	});

	it('should handle string input', () => {
		expect(formatCurrency('1000', mockUSDCurrency)).toBe('$1,000.00');
	});

	it('should return "0" for NaN input', () => {
		expect(formatCurrency('invalid', mockUSDCurrency)).toBe('0');
	});

	it('should handle zero value', () => {
		expect(formatCurrency(0, mockUSDCurrency)).toBe('$0.00');
	});

	it('should handle negative values', () => {
		expect(formatCurrency(-100, mockUSDCurrency)).toBe('-$100.00');
	});

	it('should respect currency decimal places', () => {
		const result = formatCurrency(100, mockVNDCurrency);
		// Using regex to handle non-breaking space
		expect(result).toMatch(/100\s₫/);
	});
});

describe('formatCurrencyWithDecimals', () => {
	it('should format with default 2 decimals', () => {
		expect(formatCurrencyWithDecimals({ num: 1234.5678 })).toBe('1,234.57');
	});

	it('should format with custom min and max decimals', () => {
		expect(formatCurrencyWithDecimals({ num: 1000, minDecimals: 0, maxDecimals: 2 })).toBe('1,000');
	});

	it('should clamp max decimals between 0 and 8', () => {
		// Max decimals clamped to 8
		expect(formatCurrencyWithDecimals({ num: 1.123456789, maxDecimals: 10 })).toBe('1.12345679');
	});

	it('should handle undefined number as 0', () => {
		// Default minDecimals and maxDecimals are 2
		expect(formatCurrencyWithDecimals({ num: undefined })).toBe('0.00');
	});

	it('should respect minimum decimals', () => {
		expect(formatCurrencyWithDecimals({ num: 100, minDecimals: 3, maxDecimals: 3 })).toBe('100.000');
	});
});

describe('formatAddress', () => {
	it('should shorten blockchain address', () => {
		// Arrange
		const address = '0x1234567890abcdef1234567890abcdef12345678';

		// Act
		const result = formatAddress(address);

		// Assert
		expect(result).toBe('0x123...2345678');
	});

	it('should return empty string for empty input', () => {
		expect(formatAddress('')).toBe('');
	});

	it('should return empty string for undefined input', () => {
		expect(formatAddress(undefined as any)).toBe('');
	});

	it('should handle short addresses', () => {
		const shortAddress = '0x123456';
		const result = formatAddress(shortAddress);

		expect(result).toContain('0x123');
		expect(result).toContain('...');
	});
});

describe('shortenString', () => {
	it('should shorten long string with default length', () => {
		// Arrange
		const longString = 'This is a very long string that needs to be shortened';

		// Act
		const result = shortenString(longString);

		// Assert
		expect(result).toBe('This is a ... shortened');
	});

	it('should return original string if shorter than length', () => {
		const shortString = 'Short';
		expect(shortenString(shortString)).toBe('Short');
	});

	it('should return original string if exactly at length', () => {
		const exactString = '1234567890';
		expect(shortenString(exactString, 10)).toBe('1234567890');
	});

	it('should return empty string for undefined input', () => {
		expect(shortenString(undefined)).toBe('');
	});

	it('should handle custom length parameter', () => {
		const str = '12345678901234567890';
		const result = shortenString(str, 5);

		expect(result).toBe('12345...67890');
	});
});

describe('numberFormatter', () => {
	it('should format thousands with k suffix', () => {
		expect(numberFormatter(1500)).toBe('1.5k');
	});

	it('should format millions with M suffix', () => {
		expect(numberFormatter(2500000)).toBe('2.5M');
	});

	it('should format billions with B suffix', () => {
		expect(numberFormatter(3500000000)).toBe('3.5B');
	});

	it('should return "0" for zero', () => {
		expect(numberFormatter(0)).toBe('0');
	});

	it('should return formatted number for small numbers less than 1000', () => {
		// Numbers less than 1000 are returned with no symbol
		expect(numberFormatter(500)).toBe('500');
	});

	it('should format with custom digits', () => {
		expect(numberFormatter(1234567, 2)).toBe('1.23M');
	});

	it('should remove trailing zeros', () => {
		expect(numberFormatter(1000)).toBe('1k');
	});
});

describe('kebabToTitleCase', () => {
	it('should convert kebab-case to Title Case', () => {
		expect(kebabToTitleCase('hello-world')).toBe('Hello World');
	});

	it('should handle single word', () => {
		expect(kebabToTitleCase('hello')).toBe('Hello');
	});

	it('should handle multiple words', () => {
		expect(kebabToTitleCase('this-is-a-test')).toBe('This Is A Test');
	});

	it('should preserve case after first letter', () => {
		expect(kebabToTitleCase('hTML-cSS')).toBe('HTML CSS');
	});
});

describe('formatToTitleCase', () => {
	it('should capitalize first letter and lowercase rest', () => {
		expect(formatToTitleCase('hello world')).toBe('Hello world');
	});

	it('should handle all uppercase', () => {
		expect(formatToTitleCase('HELLO')).toBe('Hello');
	});

	it('should return empty string for empty input', () => {
		expect(formatToTitleCase('')).toBe('');
	});

	it('should handle single character', () => {
		expect(formatToTitleCase('a')).toBe('A');
	});

	it('should lowercase everything except first letter', () => {
		expect(formatToTitleCase('hELLO WORLD')).toBe('Hello world');
	});
});

describe('capitalizeFirstLetter', () => {
	it('should capitalize first letter', () => {
		expect(capitalizeFirstLetter('hello')).toBe('Hello');
	});

	it('should lowercase rest of string', () => {
		expect(capitalizeFirstLetter('hELLO')).toBe('Hello');
	});

	it('should return empty string for empty input', () => {
		expect(capitalizeFirstLetter('')).toBe('');
	});

	it('should handle single character', () => {
		expect(capitalizeFirstLetter('a')).toBe('A');
	});

	it('should handle string with spaces', () => {
		expect(capitalizeFirstLetter('hello world')).toBe('Hello world');
	});
});

describe('getCountdownToTime', () => {
	it('should return 00:00 for invalid date with HH:mm format', () => {
		expect(getCountdownToTime('invalid-date')).toBe('00:00');
	});

	it('should return 00:00:00 for invalid date with HH:mm:ss format', () => {
		expect(getCountdownToTime('invalid-date', 'HH:mm:ss')).toBe('00:00:00');
	});

	it('should return 00:00 for undefined date', () => {
		expect(getCountdownToTime(undefined)).toBe('00:00');
	});

	it('should return 00:00:00 for past time with HH:mm:ss format', () => {
		// Past time should return 00:00:00
		const pastTime = '2020-01-01T00:00:00';
		expect(getCountdownToTime(pastTime, 'HH:mm:ss')).toBe('00:00:00');
	});

	it('should return 00:00 for past time with HH:mm format', () => {
		const pastTime = '2020-01-01T00:00:00';
		expect(getCountdownToTime(pastTime, 'HH:mm')).toBe('00:00');
	});

	it('should format future time in HH:mm format', () => {
		// This test will be time-dependent, so we test the format structure
		const futureTime = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now
		const result = getCountdownToTime(futureTime, 'HH:mm');

		expect(result).toMatch(/^\d{2}:\d{2}$/);
	});

	it('should format future time in HH:mm:ss format', () => {
		const futureTime = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now
		const result = getCountdownToTime(futureTime, 'HH:mm:ss');

		expect(result).toMatch(/^\d{2}:\d{2}:\d{2}$/);
	});
});

describe('formatTimeFromSeconds', () => {
	const t = createMockTFunction(mockTimeUnitsTranslations);

	it('should format seconds only', () => {
		expect(formatTimeFromSeconds(45, t)).toBe('45 seconds');
	});

	it('should format minutes and seconds', () => {
		const result = formatTimeFromSeconds(90, t);
		expect(result).toBe('01 minute 30 seconds');
	});

	it('should format hours, minutes and seconds', () => {
		const result = formatTimeFromSeconds(3665, t); // 1 hour, 1 minute, 5 seconds
		expect(result).toBe('01 hour 01 minute 05 seconds');
	});

	it('should format days, hours, minutes and seconds', () => {
		const result = formatTimeFromSeconds(90061, t); // 1 day, 1 hour, 1 minute, 1 second
		expect(result).toBe('01 day 01 hour 01 minute 01 second');
	});

	it('should use singular form for 1 unit', () => {
		const result = formatTimeFromSeconds(61, t); // 1 minute, 1 second
		expect(result).toContain('minute');
		expect(result).toContain('second');
	});

	it('should use plural form for multiple units', () => {
		const result = formatTimeFromSeconds(120, t); // 2 minutes
		expect(result).toContain('minutes');
	});

	it('should pad numbers with zero', () => {
		const result = formatTimeFromSeconds(5, t);
		expect(result).toBe('05 seconds');
	});

	it('should handle zero seconds', () => {
		const result = formatTimeFromSeconds(0, t);
		expect(result).toBe('00 seconds');
	});
});
