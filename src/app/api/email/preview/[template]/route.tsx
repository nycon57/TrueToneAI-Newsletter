/**
 * Email Template Preview API
 *
 * GET endpoint to preview email templates in browser.
 * Useful for development and testing email designs.
 *
 * Usage: GET /api/email/preview/[template]?name=John&amount=100
 */

import { NextRequest, NextResponse } from 'next/server';
import { render } from '@react-email/render';
import { EMAIL_TEMPLATES } from '@/emails';

// Import all email templates
import { WelcomeEmail } from '@/emails/templates/welcome';
import { SupportConfirmationEmail } from '@/emails/templates/support-confirmation';
import { SupportNotificationEmail } from '@/emails/templates/support-notification';
import { SubscriptionCreatedEmail } from '@/emails/templates/subscription-created';
import { PaymentSuccessfulEmail } from '@/emails/templates/payment-successful';
import { PaymentFailedEmail } from '@/emails/templates/payment-failed';
import { SubscriptionCancelledEmail } from '@/emails/templates/subscription-cancelled';

/**
 * Sample data for each template type
 */
const getSampleData = (template: string, searchParams: URLSearchParams) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Allow overriding sample data with query params
  const getName = () => searchParams.get('name') || 'John Doe';
  const getEmail = () => searchParams.get('email') || 'user@example.com';

  switch (template) {
    case EMAIL_TEMPLATES.WELCOME:
      return {
        name: getName(),
        quickStartSteps: [
          {
            title: 'Complete Your Profile',
            description: 'Set your preferences to receive personalized content.',
          },
          {
            title: 'Explore Weekly Insights',
            description: 'Browse AI-curated mortgage industry news and trends.',
          },
          {
            title: 'Copy & Share Content',
            description: 'One-click copy scripts for video, email, and social media.',
          },
        ],
        onboardingUrl: `${baseUrl}/onboarding`,
      };

    case EMAIL_TEMPLATES.SUPPORT_CONFIRMATION:
      return {
        name: getName(),
        referenceNumber: searchParams.get('ref') || 'SUP-ABC123XYZ',
        subject: searchParams.get('subject') || 'Technical Issue',
        message: searchParams.get('message') || 'I\'m having trouble accessing my account.',
        category: searchParams.get('category') || 'technical',
        expectedResponseTime: searchParams.get('responseTime') || '24-48 hours',
      };

    case EMAIL_TEMPLATES.SUPPORT_NOTIFICATION:
      return {
        userName: getName(),
        userEmail: getEmail(),
        userTier: searchParams.get('tier') || 'premium',
        referenceNumber: searchParams.get('ref') || 'SUP-ABC123XYZ',
        subject: searchParams.get('subject') || 'Technical Issue',
        category: searchParams.get('category') || 'technical',
        message: searchParams.get('message') || 'I\'m having trouble accessing my account. Can you help?',
        attachments: searchParams.get('attachments')
          ? [{ name: 'screenshot.png', url: '#' }]
          : undefined,
        userId: searchParams.get('userId') || 'user_123',
      };

    case EMAIL_TEMPLATES.SUBSCRIPTION_CREATED:
      return {
        name: getName(),
        planName: searchParams.get('plan') || 'Professional Plan',
        price: parseFloat(searchParams.get('price') || '29.99'),
        nextBillingDate: new Date(
          searchParams.get('billingDate') || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        ),
        features: [
          'Unlimited AI personalization',
          'Premium newsletter templates',
          'Priority customer support',
          'Analytics dashboard',
        ],
      };

    case EMAIL_TEMPLATES.PAYMENT_SUCCESSFUL:
      return {
        name: getName(),
        amount: parseInt(searchParams.get('amount') || '2999'), // Amount in cents
        invoiceUrl: searchParams.get('invoiceUrl') || `${baseUrl}/billing/invoice/123`,
        nextBillingDate: new Date(
          searchParams.get('billingDate') || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        ),
        receiptNumber: searchParams.get('receipt') || 'REC-2024-001',
      };

    case EMAIL_TEMPLATES.PAYMENT_FAILED:
      return {
        name: getName(),
        amount: parseInt(searchParams.get('amount') || '2999'), // Amount in cents
        attemptCount: parseInt(searchParams.get('attempts') || '1'),
        nextRetryDate: new Date(
          searchParams.get('retryDate') || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        ),
        updatePaymentUrl: searchParams.get('updateUrl') || `${baseUrl}/billing/payment`,
      };

    case EMAIL_TEMPLATES.SUBSCRIPTION_CANCELLED:
      return {
        name: getName(),
        endDate: new Date(
          searchParams.get('endDate') || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        ),
        planName: searchParams.get('plan') || 'Professional Plan',
        feedback: searchParams.get('feedback') !== 'false', // Default to true
      };

    case EMAIL_TEMPLATES.TRIAL_EXPIRING:
      return {
        name: getName(),
        daysRemaining: parseInt(searchParams.get('days') || '3'),
        trialEndDate: new Date(
          searchParams.get('endDate') || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        ),
        upgradeUrl: searchParams.get('upgradeUrl') || `${baseUrl}/billing/upgrade`,
      };

    case EMAIL_TEMPLATES.ONBOARDING_COMPLETE:
      return {
        name: getName(),
        preferences: {
          topics: searchParams.get('topics')?.split(',') || ['Rate Changes', 'Market Updates', 'Loan Programs'],
          frequency: searchParams.get('frequency') || 'weekly',
        },
        nextSteps: [
          {
            title: 'Explore Your Dashboard',
            description: 'Check out your personalized insights',
            url: `${baseUrl}/dashboard`,
          },
          {
            title: 'Chat with AI',
            description: 'Ask questions about any article',
            url: `${baseUrl}/chat`,
          },
        ],
      };

    default:
      return null;
  }
};

