/**
 * TrueTone Custom Authentication Layout
 *
 * This file should be placed at: kindeSrc/environment/pages/layout.tsx
 * in your custom UI repository after creating from Splitscape template.
 *
 * This layout wraps all authentication pages and provides:
 * - CSS custom properties injection
 * - Split-screen design (brand on left, form on right)
 * - Responsive mobile layout
 * - SEO meta tags
 */

import { styles } from './styles';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* SEO & Social */}
        <title>Sign In | TrueTone Insights</title>
        <meta name="description" content="Sign in to access market intelligence for loan officers" />

        {/* Favicon */}
        <link rel="icon" href="https://truetoneai.com/favicon.ico" />

        {/* Inject CSS Custom Properties */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                ${Object.entries(styles)
                  .map(([key, value]) => `${key}: ${value};`)
                  .join('\n                ')}
              }

              /* Reset & Base Styles */
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }

              body {
                font-family: var(--kinde-base-font-family);
                font-size: var(--kinde-base-font-size);
                color: var(--kinde-base-color);
                line-height: var(--kinde-line-height-normal);
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }

              /* Layout Container */
              .auth-container {
                display: flex;
                min-height: 100vh;
                width: 100%;
              }

              /* Left Side - Brand Section */
              .auth-brand-section {
                flex: 1;
                background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                color: white;
                padding: 4rem;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                overflow: hidden;
              }

              /* Background pattern */
              .auth-brand-section::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-image:
                  radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%);
                pointer-events: none;
              }

              .brand-content {
                position: relative;
                z-index: 1;
                max-width: 480px;
              }

              .brand-logo {
                width: 180px;
                height: auto;
                margin-bottom: 2rem;
              }

              .brand-content h1 {
                font-size: 2.5rem;
                font-weight: var(--kinde-font-weight-bold);
                margin-bottom: 1rem;
                line-height: var(--kinde-line-height-tight);
              }

              .brand-content > p {
                font-size: 1.25rem;
                opacity: 0.9;
                margin-bottom: 2.5rem;
              }

              .features {
                list-style: none;
                margin: 0;
                padding: 0;
              }

              .features li {
                padding: 0.75rem 0;
                font-size: 1.125rem;
                display: flex;
                align-items: center;
                opacity: 0.95;
              }

              .features li::before {
                content: '✓';
                margin-right: 0.75rem;
                font-weight: var(--kinde-font-weight-bold);
                font-size: 1.25rem;
              }

              /* Right Side - Form Section */
              .auth-form-section {
                flex: 1;
                background: var(--kinde-page-background-color);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
              }

              /* Mobile Responsive */
              @media (max-width: 768px) {
                .auth-container {
                  flex-direction: column;
                }

                .auth-brand-section {
                  flex: none;
                  min-height: 40vh;
                  padding: 2rem;
                }

                .brand-content {
                  max-width: 100%;
                }

                .brand-content h1 {
                  font-size: 1.875rem;
                }

                .brand-content > p {
                  font-size: 1rem;
                  margin-bottom: 1.5rem;
                }

                .features {
                  display: none; /* Hide features on mobile */
                }

                .auth-form-section {
                  flex: 1;
                  padding: 1.5rem;
                }
              }

              /* Tablet */
              @media (min-width: 769px) and (max-width: 1024px) {
                .brand-content h1 {
                  font-size: 2rem;
                }

                .features li {
                  font-size: 1rem;
                }
              }
            `,
          }}
        />
      </head>

      <body>
        <div className="auth-container">
          {/* Left Side - Brand */}
          <div className="auth-brand-section">
            <div className="brand-content">
              {/* Logo */}
              <img
                src="https://truetoneai.com/logo-white.svg"
                alt="TrueTone Insights"
                className="brand-logo"
              />

              {/* Heading */}
              <h1>Welcome to TrueTone Insights</h1>

              {/* Subheading */}
              <p>Market intelligence and AI-powered content for loan officers</p>

              {/* Feature List */}
              <ul className="features">
                <li>AI-powered market analysis</li>
                <li>Personalized newsletter content</li>
                <li>Multi-channel marketing scripts</li>
                <li>Real-time industry insights</li>
              </ul>
            </div>
          </div>

          {/* Right Side - Authentication Form (Kinde widget) */}
          <div className="auth-form-section">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}

/**
 * CUSTOMIZATION NOTES:
 *
 * 1. Logo URL:
 *    - Replace "https://truetoneai.com/logo-white.svg" with your actual logo
 *    - Use a white/light version for the gradient background
 *    - Host on your domain or use a CDN
 *
 * 2. Background Gradient:
 *    - Current: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)
 *    - Customize colors to match your brand
 *    - Consider using brand colors from your design system
 *
 * 3. Feature List:
 *    - Update bullet points to highlight your app's key features
 *    - Keep it concise (3-4 items)
 *    - Focus on value proposition
 *
 * 4. Responsive Behavior:
 *    - Mobile: Stacked layout (brand top, form bottom)
 *    - Desktop: Split-screen (brand left, form right)
 *    - Customize breakpoints as needed
 *
 * 5. Branding Assets:
 *    - All external assets (logo, images) must be HTTPS
 *    - Host on same domain as auth pages for best performance
 *    - Or use CDN with proper CORS configuration
 *
 * 6. Alternative Layouts:
 *    - Centered card: Remove brand section, center form
 *    - Full background: Background image instead of gradient
 *    - Minimal: Simple centered form without brand section
 *
 * 7. Dark Mode Support (Optional):
 *    - Add dark mode styles if your app supports it
 *    - Check for prefers-color-scheme media query
 *    - Adjust colors accordingly
 */
