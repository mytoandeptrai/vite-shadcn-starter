/**
 * Tests for validation functions
 * Testing: validatePassword, spaceValidation, validateEmail,
 * convertToStringNumber, onlyLettersAndSpecialCharactersRegex,
 * numbersAndLettersRegex, accountHolderValidation
 */
import {
	validatePassword,
	spaceValidation,
	validateEmail,
	convertToStringNumber,
	onlyLettersAndSpecialCharactersRegex,
	numbersAndLettersRegex,
	accountHolderValidation,
} from './validations';

describe('validatePassword', () => {
	it('should return true for valid password with all requirements', () => {
		// Arrange
		const password = 'Test1234!';

		// Act
		const result = validatePassword(password);

		// Assert
		expect(result).toBe(true);
	});

	it('should return false for password without uppercase', () => {
		expect(validatePassword('test1234!')).toBe(false);
	});

	it('should return false for password without lowercase', () => {
		expect(validatePassword('TEST123!')).toBe(false);
	});

	it('should return false for password without number', () => {
		expect(validatePassword('TestAbc!')).toBe(false);
	});

	it('should return false for password without special character', () => {
		expect(validatePassword('Test1234')).toBe(false);
	});

	it('should return false for empty string', () => {
		expect(validatePassword('')).toBe(false);
	});

	it('should return true for complex valid password', () => {
		expect(validatePassword('MyP@ssw0rd!')).toBe(true);
	});
});

describe('spaceValidation', () => {
	it('should return true when string contains spaces', () => {
		// Arrange
		const str = 'hello world';

		// Act
		const result = spaceValidation(str);

		// Assert
		expect(result).toBe(true);
	});

	it('should return false when string has no spaces', () => {
		expect(spaceValidation('helloworld')).toBe(false);
	});

	it('should return false for empty string', () => {
		expect(spaceValidation('')).toBe(false);
	});

	it('should return true for string with multiple spaces', () => {
		expect(spaceValidation('hello   world')).toBe(true);
	});

	it('should return true for string with leading/trailing spaces', () => {
		expect(spaceValidation(' hello')).toBe(true);
		expect(spaceValidation('hello ')).toBe(true);
	});
});

describe('validateEmail', () => {
	it('should return true for valid email', () => {
		// Arrange
		const email = 'test@example.com';

		// Act
		const result = validateEmail(email);

		// Assert
		expect(result).toBe(true);
	});

	it('should return false for email without @', () => {
		expect(validateEmail('testexample.com')).toBe(false);
	});

	it('should return false for email without domain', () => {
		expect(validateEmail('test@')).toBe(false);
	});

	it('should return false for invalid email format', () => {
		expect(validateEmail('test@.com')).toBe(false);
	});

	it('should return false for empty string', () => {
		expect(validateEmail('')).toBe(false);
	});

	it('should return true for email with subdomain', () => {
		expect(validateEmail('test@mail.example.com')).toBe(true);
	});

	it('should return true for email with plus sign', () => {
		expect(validateEmail('test+tag@example.com')).toBe(true);
	});
});

describe('convertToStringNumber', () => {
	it('should remove all non-numeric characters', () => {
		// Arrange
		const str = 'abc123def456';

		// Act
		const result = convertToStringNumber(str);

		// Assert
		expect(result).toBe('123456');
	});

	it('should return empty string when no numbers present', () => {
		expect(convertToStringNumber('abcdef')).toBe('');
	});

	it('should handle empty string', () => {
		expect(convertToStringNumber('')).toBe('');
	});

	it('should handle string with only numbers', () => {
		expect(convertToStringNumber('123456')).toBe('123456');
	});

	it('should remove special characters', () => {
		expect(convertToStringNumber('12-34-56')).toBe('123456');
	});

	it('should handle mixed content', () => {
		expect(convertToStringNumber('Price: $12.99')).toBe('1299');
	});
});

describe('onlyLettersAndSpecialCharactersRegex', () => {
	it('should keep only letters, spaces, hyphens, and underscores', () => {
		// Arrange
		const str = 'hello-world_test 123';

		// Act
		const result = onlyLettersAndSpecialCharactersRegex(str);

		// Assert
		expect(result).toBe('hello-world_test ');
	});

	it('should remove numbers', () => {
		expect(onlyLettersAndSpecialCharactersRegex('abc123def')).toBe('abcdef');
	});

	it('should remove special characters except allowed ones', () => {
		expect(onlyLettersAndSpecialCharactersRegex('hello@world!test#')).toBe('helloworldtest');
	});

	it('should keep hyphens and underscores', () => {
		expect(onlyLettersAndSpecialCharactersRegex('hello-world_test')).toBe('hello-world_test');
	});

	it('should handle empty string', () => {
		expect(onlyLettersAndSpecialCharactersRegex('')).toBe('');
	});

	it('should preserve spaces', () => {
		expect(onlyLettersAndSpecialCharactersRegex('hello world')).toBe('hello world');
	});

	it('should handle only invalid characters', () => {
		expect(onlyLettersAndSpecialCharactersRegex('123!@#')).toBe('');
	});
});

describe('numbersAndLettersRegex', () => {
	it('should keep only numbers and letters', () => {
		// Arrange
		const str = 'abc123def456!@#';

		// Act
		const result = numbersAndLettersRegex(str);

		// Assert
		expect(result).toBe('abc123def456');
	});

	it('should remove special characters', () => {
		expect(numbersAndLettersRegex('hello@world!')).toBe('helloworld');
	});

	it('should remove spaces', () => {
		expect(numbersAndLettersRegex('hello world')).toBe('helloworld');
	});

	it('should handle empty string', () => {
		expect(numbersAndLettersRegex('')).toBe('');
	});

	it('should handle only alphanumeric characters', () => {
		expect(numbersAndLettersRegex('abc123')).toBe('abc123');
	});

	it('should remove hyphens and underscores', () => {
		expect(numbersAndLettersRegex('hello-world_test')).toBe('helloworldtest');
	});

	it('should handle only special characters', () => {
		expect(numbersAndLettersRegex('!@#$%^&*()')).toBe('');
	});
});

describe('accountHolderValidation', () => {
	it('should keep letters, numbers, spaces, hyphens, and dots', () => {
		// Arrange
		const str = 'John Doe-Smith Jr.';

		// Act
		const result = accountHolderValidation(str);

		// Assert
		expect(result).toBe('John Doe-Smith Jr.');
	});

	it('should remove special characters except allowed ones', () => {
		expect(accountHolderValidation('John@Doe#Smith$')).toBe('JohnDoeSmith');
	});

	it('should keep dots for middle initials', () => {
		expect(accountHolderValidation('John A. Smith')).toBe('John A. Smith');
	});

	it('should keep hyphens for hyphenated names', () => {
		expect(accountHolderValidation('Mary-Jane Watson')).toBe('Mary-Jane Watson');
	});

	it('should handle empty string', () => {
		expect(accountHolderValidation('')).toBe('');
	});

	it('should preserve spaces between names', () => {
		expect(accountHolderValidation('First Middle Last')).toBe('First Middle Last');
	});

	it('should remove parentheses and brackets', () => {
		expect(accountHolderValidation('John (Jack) Smith')).toBe('John Jack Smith');
	});

	it('should remove various special characters', () => {
		expect(accountHolderValidation('John!@#$%^&*()Smith')).toBe('JohnSmith');
	});

	it('should keep numbers in names', () => {
		expect(accountHolderValidation('John Smith 3rd')).toBe('John Smith 3rd');
	});
});
