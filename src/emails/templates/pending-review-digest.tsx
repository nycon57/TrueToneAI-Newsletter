/**
 * Pending Review Digest Email Template
 *
 * Sent to admin users as a daily/weekly reminder of articles awaiting review.
 * Digest-style format with summary list and quick action links.
 */

import { Heading, Text, Hr, Link } from '@react-email/components';
import { EmailLayout } from './_components/EmailLayout';
import { EmailHeader } from './_components/EmailHeader';
import { EmailFooter } from './_components/EmailFooter';
import { EmailSection } from './_components/EmailSection';
import { EmailButton } from './_components/EmailButton';

export interface PendingArticle {
  id: string;
  title: string;
  summary?: string;
  creatorName: string;
  submittedAt: Date;
  daysWaiting: number;
  reviewUrl: string;
}

export interface PendingReviewDigestProps {
  pendingArticles: PendingArticle[];
  totalCount: number;
  dashboardUrl: string;
}

export function PendingReviewDigest({
  pendingArticles,
  totalCount,
  dashboardUrl,
}: PendingReviewDigestProps) {
  const urgentArticles = pendingArticles.filter((a) => a.daysWaiting >= 2);

  return (
    <EmailLayout preview={`${totalCount} articles awaiting review`}>
      {/* Alert Header */}
      <EmailSection backgroundColor="#fff3cd" padding="16px 40px">
        <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
          <tr>
            <td style={alertIconStyle}>📋</td>
            <td>
              <Text style={alertTextStyle}>
                <strong>Review Reminder</strong> - {totalCount} article
                {totalCount !== 1 ? 's' : ''} pending
              </Text>
            </td>
          </tr>
        </table>
      </EmailSection>

      <EmailHeader title="Pending Review Digest" showLogo={false} />

      <EmailSection>
        {/* Summary Stats */}
        <div style={statsContainerStyle}>
          <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
            <tr>
              <td style={statCellStyle}>
                <div style={statBoxStyle}>
                  <Text style={statNumberStyle}>{totalCount}</Text>
                  <Text style={statLabelStyle}>Total Pending</Text>
                </div>
              </td>
              <td style={statCellStyle}>
                <div style={{...statBoxStyle, ...urgentStatStyle}}>
                  <Text style={statNumberStyle}>{urgentArticles.length}</Text>
                  <Text style={statLabelStyle}>Urgent (2+ days)</Text>
                </div>
              </td>
            </tr>
          </table>
        </div>

        <Text style={introTextStyle}>
          Here's a summary of articles currently awaiting your review:
        </Text>

        {/* Urgent Articles (if any) */}
        {urgentArticles.length > 0 && (
          <>
            <Text style={sectionHeadingStyle}>⚠️ Urgent - Waiting 2+ Days:</Text>
            <div style={urgentSectionStyle}>
              {urgentArticles.map((article) => (
                <div key={article.id} style={articleItemStyle}>
                  <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
                    <tr>
                      <td style={{ paddingRight: '16px', verticalAlign: 'top' }}>
                        <div style={daysBadgeUrgentStyle}>
                          {article.daysWaiting}d
                        </div>
                      </td>
                      <td style={{ flex: 1 }}>
                        <Heading as="h3" style={articleTitleStyle}>
                          {article.title}
                        </Heading>
                        {article.summary && (
                          <Text style={articleSummaryStyle}>
                            {article.summary.substring(0, 100)}
                            {article.summary.length > 100 ? '...' : ''}
                          </Text>
                        )}
                        <Text style={articleMetaStyle}>
                          By {article.creatorName} •{' '}
                          {new Date(article.submittedAt).toLocaleDateString()}
                        </Text>
                      </td>
                      <td style={{ verticalAlign: 'middle', textAlign: 'right' }}>
                        <Link href={article.reviewUrl} style={reviewLinkStyle}>
                          Review →
                        </Link>
                      </td>
                    </tr>
                  </table>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Recent Articles */}
        {pendingArticles.filter((a) => a.daysWaiting < 2).length > 0 && (
          <>
            <Text style={sectionHeadingStyle}>Recent Submissions:</Text>
            <div style={articleListStyle}>
              {pendingArticles
                .filter((a) => a.daysWaiting < 2)
                .map((article) => (
                  <div key={article.id} style={articleItemStyle}>
                    <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
                      <tr>
                        <td style={{ paddingRight: '16px', verticalAlign: 'top' }}>
                          <div style={daysBadgeStyle}>{article.daysWaiting}d</div>
                        </td>
                        <td style={{ flex: 1 }}>
                          <Heading as="h3" style={articleTitleStyle}>
                            {article.title}
                          </Heading>
                          <Text style={articleMetaStyle}>
                            By {article.creatorName} •{' '}
                            {new Date(article.submittedAt).toLocaleDateString()}
                          </Text>
                        </td>
                        <td style={{ verticalAlign: 'middle', textAlign: 'right' }}>
                          <Link href={article.reviewUrl} style={reviewLinkStyle}>
                            Review →
                          </Link>
                        </td>
                      </tr>
                    </table>
                  </div>
                ))}
            </div>
          </>
        )}

        {/* Action Button */}
        <div style={actionContainerStyle}>
          <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
            <tr>
              <td style={{ textAlign: 'center', padding: '8px' }}>
                <EmailButton href={dashboardUrl}>View All Pending Articles</EmailButton>
              </td>
            </tr>
          </table>
        </div>

        <Hr style={hrStyle} />

        {/* Reminder Info */}
        <div style={reminderBoxStyle}>
          <Text style={reminderTextStyle}>
            💡 <strong>Reminder:</strong> Try to review articles within 24-48
            hours of submission to maintain quality turnaround times.
          </Text>
        </div>
      </EmailSection>

      <EmailFooter />
    </EmailLayout>
  );
}

// Export as default for dynamic imports
export default PendingReviewDigest;

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

const statsContainerStyle = {
  margin: '0 0 24px 0',
};

const statCellStyle = {
  padding: '0 8px',
  width: '50%',
};

const statBoxStyle = {
  backgroundColor: '#f6f9fc',
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center' as const,
};

const urgentStatStyle = {
  backgroundColor: '#fff3cd',
  borderLeft: '4px solid #ffc107',
};

const statNumberStyle = {
  color: '#2C2A4A',
  fontSize: '32px',
  fontWeight: '700',
  margin: '0 0 4px 0',
};

const statLabelStyle = {
  color: '#8898aa',
  fontSize: '13px',
  fontWeight: '500',
  margin: 0,
};

const introTextStyle = {
  color: '#525f7f',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 24px 0',
};

const sectionHeadingStyle = {
  color: '#2C2A4A',
  fontSize: '16px',
  fontWeight: '600',
  margin: '24px 0 16px 0',
};

const urgentSectionStyle = {
  margin: '0 0 24px 0',
};

const articleListStyle = {
  margin: '0 0 24px 0',
};

const articleItemStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e6ebf1',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '12px',
};

const daysBadgeStyle = {
  backgroundColor: '#e6ebf1',
  borderRadius: '12px',
  color: '#525f7f',
  fontSize: '12px',
  fontWeight: '600',
  padding: '6px 10px',
  display: 'inline-block',
};

const daysBadgeUrgentStyle = {
  backgroundColor: '#ffc107',
  borderRadius: '12px',
  color: '#856404',
  fontSize: '12px',
  fontWeight: '600',
  padding: '6px 10px',
  display: 'inline-block',
};

const articleTitleStyle = {
  color: '#2C2A4A',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 8px 0',
};

const articleSummaryStyle = {
  color: '#525f7f',
  fontSize: '13px',
  lineHeight: '1.5',
  margin: '0 0 8px 0',
};

const articleMetaStyle = {
  color: '#8898aa',
  fontSize: '12px',
  margin: 0,
};

const reviewLinkStyle = {
  color: '#4F518C',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
};

const actionContainerStyle = {
  margin: '32px 0',
};

const hrStyle = {
  borderColor: '#e6ebf1',
  margin: '32px 0',
};

const reminderBoxStyle = {
  backgroundColor: '#f0f7ff',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0 0 0',
};

const reminderTextStyle = {
  color: '#525f7f',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: 0,
};
