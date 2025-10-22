import { Section } from '@react-email/components';
import { ReactNode, CSSProperties } from 'react';

interface EmailSectionProps {
  children: ReactNode;
  backgroundColor?: string;
  padding?: string;
  style?: CSSProperties;
}

export function EmailSection({
  children,
  backgroundColor,
  padding = '32px 40px',
  style = {},
}: EmailSectionProps) {
  return (
    <Section
      style={{
        backgroundColor: backgroundColor || 'transparent',
        padding,
        ...style,
      }}
    >
      {children}
    </Section>
  );
}
