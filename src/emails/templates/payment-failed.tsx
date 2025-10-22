/**
 * Payment Failed Email Template
 *
 * Sent when a subscription payment fails.
 * Shows failure details, next retry date, and action required.
 */

import { Heading, Text, Hr } from '@react-email/components';
import { EmailLayout } from './_components/EmailLayout';
import { EmailHeader } from './_components/EmailHeader';
import { EmailFooter } from './_components/EmailFooter';
import { EmailSection } from './_components/EmailSection';
import { EmailButton } from './_components/EmailButton';

export interface PaymentFailedEmailProps {
  name: string;
  amount: number;
  currency?: string;
  attemptCount: number;
  nextRetryDate?: Date | null;
  updatePaymentUrl?: string;
}

export function PaymentFailedEmail({
  name,
  amount,
  currency = 'USD',
  attemptCount,
  nextRetryDate,
  updatePaymentUrl,
}: PaymentFailedEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://truetone.ai';
  const billingUrl = updatePaymentUrl || `${baseUrl}/billing`;
  const supportUrl = `${baseUrl}/support`;

  // Format amount
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100); // Amount is in cents

  // Format next retry date if provided
  const formattedRetryDate = nextRetryDate
    ? new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(nextRetryDate)
    : 'within the next few days';

  // Determine urgency message based on attempt count
  const maxAttempts = 4;
  const isLastAttempt = attemptCount >= maxAttempts - 1;

  return (
    <EmailLayout preview={`Action required: Payment of ${formattedAmount} failed`}>
      <EmailHeader
        title="Action Required ⚠️"
        subtitle="We couldn't process your payment"
      />

      <EmailSection>
        <Text style={greetingStyle}>Hi {name},</Text>

        <Text style={paragraphStyle}>
          We were unable to process your recent payment for your TrueTone Insights subscription. Your payment method may have insufficient funds, be expired, or have been declined by your bank.
        </Text>

        {/* Alert Box */}
        <div style={alertBoxStyle}>
          <div style={alertHeaderStyle}>
            <span style={alertIconStyle}>!</span>
            <Text style={alertTitleStyle}>Payment Failed</Text>
          </div>

          <table width="100%" cellPadding="0" cellSpacing="0" role="presentation" style={alertTableStyle}>
            <tr>
              <td style={alertLabelStyle}>Amount Due:</td>
              <td style={alertValueStyle}>
                <strong>{formattedAmount}</strong>
              </td>
            </tr>
            <tr>
              <td style={alertLabelStyle}>Attempt:</td>
              <td style={alertValueStyle}>{attemptCount} of {maxAttempts}</td>
            </tr>
            {nextRetryDate && (
              <tr>
                <td style={alertLabelStyle}>Next Retry:</td>
                <td style={alertValueStyle}>{formattedRetryDate}</td>
              </tr>
            )}
          </table>

          {isLastAttempt && (
            <div style={urgentWarningStyle}>
              <Text style={urgentWarningTextStyle}>
                ⚠️ <strong>Final Attempt:</strong> This is your last retry. If payment fails again, your subscription will be cancelled and access will be restricted.
              </Text>
            </div>
          )}
        </div>

        {/* Action Required */}
        <Text style={sectionHeadingStyle}>What You Need to Do:</Text>

        <div style={stepsBoxStyle}>
          <div style={stepItemStyle}>
            <Text style={stepNumberStyle}>1</Text>
            <div>
              <Text style={stepTitleStyle}>Update Your Payment Method</Text>
              <Text style={stepDescriptionStyle}>
                Add a new card or update your existing payment information to avoid service interruption.
              </Text>
            </div>
          </div>

          <div style={stepItemStyle}>
            <Text style={stepNumberStyle}>2</Text>
            <div>
              <Text style={stepTitleStyle}>Verify Sufficient Funds</Text>
              <Text style={stepDescriptionStyle}>
                Ensure your payment method has sufficient funds to cover the {formattedAmount} charge.
              </Text>
            </div>
          </div>

          <div style={stepItemStyle}>
            <Text style={stepNumberStyle}>3</Text>
            <div>
              <Text style={stepTitleStyle}>Contact Your Bank if Needed</Text>
              <Text style={stepDescriptionStyle}>
                If the issue persists, contact your bank to ensure they're not blocking the transaction.
              </Text>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div style={ctaContainerStyle}>
          <EmailButton href={billingUrl}>Update Payment Method</EmailButton>
        </div>

        <Hr style={hrStyle} />

        {/* Common Reasons */}
        <Text style={sectionHeadingStyle}>Common Reasons for Payment Failure:</Text>

        <div style={reasonsBoxStyle}>
          <Text style={reasonTextStyle}>• Insufficient funds in your account</Text>
          <Text style={reasonTextStyle}>• Expired or cancelled card</Text>
          <Text style={reasonTextStyle}>• Incorrect billing address or CVV</Text>
          <Text style={reasonTextStyle}>• Card issuer declined the charge</Text>
          <Text style={reasonTextStyle}>• Daily spending limit reached</Text>
        </div>

        <Hr style={hrStyle} />

        {/* What Happens Next */}
        <div style={timelineBoxStyle}>
          <Text style={timelineHeadingStyle}>What Happens Next:</Text>
          <Text style={timelineTextStyle}>
            {isLastAttempt ? (
              <>
                If you don't update your payment method, we'll make one final attempt {formattedRetryDate}. If that fails, your subscription will be cancelled and you'll lose access to premium features.
              </>
            ) : (
              <>
                We'll automatically retry the payment {formattedRetryDate}. However, to avoid service interruption, we recommend updating your payment information as soon as possible.
              </>
            )}
          </Text>
        </div>

        {/* Support */}
        <Text style={supportTextStyle}>
          Need help? Our support team is here to assist you. Visit our{' '}
          <a href={supportUrl} style={linkStyle}>
            support center
          </a>
          {' '}or reply to this email.
        </Text>

        <Text style={signatureStyle}>
          We're here to help,
          <br />
          <strong>The TrueTone Team</strong>
        </Text>
      </EmailSection>

      <EmailFooter />
    </EmailLayout>
  );
}

