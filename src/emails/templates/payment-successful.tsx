/**
 * Payment Successful Email Template
 *
 * Sent when a subscription payment is successfully processed.
 * Shows payment details, receipt, and next billing date.
 */

import { Heading, Text, Hr } from '@react-email/components';
import { EmailLayout } from './_components/EmailLayout';
import { EmailHeader } from './_components/EmailHeader';
import { EmailFooter } from './_components/EmailFooter';
import { EmailSection } from './_components/EmailSection';
import { EmailButton } from './_components/EmailButton';

export interface PaymentSuccessfulEmailProps {
  name: string;
  amount: number;
  currency?: string;
  invoiceUrl?: string | null;
  nextBillingDate?: Date | null;
  receiptNumber?: string;
}

export function PaymentSuccessfulEmail({
  name,
  amount,
  currency = 'USD',
  invoiceUrl,
  nextBillingDate,
  receiptNumber,
}: PaymentSuccessfulEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://truetone.ai';
  const billingUrl = `${baseUrl}/billing`;

  // Format amount
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100); // Amount is in cents

  // Format next billing date if provided
  const formattedNextBilling = nextBillingDate
    ? new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(nextBillingDate)
    : null;

  // Generate receipt number if not provided
  const receipt = receiptNumber || `REC-${Date.now().toString(36).toUpperCase()}`;

  return (
    <EmailLayout preview={`Payment received - ${formattedAmount}. Thank you!`}>
      <EmailHeader
        title="Payment Received ✓"
        subtitle="Thank you for your payment"
      />

      <EmailSection>
        <Text style={greetingStyle}>Hi {name},</Text>

        <Text style={paragraphStyle}>
          We've successfully processed your payment. Thank you for your continued subscription to TrueTone Insights!
        </Text>

        {/* Payment Details Card */}
        <div style={paymentCardStyle}>
          <div style={paymentHeaderStyle}>
            <span style={successIconStyle}>✓</span>
            <Text style={paymentStatusStyle}>Payment Successful</Text>
          </div>

          <Hr style={cardHrStyle} />

          <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
            <tr>
              <td style={detailLabelStyle}>Amount Paid:</td>
              <td style={detailValueStyle}>
                <strong>{formattedAmount}</strong>
              </td>
            </tr>
            <tr>
              <td style={detailLabelStyle}>Receipt Number:</td>
              <td style={detailValueStyle}>{receipt}</td>
            </tr>
            <tr>
              <td style={detailLabelStyle}>Payment Date:</td>
              <td style={detailValueStyle}>
                {new Intl.DateTimeFormat('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                }).format(new Date())}
              </td>
            </tr>
            {formattedNextBilling && (
              <tr>
                <td style={detailLabelStyle}>Next Billing Date:</td>
                <td style={detailValueStyle}>{formattedNextBilling}</td>
              </tr>
            )}
          </table>
        </div>

        {/* Action Buttons */}
        <div style={buttonContainerStyle}>
          {invoiceUrl && (
            <div style={buttonWrapperStyle}>
              <EmailButton href={invoiceUrl}>Download Receipt</EmailButton>
            </div>
          )}
          <div style={buttonWrapperStyle}>
            <EmailButton href={billingUrl} variant="secondary">
              View Billing History
            </EmailButton>
          </div>
        </div>

        <Hr style={hrStyle} />

        {/* Additional Info */}
        <div style={infoBoxStyle}>
          <Text style={infoTextStyle}>
            📧 <strong>Receipt Saved:</strong> This receipt has been saved to your account. You can view all your invoices and billing history in your{' '}
            <a href={billingUrl} style={linkStyle}>
              billing settings
            </a>
            .
          </Text>
        </div>

        {formattedNextBilling && (
          <div style={reminderBoxStyle}>
            <Text style={reminderTextStyle}>
              💳 <strong>Next Payment:</strong> Your next billing date is {formattedNextBilling}. We'll send you a reminder a few days before.
            </Text>
          </div>
        )}

        <Hr style={hrStyle} />

        {/* Support */}
        <Text style={supportTextStyle}>
          Questions about your payment or subscription? We're here to help! Reply to this email or contact our support team anytime.
        </Text>

        <Text style={signatureStyle}>
          Thank you for being a valued customer,
          <br />
          <strong>The TrueTone Team</strong>
        </Text>
      </EmailSection>

      <EmailFooter />
    </EmailLayout>
  );
}

// Export as default for dynamic imports
export default PaymentSuccessfulEmail;

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

const paymentCardStyle = {
  backgroundColor: '#ffffff',
  border: '2px solid #28a745',
  borderRadius: '12px',
  overflow: 'hidden',
  margin: '24px 0',
};

const paymentHeaderStyle = {
  backgroundColor: '#d4edda',
  padding: '20px 24px',
  textAlign: 'center' as const,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
};

const successIconStyle = {
  backgroundColor: '#28a745',
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

const paymentStatusStyle = {
  color: '#155724',
  fontSize: '20px',
  fontWeight: '700',
  margin: 0,
};

const cardHrStyle = {
  borderColor: '#e6ebf1',
  margin: 0,
};

const detailLabelStyle = {
  color: '#8898aa',
  fontSize: '14px',
  fontWeight: '500',
  padding: '12px 24px',
  verticalAlign: 'top',
  width: '160px',
};

const detailValueStyle = {
  color: '#2C2A4A',
  fontSize: '14px',
  fontWeight: '400',
  padding: '12px 24px 12px 0',
};

const buttonContainerStyle = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const buttonWrapperStyle = {
  display: 'inline-block',
  margin: '0 8px 8px 8px',
};

const hrStyle = {
  borderColor: '#e6ebf1',
  margin: '32px 0',
};

const infoBoxStyle = {
  backgroundColor: '#f6f9fc',
  borderRadius: '8px',
  padding: '16px',
  margin: '0 0 16px 0',
};

const infoTextStyle = {
  color: '#525f7f',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: 0,
};

const reminderBoxStyle = {
  backgroundColor: '#fff3cd',
  borderRadius: '8px',
  padding: '16px',
  margin: '0 0 24px 0',
};

const reminderTextStyle = {
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
