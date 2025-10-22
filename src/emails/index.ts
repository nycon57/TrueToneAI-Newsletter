/**
 * TrueTone Insights Email Service
 *
 * Main export file for the email service.
 * Import email functions, types, and utilities from this file.
 *
 * @example
 * ```typescript
 * import { sendWelcome, EMAIL_TEMPLATES } from '@/emails';
 *
 * const result = await sendWelcome({
 *   to: 'user@example.com',
 *   name: 'John Doe',
 * });
 * ```
 */

// Core sending functions
export {
  sendEmail,
  sendSupportConfirmation,
  sendSupportNotification,
  sendWelcome,
  sendOnboardingComplete,
  sendSubscriptionCreated,
  sendPaymentSuccessful,
  sendPaymentFailed,
  sendSubscriptionCancelled,
  sendTrialExpiring,
} from './service/send';

// Types for sending functions
export type {
  SendEmailOptions,
  SendEmailResult,
  SupportConfirmationData,
  SupportNotificationData,
  WelcomeEmailData,
  OnboardingCompleteData,
  SubscriptionCreatedData,
  PaymentSuccessfulData,
  PaymentFailedData,
  SubscriptionCancelledData,
  TrialExpiringData,
} from './service/send';

// Template registry
export {
  EMAIL_TEMPLATES,
  EMAIL_CATEGORIES,
  TEMPLATE_CATEGORIES,
  getTemplateCategory,
  isMarketingEmail,
} from './service/templates';

export type {
  EmailTemplate,
  EmailCategory,
} from './service/templates';

// Resend client and configuration
export {
  resend,
  EMAIL_CONFIG,
  getFromAddress,
  isResendConfigured,
} from './service/resend';

// Validation utilities
export {
  isValidEmail,
  sanitizeEmail,
  validateAndSanitizeEmail,
  validateRecipients,
  isDisposableEmail,
  getEmailDomain,
  validateEmailBatch,
  isValidProductionEmail,
  assertValidEmail,
} from './utils/validation';

// Error classes and utilities
export {
  EmailError,
  EmailValidationError,
  EmailSendError,
  TemplateRenderError,
  EmailConfigurationError,
  EmailQueueError,
  UnsubscribeError,
  isEmailError,
  isEmailValidationError,
  isEmailSendError,
  isTemplateRenderError,
  formatErrorForLogging,
  getErrorMessage,
  withEmailErrorHandling,
  withRetry,
  DEFAULT_RETRY_CONFIG,
} from './utils/errors';

export type {
  RetryConfig,
} from './utils/errors';
