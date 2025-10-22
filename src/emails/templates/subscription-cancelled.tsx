/**
 * Subscription Cancelled Email Template
 *
 * Sent when a user cancels their subscription.
 * Shows cancellation details, access end date, and resubscribe option.
 */

import { Heading, Text, Hr } from '@react-email/components';
import { EmailLayout } from './_components/EmailLayout';
import { EmailHeader } from './_components/EmailHeader';
import { EmailFooter } from './_components/EmailFooter';
import { EmailSection } from './_components/EmailSection';
import { EmailButton } from './_components/EmailButton';

export interface SubscriptionCancelledEmailProps {
  name: string;
  planName?: string;
  endDate: Date;
  feedback?: boolean;
}

export function SubscriptionCancelledEmail({
  name,
  planName,
  endDate,
  feedback = true,
}: SubscriptionCancelledEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://truetone.ai';
  const resubscribeUrl = `${baseUrl}/billing`;
  const feedbackUrl = `${baseUrl}/feedback?reason=cancellation`;

  // Format end date
  const formattedEndDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(endDate);

  // Calculate days remaining
  const today = new Date();
  const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const hasImmediateAccess = daysRemaining > 0;

  return (
    <EmailLayout preview="Your subscription has been cancelled">
      <EmailHeader
        title="Subscription Cancelled"
        subtitle="We're sorry to see you go"
      />

      <EmailSection>
        <Text style={greetingStyle}>Hi {name},</Text>

        <Text style={paragraphStyle}>
          We've processed your request to cancel your {planName || 'TrueTone Insights'} subscription. We're sorry to see you go and hope you'll consider rejoining us in the future.
        </Text>

        {/* Cancellation Details Card */}
        <div style={cancelCardStyle}>
          <div style={cancelHeaderStyle}>
            <Text style={cancelTitleStyle}>Cancellation Confirmed</Text>
          </div>

          <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" style={cancelTableStyle}>
            <tr>
              <td style={detailLabelStyle}>Plan:</td>
              <td style={detailValueStyle}>{planName || 'TrueTone Insights'}</td>
            </tr>
            <tr>
              <td style={detailLabelStyle}>Cancelled On:</td>
              <td style={detailValueStyle}>
                {new Intl.DateTimeFormat('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                }).format(new Date())}
              </td>
            </tr>
            <tr>
              <td style={detailLabelStyle}>Access Ends:</td>
              <td style={detailValueStyle}>
                <strong>{formattedEndDate}</strong>
              </td>
            </tr>
            {hasImmediateAccess && (
              <tr>
                <td style={detailLabelStyle}>Days Remaining:</td>
                <td style={detailValueStyle}>
                  <span style={daysRemainingBadgeStyle}>{daysRemaining} days</span>
                </td>
              </tr>
            )}
          </table>
        </div>

        {/* What This Means */}
        <Text style={sectionHeadingStyle}>What This Means:</Text>

        <div style={infoBoxStyle}>
          {hasImmediateAccess ? (
            <>
              <Text style={infoItemStyle}>
                ✓ You'll continue to have <strong>full access</strong> to all premium features until {formattedEndDate}
              </Text>
              <Text style={infoItemStyle}>
                ✓ No further charges will be made to your payment method
              </Text>
              <Text style={infoItemStyle}>
                ✓ After {formattedEndDate}, your account will revert to the free tier with limited features
              </Text>
              <Text style={infoItemStyle}>
                ✓ Your account data and preferences will be preserved
              </Text>
            </>
          ) : (
            <>
              <Text style={infoItemStyle}>
                ✓ Your subscription has been cancelled and access to premium features has ended
              </Text>
              <Text style={infoItemStyle}>
                ✓ No further charges will be made to your payment method
              </Text>
              <Text style={infoItemStyle}>
                ✓ Your account has been downgraded to the free tier with limited features
              </Text>
              <Text style={infoItemStyle}>
                ✓ Your account data and preferences have been preserved
              </Text>
            </>
          )}
        </div>

        <Hr style={hrStyle} />

        {/* Free Tier Features */}
        <Text style={sectionHeadingStyle}>What You'll Still Have Access To:</Text>

        <div style={freeFeaturesBoxStyle}>
          <div style={featureItemStyle}>
            <span style={freeFeatureIconStyle}>✓</span>
            <Text style={featureTextStyle}>Weekly newsletter with market insights</Text>
          </div>
          <div style={featureItemStyle}>
            <span style={freeFeatureIconStyle}>✓</span>
            <Text style={featureTextStyle}>Basic article browsing</Text>
          </div>
          <div style={featureItemStyle}>
            <span style={freeFeatureIconStyle}>✓</span>
            <Text style={featureTextStyle}>Limited AI chat interactions (3 per month)</Text>
          </div>
          <div style={featureItemStyle}>
            <span style={freeFeatureIconStyle}>✓</span>
            <Text style={featureTextStyle}>Community support access</Text>
          </div>
        </div>

        <Hr style={hrStyle} />

        {/* Changed Your Mind? */}
        <div style={resubscribeBoxStyle}>
          <Text style={resubscribeHeadingStyle}>Changed Your Mind?</Text>
          <Text style={resubscribeTextStyle}>
            You can reactivate your subscription at any time to regain access to all premium features, including unlimited AI personalization, advanced insights, and priority support.
          </Text>
          <div style={resubscribeButtonStyle}>
            <EmailButton href={resubscribeUrl}>Reactivate Subscription</EmailButton>
          </div>
        </div>

        <Hr style={hrStyle} />

        {/* Feedback Request */}
        {feedback && (
          <>
            <Text style={feedbackHeadingStyle}>We'd Love Your Feedback</Text>
            <Text style={feedbackTextStyle}>
              Your opinion matters to us! Would you mind taking a moment to share why you cancelled? Your feedback helps us improve TrueTone Insights for everyone.
            </Text>
            <div style={feedbackButtonStyle}>
              <EmailButton href={feedbackUrl} variant="secondary">
                Share Feedback (2 minutes)
              </EmailButton>
            </div>
            <Hr style={hrStyle} />
          </>
        )}

        {/* Support */}
        <Text style={supportTextStyle}>
          If you cancelled by mistake or have questions about your cancellation, please don't hesitate to reach out. We're here to help!
        </Text>

        <Text style={signatureStyle}>
          Thank you for being part of our community,
          <br />
          <strong>The TrueTone Team</strong>
        </Text>
      </EmailSection>

      <EmailFooter />
    </EmailLayout>
  );
}

// Export as default for dynamic imports
export default SubscriptionCancelledEmail;

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

const cancelCardStyle = {
  backgroundColor: '#ffffff',
  border: '2px solid #8898aa',
  borderRadius: '12px',
  overflow: 'hidden',
  margin: '24px 0',
};

const cancelHeaderStyle = {
  backgroundColor: '#f6f9fc',
  borderBottom: '1px solid #e6ebf1',
  padding: '20px 24px',
  textAlign: 'center' as const,
};

const cancelTitleStyle = {
  color: '#525f7f',
  fontSize: '18px',
  fontWeight: '600',
  margin: 0,
};

const cancelTableStyle = {
  padding: '0',
};

const detailLabelStyle = {
  color: '#8898aa',
  fontSize: '14px',
  fontWeight: '500',
  padding: '12px 24px',
  verticalAlign: 'top',
  width: '140px',
};

const detailValueStyle = {
  color: '#2C2A4A',
  fontSize: '14px',
  fontWeight: '400',
  padding: '12px 24px 12px 0',
};

const daysRemainingBadgeStyle = {
  backgroundColor: '#fff3cd',
  borderRadius: '12px',
  color: '#856404',
  display: 'inline-block',
  fontSize: '12px',
  fontWeight: '600',
  padding: '4px 12px',
};

const sectionHeadingStyle = {
  color: '#2C2A4A',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 16px 0',
};

const infoBoxStyle = {
  backgroundColor: '#f6f9fc',
  borderRadius: '8px',
  padding: '20px 24px',
  margin: '0 0 24px 0',
};

const infoItemStyle = {
  color: '#525f7f',
  fontSize: '15px',
  lineHeight: '1.8',
  margin: '0 0 12px 0',
};

const hrStyle = {
  borderColor: '#e6ebf1',
  margin: '32px 0',
};

const freeFeaturesBoxStyle = {
  backgroundColor: '#f6f9fc',
  borderRadius: '8px',
  padding: '20px',
  margin: '0 0 24px 0',
};

const featureItemStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: '12px',
};

const freeFeatureIconStyle = {
  color: '#4F518C',
  fontSize: '16px',
  fontWeight: '700',
  marginRight: '12px',
  minWidth: '20px',
};

const featureTextStyle = {
  color: '#525f7f',
  fontSize: '15px',
  lineHeight: '1.5',
  margin: 0,
};

const resubscribeBoxStyle = {
  backgroundColor: '#f0f7ff',
  border: '1px solid #4F518C',
  borderRadius: '12px',
  padding: '24px',
  textAlign: 'center' as const,
  margin: '0 0 24px 0',
};

const resubscribeHeadingStyle = {
  color: '#2C2A4A',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const resubscribeTextStyle = {
  color: '#525f7f',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 20px 0',
};

const resubscribeButtonStyle = {
  margin: '0',
};

const feedbackHeadingStyle = {
  color: '#2C2A4A',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const feedbackTextStyle = {
  color: '#525f7f',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 20px 0',
};

const feedbackButtonStyle = {
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
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
