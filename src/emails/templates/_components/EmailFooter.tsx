import { Section, Text, Link, Hr, Row, Column } from '@react-email/components';

interface EmailFooterProps {
  showUnsubscribe?: boolean;
  unsubscribeUrl?: string;
}

export function EmailFooter({
  showUnsubscribe = false,
  unsubscribeUrl,
}: EmailFooterProps) {
  return (
    <>
      <Hr style={hrStyle} />

      {/* Social Links */}
      <Section style={socialSectionStyle}>
        <Row>
          <Column align="center">
            <Link href="https://twitter.com/truetone" style={socialLinkStyle}>
              Twitter
            </Link>
            <Text style={separatorStyle}>•</Text>
            <Link href="https://linkedin.com/company/truetone" style={socialLinkStyle}>
              LinkedIn
            </Link>
            <Text style={separatorStyle}>•</Text>
            <Link href="https://truetone.ai" style={socialLinkStyle}>
              Website
            </Link>
          </Column>
        </Row>
      </Section>

      {/* Footer Info */}
      <Section style={footerSectionStyle}>
        <Text style={footerTextStyle}>
          TrueTone Insights
          <br />
          Empowering loan officers with AI-powered marketing content
        </Text>

        {showUnsubscribe && unsubscribeUrl && (
          <Text style={unsubscribeSectionStyle}>
            <Link href={unsubscribeUrl} style={unsubscribeLinkStyle}>
              Unsubscribe from these emails
            </Link>
          </Text>
        )}

        <Text style={legalTextStyle}>
          <Link href="https://truetone.ai/privacy" style={legalLinkStyle}>
            Privacy Policy
          </Link>
          {' • '}
          <Link href="https://truetone.ai/terms" style={legalLinkStyle}>
            Terms of Service
          </Link>
        </Text>

        <Text style={addressTextStyle}>
          123 Main Street, Suite 100
          <br />
          San Francisco, CA 94102
        </Text>
      </Section>
    </>
  );
}

const hrStyle = {
  borderColor: '#e6ebf1',
  margin: '40px 0',
};

const socialSectionStyle = {
  padding: '0 40px 24px',
  textAlign: 'center' as const,
};

const socialLinkStyle = {
  color: '#4F518C',
  fontSize: '14px',
  fontWeight: '500',
  textDecoration: 'none',
};

const separatorStyle = {
  color: '#8898aa',
  display: 'inline',
  margin: '0 8px',
};

const footerSectionStyle = {
  padding: '0 40px 40px',
  textAlign: 'center' as const,
};

const footerTextStyle = {
  color: '#525f7f',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
};

const unsubscribeSectionStyle = {
  margin: '24px 0 16px 0',
};

const unsubscribeLinkStyle = {
  color: '#8898aa',
  fontSize: '12px',
  textDecoration: 'underline',
};

const legalTextStyle = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
};

const legalLinkStyle = {
  color: '#8898aa',
  textDecoration: 'none',
};

const addressTextStyle = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '1.6',
  margin: 0,
};