/**
 * Render email template component based on template name
 */
const renderTemplate = (template: string, data: Record<string, unknown>) => {
  switch (template) {
    case EMAIL_TEMPLATES.WELCOME:
      return <WelcomeEmail {...data} />;

    case EMAIL_TEMPLATES.SUPPORT_CONFIRMATION:
      return <SupportConfirmationEmail {...data} />;

    case EMAIL_TEMPLATES.SUPPORT_NOTIFICATION:
      return <SupportNotificationEmail {...data} />;

    case EMAIL_TEMPLATES.SUBSCRIPTION_CREATED:
      return <SubscriptionCreatedEmail {...data} />;

    case EMAIL_TEMPLATES.PAYMENT_SUCCESSFUL:
      return <PaymentSuccessfulEmail {...data} />;

    case EMAIL_TEMPLATES.PAYMENT_FAILED:
      return <PaymentFailedEmail {...data} />;

    case EMAIL_TEMPLATES.SUBSCRIPTION_CANCELLED:
      return <SubscriptionCancelledEmail {...data} />;

    // Templates not yet implemented in preview
    case EMAIL_TEMPLATES.TRIAL_EXPIRING:
    case EMAIL_TEMPLATES.ONBOARDING_COMPLETE:
      return null;

    default:
      return null;
  }
};

