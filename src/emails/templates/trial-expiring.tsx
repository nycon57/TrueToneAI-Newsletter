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

interface TrialExpiringEmailProps {
  userName?: string;
  daysRemaining?: number;
}

export const TrialExpiringEmail = ({
  userName = 'there',
  daysRemaining = 3,
}: TrialExpiringEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your trial is expiring soon</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Text style={heading}>Hi {userName},</Text>
            <Text style={text}>
              Your trial will expire in {daysRemaining} days.
            </Text>
            <Text style={text}>
              To continue using TrueTone Insights, please subscribe to one of our plans.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default TrialExpiringEmail;

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
