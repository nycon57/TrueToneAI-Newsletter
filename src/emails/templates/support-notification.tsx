/**
 * Support Notification Email Template
 *
 * Sent to support team/admin when a user submits a support request.
 * Alert-style format with user details and quick action buttons.
 */

import { Heading, Text, Hr, Link } from '@react-email/components';
import { EmailLayout } from './_components/EmailLayout';
import { EmailHeader } from './_components/EmailHeader';
import { EmailFooter } from './_components/EmailFooter';
import { EmailSection } from './_components/EmailSection';
import { EmailButton } from './_components/EmailButton';

export interface SupportNotificationEmailProps {
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

export function SupportNotificationEmail({
  userName,
  userEmail,
  userTier = 'Free',
  referenceNumber,
  subject,
  category,
  message,
  attachments = [],
  userId,
}: SupportNotificationEmailProps) {
  const replyToUrl = `mailto:${userEmail}?subject=Re: ${encodeURIComponent(subject)} [${referenceNumber}]`;

  // Tier badge color mapping
  const tierColors: Record<string, { bg: string; text: string }> = {
    Free: { bg: '#e6ebf1', text: '#525f7f' },
    Starter: { bg: '#DABFFF', text: '#4F518C' },
    Pro: { bg: '#4F518C', text: '#ffffff' },
    Enterprise: { bg: '#2C2A4A', text: '#ffffff' },
  };

  const tierColor = tierColors[userTier] || tierColors.Free;

  return (
    <EmailLayout preview={`New Support Request: ${category} - ${referenceNumber}`}>
      {/* Alert Header */}
      <EmailSection backgroundColor="#fff3cd" padding="16px 40px">
        <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
          <tr>
            <td style={alertIconStyle}>⚠️</td>
            <td>
              <Text style={alertTextStyle}>
                <strong>New Support Request</strong> - Action may be required
              </Text>
            </td>
          </tr>
        </table>
      </EmailSection>

      <EmailHeader title="Support Request Received" showLogo={false} />

      <EmailSection>
        {/* User Details Card */}
        <div style={userCardStyle}>
          <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
            <tr>
              <td style={userAvatarCellStyle}>
                <div style={userAvatarStyle}>
                  {userName.charAt(0).toUpperCase()}
                </div>
              </td>
              <td>
                <Text style={userNameStyle}>{userName}</Text>
                <Text style={userEmailStyle}>{userEmail}</Text>
                <div style={{ marginTop: '8px' }}>
                  <span
                    style={{
                      ...tierBadgeStyle,
                      backgroundColor: tierColor.bg,
                      color: tierColor.text,
                    }}
                  >
                    {userTier} Plan
                  </span>
                </div>
              </td>
            </tr>
          </table>
        </div>

        {/* Request Details */}
        <div style={detailsCardStyle}>
          <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
            <tr>
              <td style={detailLabelStyle}>Reference Number:</td>
              <td style={detailValueStyle}>
                <code style={codeStyle}>{referenceNumber}</code>
              </td>
            </tr>
            <tr>
              <td style={detailLabelStyle}>Category:</td>
              <td style={detailValueStyle}>
                <span style={categoryBadgeStyle}>{category}</span>
              </td>
            </tr>
            <tr>
              <td style={detailLabelStyle}>Subject:</td>
              <td style={detailValueStyle}>{subject}</td>
            </tr>
            {userId && (
              <tr>
                <td style={detailLabelStyle}>User ID:</td>
                <td style={detailValueStyle}>
                  <code style={codeStyle}>{userId}</code>
                </td>
              </tr>
            )}
          </table>
        </div>

        {/* Message Content */}
        <Text style={sectionHeadingStyle}>Message:</Text>
        <div style={messageBoxStyle}>
          <Text style={messageTextStyle}>{message}</Text>
        </div>

        {/* Attachments */}
        {attachments.length > 0 && (
          <>
            <Text style={sectionHeadingStyle}>
              Attachments ({attachments.length}):
            </Text>
            <div style={attachmentBoxStyle}>
              {attachments.map((attachment, index) => (
                <div key={index} style={attachmentItemStyle}>
                  <Text style={attachmentIconStyle}>📎</Text>
                  <Link href={attachment.url} style={attachmentLinkStyle}>
                    {attachment.name}
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div style={actionContainerStyle}>
          <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
            <tr>
              <td style={{ textAlign: 'center', padding: '8px' }}>
                <EmailButton href={replyToUrl}>Reply to User</EmailButton>
              </td>
            </tr>
          </table>
        </div>

        <Hr style={hrStyle} />

        {/* Quick Tips */}
        <div style={tipsBoxStyle}>
          <Text style={tipsHeadingStyle}>💡 Response Guidelines:</Text>
          <ul style={tipsListStyle}>
            <li style={tipsItemStyle}>
              Respond within 24-48 hours for standard requests
            </li>
            <li style={tipsItemStyle}>
              Use reference number {referenceNumber} in all communications
            </li>
            <li style={tipsItemStyle}>
              For {userTier} tier users, review SLA commitments
            </li>
          </ul>
        </div>
      </EmailSection>

      <EmailFooter />
    </EmailLayout>
  );
}

// Export as default for dynamic imports
export default SupportNotificationEmail;

// Styles
const alertIconStyle = {
  fontSize: '20px',
  paddingRight: '12px',
  verticalAlign: 'middle',
  width: '32px',
};

const alertTextStyle = {
  color: '#856404',
  fontSize: '14px',
  margin: 0,
};

const userCardStyle = {
  backgroundColor: '#f6f9fc',
  borderRadius: '8px',
  padding: '20px',
  margin: '0 0 24px 0',
};

const userAvatarCellStyle = {
  paddingRight: '16px',
  verticalAlign: 'top',
  width: '60px',
};

const userAvatarStyle = {
  backgroundColor: '#4F518C',
  borderRadius: '50%',
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '600',
  height: '56px',
  lineHeight: '56px',
  textAlign: 'center' as const,
  width: '56px',
};

const userNameStyle = {
  color: '#2C2A4A',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 4px 0',
};

const userEmailStyle = {
  color: '#525f7f',
  fontSize: '14px',
  margin: '0 0 8px 0',
};

const tierBadgeStyle = {
  borderRadius: '12px',
  display: 'inline-block',
  fontSize: '12px',
  fontWeight: '600',
  padding: '4px 12px',
};

const detailsCardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e6ebf1',
  borderRadius: '8px',
  padding: '20px',
  margin: '0 0 24px 0',
};

const detailLabelStyle = {
  color: '#8898aa',
  fontSize: '14px',
  fontWeight: '500',
  padding: '8px 12px 8px 0',
  verticalAlign: 'top',
  width: '140px',
};

const detailValueStyle = {
  color: '#2C2A4A',
  fontSize: '14px',
  fontWeight: '400',
  padding: '8px 0',
};

const codeStyle = {
  backgroundColor: '#f6f9fc',
  borderRadius: '4px',
  color: '#4F518C',
  fontFamily: 'monospace',
  fontSize: '13px',
  padding: '2px 6px',
};

const categoryBadgeStyle = {
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
  margin: '24px 0 12px 0',
};

const messageBoxStyle = {
  backgroundColor: '#f6f9fc',
  borderLeft: '4px solid #4F518C',
  borderRadius: '8px',
  padding: '20px',
  margin: '0 0 24px 0',
};

const messageTextStyle = {
  color: '#525f7f',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: 0,
  whiteSpace: 'pre-wrap' as const,
};

const attachmentBoxStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e6ebf1',
  borderRadius: '8px',
  padding: '16px',
  margin: '0 0 24px 0',
};

const attachmentItemStyle = {
  alignItems: 'center',
  display: 'flex',
  marginBottom: '8px',
};

const attachmentIconStyle = {
  fontSize: '16px',
  marginRight: '8px',
};

const attachmentLinkStyle = {
  color: '#4F518C',
  fontSize: '14px',
  textDecoration: 'none',
};

const actionContainerStyle = {
  margin: '32px 0',
};

const hrStyle = {
  borderColor: '#e6ebf1',
  margin: '32px 0',
};

const tipsBoxStyle = {
  backgroundColor: '#f0f7ff',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0 0 0',
};

const tipsHeadingStyle = {
  color: '#2C2A4A',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const tipsListStyle = {
  color: '#525f7f',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: 0,
  paddingLeft: '20px',
};

const tipsItemStyle = {
  marginBottom: '8px',
};
