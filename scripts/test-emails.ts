#!/usr/bin/env npx tsx

/**
 * Email Template Testing Script
 *
 * This script allows you to test individual or all email templates
 * by sending them to a test email address.
 *
 * Usage:
 *   npm run email:test <template> [--to=email@example.com]
 *   npm run email:test:all [--to=email@example.com]
 *
 * Examples:
 *   npm run email:test support-confirmation
 *   npm run email:test welcome --to=myemail@example.com
 *   npm run email:test:all
 *
 * Environment Variables:
 *   TEST_EMAIL - Default email address for testing (optional)
 *   RESEND_API_KEY - Required for sending emails
 */

import {
  sendSupportConfirmation,
  sendSupportNotification,
  sendWelcome,
  sendOnboardingComplete,
  sendSubscriptionCreated,
  sendPaymentSuccessful,
  sendPaymentFailed,
  sendSubscriptionCancelled,
  sendTrialExpiring,
  // TODO: These will be added in future phases:
  // sendAiLimitWarning,
  // sendAiLimitReached,
  // sendNewsletterPublished,
} from '../src/emails/service/send';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

const log = {
  info: (msg: string) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  header: (msg: string) => console.log(`\n${colors.bright}${msg}${colors.reset}`),
  dim: (msg: string) => console.log(`${colors.gray}${msg}${colors.reset}`),
};

// Template test functions with realistic test data
const templates = {
  'support-confirmation': async (to: string) => {
    await sendSupportConfirmation({
      to,
      name: 'Test User',
      subject: 'Technical Issue - Unable to access personalized content',
      category: 'technical',
      message: 'This is a test support request message to verify email formatting and delivery. I am experiencing issues accessing the AI personalization features after upgrading my subscription.',
      referenceNumber: 'SUP-TEST-12345',
      expectedResponseTime: '24-48 hours',
    });
  },

  'support-notification': async (to: string) => {
    await sendSupportNotification({
      to,
      userEmail: 'testuser@example.com',
      userName: 'Test User',
      userTier: 'Professional',
      subject: 'Technical Issue - Unable to access personalized content',
      category: 'technical',
      message: 'Test support request from automated testing script. User reports issues with AI personalization features.',
      referenceNumber: 'SUP-TEST-12345',
      userId: 'test-user-123',
    });
  },

  'welcome': async (to: string) => {
    await sendWelcome({
      to,
      name: 'Test User',
    });
  },

  'onboarding-complete': async (to: string) => {
    await sendOnboardingComplete({
      to,
      name: 'Test User',
      preferences: {
        topics: ['Rate Changes', 'Market Updates', 'Loan Programs'],
        frequency: 'weekly',
      },
      nextSteps: [
        {
          title: 'Explore Your Dashboard',
          description: 'Check out your personalized insights',
          url: 'https://app.example.com/dashboard',
        },
        {
          title: 'Chat with AI',
          description: 'Ask questions about any article',
          url: 'https://app.example.com/chat',
        },
      ],
    });
  },

  'subscription-created': async (to: string) => {
    await sendSubscriptionCreated({
      to,
      name: 'Test User',
      planName: 'Professional Plan',
      price: 2999, // Price in cents
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      features: ['AI Chat', 'Priority Support', 'Advanced Analytics'],
    });
  },

  'payment-successful': async (to: string) => {
    await sendPaymentSuccessful({
      to,
      name: 'Test User',
      amount: 2999, // Amount in cents
      invoiceUrl: 'https://invoice.stripe.com/i/test',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      receiptNumber: 'RCPT-TEST-12345',
    });
  },

  'payment-failed': async (to: string) => {
    await sendPaymentFailed({
      to,
      name: 'Test User',
      amount: 2999, // Amount in cents
      attemptCount: 1,
      nextRetryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      updatePaymentUrl: 'https://app.example.com/billing',
    });
  },

  'subscription-cancelled': async (to: string) => {
    await sendSubscriptionCancelled({
      to,
      name: 'Test User',
      planName: 'Professional Plan',
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      feedback: true,
    });
  },

  'trial-expiring': async (to: string) => {
    await sendTrialExpiring({
      to,
      name: 'Test User',
      daysRemaining: 3,
      trialEndDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      upgradeUrl: 'https://app.example.com/upgrade',
    });
  },

  // TODO: Phase 2 - AI Usage emails
  // 'ai-limit-warning': async (to: string) => {
  //   await sendAiLimitWarning({
  //     to,
  //     name: 'Test User',
  //     currentUsage: 8,
  //     limit: 10,
  //     resetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  //     upgradeUrl: 'https://app.example.com/upgrade',
  //   });
  // },

  // 'ai-limit-reached': async (to: string) => {
  //   await sendAiLimitReached({
  //     to,
  //     name: 'Test User',
  //     limit: 10,
  //     resetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  //     upgradeUrl: 'https://app.example.com/upgrade',
  //   });
  // },

  // TODO: Phase 3 - Newsletter emails
  // 'newsletter-published': async (to: string) => {
  //   await sendNewsletterPublished({
  //     to,
  //     name: 'Test User',
  //     newsletterTitle: 'TrueTone Insights - Week of October 21, 2025',
  //     newsletterUrl: 'https://app.example.com/newsletter/test-uuid',
  //     publishDate: new Date(),
  //     articleCount: 4,
  //     highlights: [
  //       'Fed Cuts Rates: What This Means for Your Clients',
  //       'New FHA Loan Limits Give First-Time Buyers a Boost',
  //       'Mortgage Credit Scores Just Got Easier with FICO 10T',
  //     ],
  //   });
  // },
};

