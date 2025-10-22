/**
 * Email Templates Index
 *
 * Central export point for all email templates.
 * Templates are exported with both named and default exports for flexibility.
 */

// Support Templates
export { SupportConfirmationEmail } from './support-confirmation';
export type { SupportConfirmationEmailProps } from './support-confirmation';

export { SupportNotificationEmail } from './support-notification';
export type { SupportNotificationEmailProps } from './support-notification';

// Onboarding Templates
export { WelcomeEmail } from './welcome';
export type { WelcomeEmailProps } from './welcome';

// Subscription Templates
export { SubscriptionCreatedEmail } from './subscription-created';
export type { SubscriptionCreatedEmailProps } from './subscription-created';
