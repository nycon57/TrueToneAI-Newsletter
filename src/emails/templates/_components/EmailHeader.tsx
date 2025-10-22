import { Section, Img, Heading, Text } from '@react-email/components';

interface EmailHeaderProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
}

export function EmailHeader({
  title,
  subtitle,
  showLogo = true,
}: EmailHeaderProps) {
  return (
    <>
      {/* Logo Section */}
      {showLogo && (
        <Section style={logoSectionStyle}>
          <Img
            src="https://truetone.ai/logo.png"
            width="150"
            height="40"
            alt="TrueTone Insights"
            style={logoStyle}
          />
        </Section>
      )}

      {/* Hero Section with Gradient */}
      {(title || subtitle) && (
        <Section style={heroSectionStyle}>
          <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
            <tr>
              <td style={gradientBackgroundStyle}>
                {title && <Heading style={titleStyle}>{title}</Heading>}
                {subtitle && <Text style={subtitleStyle}>{subtitle}</Text>}
              </td>
            </tr>
          </table>
        </Section>
      )}
    </>
  );
}

const logoSectionStyle = {
  padding: '24px 40px',
  textAlign: 'center' as const,
};

const logoStyle = {
  margin: '0 auto',
};

const heroSectionStyle = {
  width: '100%',
};

const gradientBackgroundStyle = {
  background: 'linear-gradient(135deg, #4F518C 0%, #2C2A4A 100%)',
  padding: '48px 40px',
  textAlign: 'center' as const,
};

const titleStyle = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '700',
  lineHeight: '1.2',
  margin: '0 0 12px 0',
  padding: 0,
};

const subtitleStyle = {
  color: '#DABFFF',
  fontSize: '18px',
  fontWeight: '400',
  lineHeight: '1.5',
  margin: 0,
  padding: 0,
};
