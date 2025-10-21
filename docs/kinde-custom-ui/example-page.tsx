/**
 * TrueTone Custom Authentication Page
 *
 * This file should be placed at: kindeSrc/environment/pages/(kinde)/(default)/page.tsx
 * in your custom UI repository after creating from Splitscape template.
 *
 * This is the default page template for all authentication flows.
 * You can create route-specific pages later (login/, register/, etc.)
 */

interface PageContext {
  pageType: string;      // 'login', 'register', 'recovery', 'verify', etc.
  locale?: string;       // User's locale
  client?: any;          // Client application info
  request?: any;         // Request details
}

interface PageProps {
  context: PageContext;
}

export default function Page({ context }: PageProps) {
  // Determine page-specific content
  const getPageContent = () => {
    const { pageType } = context;

    switch (pageType) {
      case 'login':
        return {
          heading: 'Sign in to your account',
          subheading: 'Welcome back! Enter your credentials to continue.',
          footerText: "Don't have an account?",
          footerLink: 'Sign up',
        };

      case 'register':
        return {
          heading: 'Create your account',
          subheading: 'Get started with TrueTone Insights in seconds.',
          footerText: 'Already have an account?',
          footerLink: 'Sign in',
        };

      case 'recovery':
        return {
          heading: 'Reset your password',
          subheading: "Enter your email and we'll send you a reset link.",
          footerText: 'Remember your password?',
          footerLink: 'Back to sign in',
        };

      case 'verify':
        return {
          heading: 'Verify your email',
          subheading: "We've sent a verification code to your email.",
          footerText: "Didn't receive the code?",
          footerLink: 'Resend',
        };

      case 'mfa':
        return {
          heading: 'Two-factor authentication',
          subheading: 'Enter the code from your authenticator app.',
          footerText: 'Having trouble?',
          footerLink: 'Get help',
        };

      default:
        return {
          heading: 'Welcome',
          subheading: 'Please complete the authentication process.',
          footerText: '',
          footerLink: '',
        };
    }
  };

  const content = getPageContent();

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* Page Container */
            .auth-page {
              width: 100%;
              max-width: 400px;
              margin: 0 auto;
            }

            /* Header Section */
            .auth-header {
              text-align: center;
              margin-bottom: 2rem;
            }

            .auth-header h2 {
              font-size: var(--kinde-heading-font-size);
              font-weight: var(--kinde-font-weight-bold);
              color: var(--kinde-heading-color);
              margin-bottom: 0.5rem;
              line-height: var(--kinde-line-height-tight);
            }

            .auth-header p {
              font-size: var(--kinde-base-font-size);
              color: var(--kinde-secondary-color);
              line-height: var(--kinde-line-height-normal);
            }

            /* Widget Container */
            .auth-widget-container {
              background: var(--kinde-card-background-color);
              border: 1px solid var(--kinde-card-border-color);
              border-radius: var(--kinde-card-border-radius);
              padding: var(--kinde-card-padding);
              box-shadow: var(--kinde-card-shadow);
              margin-bottom: 1.5rem;
            }

            /* Footer Section */
            .auth-footer {
              text-align: center;
              padding-top: 1.5rem;
              border-top: 1px solid var(--kinde-divider-color);
            }

            .auth-footer p {
              font-size: var(--kinde-small-font-size);
              color: var(--kinde-secondary-color);
              margin-bottom: 1rem;
            }

            .auth-footer a {
              color: var(--kinde-link-color);
              text-decoration: none;
              font-weight: var(--kinde-font-weight-medium);
              transition: color var(--kinde-transition-fast);
            }

            .auth-footer a:hover {
              color: var(--kinde-link-hover-color);
              text-decoration: underline;
            }

            .auth-links {
              display: flex;
              justify-content: center;
              gap: 1.5rem;
              margin-top: 1.5rem;
            }

            .auth-links a {
              font-size: var(--kinde-small-font-size);
              color: var(--kinde-tertiary-color);
            }

            /* Security Badge */
            .security-badge {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 0.5rem;
              margin-top: 2rem;
              padding: 0.75rem;
              background: var(--kinde-info-background-color);
              border-radius: var(--kinde-border-radius);
              font-size: var(--kinde-small-font-size);
              color: var(--kinde-info-color);
            }

            .security-badge svg {
              width: 16px;
              height: 16px;
            }

            /* Mobile Responsive */
            @media (max-width: 640px) {
              .auth-page {
                max-width: 100%;
              }

              .auth-header h2 {
                font-size: 1.5rem;
              }

              .auth-widget-container {
                padding: 1.5rem;
              }

              .auth-links {
                flex-direction: column;
                gap: 0.75rem;
              }
            }
          `,
        }}
      />

      <div className="auth-page">
        {/* Header */}
        <div className="auth-header">
          <h2>{content.heading}</h2>
          <p>{content.subheading}</p>
        </div>

        {/* Authentication Widget (Kinde auto-injects this) */}
        <div className="auth-widget-container">
          {/* The Kinde widget will be rendered here automatically */}
          {/* This includes: form fields, social auth buttons, error messages, etc. */}
        </div>

        {/* Footer */}
        <div className="auth-footer">
          {content.footerText && (
            <p>
              {content.footerText}{' '}
              <a href="#">{content.footerLink}</a>
            </p>
          )}

          {/* Links to legal pages */}
          <div className="auth-links">
            <a href="https://truetoneai.com/terms" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>
            <a href="https://truetoneai.com/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            <a href="https://truetoneai.com/support" target="_blank" rel="noopener noreferrer">
              Support
            </a>
          </div>

          {/* Security Badge (Optional) */}
          <div className="security-badge">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11.5 10a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Secured by Kinde</span>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * CUSTOMIZATION NOTES:
 *
 * 1. Dynamic Content:
 *    - The page adapts messaging based on pageType
 *    - Customize messages in getPageContent() function
 *    - Add more page types as needed
 *
 * 2. Kinde Widget:
 *    - The .auth-widget-container is where Kinde injects the form
 *    - You don't need to render form fields manually
 *    - Kinde handles: inputs, validation, social auth buttons, errors
 *    - Styles from styles.ts apply to the widget automatically
 *
 * 3. Footer Links:
 *    - Update URLs to point to your actual pages
 *    - Consider adding: Help Center, FAQ, Contact Support
 *    - Ensure all external links open in new tab
 *
 * 4. Security Badge:
 *    - Optional visual element to build trust
 *    - Customize or remove based on preference
 *    - Could add SSL icon, SOC 2 badge, etc.
 *
 * 5. Localization (Advanced):
 *    ```tsx
 *    const getMessage = () => {
 *      const locale = context.locale || 'en';
 *      if (locale === 'es') return 'Iniciar sesión';
 *      return 'Sign in';
 *    };
 *    ```
 *
 * 6. Route-Specific Pages (Advanced):
 *    Create separate page.tsx files for specific routes:
 *
 *    kindeSrc/environment/pages/(kinde)/
 *    ├── login/
 *    │   └── page.tsx        # Custom login page
 *    ├── register/
 *    │   └── page.tsx        # Custom sign-up page
 *    ├── recovery/
 *    │   └── page.tsx        # Custom password reset
 *    └── (default)/
 *        └── page.tsx        # Fallback (this file)
 *
 * 7. Additional Context Available:
 *    - context.client: Info about your application
 *    - context.request: Request details (headers, IP, etc.)
 *    - context.locale: User's locale
 *    - Use for conditional rendering or analytics
 *
 * 8. Analytics Tracking (Optional):
 *    ```tsx
 *    useEffect(() => {
 *      // Track page view
 *      analytics.track('Auth Page Viewed', {
 *        pageType: context.pageType,
 *      });
 *    }, []);
 *    ```
 *
 * 9. Error Handling:
 *    - Kinde handles error display automatically
 *    - Errors styled via CSS custom properties
 *    - Customize error appearance in styles.ts:
 *      --kinde-error-color
 *      --kinde-error-background-color
 */
