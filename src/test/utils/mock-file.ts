/**
 * File object mocking utilities for testing file validation functions
 */

/**
 * Creates a mock File object for testing
 * @param name - File name
 * @param size - File size in bytes
 * @param type - MIME type
 * @returns File object
 */
export const createMockFile = (
	name = 'test.png',
	size = 1024,
	type = 'image/png',
): File => {
	const blob = new Blob(['x'.repeat(size)], { type });
	return new File([blob], name, { type });
};

/**
 * Creates a File object that exceeds the typical size limit
 * @param sizeMB - Size in megabytes (default: 11MB to exceed common 10MB limit)
 * @returns Oversized File object
 */
export const createOversizedFile = (sizeMB = 11): File => {
	return createMockFile('large.png', sizeMB * 1024 * 1024, 'image/png');
};

/**
 * Creates a File object with an invalid format (PDF instead of image)
 * @returns File object with PDF MIME type
 */
export const createInvalidFormatFile = (): File => {
	return createMockFile('test.pdf', 1024, 'application/pdf');
};

/**
 * Creates a valid JPEG file
 * @param name - File name
 * @param size - File size in bytes
 * @returns JPEG File object
 */
export const createJPEGFile = (name = 'test.jpg', size = 1024): File => {
	return createMockFile(name, size, 'image/jpeg');
};

/**
 * Creates a valid PNG file
 * @param name - File name
 * @param size - File size in bytes
 * @returns PNG File object
 */
export const createPNGFile = (name = 'test.png', size = 1024): File => {
	return createMockFile(name, size, 'image/png');
};
