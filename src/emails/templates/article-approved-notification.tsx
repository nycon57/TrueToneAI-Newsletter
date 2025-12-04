/**
 * Article Approved Notification Email Template
 *
 * Sent to article creator when their article has been approved and published.
 * Success-style format with article details and view live article link.
 */

import { Heading, Text, Hr } from '@react-email/components';
import { EmailLayout } from './_components/EmailLayout';
import { EmailHeader } from './_components/EmailHeader';
import { EmailFooter } from './_components/EmailFooter';
import { EmailSection } from './_components/EmailSection';
import { EmailButton } from './_components/EmailButton';

export interface ArticleApprovedNotificationProps {
  creatorName: string;
  articleTitle: string;
  articleSummary?: string;
  reviewNotes?: string;
  reviewedBy?: string;
  articleUrl?: string;
}

export function ArticleApprovedNotification({
  creatorName,
  articleTitle,
  articleSummary,
  reviewNotes,
  reviewedBy,
  articleUrl,
}: ArticleApprovedNotificationProps) {
  return (
    <EmailLayout preview={`Your article "${articleTitle}" has been approved!`}>
      {/* Success Header */}
      <EmailSection backgroundColor="#d4edda" padding="16px 40px">
        <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
          <tr>
            <td style={successIconStyle}>✅</td>
            <td>
              <Text style={successTextStyle}>
                <strong>Article Approved</strong> - Now published
              </Text>
            </td>
          </tr>
        </table>
      </EmailSection>

      <EmailHeader title="Congratulations!" showLogo={false} />

      <EmailSection>
        {/* Greeting */}
        <Text style={greetingStyle}>Hi {creatorName},</Text>

        <Text style={bodyTextStyle}>
          Great news! Your article has been reviewed and approved. it&apos;s now live
          and visible to users.
        </Text>

        {/* Article Details Card */}
        <div style={articleCardStyle}>
          <div style={checkmarkStyle}>✓</div>
          <Heading as="h2" style={articleTitleStyle}>
            {articleTitle}
          </Heading>
          {articleSummary && (
            <Text style={articleSummaryStyle}>{articleSummary}</Text>
          )}
        </div>

        {/* Review Notes */}
        {reviewNotes && (
          <>
            <Text style={sectionHeadingStyle}>Reviewer Notes:</Text>
            <div style={notesBoxStyle}>
              <Text style={notesTextStyle}>{reviewNotes}</Text>
            </div>
          </>
        )}

        {/* Reviewer Info */}
        {reviewedBy && (
          <div style={reviewerInfoStyle}>
            <Text style={reviewerTextStyle}>
              Reviewed by: <strong>{reviewedBy}</strong>
            </Text>
          </div>
        )}

        {/* Action Button */}
        {articleUrl && (
          <div style={actionContainerStyle}>
            <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
              <tr>
                <td style={{ textAlign: 'center', padding: '8px' }}>
                  <EmailButton href={articleUrl}>View Live Article</EmailButton>
                </td>
              </tr>
            </table>
          </div>
        )}

        <Hr style={hrStyle} />

        {/* Next Steps */}
        <div style={nextStepsBoxStyle}>
          <Text style={nextStepsHeadingStyle}>📌 what&apos;s Next?</Text>
          <ul style={nextStepsListStyle}>
            <li style={nextStepsItemStyle}>
              Your article is now visible to all users
            </li>
            <li style={nextStepsItemStyle}>
              It will be included in the next newsletter
            </li>
            <li style={nextStepsItemStyle}>
              Continue creating great content!
            </li>
          </ul>
        </div>

        <Text style={closingStyle}>
          Thank you for your contribution! 🎉
        </Text>
      </EmailSection>

      <EmailFooter />
    </EmailLayout>
  );
}

// Export as default for dynamic imports
export default ArticleApprovedNotification;

// Styles
const successIconStyle = {
  fontSize: '20px',
  paddingRight: '12px',
  verticalAlign: 'middle',
  width: '32px',
};

const successTextStyle = {
  color: '#155724',
  fontSize: '14px',
  margin: 0,
};

const greetingStyle = {
  color: '#2C2A4A',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0 0 16px 0',
};

const bodyTextStyle = {
  color: '#525f7f',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 24px 0',
};

const articleCardStyle = {
  backgroundColor: '#f6f9fc',
  borderRadius: '8px',
  borderLeft: '4px solid #28a745',
  padding: '24px',
  margin: '0 0 24px 0',
  position: 'relative' as const,
};

const checkmarkStyle = {
  backgroundColor: '#28a745',
  borderRadius: '50%',
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '700',
  height: '48px',
  lineHeight: '48px',
  position: 'absolute' as const,
  right: '24px',
  textAlign: 'center' as const,
  top: '24px',
  width: '48px',
};

const articleTitleStyle = {
  color: '#2C2A4A',
  fontSize: '22px',
  fontWeight: '700',
  margin: '0 0 12px 0',
  paddingRight: '60px',
};

const articleSummaryStyle = {
  color: '#525f7f',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: 0,
  paddingRight: '60px',
};

const sectionHeadingStyle = {
  color: '#2C2A4A',
  fontSize: '16px',
  fontWeight: '600',
  margin: '24px 0 12px 0',
};

const notesBoxStyle = {
  backgroundColor: '#f6f9fc',
  borderLeft: '4px solid #4F518C',
  borderRadius: '8px',
  padding: '16px',
  margin: '0 0 16px 0',
};

const notesTextStyle = {
  color: '#525f7f',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: 0,
};

const reviewerInfoStyle = {
  margin: '0 0 24px 0',
};

const reviewerTextStyle = {
  color: '#8898aa',
  fontSize: '13px',
  margin: 0,
};

const actionContainerStyle = {
  margin: '32px 0',
};

const hrStyle = {
  borderColor: '#e6ebf1',
  margin: '32px 0',
};

const nextStepsBoxStyle = {
  backgroundColor: '#f0f7ff',
  borderRadius: '8px',
  padding: '20px',
  margin: '0 0 24px 0',
};

const nextStepsHeadingStyle = {
  color: '#2C2A4A',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const nextStepsListStyle = {
  color: '#525f7f',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: 0,
  paddingLeft: '20px',
};

const nextStepsItemStyle = {
  marginBottom: '8px',
};

const closingStyle = {
  color: '#2C2A4A',
  fontSize: '16px',
  fontWeight: '500',
  margin: '24px 0 0 0',
  textAlign: 'center' as const,
};
