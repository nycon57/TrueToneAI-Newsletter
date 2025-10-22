import { Button } from '@react-email/components';

interface EmailButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function EmailButton({
  href,
  children,
  variant = 'primary',
}: EmailButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Button
      href={href}
      style={{
        ...baseButtonStyle,
        ...(isPrimary ? primaryButtonStyle : secondaryButtonStyle),
      }}
    >
      {children}
    </Button>
  );
}

const baseButtonStyle = {
  borderRadius: '8px',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '1',
  minHeight: '44px',
  padding: '14px 28px',
  textAlign: 'center' as const,
  textDecoration: 'none',
  transition: 'all 0.2s ease',
};

const primaryButtonStyle = {
  background: 'linear-gradient(135deg, #4F518C 0%, #2C2A4A 100%)',
  color: '#ffffff',
};

const secondaryButtonStyle = {
  backgroundColor: '#ffffff',
  border: '2px solid #4F518C',
  color: '#4F518C',
};