// Export as default for dynamic imports
export default PaymentFailedEmail;

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

const alertBoxStyle = {
  backgroundColor: '#ffffff',
  border: '2px solid #dc3545',
  borderRadius: '12px',
  overflow: 'hidden',
  margin: '24px 0',
};

const alertHeaderStyle = {
  backgroundColor: '#f8d7da',
  padding: '20px 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
};

const alertIconStyle = {
  backgroundColor: '#dc3545',
  borderRadius: '50%',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '20px',
  fontWeight: '700',
  height: '36px',
  lineHeight: '36px',
  textAlign: 'center' as const,
  width: '36px',
};

const alertTitleStyle = {
  color: '#721c24',
  fontSize: '20px',
  fontWeight: '700',
  margin: 0,
};

const alertTableStyle = {
  padding: '0',
};

const alertLabelStyle = {
  color: '#8898aa',
  fontSize: '14px',
  fontWeight: '500',
  padding: '12px 24px',
  verticalAlign: 'top',
  width: '140px',
};

const alertValueStyle = {
  color: '#2C2A4A',
  fontSize: '14px',
  fontWeight: '400',
  padding: '12px 24px 12px 0',
};

const urgentWarningStyle = {
  backgroundColor: '#fff3cd',
  borderTop: '1px solid #ffeaa7',
  padding: '16px 24px',
};

const urgentWarningTextStyle = {
  color: '#856404',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: 0,
};

const sectionHeadingStyle = {
  color: '#2C2A4A',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 16px 0',
};

const stepsBoxStyle = {
  margin: '0 0 32px 0',
};

const stepItemStyle = {
  alignItems: 'flex-start',
  display: 'flex',
  marginBottom: '20px',
};

const stepNumberStyle = {
  backgroundColor: '#dc3545',
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

const stepTitleStyle = {
  color: '#2C2A4A',
  fontSize: '15px',
  fontWeight: '600',
  margin: '0 0 4px 0',
};

const stepDescriptionStyle = {
  color: '#525f7f',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: 0,
};

const ctaContainerStyle = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const hrStyle = {
  borderColor: '#e6ebf1',
  margin: '32px 0',
};

const reasonsBoxStyle = {
  backgroundColor: '#f6f9fc',
  borderRadius: '8px',
  padding: '20px 24px',
  margin: '0 0 24px 0',
};

const reasonTextStyle = {
  color: '#525f7f',
  fontSize: '14px',
  lineHeight: '1.8',
  margin: '0 0 8px 0',
};

const timelineBoxStyle = {
  backgroundColor: '#fff3cd',
  borderLeft: '4px solid #ffc107',
  borderRadius: '4px',
  padding: '16px 20px',
  margin: '0 0 24px 0',
};

const timelineHeadingStyle = {
  color: '#856404',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 8px 0',
};

const timelineTextStyle = {
  color: '#856404',
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