type TemplateName = keyof typeof templates;

/**
 * Display usage information
 */
function showUsage() {
  log.header('📧 Email Template Testing Script');
  console.log('\nUsage:');
  console.log('  npm run email:test <template> [--to=email@example.com]');
  console.log('  npm run email:test:all [--to=email@example.com]');

  console.log('\nAvailable templates:');
  Object.keys(templates).forEach(t => {
    console.log(`  ${colors.cyan}•${colors.reset} ${t}`);
  });

  console.log('\nExamples:');
  log.dim('  npm run email:test support-confirmation');
  log.dim('  npm run email:test welcome --to=myemail@example.com');
  log.dim('  npm run email:test:all');

  console.log('\nEnvironment Variables:');
  console.log(`  TEST_EMAIL      Default test email (current: ${process.env.TEST_EMAIL || 'not set'})`);
  console.log(`  RESEND_API_KEY  Required for sending (current: ${process.env.RESEND_API_KEY ? 'set' : colors.red + 'NOT SET' + colors.reset})`);
}

/**
 * Check if required environment variables are set
 */
function checkEnvironment(): boolean {
  if (!process.env.RESEND_API_KEY) {
    log.error('RESEND_API_KEY environment variable is not set');
    log.warning('Please add RESEND_API_KEY to your .env file');
    return false;
  }
  return true;
}

/**
 * Send a single email template
 */
async function sendTemplate(templateName: TemplateName, to: string): Promise<boolean> {
  try {
    const templateFn = templates[templateName];
    if (!templateFn) {
      log.error(`Template "${templateName}" not found`);
      return false;
    }

    log.info(`Sending ${colors.bright}${templateName}${colors.reset} to ${colors.bright}${to}${colors.reset}...`);
    await templateFn(to);
    log.success(`${templateName} sent successfully`);
    return true;
  } catch (error) {
    log.error(`Failed to send ${templateName}`);
    if (error instanceof Error) {
      log.dim(`  Error: ${error.message}`);
    }
    return false;
  }
}

/**
 * Send all email templates
 */
async function sendAllTemplates(to: string) {
  log.header('📨 Testing All Email Templates');
  log.info(`Recipient: ${colors.bright}${to}${colors.reset}\n`);

  const results: { template: string; success: boolean }[] = [];

  for (const [name, fn] of Object.entries(templates)) {
    const success = await sendTemplate(name as TemplateName, to);
    results.push({ template: name, success });

    // Add a small delay between emails to avoid rate limiting
    if (Object.keys(templates).indexOf(name) < Object.keys(templates).length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Summary
  console.log('\n' + '─'.repeat(50));
  log.header('Summary');

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`${colors.green}Successful:${colors.reset} ${successful}`);
  if (failed > 0) {
    console.log(`${colors.red}Failed:${colors.reset} ${failed}`);
    console.log('\nFailed templates:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  ${colors.red}✗${colors.reset} ${r.template}`);
    });
  }

  console.log('─'.repeat(50) + '\n');
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  // Show usage if no arguments
  if (args.length === 0) {
    showUsage();
    process.exit(0);
  }

  // Check environment
  if (!checkEnvironment()) {
    process.exit(1);
  }

  // Parse arguments
  const templateArg = args[0];
  const toArg = args.find(arg => arg.startsWith('--to='))?.split('=')[1];
  const testEmail = toArg || process.env.TEST_EMAIL || 'test@example.com';

  // Handle 'all' special case
  if (templateArg === 'all') {
    await sendAllTemplates(testEmail);
    process.exit(0);
  }

  // Validate template name
  if (!templates[templateArg as TemplateName]) {
    log.error(`Template "${templateArg}" not found`);
    console.log('\nAvailable templates:');
    Object.keys(templates).forEach(t => {
      console.log(`  ${colors.cyan}•${colors.reset} ${t}`);
    });
    process.exit(1);
  }

  // Send single template
  log.header('📧 Email Template Test');
  const success = await sendTemplate(templateArg as TemplateName, testEmail);

  if (!success) {
    process.exit(1);
  }

  log.success('Test completed successfully\n');
}

// Run the script
main().catch((error) => {
  log.error('Unexpected error occurred');
  console.error(error);
  process.exit(1);
});
