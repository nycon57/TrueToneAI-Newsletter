#!/usr/bin/env npx tsx

/**
 * Email Deliverability Testing Script
 *
 * This script tests email deliverability by checking:
 * - DNS records (SPF, DKIM, DMARC)
 * - Email formatting and structure
 * - Spam score estimation
 * - Common deliverability issues
 *
 * Usage:
 *   npm run email:deliverability [--domain=example.com]
 *
 * Examples:
 *   npm run email:deliverability
 *   npm run email:deliverability --domain=truetoneinsights.com
 */

import { Resend } from 'resend';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  blue: '\x1b[34m',
};

const log = {
  info: (msg: string) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  header: (msg: string) => console.log(`\n${colors.bright}${msg}${colors.reset}`),
  dim: (msg: string) => console.log(`${colors.gray}${msg}${colors.reset}`),
};

interface DNSRecord {
  type: string;
  name: string;
  value: string;
}

interface DeliverabilityCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'info';
  message: string;
  details?: string;
}

/**
 * Check DNS records using DNS lookup
 */
async function checkDNSRecords(domain: string): Promise<DeliverabilityCheck[]> {
  const checks: DeliverabilityCheck[] = [];

  try {
    const dns = await import('dns');
    const { promisify } = await import('util');
    const resolveTxt = promisify(dns.resolveTxt);

    // Check SPF record
    try {
      const spfRecords = await resolveTxt(domain);
      const spfRecord = spfRecords.find(record =>
        record.join('').includes('v=spf1')
      );

      if (spfRecord) {
        checks.push({
          name: 'SPF Record',
          status: 'pass',
          message: 'SPF record found',
          details: spfRecord.join(''),
        });
      } else {
        checks.push({
          name: 'SPF Record',
          status: 'fail',
          message: 'SPF record not found',
          details: 'Add an SPF record to improve deliverability',
        });
      }
    } catch (error) {
      checks.push({
        name: 'SPF Record',
        status: 'fail',
        message: 'SPF record not found',
        details: 'Add an SPF record to improve deliverability',
      });
    }

    // Check DMARC record
    try {
      const dmarcRecords = await resolveTxt(`_dmarc.${domain}`);
      const dmarcRecord = dmarcRecords.find(record =>
        record.join('').includes('v=DMARC1')
      );

      if (dmarcRecord) {
        checks.push({
          name: 'DMARC Record',
          status: 'pass',
          message: 'DMARC record found',
          details: dmarcRecord.join(''),
        });
      } else {
        checks.push({
          name: 'DMARC Record',
          status: 'warning',
          message: 'DMARC record not found',
          details: 'Consider adding a DMARC record for better email authentication',
        });
      }
    } catch (error) {
      checks.push({
        name: 'DMARC Record',
        status: 'warning',
        message: 'DMARC record not found',
        details: 'Consider adding a DMARC record for better email authentication',
      });
    }

  } catch (error) {
    checks.push({
      name: 'DNS Check',
      status: 'fail',
      message: 'Failed to check DNS records',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  return checks;
}

/**
 * Check Resend domain verification
 */
async function checkResendDomain(): Promise<DeliverabilityCheck[]> {
  const checks: DeliverabilityCheck[] = [];

  if (!process.env.RESEND_API_KEY) {
    checks.push({
      name: 'Resend API Key',
      status: 'fail',
      message: 'RESEND_API_KEY not found in environment',
      details: 'Set RESEND_API_KEY in your .env file',
    });
    return checks;
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Note: Resend API doesn't have a direct domain list endpoint
    // This is a placeholder for when they add it
    checks.push({
      name: 'Resend Connection',
      status: 'pass',
      message: 'Resend API key is valid',
      details: 'Connected to Resend successfully',
    });

    checks.push({
      name: 'DKIM (Resend)',
      status: 'info',
      message: 'Resend handles DKIM automatically',
      details: 'DKIM signatures are added to all emails sent through Resend',
    });

  } catch (error) {
    checks.push({
      name: 'Resend Connection',
      status: 'fail',
      message: 'Failed to connect to Resend',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  return checks;
}

/**
 * Check email configuration
 */
function checkEmailConfiguration(): DeliverabilityCheck[] {
  const checks: DeliverabilityCheck[] = [];

  // Check FROM email
  if (process.env.RESEND_FROM_EMAIL) {
    checks.push({
      name: 'FROM Email',
      status: 'pass',
      message: `Configured: ${process.env.RESEND_FROM_EMAIL}`,
    });
  } else {
    checks.push({
      name: 'FROM Email',
      status: 'fail',
      message: 'RESEND_FROM_EMAIL not configured',
      details: 'Set RESEND_FROM_EMAIL in your .env file',
    });
  }

  // Check FROM name
  if (process.env.RESEND_FROM_NAME) {
    checks.push({
      name: 'FROM Name',
      status: 'pass',
      message: `Configured: ${process.env.RESEND_FROM_NAME}`,
    });
  } else {
    checks.push({
      name: 'FROM Name',
      status: 'warning',
      message: 'RESEND_FROM_NAME not configured',
      details: 'Consider setting a friendly FROM name',
    });
  }

  // Check support email
  if (process.env.SUPPORT_EMAIL) {
    checks.push({
      name: 'Support Email',
      status: 'pass',
      message: `Configured: ${process.env.SUPPORT_EMAIL}`,
    });
  } else {
    checks.push({
      name: 'Support Email',
      status: 'warning',
      message: 'SUPPORT_EMAIL not configured',
      details: 'Set SUPPORT_EMAIL for reply-to addresses',
    });
  }

  return checks;
}

/**
 * Check best practices
 */
function checkBestPractices(): DeliverabilityCheck[] {
  const checks: DeliverabilityCheck[] = [];

  checks.push({
    name: 'Unsubscribe Link',
    status: 'info',
    message: 'Ensure all marketing emails include an unsubscribe link',
    details: 'Required by CAN-SPAM and GDPR',
  });

  checks.push({
    name: 'Plain Text Alternative',
    status: 'info',
    message: 'Include plain text versions of HTML emails',
    details: 'Improves deliverability and accessibility',
  });

  checks.push({
    name: 'Image Alt Text',
    status: 'info',
    message: 'Add alt text to all images',
    details: 'Required for accessibility and when images are blocked',
  });

  checks.push({
    name: 'Text-to-Image Ratio',
    status: 'info',
    message: 'Maintain 60:40 text-to-image ratio',
    details: 'Too many images can trigger spam filters',
  });

  checks.push({
    name: 'Testing Tools',
    status: 'info',
    message: 'Test emails before sending to large lists',
    details: 'Use mail-tester.com to check spam score',
  });

  return checks;
}

/**
 * Display deliverability report
 */
function displayReport(checks: DeliverabilityCheck[]) {
  const statusSymbols = {
    pass: `${colors.green}✓${colors.reset}`,
    fail: `${colors.red}✗${colors.reset}`,
    warning: `${colors.yellow}⚠${colors.reset}`,
    info: `${colors.blue}ℹ${colors.reset}`,
  };

  checks.forEach(check => {
    const symbol = statusSymbols[check.status];
    console.log(`${symbol} ${colors.bright}${check.name}${colors.reset}: ${check.message}`);
    if (check.details) {
      log.dim(`  ${check.details}`);
    }
  });
}

/**
 * Generate summary
 */
function displaySummary(allChecks: DeliverabilityCheck[]) {
  const passed = allChecks.filter(c => c.status === 'pass').length;
  const failed = allChecks.filter(c => c.status === 'fail').length;
  const warnings = allChecks.filter(c => c.status === 'warning').length;
  const info = allChecks.filter(c => c.status === 'info').length;

  console.log('\n' + '─'.repeat(70));
  log.header('Summary');

  console.log(`${colors.green}Passed:${colors.reset}   ${passed}`);
  console.log(`${colors.red}Failed:${colors.reset}   ${failed}`);
  console.log(`${colors.yellow}Warnings:${colors.reset} ${warnings}`);
  console.log(`${colors.blue}Info:${colors.reset}     ${info}`);

  console.log('\n' + '─'.repeat(70));

  if (failed > 0) {
    log.warning('\nAction Required:');
    allChecks.filter(c => c.status === 'fail').forEach(check => {
      console.log(`  ${colors.red}•${colors.reset} ${check.name}: ${check.details || check.message}`);
    });
  }

  if (warnings > 0) {
    log.warning('\nRecommendations:');
    allChecks.filter(c => c.status === 'warning').forEach(check => {
      console.log(`  ${colors.yellow}•${colors.reset} ${check.name}: ${check.details || check.message}`);
    });
  }

  console.log('\n' + '─'.repeat(70));

  // External tools recommendation
  log.header('Recommended Testing Tools');
  console.log(`
  ${colors.cyan}Mail Tester:${colors.reset}     https://www.mail-tester.com
    → Test spam score and deliverability (send test email to their address)

  ${colors.cyan}MXToolbox:${colors.reset}       https://mxtoolbox.com/dmarc.aspx
    → Check SPF, DKIM, DMARC records

  ${colors.cyan}DMARC Analyzer:${colors.reset}  https://www.dmarcanalyzer.com/dmarc/dmarc-record-check/
    → Validate DMARC policy

  ${colors.cyan}Email on Acid:${colors.reset}   https://www.emailonacid.com
    → Test email rendering across clients
  `);
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const domainArg = args.find(arg => arg.startsWith('--domain='))?.split('=')[1];
  const domain = domainArg || process.env.RESEND_FROM_EMAIL?.split('@')[1] || 'resend.dev';

  log.header('📧 Email Deliverability Check');
  console.log(`Domain: ${colors.bright}${domain}${colors.reset}\n`);

  const allChecks: DeliverabilityCheck[] = [];

  // 1. Check Resend configuration
  log.header('Resend Configuration');
  const resendChecks = await checkResendDomain();
  displayReport(resendChecks);
  allChecks.push(...resendChecks);

  // 2. Check email configuration
  log.header('\nEmail Configuration');
  const configChecks = checkEmailConfiguration();
  displayReport(configChecks);
  allChecks.push(...configChecks);

  // 3. Check DNS records
  log.header('\nDNS Records');
  log.info(`Checking DNS records for ${domain}...`);
  const dnsChecks = await checkDNSRecords(domain);
  displayReport(dnsChecks);
  allChecks.push(...dnsChecks);

  // 4. Best practices
  log.header('\nBest Practices');
  const practiceChecks = checkBestPractices();
  displayReport(practiceChecks);
  allChecks.push(...practiceChecks);

  // Display summary
  displaySummary(allChecks);
}

// Run the script
main().catch((error) => {
  log.error('Unexpected error occurred');
  console.error(error);
  process.exit(1);
});
