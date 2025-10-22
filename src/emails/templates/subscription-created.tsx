/**
 * Subscription Created Email Template
 *
 * Sent when a user creates/upgrades to a paid subscription.
 * Shows plan details, features unlocked, and billing information.
 */

import { Heading, Text, Hr } from '@react-email/components';
import { EmailLayout } from './_components/EmailLayout';
import { EmailHeader } from './_components/EmailHeader';
import { EmailFooter } from './_components/EmailFooter';
import { EmailSection } from './_components/EmailSection';
import { EmailButton } from './_components/EmailButton';

export interface SubscriptionCreatedEmailProps {
  name: string;
  planName: string;
  price: number;
  currency?: string;
  nextBillingDate: Date;
  features?: string[];
  manageBillingUrl?: string;
}

export function SubscriptionCreatedEmail({
  name,
  planName,
  price,
  currency = 'USD',
  nextBillingDate,
  features,
  manageBillingUrl,
}: SubscriptionCreatedEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://truetone.ai';
  const billingUrl = manageBillingUrl || `${baseUrl}/billing`;

  // Format price
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price / 100); // Assuming price is in cents

  // Format billing date
  const formattedBillingDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(nextBillingDate);

  // Default features if not provided
  const defaultFeatures: Record<string, string[]> = {
    Starter: [
      'Weekly personalized newsletters',
      'AI-powered content customization',
      'Copy-ready marketing scripts',
      'Email and social media templates',
      'Industry trend analysis',
    ],
    Pro: [
      'Everything in Starter, plus:',
      'Unlimited AI chat interactions',
      'Advanced personalization options',
      'Priority email support',
      'Early access to new features',
      'Custom branding options',
    ],
    Enterprise: [
      'Everything in Pro, plus:',
      'Dedicated account manager',
      'Custom integration support',
      'White-label options',
      'Advanced analytics dashboard',
      'SLA guarantee',
    ],
  };

  const featureList = features || defaultFeatures[planName] || defaultFeatures.Starter;

  return (
    <EmailLayout
      preview={`Welcome to ${planName}! Your subscription is active - ${formattedPrice}/month`}
    >
      <EmailHeader
        title="Thank You! 🎉"
        subtitle={`Your ${planName} subscription is now active`}
      />

      <EmailSection>
        <Text style={greetingStyle}>Hi {name},</Text>

        <Text style={paragraphStyle}>
          Thank you for subscribing to <strong>TrueTone Insights {planName}</strong>! We're excited to support your growth with premium features and personalized content.
        </Text>

        {/* Plan Details Card */}
        <div style={planCardStyle}>
          <div style={planHeaderStyle}>
            <Text style={planNameStyle}>{planName} Plan</Text>
            <Text style={planPriceStyle}>{formattedPrice}/month</Text>
          </div>

          <Hr style={planHrStyle} />

          <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
            <tr>
              <td style={planDetailLabelStyle}>Status:</td>
              <td style={planDetailValueStyle}>
                <span style={activeBadgeStyle}>Active</span>
              </td>
            </tr>
            <tr>
              <td style={planDetailLabelStyle}>Next Billing Date:</td>
              <td style={planDetailValueStyle}>{formattedBillingDate}</td>
            </tr>
            <tr>
              <td style={planDetailLabelStyle}>Amount:</td>
              <td style={planDetailValueStyle}>{formattedPrice}</td>
            </tr>
          </table>
        </div>

        <Hr style={hrStyle} />

        {/* Features Unlocked */}
        <Text style={sectionHeadingStyle}>What's Included:</Text>

        <div style={featuresBoxStyle}>
          {featureList.map((feature, index) => (
            <div key={index} style={featureItemStyle}>
              <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
                <tr>
                  <td style={featureIconCellStyle}>
                    <span style={featureIconStyle}>✓</span>
                  </td>
                  <td>
                    <Text style={featureTextStyle}>{feature}</Text>
                  </td>
                </tr>
              </table>
            </div>
          ))}
        </div>

        <Hr style={hrStyle} />

        {/* Next Steps */}
        <Text style={sectionHeadingStyle}>Get the Most from Your Subscription:</Text>

        <div style={tipsBoxStyle}>
          <div style={tipItemStyle}>
            <Text style={tipNumberStyle}>1</Text>
            <div>
              <Text style={tipTitleStyle}>Complete Your Profile</Text>
              <Text style={tipDescriptionStyle}>
                Set your preferences for maximum personalization
              </Text>
            </div>
          </div>

          <div style={tipItemStyle}>
            <Text style={tipNumberStyle}>2</Text>
            <div>
              <Text style={tipTitleStyle}>Explore AI Features</Text>
              <Text style={tipDescriptionStyle}>
                Chat with our AI to customize content to your voice
              </Text>
            </div>
          </div>

          <div style={tipItemStyle}>
            <Text style={tipNumberStyle}>3</Text>
            <div>
              <Text style={tipTitleStyle}>Share Your Content</Text>
              <Text style={tipDescriptionStyle}>
                Start engaging your clients with ready-to-use scripts
              </Text>
            </div>
          </div>
        </div>

        {/* Manage Billing CTA */}
        <div style={ctaContainerStyle}>
          <EmailButton href={billingUrl}>Manage Billing & Subscription</EmailButton>
        </div>

        {/* Receipt Note */}
        <div style={receiptBoxStyle}>
          <Text style={receiptTextStyle}>
            📧 <strong>Receipt:</strong> A payment receipt has been sent to your email. You can also view your invoices and billing history in your{' '}
            <a href={billingUrl} style={linkStyle}>
              account settings
            </a>
            .
          </Text>
        </div>

        <Hr style={hrStyle} />

        {/* Support */}
        <Text style={supportTextStyle}>
          Questions about your subscription? We're here to help! Reply to this email or contact our support team anytime.
        </Text>

        <Text style={signatureStyle}>
          Thank you for choosing TrueTone Insights,
          <br />
          <strong>The TrueTone Team</strong>
        </Text>
      </EmailSection>

      <EmailFooter />
    </EmailLayout>
  );
}

