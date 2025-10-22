/**
 * Email Validation Utilities
 *
 * Provides email validation, sanitization, and verification functions
 * for the email service layer.
 */

import { EmailValidationError } from './errors';

/**
 * RFC 5322 compliant email validation regex
 * Source: https://emailregex.com/
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Stricter email validation regex for production use
 */
const STRICT_EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Common disposable email domains to block
 */
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'tempmail.com',
  'guerrillamail.com',
  'mailinator.com',
  '10minutemail.com',
  'throwaway.email',
  'temp-mail.org',
  'getnada.com',
  'maildrop.cc',
]);

/**
 * Validates if a string is a valid email address
 *
 * @param email - Email address to validate
 * @param strict - Use stricter validation rules
 * @returns True if valid, false otherwise
 */
export function isValidEmail(email: string, strict = false): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const regex = strict ? STRICT_EMAIL_REGEX : EMAIL_REGEX;
  return regex.test(email.trim());
}

/**
 * Sanitizes an email address by trimming and lowercasing
 *
 * @param email - Email address to sanitize
 * @returns Sanitized email address
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Validates and sanitizes an email address
 *
 * @param email - Email address to process
 * @param strict - Use stricter validation rules
 * @returns Sanitized email or null if invalid
 */
export function validateAndSanitizeEmail(
  email: string,
  strict = false
): string | null {
  const sanitized = sanitizeEmail(email);
  return isValidEmail(sanitized, strict) ? sanitized : null;
}

/**
 * Validates and sanitizes a list of email addresses
 *
 * @param emails - Single email or array of emails
 * @param strict - Use stricter validation rules
 * @returns Array of valid, sanitized emails
 */
export function validateRecipients(
  emails: string | string[],
  strict = false
): string[] {
  const emailArray = Array.isArray(emails) ? emails : [emails];

  return emailArray
    .map((email) => validateAndSanitizeEmail(email, strict))
    .filter((email): email is string => email !== null);
}

/**
 * Checks if an email domain is from a disposable email provider
 *
 * @param email - Email address to check
 * @returns True if disposable, false otherwise
 */
export function isDisposableEmail(email: string): boolean {
  try {
    const domain = email.toLowerCase().split('@')[1];
    return DISPOSABLE_EMAIL_DOMAINS.has(domain);
  } catch {
    return false;
  }
}

/**
 * Extracts the domain from an email address
 *
 * @param email - Email address
 * @returns Domain or null if invalid
 */
export function getEmailDomain(email: string): string | null {
  if (!isValidEmail(email)) {
    return null;
  }

  try {
    return email.toLowerCase().split('@')[1];
  } catch {
    return null;
  }
}

/**
 * Validates a batch of emails and returns validation results
 *
 * @param emails - Array of emails to validate
 * @returns Validation results with valid and invalid emails
 */
export function validateEmailBatch(emails: string[]): {
  valid: string[];
  invalid: string[];
  disposable: string[];
} {
  const valid: string[] = [];
  const invalid: string[] = [];
  const disposable: string[] = [];

  for (const email of emails) {
    const sanitized = sanitizeEmail(email);

    if (!isValidEmail(sanitized)) {
      invalid.push(email);
      continue;
    }

    if (isDisposableEmail(sanitized)) {
      disposable.push(email);
      continue;
    }

    valid.push(sanitized);
  }

  return { valid, invalid, disposable };
}

/**
 * Checks if email has a valid format and is not from a disposable provider
 *
 * @param email - Email to validate
 * @returns True if valid and not disposable
 */
export function isValidProductionEmail(email: string): boolean {
  const sanitized = sanitizeEmail(email);
  return isValidEmail(sanitized, true) && !isDisposableEmail(sanitized);
}

/**
 * Validates email and throws error if invalid
 *
 * @param email - Email to validate
 * @param allowDisposable - Whether to allow disposable emails
 * @throws EmailValidationError if invalid
 */
export function assertValidEmail(
  email: string,
  allowDisposable = false
): void {
  if (!email) {
    throw new EmailValidationError(
      'Email address is required',
      email,
      'EMPTY_EMAIL'
    );
  }

  const sanitized = sanitizeEmail(email);

  if (!isValidEmail(sanitized, true)) {
    throw new EmailValidationError(
      `Invalid email format: ${email}`,
      email,
      'INVALID_FORMAT'
    );
  }

  if (!allowDisposable && isDisposableEmail(sanitized)) {
    throw new EmailValidationError(
      `Disposable email addresses are not allowed: ${email}`,
      email,
      'DISPOSABLE_EMAIL'
    );
  }
}
