/**
 * Manual Email Sending API
 *
 * POST endpoint for sending emails manually (testing/admin use).
 * Requires authentication and supports all email template types.
 *
 * Rate limited to prevent abuse.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import {
  sendWelcome,
  sendOnboardingComplete,
  sendSupportConfirmation,
  sendSupportNotification,
  sendSubscriptionCreated,
  sendPaymentSuccessful,
  sendPaymentFailed,
  sendSubscriptionCancelled,
  sendTrialExpiring,
  EMAIL_TEMPLATES,
} from '@/emails';

// Simple in-memory rate limiter (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute

/**
 * Check if request is rate limited
 */
function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  if (!userLimit || now > userLimit.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  userLimit.count++;
  return false;
}

/**
 * POST /api/email/send
 *
 * Send an email using a specific template
 *
 * @body template - Email template name from EMAIL_TEMPLATES
 * @body to - Recipient email address
 * @body data - Template-specific data object
 */
export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check rate limit
    if (isRateLimited(kindeUser.id)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { template, to, data } = body;

    // Validate required fields
    if (!template || !to || !data) {
      return NextResponse.json(
        { error: 'Missing required fields: template, to, and data are required' },
        { status: 400 }
      );
    }

    // Validate email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Send email based on template type
    let result;

    try {
      switch (template) {
        case EMAIL_TEMPLATES.WELCOME:
          result = await sendWelcome({
            to,
            name: data.name,
            quickStartSteps: data.quickStartSteps,
            onboardingUrl: data.onboardingUrl,
          });
          break;

        case EMAIL_TEMPLATES.ONBOARDING_COMPLETE:
          result = await sendOnboardingComplete({
            to,
            name: data.name,
            preferences: data.preferences,
            nextSteps: data.nextSteps,
          });
          break;

        case EMAIL_TEMPLATES.SUPPORT_CONFIRMATION:
          result = await sendSupportConfirmation({
            to,
            name: data.name,
            referenceNumber: data.referenceNumber,
            subject: data.subject,
            message: data.message,
            category: data.category,
            expectedResponseTime: data.expectedResponseTime,
          });
          break;

        case EMAIL_TEMPLATES.SUPPORT_NOTIFICATION:
          result = await sendSupportNotification({
            to,
            userName: data.userName,
            userEmail: data.userEmail,
            userTier: data.userTier,
            referenceNumber: data.referenceNumber,
            subject: data.subject,
            category: data.category,
            message: data.message,
            attachments: data.attachments,
            userId: data.userId,
          });
          break;

        case EMAIL_TEMPLATES.SUBSCRIPTION_CREATED:
          result = await sendSubscriptionCreated({
            to,
            name: data.name,
            planName: data.planName,
            price: data.price,
            nextBillingDate: new Date(data.nextBillingDate),
            features: data.features,
          });
          break;

        case EMAIL_TEMPLATES.PAYMENT_SUCCESSFUL:
          result = await sendPaymentSuccessful({
            to,
            name: data.name,
            amount: data.amount,
            invoiceUrl: data.invoiceUrl,
            nextBillingDate: data.nextBillingDate ? new Date(data.nextBillingDate) : null,
            receiptNumber: data.receiptNumber,
          });
          break;

        case EMAIL_TEMPLATES.PAYMENT_FAILED:
          result = await sendPaymentFailed({
            to,
            name: data.name,
            amount: data.amount,
            attemptCount: data.attemptCount,
            nextRetryDate: data.nextRetryDate ? new Date(data.nextRetryDate) : null,
            updatePaymentUrl: data.updatePaymentUrl,
          });
          break;

        case EMAIL_TEMPLATES.SUBSCRIPTION_CANCELLED:
          result = await sendSubscriptionCancelled({
            to,
            name: data.name,
            endDate: new Date(data.endDate),
            planName: data.planName,
            feedback: data.feedback,
          });
          break;

        case EMAIL_TEMPLATES.TRIAL_EXPIRING:
          result = await sendTrialExpiring({
            to,
            name: data.name,
            daysRemaining: data.daysRemaining,
            trialEndDate: new Date(data.trialEndDate),
            upgradeUrl: data.upgradeUrl,
          });
          break;

        default:
          return NextResponse.json(
            { error: `Unknown template: ${template}` },
            { status: 400 }
          );
      }

      if (!result.success) {
        throw new Error(result.error || 'Email sending failed');
      }

      console.log('[Email Send] Email sent successfully:', {
        template,
        to,
        messageId: result.id,
        userId: kindeUser.id,
      });

      return NextResponse.json({
        success: true,
        message: 'Email sent successfully',
        messageId: result.id,
        template,
      });

    } catch (sendError) {
      console.error('[Email Send] Error sending email:', sendError);
      return NextResponse.json(
        {
          error: 'Failed to send email',
          details: sendError instanceof Error ? sendError.message : 'Unknown error',
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('[Email Send] Error processing request:', error);
    return NextResponse.json(
      {
        error: 'Failed to process email request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