// Export as default for dynamic imports
export default SubscriptionCreatedEmail;

// Styles
const greetingStyle = {
  color: '#2C2A4A',
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '1.4',
  margin: '0 0 16px 0',
};

const paragraphStyle = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 24px 0',
};

const planCardStyle = {
  backgroundColor: '#ffffff',
  border: '2px solid #4F518C',
  borderRadius: '12px',
  overflow: 'hidden',
  margin: '24px 0',
};

const planHeaderStyle = {
  background: 'linear-gradient(135deg, #4F518C 0%, #2C2A4A 100%)',
  padding: '24px',
  textAlign: 'center' as const,
};

const planNameStyle = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 8px 0',
};

const planPriceStyle = {
  color: '#DABFFF',
  fontSize: '32px',
  fontWeight: '700',
  margin: 0,
};

const planHrStyle = {
  borderColor: '#e6ebf1',
  margin: 0,
};

const planDetailLabelStyle = {
  color: '#8898aa',
  fontSize: '14px',
  fontWeight: '500',
  padding: '12px 24px',
  verticalAlign: 'top',
  width: '160px',
};

const planDetailValueStyle = {
  color: '#2C2A4A',
  fontSize: '14px',
  fontWeight: '600',
  padding: '12px 24px 12px 0',
};

const activeBadgeStyle = {
  backgroundColor: '#d4edda',
  borderRadius: '12px',
  color: '#155724',
  display: 'inline-block',
  fontSize: '12px',
  fontWeight: '600',
  padding: '4px 12px',
};

const hrStyle = {
  borderColor: '#e6ebf1',
  margin: '32px 0',
};

const sectionHeadingStyle = {
  color: '#2C2A4A',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 16px 0',
};

const featuresBoxStyle = {
  backgroundColor: '#f6f9fc',
  borderRadius: '8px',
  padding: '20px',
  margin: '0 0 24px 0',
};

const featureItemStyle = {
  marginBottom: '12px',
};

const featureIconCellStyle = {
  paddingRight: '12px',
  verticalAlign: 'top',
  width: '24px',
};

const featureIconStyle = {
  color: '#4F518C',
  fontSize: '18px',
  fontWeight: '700',
};

const featureTextStyle = {
  color: '#525f7f',
  fontSize: '15px',
  lineHeight: '1.5',
  margin: 0,
};

const tipsBoxStyle = {
  margin: '0 0 32px 0',
};

const tipItemStyle = {
  alignItems: 'flex-start',
  display: 'flex',
  marginBottom: '20px',
};

const tipNumberStyle = {
  backgroundColor: '#4F518C',
  borderRadius: '50%',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '700',
  height: '32px',
  lineHeight: '32px',
  marginRight: '16px',
  minWidth: '32px',
  textAlign: 'center' as const,
  width: '32px',
};

const tipTitleStyle = {
  color: '#2C2A4A',
  fontSize: '15px',
  fontWeight: '600',
  margin: '0 0 4px 0',
};

const tipDescriptionStyle = {
  color: '#525f7f',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: 0,
};

const ctaContainerStyle = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const receiptBoxStyle = {
  backgroundColor: '#f0f7ff',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
};

const receiptTextStyle = {
  color: '#525f7f',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: 0,
};

const linkStyle = {
  color: '#4F518C',
  textDecoration: 'underline',
};

const supportTextStyle = {
  color: '#525f7f',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 24px 0',
};

const signatureStyle = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '24px 0 0 0',
};
