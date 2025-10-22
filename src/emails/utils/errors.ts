/**
 * Email Service Error Classes
 *
 * Custom error classes for email validation, sending, and template rendering.
 * These provide better error handling and debugging throughout the email service.
 *
 * @module emails/utils/errors
 */

/**
 * Base error class for all email-related errors
 */
export class EmailError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly metadata?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'EmailError';
    Object.setPrototypeOf(this, EmailError.prototype);
  }

  /**
   * Converts the error to a JSON-serializable object
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      metadata: this.metadata,
      stack: this.stack,
    };
  }
}

/**
 * Error thrown when email validation fails
 */
export class EmailValidationError extends EmailError {
  constructor(
    message: string,
    public readonly email: string,
    public readonly validationCode:
      | 'INVALID_FORMAT'
      | 'DISPOSABLE_EMAIL'
      | 'EMPTY_EMAIL'
      | 'INVALID_DOMAIN'
      | 'INVALID_RECIPIENT'
      | 'MULTIPLE_RECIPIENTS_INVALID'
  ) {
    super(message, 'EMAIL_VALIDATION_ERROR', { email, validationCode });
    this.name = 'EmailValidationError';
    Object.setPrototypeOf(this, EmailValidationError.prototype);
  }
}

/**
 * Error thrown when email sending fails
 */
export class EmailSendError extends EmailError {
  constructor(
    message: string,
    public readonly sendCode:
      | 'API_ERROR'
      | 'RATE_LIMIT'
      | 'INVALID_CREDENTIALS'
      | 'NETWORK_ERROR'
      | 'UNKNOWN_ERROR'
      | 'RECIPIENT_ERROR'
      | 'SENDER_ERROR',
    metadata?: Record<string, unknown>
  ) {
    super(message, 'EMAIL_SEND_ERROR', { ...metadata, sendCode });
    this.name = 'EmailSendError';
    Object.setPrototypeOf(this, EmailSendError.prototype);
  }
}

/**
 * Error thrown when email template rendering fails
 */
export class TemplateRenderError extends EmailError {
  constructor(
    message: string,
    public readonly templateName: string,
    public readonly renderError?: Error
  ) {
    super(message, 'TEMPLATE_RENDER_ERROR', {
      templateName,
      originalError: renderError?.message,
      originalStack: renderError?.stack,
    });
    this.name = 'TemplateRenderError';
    Object.setPrototypeOf(this, TemplateRenderError.prototype);
  }
}

/**
 * Error thrown when required configuration is missing
 */
export class EmailConfigurationError extends EmailError {
  constructor(
    message: string,
    public readonly missingConfig: string[]
  ) {
    super(message, 'EMAIL_CONFIGURATION_ERROR', { missingConfig });
    this.name = 'EmailConfigurationError';
    Object.setPrototypeOf(this, EmailConfigurationError.prototype);
  }
}

/**
 * Error thrown when email queue operations fail
 */
export class EmailQueueError extends EmailError {
  constructor(
    message: string,
    public readonly queueCode:
      | 'QUEUE_FULL'
      | 'QUEUE_TIMEOUT'
      | 'INVALID_JOB'
      | 'QUEUE_ERROR',
    metadata?: Record<string, unknown>
  ) {
    super(message, 'EMAIL_QUEUE_ERROR', { ...metadata, queueCode });
    this.name = 'EmailQueueError';
    Object.setPrototypeOf(this, EmailQueueError.prototype);
  }
}

/**
 * Error thrown when unsubscribe operations fail
 */
export class UnsubscribeError extends EmailError {
  constructor(
    message: string,
    public readonly unsubscribeCode:
      | 'INVALID_TOKEN'
      | 'EXPIRED_TOKEN'
      | 'USER_NOT_FOUND'
      | 'ALREADY_UNSUBSCRIBED'
      | 'DATABASE_ERROR',
    metadata?: Record<string, unknown>
  ) {
    super(message, 'UNSUBSCRIBE_ERROR', { ...metadata, unsubscribeCode });
    this.name = 'UnsubscribeError';
    Object.setPrototypeOf(this, UnsubscribeError.prototype);
  }
}

/**
 * Type guard to check if an error is an EmailError
 */
export function isEmailError(error: unknown): error is EmailError {
  return error instanceof EmailError;
}

/**
 * Type guard to check if an error is an EmailValidationError
 */
export function isEmailValidationError(error: unknown): error is EmailValidationError {
  return error instanceof EmailValidationError;
}

/**
 * Type guard to check if an error is an EmailSendError
 */
export function isEmailSendError(error: unknown): error is EmailSendError {
  return error instanceof EmailSendError;
}

/**
 * Type guard to check if an error is a TemplateRenderError
 */
export function isTemplateRenderError(error: unknown): error is TemplateRenderError {
  return error instanceof TemplateRenderError;
}

/**
 * Formats an error for logging purposes
 *
 * @param error - Error to format
 * @returns Formatted error object for logging
 */
export function formatErrorForLogging(error: unknown): Record<string, unknown> {
  if (isEmailError(error)) {
    return error.toJSON();
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    error: String(error),
  };
}

/**
 * Safely extracts error message from any error type
 *
 * @param error - Error to extract message from
 * @returns Error message string
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Unknown error occurred';
}

/**
 * Wraps a function call with error handling, converting errors to EmailError types
 *
 * @param fn - Function to execute
 * @param errorMessage - Default error message if function fails
 * @param errorCode - Error code to use
 * @returns Result of function or throws EmailError
 */
export async function withEmailErrorHandling<T>(
  fn: () => Promise<T>,
  errorMessage: string,
  errorCode: string
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (isEmailError(error)) {
      throw error;
    }

    throw new EmailError(
      errorMessage,
      errorCode,
      {
        originalError: getErrorMessage(error),
      }
    );
  }
}

/**
 * Retry configuration for email operations
 */
export interface RetryConfig {
  maxAttempts: number;
  delayMs: number;
  backoffMultiplier: number;
}

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
};

/**
 * Executes a function with retry logic for transient errors
 *
 * @param fn - Async function to execute
 * @param config - Retry configuration
 * @returns Result of function execution
 * @throws Last error if all retries fail
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  let lastError: Error | undefined;
  let delay = config.delayMs;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on validation errors
      if (isEmailValidationError(error) || isEmailConfigurationError(error)) {
        throw error;
      }

      // Don't retry if it's the last attempt
      if (attempt === config.maxAttempts) {
        break;
      }

      // Log retry attempt
      console.warn(
        `[Email Service] Attempt ${attempt}/${config.maxAttempts} failed. Retrying in ${delay}ms...`,
        formatErrorForLogging(error)
      );

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Increase delay for next attempt
      delay *= config.backoffMultiplier;
    }
  }

  // All retries failed, throw the last error
  throw lastError || new Error('All retry attempts failed');
}

/**
 * Type guard to check if an error is an EmailConfigurationError
 */
function isEmailConfigurationError(error: unknown): error is EmailConfigurationError {
  return error instanceof EmailConfigurationError;
}
