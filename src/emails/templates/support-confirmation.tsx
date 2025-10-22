/**
 * Support Confirmation Email Template
 *
 * Sent to users after they submit a support request.
 * Provides confirmation, reference number, and expected response time.
 */

import { Heading, Text, Hr } from '@react-email/components';
import { EmailLayout } from './_components/EmailLayout';
import { EmailHeader } from './_components/EmailHeader';
import { EmailFooter } from './_components/EmailFooter';
import { EmailSection } from './_components/EmailSection';
import { EmailButton } from './_components/EmailButton';

export interface SupportConfirmationEmailProps {
  name: string;
  referenceNumber: string;
  subject: string;
  message: string;
  category: string;
  expectedResponseTime?: string;
}

export function SupportConfirmationEmail({
  name,
  referenceNumber,
  subject,
  message,
  category,
  expectedResponseTime = '24-48 hours',
}: SupportConfirmationEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://truetone.ai';
  const faqUrl = `${baseUrl}/account?tab=support`;

  return (
    <EmailLayout preview={`Support request received - ${referenceNumber}`}>
      <EmailHeader
        title="We Got Your Message!"
        subtitle={`Reference: ${referenceNumber}`}
      />

      <EmailSection>
        <Text style={greetingStyle}>Hi {name},</Text>

        <Text style={paragraphStyle}>
          Thank you for reaching out to TrueTone Insights support. We've received your message and wanted to confirm that we're on it.
        </Text>

        {/* Reference Number Card */}
        <div style={cardStyle}>
          <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
            <tr>
              <td style={cardLabelStyle}>Reference Number:</td>
              <td style={cardValueStyle}>{referenceNumber}</td>
            </tr>
            <tr>
              <td style={cardLabelStyle}>Category:</td>
              <td style={cardValueStyle}>
                <span style={badgeStyle}>{category}</span>
              </td>
            </tr>
            <tr>
              <td style={cardLabelStyle}>Expected Response:</td>
              <td style={cardValueStyle}>{expectedResponseTime}</td>
            </tr>
          </table>
        </div>

        <Text style={sectionHeadingStyle}>Your Message:</Text>
        <div style={messageBoxStyle}>
          <Text style={messageSubjectStyle}>{subject}</Text>
          <Hr style={messageHrStyle} />
          <Text style={messageTextStyle}>{message}</Text>
        </div>

        <Text style={paragraphStyle}>
          Our support team will review your request and get back to you within {expectedResponseTime}. We'll respond to the email address associated with your account.
        </Text>

        <div style={ctaContainerStyle}>
          <EmailButton href={faqUrl}>Visit FAQ & Support Center</EmailButton>
        </div>

        <Text style={signatureStyle}>
          Best regards,
          <br />
          <strong>TrueTone Insights Support Team</strong>
        </Text>
      </EmailSection>

      <EmailFooter />
    </EmailLayout>
  );
}

// Export as default for dynamic imports
export default SupportConfirmationEmail;

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
  margin: '0 0 20px 0',
};

const cardStyle = {
  backgroundColor: '#f6f9fc',
  borderLeft: '4px solid #4F518C',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const cardLabelStyle = {
  color: '#8898aa',
  fontSize: '14px',
  fontWeight: '500',
  padding: '8px 12px 8px 0',
  verticalAlign: 'top',
  width: '160px',
};

const cardValueStyle = {
  color: '#2C2A4A',
  fontSize: '14px',
  fontWeight: '600',
  padding: '8px 0',
};

const badgeStyle = {
  backgroundColor: '#DABFFF',
  borderRadius: '12px',
  color: '#4F518C',
  display: 'inline-block',
  fontSize: '12px',
  fontWeight: '600',
  padding: '4px 12px',
  textTransform: 'capitalize' as const,
};

const sectionHeadingStyle = {
  color: '#2C2A4A',
  fontSize: '16px',
  fontWeight: '600',
  margin: '32px 0 12px 0',
};

const messageBoxStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e6ebf1',
  borderRadius: '8px',
  padding: '20px',
  margin: '0 0 24px 0',
};

const messageSubjectStyle = {
  color: '#2C2A4A',
  fontSize: '15px',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const messageHrStyle = {
  borderColor: '#e6ebf1',
  margin: '12px 0',
};

const messageTextStyle = {
  color: '#525f7f',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '12px 0 0 0',
  whiteSpace: 'pre-wrap' as const,
};

const ctaContainerStyle = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const signatureStyle = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '32px 0 0 0',
};
