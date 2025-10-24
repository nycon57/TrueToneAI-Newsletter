import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface OnboardingCompleteEmailProps {
  userName?: string;
}

export const OnboardingCompleteEmail = ({
  userName = 'there',
}: OnboardingCompleteEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to TrueTone Insights!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Text style={heading}>Welcome to TrueTone Insights, {userName}!</Text>
            <Text style={text}>
              You've completed onboarding and are ready to start using TrueTone Insights.
            </Text>
            <Text style={text}>
              We're excited to have you on board!
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OnboardingCompleteEmail;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const section = {
  padding: '24px',
  border: 'solid 1px #dedede',
  borderRadius: '5px',
  textAlign: 'left' as const,
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 15px',
};

const text = {
  fontSize: '16px',
  lineHeight: '26px',
};
