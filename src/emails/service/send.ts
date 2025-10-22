/**
 * Email Sending Service
 *
 * Core email sending functions with retry logic, error handling, and logging.
 * All email templates are rendered and sent through this service.
 *
 * @module emails/service/send
 */

import { render } from '@react-email/render';
import { resend, EMAIL_CONFIG, getFromAddress } from './resend';
import { EMAIL_TEMPLATES, type EmailTemplate } from './templates';
import type { ReactElement } from 'react';
import {
  EmailSendError,
  TemplateRenderError,
  withRetry,
  formatErrorForLogging,
} from '../utils/errors';
import { validateRecipients } from '../utils/validation';

/**
 * Base email sending options
 */
export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  template: ReactElement;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  tags?: Array<{ name: string; value: string }>;
  headers?: Record<string, string>;
}

/**
 * Email send result
 */
export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Core email sending function with error handling and retry logic
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  try {
    // Validate and sanitize email addresses
    const toEmails = validateRecipients(options.to);
    if (toEmails.length === 0) {
      throw new EmailSendError(
        'No valid recipient email addresses provided',
        'RECIPIENT_ERROR'
      );
    }

    // Render the React Email template to HTML with error handling
    let html: string;
    try {
      html = await render(options.template);
    } catch (error) {
      throw new TemplateRenderError(
        'Failed to render email template',
        'unknown',
        error instanceof Error ? error : undefined
      );
    }

    // Send email via Resend with retry logic
    const result = await withRetry(async () => {
      const { data, error } = await resend.emails.send({
        from: getFromAddress(),
        to: toEmails,
        subject: options.subject,
        html,
        cc: options.cc,
        bcc: options.bcc,
        replyTo: options.replyTo || EMAIL_CONFIG.replyTo,
        tags: options.tags,
        headers: options.headers,
      });

      if (error) {
        throw new EmailSendError(
          `Resend API error: ${error.message}`,
          'API_ERROR',
          { resendError: error }
        );
      }

      return data;
    });

    console.log('[Email Service] Email sent successfully:', result?.id);
    return { success: true, id: result?.id };

  } catch (error) {
    console.error('[Email Service] Failed to send email:', formatErrorForLogging(error));
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Subscription Created Email Data
 */
export interface SubscriptionCreatedData {
  to: string;
  name: string;
  planName: string;
  price: number;
  nextBillingDate: Date;
  features?: string[];
}

/**
 * Send subscription created email
 */
export async function sendSubscriptionCreated(
  data: SubscriptionCreatedData
): Promise<SendEmailResult> {
  try {
    // Import template dynamically to avoid circular dependencies
    const { SubscriptionCreatedEmail } = await import('../templates/subscription-created');

    return await sendEmail({
      to: data.to,
      subject: `Welcome to ${data.planName}! Your subscription is active`,
      template: SubscriptionCreatedEmail({
        name: data.name,
        planName: data.planName,
        price: data.price,
        nextBillingDate: data.nextBillingDate,
        features: data.features,
      }),
      tags: [
        { name: 'category', value: 'subscription' },
        { name: 'template', value: EMAIL_TEMPLATES.SUBSCRIPTION_CREATED },
      ],
    });
  } catch (error) {
    console.error('[Email Service] Error sending subscription created email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send subscription created email',
    };
  }
}

/**
 * Payment Successful Email Data
 */
export interface PaymentSuccessfulData {
  to: string;
  name: string;
  amount: number;
  invoiceUrl?: string | null;
  nextBillingDate?: Date | null;
  receiptNumber?: string;
}

/**
 * Send payment successful email
 */
export async function sendPaymentSuccessful(
  data: PaymentSuccessfulData
): Promise<SendEmailResult> {
  try {
    const { PaymentSuccessfulEmail } = await import('../templates/payment-successful');

    return await sendEmail({
      to: data.to,
      subject: 'Payment received - Thank you!',
      template: PaymentSuccessfulEmail({
        name: data.name,
        amount: data.amount,
        invoiceUrl: data.invoiceUrl,
        nextBillingDate: data.nextBillingDate,
        receiptNumber: data.receiptNumber,
      }),
      tags: [
        { name: 'category', value: 'billing' },
        { name: 'template', value: EMAIL_TEMPLATES.PAYMENT_SUCCESSFUL },
      ],
    });
  } catch (error) {
    console.error('[Email Service] Error sending payment successful email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send payment successful email',
    };
  }
}

/**
 * Payment Failed Email Data
 */
export interface PaymentFailedData {
  to: string;
  name: string;
  amount: number;
  attemptCount: number;
  nextRetryDate?: Date | null;
  updatePaymentUrl?: string;
}

/**
 * Send payment failed email
 */
export async function sendPaymentFailed(
  data: PaymentFailedData
): Promise<SendEmailResult> {
  try {
    const { PaymentFailedEmail } = await import('../templates/payment-failed');

    return await sendEmail({
      to: data.to,
      subject: 'Action required: Payment failed',
      template: PaymentFailedEmail({
        name: data.name,
        amount: data.amount,
        attemptCount: data.attemptCount,
        nextRetryDate: data.nextRetryDate,
        updatePaymentUrl: data.updatePaymentUrl,
      }),
      tags: [
        { name: 'category', value: 'billing' },
        { name: 'template', value: EMAIL_TEMPLATES.PAYMENT_FAILED },
      ],
    });
  } catch (error) {
    console.error('[Email Service] Error sending payment failed email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send payment failed email',
    };
  }
}

/**
 * Subscription Cancelled Email Data
 */
export interface SubscriptionCancelledData {
  to: string;
  name: string;
  endDate: Date;
  planName?: string;
  feedback?: boolean;
}

/**
 * Send subscription cancelled email
 */
export async function sendSubscriptionCancelled(
  data: SubscriptionCancelledData
): Promise<SendEmailResult> {
  try {
    const { SubscriptionCancelledEmail } = await import('../templates/subscription-cancelled');

    return await sendEmail({
      to: data.to,
      subject: 'Your subscription has been cancelled',
      template: SubscriptionCancelledEmail({
        name: data.name,
        endDate: data.endDate,
        planName: data.planName,
        feedback: data.feedback,
      }),
      tags: [
        { name: 'category', value: 'subscription' },
        { name: 'template', value: EMAIL_TEMPLATES.SUBSCRIPTION_CANCELLED },
      ],
    });
  } catch (error) {
    console.error('[Email Service] Error sending subscription cancelled email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send subscription cancelled email',
    };
  }
}

/**
 * Trial Expiring Email Data
 */
export interface TrialExpiringData {
  to: string;
  name: string;
  daysRemaining: number;
  trialEndDate: Date;
  upgradeUrl?: string;
}

/**
 * Send trial expiring email
 */
export async function sendTrialExpiring(
  data: TrialExpiringData
): Promise<SendEmailResult> {
  try {
    const { TrialExpiringEmail } = await import('../templates/trial-expiring');

    return await sendEmail({
      to: data.to,
      subject: `Your trial expires in ${data.daysRemaining} days`,
      template: TrialExpiringEmail({
        name: data.name,
        daysRemaining: data.daysRemaining,
        trialEndDate: data.trialEndDate,
        upgradeUrl: data.upgradeUrl,
      }),
      tags: [
        { name: 'category', value: 'subscription' },
        { name: 'template', value: EMAIL_TEMPLATES.TRIAL_EXPIRING },
      ],
    });
  } catch (error) {
    console.error('[Email Service] Error sending trial expiring email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send trial expiring email',
    };
  }
}

/**
 * Support Confirmation Email Data
 */
export interface SupportConfirmationData {
  to: string;
  name: string;
  referenceNumber: string;
  subject: string;
  message: string;
  category: string;
  expectedResponseTime?: string;
}

/**
 * Send support confirmation email to user
 */
export async function sendSupportConfirmation(
  data: SupportConfirmationData
): Promise<SendEmailResult> {
  try {
    const { SupportConfirmationEmail } = await import('../templates/support-confirmation');

    return await sendEmail({
      to: data.to,
      subject: `Support request received - ${data.referenceNumber}`,
      template: SupportConfirmationEmail({
        name: data.name,
        referenceNumber: data.referenceNumber,
        subject: data.subject,
        message: data.message,
        category: data.category,
        expectedResponseTime: data.expectedResponseTime || '24-48 hours',
      }),
      tags: [
        { name: 'category', value: 'support' },
        { name: 'template', value: EMAIL_TEMPLATES.SUPPORT_CONFIRMATION },
      ],
    });
  } catch (error) {
    console.error('[Email Service] Error sending support confirmation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send support confirmation email',
    };
  }
}

/**
 * Support Notification Email Data (sent to admin/support team)
 */
export interface SupportNotificationData {
  to: string;
  userName: string;
  userEmail: string;
  userTier?: string;
  referenceNumber: string;
  subject: string;
  category: string;
  message: string;
  attachments?: Array<{ name: string; url: string }>;
  userId?: string;
}

/**
 * Send support notification email to admin/support team
 */
export async function sendSupportNotification(
  data: SupportNotificationData
): Promise<SendEmailResult> {
  try {
    const { SupportNotificationEmail } = await import('../templates/support-notification');

    return await sendEmail({
      to: data.to,
      subject: `[Support] ${data.category} - ${data.referenceNumber}`,
      template: SupportNotificationEmail({
        userName: data.userName,
        userEmail: data.userEmail,
        userTier: data.userTier,
        referenceNumber: data.referenceNumber,
        subject: data.subject,
        category: data.category,
        message: data.message,
        attachments: data.attachments,
        userId: data.userId,
      }),
      replyTo: data.userEmail,
      tags: [
        { name: 'category', value: 'support' },
        { name: 'template', value: EMAIL_TEMPLATES.SUPPORT_NOTIFICATION },
      ],
    });
  } catch (error) {
    console.error('[Email Service] Error sending support notification email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send support notification email',
    };
  }
}

/**
 * Welcome Email Data
 */
export interface WelcomeEmailData {
  to: string;
  name: string;
  quickStartSteps?: Array<{ title: string; description: string }>;
  onboardingUrl?: string;
}

/**
 * Send welcome email to new user
 */
export async function sendWelcome(
  data: WelcomeEmailData
): Promise<SendEmailResult> {
  try {
    const { WelcomeEmail } = await import('../templates/welcome');

    return await sendEmail({
      to: data.to,
      subject: 'Welcome to TrueTone Insights!',
      template: WelcomeEmail({
        name: data.name,
        quickStartSteps: data.quickStartSteps,
        onboardingUrl: data.onboardingUrl,
      }),
      tags: [
        { name: 'category', value: 'onboarding' },
        { name: 'template', value: EMAIL_TEMPLATES.WELCOME },
      ],
    });
  } catch (error) {
    console.error('[Email Service] Error sending welcome email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send welcome email',
    };
  }
}

/**
 * Onboarding Complete Email Data
 */
export interface OnboardingCompleteData {
  to: string;
  name: string;
  preferences?: {
    topics?: string[];
    frequency?: string;
  };
  nextSteps?: Array<{ title: string; description: string; url?: string }>;
}

/**
 * Send onboarding complete email
 */
export async function sendOnboardingComplete(
  data: OnboardingCompleteData
): Promise<SendEmailResult> {
  try {
    const { OnboardingCompleteEmail } = await import('../templates/onboarding-complete');

    return await sendEmail({
      to: data.to,
      subject: 'You\'re all set! Welcome to TrueTone Insights',
      template: OnboardingCompleteEmail({
        name: data.name,
        preferences: data.preferences,
        nextSteps: data.nextSteps,
      }),
      tags: [
        { name: 'category', value: 'onboarding' },
        { name: 'template', value: EMAIL_TEMPLATES.ONBOARDING_COMPLETE },
      ],
    });
  } catch (error) {
    console.error('[Email Service] Error sending onboarding complete email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send onboarding complete email',
    };
  }
}
