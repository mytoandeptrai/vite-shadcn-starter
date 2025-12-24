/**
 * Tests for array utility functions
 * Testing: range, currentNo, shuffleArray, removeDuplicatesByKey, groupByKey
 */
import { range, currentNo, shuffleArray, removeDuplicatesByKey, groupByKey } from './common';

describe('range', () => {
	it('should create array from 1 to 5', () => {
		// Arrange
		const start = 1;
		const end = 5;

		// Act
		const result = range(start, end);

		// Assert
		expect(result).toEqual([1, 2, 3, 4, 5]);
	});

	it('should create array from 0 to 3', () => {
		expect(range(0, 3)).toEqual([0, 1, 2, 3]);
	});

	it('should create single element array when start equals end', () => {
		expect(range(5, 5)).toEqual([5]);
	});

	it('should create empty array when start is greater than end', () => {
		expect(range(5, 3)).toEqual([]);
	});

	it('should handle negative numbers', () => {
		expect(range(-2, 2)).toEqual([-2, -1, 0, 1, 2]);
	});
});

describe('currentNo', () => {
	it('should calculate row number for first page', () => {
		// Arrange
		const no = 0; // First item index
		const page = 1;
		const limit = 10;

		// Act
		const result = currentNo(no, page, limit);

		// Assert
		expect(result).toBe(1);
	});

	it('should calculate row number for second page', () => {
		const no = 0; // First item on page 2
		const page = 2;
		const limit = 10;

		expect(currentNo(no, page, limit)).toBe(11);
	});

	it('should calculate row number for last item on page', () => {
		const no = 9; // Last item (index 9) on page 1
		const page = 1;
		const limit = 10;

		expect(currentNo(no, page, limit)).toBe(10);
	});

	it('should handle different page sizes', () => {
		const no = 4;
		const page = 3;
		const limit = 5;

		expect(currentNo(no, page, limit)).toBe(15); // (3-1)*5 + 4 + 1 = 15
	});

	it('should handle string number inputs', () => {
		// Function uses Number() for page and limit
		const no = 2;
		const page = '2' as any;
		const limit = '10' as any;

		expect(currentNo(no, page, limit)).toBe(13);
	});
});

describe('shuffleArray', () => {
	it('should return array with same length', () => {
		// Arrange
		const original = [1, 2, 3, 4, 5];

		// Act
		const result = shuffleArray(original);

		// Assert
		expect(result).toHaveLength(original.length);
	});

	it('should contain all original elements', () => {
		const original = [1, 2, 3, 4, 5];
		const result = shuffleArray(original);

		// All original elements should be present
		expect(result.sort()).toEqual(original.sort());
	});

	it('should not modify original array', () => {
		const original = [1, 2, 3, 4, 5];
		const originalCopy = [...original];

		shuffleArray(original);

		expect(original).toEqual(originalCopy);
	});

	it('should handle empty array', () => {
		expect(shuffleArray([])).toEqual([]);
	});

	it('should handle single element array', () => {
		expect(shuffleArray([1])).toEqual([1]);
	});

	it('should shuffle array of objects', () => {
		const original = [
			{ id: 1, name: 'a' },
			{ id: 2, name: 'b' },
			{ id: 3, name: 'c' },
		];
		const result = shuffleArray(original);

		expect(result).toHaveLength(3);
		expect(result).toContainEqual({ id: 1, name: 'a' });
		expect(result).toContainEqual({ id: 2, name: 'b' });
		expect(result).toContainEqual({ id: 3, name: 'c' });
	});
});

describe('removeDuplicatesByKey', () => {
	it('should remove duplicates by id key', () => {
		// Arrange
		const array = [
			{ id: 1, name: 'John' },
			{ id: 2, name: 'Jane' },
			{ id: 1, name: 'Duplicate John' },
			{ id: 3, name: 'Bob' },
		];

		// Act
		const result = removeDuplicatesByKey(array, 'id');

		// Assert
		expect(result).toHaveLength(3);
		expect(result).toEqual([
			{ id: 1, name: 'John' },
			{ id: 2, name: 'Jane' },
			{ id: 3, name: 'Bob' },
		]);
	});

	it('should preserve first occurrence of duplicate', () => {
		const array = [
			{ id: 1, value: 'first' },
			{ id: 1, value: 'second' },
		];

		const result = removeDuplicatesByKey(array, 'id');

		expect(result[0].value).toBe('first');
	});

	it('should handle array with no duplicates', () => {
		const array = [
			{ id: 1, name: 'a' },
			{ id: 2, name: 'b' },
			{ id: 3, name: 'c' },
		];

		expect(removeDuplicatesByKey(array, 'id')).toEqual(array);
	});

	it('should handle empty array', () => {
		expect(removeDuplicatesByKey([], 'id')).toEqual([]);
	});

	it('should work with different key types', () => {
		const array = [
			{ name: 'John', age: 30 },
			{ name: 'Jane', age: 25 },
			{ name: 'John', age: 35 },
		];

		const result = removeDuplicatesByKey(array, 'name');

		expect(result).toHaveLength(2);
		expect(result[0].name).toBe('John');
		expect(result[1].name).toBe('Jane');
	});
});

describe('groupByKey', () => {
	it('should group items by category', () => {
		// Arrange
		const array = [
			{ id: 1, category: 'fruit', name: 'apple' },
			{ id: 2, category: 'vegetable', name: 'carrot' },
			{ id: 3, category: 'fruit', name: 'banana' },
			{ id: 4, category: 'vegetable', name: 'broccoli' },
		];

		// Act
		const result = groupByKey(array, 'category');

		// Assert
		expect(result).toEqual({
			fruit: [
				{ id: 1, category: 'fruit', name: 'apple' },
				{ id: 3, category: 'fruit', name: 'banana' },
			],
			vegetable: [
				{ id: 2, category: 'vegetable', name: 'carrot' },
				{ id: 4, category: 'vegetable', name: 'broccoli' },
			],
		});
	});

	it('should handle single group', () => {
		const array = [
			{ type: 'A', value: 1 },
			{ type: 'A', value: 2 },
		];

		const result = groupByKey(array, 'type');

		expect(Object.keys(result)).toHaveLength(1);
		expect(result.A).toHaveLength(2);
	});

	it('should handle empty array', () => {
		expect(groupByKey([], 'key')).toEqual({});
	});

	it('should handle items with unique keys', () => {
		const array = [
			{ id: 1, value: 'a' },
			{ id: 2, value: 'b' },
			{ id: 3, value: 'c' },
		];

		const result = groupByKey(array, 'id');

		expect(Object.keys(result)).toHaveLength(3);
		expect(result['1']).toEqual([{ id: 1, value: 'a' }]);
		expect(result['2']).toEqual([{ id: 2, value: 'b' }]);
		expect(result['3']).toEqual([{ id: 3, value: 'c' }]);
	});

	it('should preserve item order within groups', () => {
		const array = [
			{ type: 'A', order: 1 },
			{ type: 'B', order: 2 },
			{ type: 'A', order: 3 },
			{ type: 'A', order: 4 },
		];

		const result = groupByKey(array, 'type');

		expect(result.A[0].order).toBe(1);
		expect(result.A[1].order).toBe(3);
		expect(result.A[2].order).toBe(4);
	});
});
