/**
 * Australian Phone Number Validation
 * Validates and normalizes Australian phone numbers
 */

/**
 * Validates Australian phone number format
 * Accepts various formats:
 * - Mobile: 04XX XXX XXX, 04XXXXXXXX, +61 4XX XXX XXX
 * - Landline: 02 XXXX XXXX, 0XXXXXXXXX, +61 X XXXX XXXX
 * 
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid Australian phone number
 */
export function isValidAustralianPhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return false;
  }

  // Remove all spaces, dashes, and parentheses for validation
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // Pattern 1: Mobile numbers starting with 04 (10 digits)
  // 04XX XXX XXX or 04XXXXXXXX
  const mobilePattern = /^04\d{8}$/;

  // Pattern 2: Landline numbers starting with 02, 03, 07, 08 (10 digits)
  // 0X XXXX XXXX or 0XXXXXXXXX
  const landlinePattern = /^0[2378]\d{8}$/;

  // Pattern 3: International format with +61
  // +61 4XX XXX XXX (mobile) or +61 X XXXX XXXX (landline)
  const internationalPattern = /^\+61[2378]\d{8}$/; // +61 followed by area code (2,3,7,8) and 8 digits
  const internationalMobilePattern = /^\+614\d{8}$/; // +61 4XX XXX XXX

  return (
    mobilePattern.test(cleaned) ||
    landlinePattern.test(cleaned) ||
    internationalPattern.test(cleaned) ||
    internationalMobilePattern.test(cleaned)
  );
}

/**
 * Normalizes Australian phone number to a standard format
 * Converts to: 04XX XXX XXX format (with spaces)
 * 
 * @param {string} phone - Phone number to normalize
 * @returns {string} - Normalized phone number or original if invalid
 */
export function normalizeAustralianPhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return phone;
  }

  // Remove all spaces, dashes, and parentheses
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // Handle international format (+61)
  if (cleaned.startsWith('+61')) {
    cleaned = '0' + cleaned.substring(3); // Convert +61 to 0
  }

  // Validate it's a valid Australian number
  if (!isValidAustralianPhone(cleaned)) {
    return phone; // Return original if invalid
  }

  // Format: 04XX XXX XXX for mobile, 0X XXXX XXXX for landline
  if (cleaned.startsWith('04')) {
    // Mobile: 04XX XXX XXX
    return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`;
  } else if (cleaned.startsWith('0')) {
    // Landline: 0X XXXX XXXX
    return `${cleaned.substring(0, 2)} ${cleaned.substring(2, 6)} ${cleaned.substring(6)}`;
  }

  return phone;
}

/**
 * Formats phone number for display
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number
 */
export function formatAustralianPhone(phone) {
  return normalizeAustralianPhone(phone);
}