/**
 * GET /api/email/preview/[template]
 *
 * Preview an email template with sample data
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { template: string } }
) {
  try {
    const template = params.template;
    const searchParams = req.nextUrl.searchParams;

    // Validate template exists
    const validTemplates = Object.values(EMAIL_TEMPLATES);
    if (!validTemplates.includes(template)) {
      // If invalid template, show list of available templates
      return new NextResponse(
        `
<!DOCTYPE html>
<html>
<head>
  <title>Email Templates Preview</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
      background: #f5f5f5;
    }
    h1 {
      color: #333;
      border-bottom: 2px solid #0066cc;
      padding-bottom: 10px;
    }
    .template-list {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .template-item {
      padding: 12px;
      margin: 8px 0;
      background: #f9f9f9;
      border-radius: 4px;
      border-left: 4px solid #0066cc;
    }
    .template-item a {
      color: #0066cc;
      text-decoration: none;
      font-weight: 500;
    }
    .template-item a:hover {
      text-decoration: underline;
    }
    .template-desc {
      color: #666;
      font-size: 14px;
      margin-top: 4px;
    }
    .query-params {
      background: #fff3cd;
      border: 1px solid #ffc107;
      padding: 12px;
      margin: 20px 0;
      border-radius: 4px;
    }
    code {
      background: #f4f4f4;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <h1>📧 Email Templates Preview</h1>

  <div class="query-params">
    <strong>💡 Tip:</strong> Add query parameters to customize preview data.<br>
    Example: <code>?name=John&email=john@example.com&amount=99.99</code>
  </div>

  <div class="template-list">
    <h2>Available Templates:</h2>

    <div class="template-item">
      <a href="/api/email/preview/${EMAIL_TEMPLATES.WELCOME}">Welcome Email</a>
      <div class="template-desc">Sent to new users after registration</div>
    </div>

    <div class="template-item">
      <a href="/api/email/preview/${EMAIL_TEMPLATES.SUPPORT_CONFIRMATION}">Support Confirmation</a>
      <div class="template-desc">Confirmation email sent to users when they submit a support request</div>
    </div>

    <div class="template-item">
      <a href="/api/email/preview/${EMAIL_TEMPLATES.SUPPORT_NOTIFICATION}">Support Notification (Admin)</a>
      <div class="template-desc">Notification email sent to support team for new requests</div>
    </div>

    <div class="template-item">
      <a href="/api/email/preview/${EMAIL_TEMPLATES.SUBSCRIPTION_CREATED}">Subscription Created</a>
      <div class="template-desc">Confirmation when user creates a new subscription</div>
    </div>

    <div class="template-item">
      <a href="/api/email/preview/${EMAIL_TEMPLATES.PAYMENT_SUCCESSFUL}">Payment Successful</a>
      <div class="template-desc">Receipt for successful payment</div>
    </div>

    <div class="template-item">
      <a href="/api/email/preview/${EMAIL_TEMPLATES.PAYMENT_FAILED}">Payment Failed</a>
      <div class="template-desc">Alert when payment fails</div>
    </div>

    <div class="template-item">
      <a href="/api/email/preview/${EMAIL_TEMPLATES.SUBSCRIPTION_CANCELLED}">Subscription Cancelled</a>
      <div class="template-desc">Confirmation when subscription is cancelled</div>
    </div>

    <div class="template-item">
      <a href="/api/email/preview/${EMAIL_TEMPLATES.TRIAL_EXPIRING}">Trial Expiring</a>
      <div class="template-desc">Reminder when trial period is ending</div>
    </div>

    <div class="template-item">
      <a href="/api/email/preview/${EMAIL_TEMPLATES.ONBOARDING_COMPLETE}">Onboarding Complete</a>
      <div class="template-desc">Confirmation when user completes onboarding</div>
    </div>
  </div>
</body>
</html>
        `,
        {
          status: 200,
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }

    // Get sample data for template
    const sampleData = getSampleData(template, searchParams);

    if (!sampleData) {
      return NextResponse.json(
        { error: 'Could not generate sample data for template' },
        { status: 500 }
      );
    }

    // Render template
    const templateComponent = renderTemplate(template, sampleData);

    if (!templateComponent) {
      return NextResponse.json(
        {
          error: 'Template not yet implemented',
          message: `The ${template} template exists but hasn't been implemented yet.`,
        },
        { status: 501 }
      );
    }

    // Render to HTML
    const html = await render(templateComponent);

    // Add navigation header
    const htmlWithNav = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Preview: ${template}</title>
  <style>
    .email-preview-nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #1a1a1a;
      color: white;
      padding: 12px 20px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    .email-preview-nav a {
      color: #4a9eff;
      text-decoration: none;
      margin-left: 20px;
    }
    .email-preview-nav a:hover {
      text-decoration: underline;
    }
    .email-preview-content {
      margin-top: 60px;
    }
  </style>
</head>
<body>
  <div class="email-preview-nav">
    📧 Email Preview: <strong>${template}</strong>
    <a href="/api/email/preview">← Back to templates</a>
  </div>
  <div class="email-preview-content">
    ${html}
  </div>
</body>
</html>
    `;

    return new NextResponse(htmlWithNav, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (error) {
    console.error('[Email Preview] Error rendering template:', error);
    return NextResponse.json(
      {
        error: 'Failed to render email template',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
