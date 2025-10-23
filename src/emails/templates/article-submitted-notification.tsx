/**
 * Article Submitted Notification Email Template
 *
 * Sent to admin users when a new article is submitted for review.
 * Alert-style format with article details and review action button.
 */

import { Heading, Text, Hr, Link } from '@react-email/components';
import { EmailLayout } from './_components/EmailLayout';
import { EmailHeader } from './_components/EmailHeader';
import { EmailFooter } from './_components/EmailFooter';
import { EmailSection } from './_components/EmailSection';
import { EmailButton } from './_components/EmailButton';

export interface ArticleSubmittedNotificationProps {
  articleId: string;
  articleTitle: string;
  articleSummary?: string;
  creatorName: string;
  creatorEmail: string;
  category?: string;
  tags?: string[];
  reviewUrl: string;
}

export function ArticleSubmittedNotification({
  articleId,
  articleTitle,
  articleSummary,
  creatorName,
  creatorEmail,
  category,
  tags = [],
  reviewUrl,
}: ArticleSubmittedNotificationProps) {
  return (
    <EmailLayout preview={`New Article: ${articleTitle}`}>
      {/* Alert Header */}
      <EmailSection backgroundColor="#fff3cd" padding="16px 40px">
        <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
          <tr>
            <td style={alertIconStyle}>📝</td>
            <td>
              <Text style={alertTextStyle}>
                <strong>New Article Submitted</strong> - Review required
              </Text>
            </td>
          </tr>
        </table>
      </EmailSection>

      <EmailHeader title="Article Awaiting Review" showLogo={false} />

      <EmailSection>
        {/* Article Details Card */}
        <div style={articleCardStyle}>
          <Heading as="h2" style={articleTitleStyle}>
            {articleTitle}
          </Heading>
          {articleSummary && (
            <Text style={articleSummaryStyle}>{articleSummary}</Text>
          )}
        </div>

        {/* Metadata */}
        <div style={metadataCardStyle}>
          <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
            <tr>
              <td style={metadataLabelStyle}>Article ID:</td>
              <td style={metadataValueStyle}>
                <code style={codeStyle}>{articleId}</code>
              </td>
            </tr>
            <tr>
              <td style={metadataLabelStyle}>Created By:</td>
              <td style={metadataValueStyle}>
                {creatorName}
                <br />
                <span style={{ fontSize: '13px', color: '#8898aa' }}>
                  {creatorEmail}
                </span>
              </td>
            </tr>
            {category && (
              <tr>
                <td style={metadataLabelStyle}>Category:</td>
                <td style={metadataValueStyle}>
                  <span style={categoryBadgeStyle}>{category}</span>
                </td>
              </tr>
            )}
            {tags.length > 0 && (
              <tr>
                <td style={metadataLabelStyle}>Tags:</td>
                <td style={metadataValueStyle}>
                  {tags.map((tag, index) => (
                    <span key={index} style={tagBadgeStyle}>
                      {tag}
                    </span>
                  ))}
                </td>
              </tr>
            )}
          </table>
        </div>

        {/* Action Button */}
        <div style={actionContainerStyle}>
          <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
            <tr>
              <td style={{ textAlign: 'center', padding: '8px' }}>
                <EmailButton href={reviewUrl}>Review Article</EmailButton>
              </td>
            </tr>
          </table>
        </div>

        <Hr style={hrStyle} />

        {/* Guidelines */}
        <div style={guidelinesBoxStyle}>
          <Text style={guidelinesHeadingStyle}>📋 Review Guidelines:</Text>
          <ul style={guidelinesListStyle}>
            <li style={guidelinesItemStyle}>
              Review content for accuracy, tone, and completeness
            </li>
            <li style={guidelinesItemStyle}>
              Check that all required sections are filled out
            </li>
            <li style={guidelinesItemStyle}>
              Approve or provide constructive feedback within 24-48 hours
            </li>
            <li style={guidelinesItemStyle}>
              If rejecting, provide clear reasons for the creator
            </li>
          </ul>
        </div>
      </EmailSection>

      <EmailFooter />
    </EmailLayout>
  );
}

// Export as default for dynamic imports
export default ArticleSubmittedNotification;

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

const articleCardStyle = {
  backgroundColor: '#f6f9fc',
  borderRadius: '8px',
  padding: '24px',
  margin: '0 0 24px 0',
};

const articleTitleStyle = {
  color: '#2C2A4A',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 12px 0',
};

const articleSummaryStyle = {
  color: '#525f7f',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: 0,
};

const metadataCardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e6ebf1',
  borderRadius: '8px',
  padding: '20px',
  margin: '0 0 24px 0',
};

const metadataLabelStyle = {
  color: '#8898aa',
  fontSize: '14px',
  fontWeight: '500',
  padding: '8px 12px 8px 0',
  verticalAlign: 'top',
  width: '120px',
};

const metadataValueStyle = {
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

const tagBadgeStyle = {
  backgroundColor: '#e6ebf1',
  borderRadius: '12px',
  color: '#525f7f',
  display: 'inline-block',
  fontSize: '11px',
  fontWeight: '500',
  padding: '4px 10px',
  marginRight: '6px',
};

const actionContainerStyle = {
  margin: '32px 0',
};

const hrStyle = {
  borderColor: '#e6ebf1',
  margin: '32px 0',
};

const guidelinesBoxStyle = {
  backgroundColor: '#f0f7ff',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0 0 0',
};

const guidelinesHeadingStyle = {
  color: '#2C2A4A',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const guidelinesListStyle = {
  color: '#525f7f',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: 0,
  paddingLeft: '20px',
};

const guidelinesItemStyle = {
  marginBottom: '8px',
};
