/**
 * Article Rejected Notification Email Template
 *
 * Sent to article creator when their article has been rejected.
 * Constructive feedback style with rejection reason and next steps.
 */

import { Heading, Text, Hr } from '@react-email/components';
import { EmailLayout } from './_components/EmailLayout';
import { EmailHeader } from './_components/EmailHeader';
import { EmailFooter } from './_components/EmailFooter';
import { EmailSection } from './_components/EmailSection';
import { EmailButton } from './_components/EmailButton';

export interface ArticleRejectedNotificationProps {
  creatorName: string;
  articleTitle: string;
  articleSummary?: string;
  rejectionReason: string;
  reviewNotes?: string;
  reviewedBy?: string;
  editArticleUrl?: string;
}

export function ArticleRejectedNotification({
  creatorName,
  articleTitle,
  articleSummary,
  rejectionReason,
  reviewNotes,
  reviewedBy,
  editArticleUrl,
}: ArticleRejectedNotificationProps) {
  return (
    <EmailLayout preview={`Your article "${articleTitle}" needs revisions`}>
      {/* Info Header */}
      <EmailSection backgroundColor="#fff3cd" padding="16px 40px">
        <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
          <tr>
            <td style={infoIconStyle}>ℹ️</td>
            <td>
              <Text style={infoTextStyle}>
                <strong>Article Needs Revision</strong> - Feedback provided
              </Text>
            </td>
          </tr>
        </table>
      </EmailSection>

      <EmailHeader title="Article Review Update" showLogo={false} />

      <EmailSection>
        {/* Greeting */}
        <Text style={greetingStyle}>Hi {creatorName},</Text>

        <Text style={bodyTextStyle}>
          Thank you for your article submission. After review, we've determined
          that some revisions are needed before it can be published.
        </Text>

        {/* Article Details Card */}
        <div style={articleCardStyle}>
          <Heading as="h2" style={articleTitleStyle}>
            {articleTitle}
          </Heading>
          {articleSummary && (
            <Text style={articleSummaryStyle}>{articleSummary}</Text>
          )}
        </div>

        {/* Rejection Reason */}
        <Text style={sectionHeadingStyle}>Why this needs revision:</Text>
        <div style={reasonBoxStyle}>
          <Text style={reasonTextStyle}>{rejectionReason}</Text>
        </div>

        {/* Additional Review Notes */}
        {reviewNotes && (
          <>
            <Text style={sectionHeadingStyle}>Additional Feedback:</Text>
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
        {editArticleUrl && (
          <div style={actionContainerStyle}>
            <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
              <tr>
                <td style={{ textAlign: 'center', padding: '8px' }}>
                  <EmailButton href={editArticleUrl}>Revise Article</EmailButton>
                </td>
              </tr>
            </table>
          </div>
        )}

        <Hr style={hrStyle} />

        {/* Next Steps */}
        <div style={nextStepsBoxStyle}>
          <Text style={nextStepsHeadingStyle}>📝 Next Steps:</Text>
          <ul style={nextStepsListStyle}>
            <li style={nextStepsItemStyle}>
              Review the feedback carefully and address the concerns
            </li>
            <li style={nextStepsItemStyle}>
              Make necessary revisions to your article
            </li>
            <li style={nextStepsItemStyle}>
              Resubmit for review when ready
            </li>
            <li style={nextStepsItemStyle}>
              Feel free to reach out if you have questions
            </li>
          </ul>
        </div>

        <Text style={closingStyle}>
          We appreciate your understanding and look forward to reviewing your
          revised article!
        </Text>
      </EmailSection>

      <EmailFooter />
    </EmailLayout>
  );
}

// Export as default for dynamic imports
export default ArticleRejectedNotification;

// Styles
const infoIconStyle = {
  fontSize: '20px',
  paddingRight: '12px',
  verticalAlign: 'middle',
  width: '32px',
};

const infoTextStyle = {
  color: '#856404',
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
  borderLeft: '4px solid #ffc107',
  padding: '24px',
  margin: '0 0 24px 0',
};

const articleTitleStyle = {
  color: '#2C2A4A',
  fontSize: '22px',
  fontWeight: '700',
  margin: '0 0 12px 0',
};

const articleSummaryStyle = {
  color: '#525f7f',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: 0,
};

const sectionHeadingStyle = {
  color: '#2C2A4A',
  fontSize: '16px',
  fontWeight: '600',
  margin: '24px 0 12px 0',
};

const reasonBoxStyle = {
  backgroundColor: '#fff3cd',
  borderLeft: '4px solid #ffc107',
  borderRadius: '8px',
  padding: '20px',
  margin: '0 0 16px 0',
};

const reasonTextStyle = {
  color: '#856404',
  fontSize: '15px',
  fontWeight: '500',
  lineHeight: '1.6',
  margin: 0,
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
  color: '#525f7f',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '24px 0 0 0',
  textAlign: 'center' as const,
};
