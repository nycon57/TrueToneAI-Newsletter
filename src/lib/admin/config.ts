/**
 * Admin Email Configuration
 *
 * This module provides functions to retrieve admin email addresses
 * for sending article review notifications, reminders, and updates.
 *
 * Configuration:
 * Set the ADMIN_EMAILS environment variable with comma-separated email addresses:
 * ADMIN_EMAILS="admin1@example.com,admin2@example.com,admin3@example.com"
 */

/**
 * Get list of admin email addresses from environment variable
 * Falls back to an empty array if not configured
 */
export function getAdminEmails(): string[] {
  const adminEmailsEnv = process.env.ADMIN_EMAILS;

  if (!adminEmailsEnv) {
    console.warn(
      "ADMIN_EMAILS environment variable not set. Admin notifications will not be sent."
    );
    return [];
  }

  // Split by comma and trim whitespace
  const emails = adminEmailsEnv
    .split(",")
    .map((email) => email.trim())
    .filter((email) => email.length > 0);

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validEmails = emails.filter((email) => {
    if (!emailRegex.test(email)) {
      console.warn(`Invalid email address in ADMIN_EMAILS: ${email}`);
      return false;
    }
    return true;
  });

  return validEmails;
}

/**
 * Check if admin email notifications are configured
 */
export function isAdminEmailConfigured(): boolean {
  return getAdminEmails().length > 0;
}

/**
 * Get the primary admin email (first in the list)
 * Useful for single recipient operations
 */
export function getPrimaryAdminEmail(): string | null {
  const emails = getAdminEmails();
  return emails.length > 0 ? emails[0] : null;
}
