/**
 * Tests for validation and utility functions
 * Testing: validateFileFormat, checkFileSize, validateFileSize,
 * removeEmptyStringObject, isInvalidNumber, initMediaFromUrl,
 * CHAIN_OPTIONS, CRYPTO_OPTIONS
 */
import { vi } from 'vitest';
import {
	validateFileFormat,
	checkFileSize,
	validateFileSize,
	removeEmptyStringObject,
	isInvalidNumber,
	initMediaFromUrl,
	CHAIN_OPTIONS,
	CRYPTO_OPTIONS,
} from './common';
import { createMockFile, createInvalidFormatFile, createOversizedFile } from '@/test/utils/mock-file';
import { createMockTFunction } from '@/test/utils/mock-i18n';
import { EMedia } from '@/constant';

// Mock uuid to return predictable IDs
vi.mock('uuid', () => ({
	v4: vi.fn(() => 'mock-uuid-1234'),
}));

describe('validateFileFormat', () => {
	it('should return true for valid PNG file', () => {
		// Arrange
		const file = createMockFile('test.png', 1024, 'image/png');

		// Act
		const result = validateFileFormat(file);

		// Assert
		expect(result).toBe(true);
	});

	it('should return true for valid JPEG file', () => {
		const file = createMockFile('test.jpg', 1024, 'image/jpeg');
		expect(validateFileFormat(file)).toBe(true);
	});

	it('should return false for invalid PDF file', () => {
		const file = createInvalidFormatFile();
		expect(validateFileFormat(file)).toBe(false);
	});

	it('should return true for string input (edge case)', () => {
		// Function checks if file is string and returns true
		expect(validateFileFormat('string' as any)).toBe(true);
	});

	it('should return true for null input', () => {
		expect(validateFileFormat(null as any)).toBe(true);
	});

	it('should return true for undefined input', () => {
		expect(validateFileFormat(undefined as any)).toBe(true);
	});
});

describe('checkFileSize', () => {
	it('should return true for file within size limit', () => {
		// Arrange
		const file = createMockFile('test.png', 5 * 1024 * 1024, 'image/png'); // 5MB
		const sizeLimit = 10; // 10MB

		// Act
		const result = checkFileSize(file, sizeLimit);

		// Assert
		expect(result).toBe(true);
	});

	it('should return false for file exceeding size limit', () => {
		const file = createOversizedFile(11); // 11MB
		const sizeLimit = 10; // 10MB

		expect(checkFileSize(file, sizeLimit)).toBe(false);
	});

	it('should return true for file exactly at size limit', () => {
		const file = createMockFile('test.png', 10 * 1024 * 1024, 'image/png'); // Exactly 10MB
		const sizeLimit = 10;

		expect(checkFileSize(file, sizeLimit)).toBe(true);
	});

	it('should return true for string input (edge case)', () => {
		expect(checkFileSize('string' as any, 10)).toBe(true);
	});

	it('should return true for null input', () => {
		expect(checkFileSize(null as any, 10)).toBe(true);
	});
});

describe('validateFileSize', () => {
	it('should return true for file within default 10MB limit', () => {
		// Arrange
		const file = createMockFile('test.png', 5 * 1024 * 1024, 'image/png'); // 5MB

		// Act (no size parameter = default 10MB)
		const result = validateFileSize(file);

		// Assert
		expect(result).toBe(true);
	});

	it('should return false for file exceeding custom size limit', () => {
		const file = createMockFile('test.png', 8 * 1024 * 1024, 'image/png'); // 8MB
		expect(validateFileSize(file, 5)).toBe(false); // 5MB limit
	});

	it('should return true for file exactly at limit', () => {
		const file = createMockFile('test.png', 10 * 1024 * 1024, 'image/png'); // 10MB
		expect(validateFileSize(file, 10)).toBe(true);
	});

	it('should return true for string input (edge case)', () => {
		expect(validateFileSize('string' as any)).toBe(true);
	});

	it('should return true for file with no size property', () => {
		const file = { type: 'image/png' } as File;
		expect(validateFileSize(file)).toBe(true);
	});

	it('should return true for null input', () => {
		expect(validateFileSize(null as any)).toBe(true);
	});
});

