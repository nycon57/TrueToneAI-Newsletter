/**
 * Welcome Email Template
 *
 * Sent to new users after registration.
 * Warm welcome, quick start guide, and onboarding CTA.
 */

import { Heading, Text, Hr } from '@react-email/components';
import { EmailLayout } from './_components/EmailLayout';
import { EmailHeader } from './_components/EmailHeader';
import { EmailFooter } from './_components/EmailFooter';
import { EmailSection } from './_components/EmailSection';
import { EmailButton } from './_components/EmailButton';

export interface WelcomeEmailProps {
  name: string;
  quickStartSteps?: Array<{ title: string; description: string }>;
  onboardingUrl?: string;
}

export function WelcomeEmail({
  name,
  quickStartSteps,
  onboardingUrl,
}: WelcomeEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://truetone.ai';
  const defaultOnboardingUrl = onboardingUrl || `${baseUrl}/onboarding`;

  // Default quick start steps if not provided
  const steps = quickStartSteps || [
    {
      title: 'Complete Your Profile',
      description: 'Set your preferences to receive personalized content tailored to your market and style.',
    },
    {
      title: 'Explore Weekly Insights',
      description: 'Browse our AI-curated mortgage industry news and trends, delivered fresh every week.',
    },
    {
      title: 'Copy & Share Content',
      description: 'One-click copy scripts for video, email, and social media to engage your clients instantly.',
    },
  ];

  // Benefits/What to Expect
  const benefits = [
    {
      icon: '📰',
      title: 'Weekly Newsletter',
      description: 'Curated mortgage industry insights delivered to your inbox',
    },
    {
      icon: '🎯',
      title: 'AI Personalization',
      description: 'Content tailored to your unique voice and market',
    },
    {
      icon: '⚡',
      title: 'Ready-to-Use Scripts',
      description: 'Copy-paste marketing content for all your channels',
    },
  ];

  return (
    <EmailLayout preview={`Welcome to TrueTone Insights, ${name}!`}>
      <EmailHeader
        title={`Welcome, ${name}! 🎉`}
        subtitle="Let's help you stand out as a trusted mortgage expert"
      />

      <EmailSection>
        <Text style={greetingStyle}>
          Hi {name},
        </Text>

        <Text style={paragraphStyle}>
          Welcome to <strong>TrueTone Insights</strong>! We're thrilled to have you join thousands of loan officers who are using our AI-powered platform to stay informed and engage their clients with confidence.
        </Text>

        <Text style={paragraphStyle}>
          You're now equipped with weekly insights, personalized scripts, and the tools you need to turn mortgage news into meaningful conversations.
        </Text>

        {/* What to Expect Section */}
        <Text style={sectionHeadingStyle}>What You'll Love:</Text>

        {benefits.map((benefit, index) => (
          <div key={index} style={benefitCardStyle}>
            <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
              <tr>
                <td style={benefitIconCellStyle}>
                  <span style={benefitIconStyle}>{benefit.icon}</span>
                </td>
                <td>
                  <Text style={benefitTitleStyle}>{benefit.title}</Text>
                  <Text style={benefitDescriptionStyle}>{benefit.description}</Text>
                </td>
              </tr>
            </table>
          </div>
        ))}

        <Hr style={hrStyle} />

        {/* Quick Start Guide */}
        <Text style={sectionHeadingStyle}>Get Started in 3 Steps:</Text>

        {steps.map((step, index) => (
          <div key={index} style={stepContainerStyle}>
            <table width="100%" cellPadding="0" cellSpacing="0" role="presentation">
              <tr>
                <td style={stepNumberCellStyle}>
                  <div style={stepNumberStyle}>{index + 1}</div>
                </td>
                <td>
                  <Text style={stepTitleStyle}>{step.title}</Text>
                  <Text style={stepDescriptionStyle}>{step.description}</Text>
                </td>
              </tr>
            </table>
          </div>
        ))}

        {/* CTA */}
        <div style={ctaContainerStyle}>
          <EmailButton href={defaultOnboardingUrl}>
            Complete Your Onboarding
          </EmailButton>
        </div>

        <Hr style={hrStyle} />

        {/* Support Section */}
        <div style={supportBoxStyle}>
          <Text style={supportHeadingStyle}>Need Help Getting Started?</Text>
          <Text style={supportTextStyle}>
            Our support team is here for you! Have questions or need guidance? Reply to this email or visit our{' '}
            <a href={`${baseUrl}/account?tab=support`} style={linkStyle}>
              Support Center
            </a>
            .
          </Text>
        </div>

        <Text style={signatureStyle}>
          Welcome aboard,
          <br />
          <strong>The TrueTone Insights Team</strong>
        </Text>
      </EmailSection>

      <EmailFooter />
    </EmailLayout>
  );
}

// Export as default for dynamic imports
export default WelcomeEmail;

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

const sectionHeadingStyle = {
  color: '#2C2A4A',
  fontSize: '20px',
  fontWeight: '600',
  margin: '32px 0 20px 0',
};

const benefitCardStyle = {
  backgroundColor: '#f6f9fc',
  borderRadius: '8px',
  padding: '16px',
  margin: '0 0 12px 0',
};

const benefitIconCellStyle = {
  paddingRight: '16px',
  verticalAlign: 'top',
  width: '48px',
};

const benefitIconStyle = {
  fontSize: '32px',
  lineHeight: '1',
};

const benefitTitleStyle = {
  color: '#2C2A4A',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 4px 0',
};

const benefitDescriptionStyle = {
  color: '#525f7f',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: 0,
};

const hrStyle = {
  borderColor: '#e6ebf1',
  margin: '32px 0',
};

const stepContainerStyle = {
  margin: '0 0 20px 0',
};

const stepNumberCellStyle = {
  paddingRight: '16px',
  verticalAlign: 'top',
  width: '48px',
};

const stepNumberStyle = {
  backgroundColor: '#4F518C',
  borderRadius: '50%',
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '700',
  height: '40px',
  lineHeight: '40px',
  textAlign: 'center' as const,
  width: '40px',
};

const stepTitleStyle = {
  color: '#2C2A4A',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 6px 0',
};

const stepDescriptionStyle = {
  color: '#525f7f',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: 0,
};

const ctaContainerStyle = {
  margin: '40px 0',
  textAlign: 'center' as const,
};

const supportBoxStyle = {
  backgroundColor: '#f0f7ff',
  borderLeft: '4px solid #4F518C',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const supportHeadingStyle = {
  color: '#2C2A4A',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 8px 0',
};

const supportTextStyle = {
  color: '#525f7f',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: 0,
};

const linkStyle = {
  color: '#4F518C',
  textDecoration: 'underline',
};

const signatureStyle = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '32px 0 0 0',
};