describe('removeEmptyStringObject', () => {
	it('should remove empty string properties', () => {
		// Arrange
		const obj = {
			name: 'John',
			email: '',
			age: 30,
			address: '',
		};

		// Act
		const result = removeEmptyStringObject(obj);

		// Assert
		expect(result).toEqual({
			name: 'John',
			age: 30,
		});
	});

	it('should preserve non-empty values', () => {
		const obj = {
			a: 'value',
			b: 123,
			c: true,
			d: false,
		};

		expect(removeEmptyStringObject(obj)).toEqual(obj);
	});

	it('should handle all empty strings', () => {
		const obj = {
			a: '',
			b: '',
			c: '',
		};

		expect(removeEmptyStringObject(obj)).toEqual({});
	});

	it('should handle object with no empty strings', () => {
		const obj = {
			name: 'Alice',
			age: 25,
		};

		expect(removeEmptyStringObject(obj)).toEqual(obj);
	});

	it('should preserve null and undefined values', () => {
		const obj = {
			a: null,
			b: undefined,
			c: '',
			d: 'value',
		};

		const result = removeEmptyStringObject(obj);

		expect(result.a).toBeNull();
		expect(result.b).toBeUndefined();
		expect(result).not.toHaveProperty('c');
		expect(result.d).toBe('value');
	});

	it('should not modify original object', () => {
		const obj = {
			name: 'Test',
			email: '',
		};
		const originalCopy = { ...obj };

		removeEmptyStringObject(obj);

		expect(obj).toEqual(originalCopy);
	});
});

describe('isInvalidNumber', () => {
	it('should return true for null', () => {
		expect(isInvalidNumber(null)).toBe(true);
	});

	it('should return true for undefined', () => {
		expect(isInvalidNumber(undefined)).toBe(true);
	});

	it('should return true for NaN', () => {
		expect(isInvalidNumber(NaN)).toBe(true);
	});

	it('should return false for valid number', () => {
		expect(isInvalidNumber(42)).toBe(false);
	});

	it('should return false for zero', () => {
		expect(isInvalidNumber(0)).toBe(false);
	});

	it('should return false for negative number', () => {
		expect(isInvalidNumber(-10)).toBe(false);
	});

	it('should return true for string', () => {
		expect(isInvalidNumber('123')).toBe(true);
	});

	it('should return true for object', () => {
		expect(isInvalidNumber({})).toBe(true);
	});
});

describe('initMediaFromUrl', () => {
	it('should create media object from video URL', () => {
		// Arrange
		const url = 'https://example.com/video.mp4';

		// Act
		const result = initMediaFromUrl(url);

		// Assert
		expect(result).toEqual({
			id: 'mock-uuid-1234',
			url: 'https://example.com/video.mp4',
			type: EMedia.Video,
		});
	});

	it('should create media object from image URL', () => {
		const url = 'https://example.com/image.png';

		const result = initMediaFromUrl(url);

		expect(result).toEqual({
			id: 'mock-uuid-1234',
			url: 'https://example.com/image.png',
			type: EMedia.Image,
		});
	});

	it('should default to Image type when URL has no video indicator', () => {
		const url = 'https://example.com/file.unknown';

		const result = initMediaFromUrl(url);

		expect(result.type).toBe(EMedia.Image);
	});

	it('should generate unique ID using uuid', () => {
		const url = 'https://example.com/test.jpg';

		const result = initMediaFromUrl(url);

		expect(result.id).toBe('mock-uuid-1234');
	});
});

describe('CHAIN_OPTIONS', () => {
	it('should return array of chain options with translations', () => {
		// Arrange
		const t = createMockTFunction({
			'chains.ETH': 'Ethereum',
			'chains.BNB': 'BNB Chain',
		});

		// Act
		const result = CHAIN_OPTIONS(t);

		// Assert
		expect(result).toEqual([
			{ label: 'Ethereum', value: 'ETH' },
			{ label: 'BNB Chain', value: 'BSC' },
		]);
	});

	it('should return correct number of options', () => {
		const t = createMockTFunction();
		const result = CHAIN_OPTIONS(t);

		expect(result).toHaveLength(2);
	});

	it('should have correct structure for each option', () => {
		const t = createMockTFunction();
		const result = CHAIN_OPTIONS(t);

		result.forEach((option) => {
			expect(option).toHaveProperty('label');
			expect(option).toHaveProperty('value');
		});
	});
});

describe('CRYPTO_OPTIONS', () => {
	it('should return array of crypto token options with translations', () => {
		// Arrange
		const t = createMockTFunction({
			'tokens.USDT': 'Tether USD',
			'tokens.USDC': 'USD Coin',
		});

		// Act
		const result = CRYPTO_OPTIONS(t);

		// Assert
		expect(result).toEqual([
			{ label: 'Tether USD', value: 'USDT' },
			{ label: 'USD Coin', value: 'USDC' },
		]);
	});

	it('should return correct number of options', () => {
		const t = createMockTFunction();
		const result = CRYPTO_OPTIONS(t);

		expect(result).toHaveLength(2);
	});

	it('should have correct structure for each option', () => {
		const t = createMockTFunction();
		const result = CRYPTO_OPTIONS(t);

		result.forEach((option) => {
			expect(option).toHaveProperty('label');
			expect(option).toHaveProperty('value');
		});
	});
});
