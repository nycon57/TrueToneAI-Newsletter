/**
 * TrueTone Newsletter - Application-Specific Authentication Page
 *
 * This file should be placed at: kindeSrc/environment/pages/(kinde)/(default)/page.tsx
 * in your custom UI repository after creating from Splitscape template.
 *
 * This version includes conditional rendering based on Kinde Application Client ID,
 * allowing you to have different designs for TrueTone Newsletter vs other apps.
 *
 * IMPORTANT: This uses server actions and Kinde infrastructure
 */

'use server';

import {
  getKindeWidget,
  type KindePageEvent,
} from '@kinde/infrastructure';
import React from 'react';
import { renderToString } from 'react-dom/server.browser';
import Layout from '../../layout';

/**
 * Main Page Component with Application-Specific Rendering
 */
const DefaultPage: React.FC<KindePageEvent> = async ({ context, request }) => {
  // ============================================================================
  // 1. EXTRACT CLIENT ID FROM REQUEST
  // ============================================================================
  // The clientId tells us which Kinde application is making the auth request
  const clientId = request.authUrlParams?.clientId || null;

  // ============================================================================
  // 2. LOAD APPLICATION CLIENT IDS FROM ENVIRONMENT VARIABLES
  // ============================================================================
  // These should be set in your custom UI repository .env file
  // and configured in Kinde Dashboard → Design → Custom code → Settings
  const CLIENT_ID_NEWSLETTER = process.env.CLIENT_ID_NEWSLETTER;
  const CLIENT_ID_DASHBOARD = process.env.CLIENT_ID_DASHBOARD; // For future use
  const CLIENT_ID_ADMIN = process.env.CLIENT_ID_ADMIN;         // For future use

  // ============================================================================
  // 3. DETERMINE AUTH FLOW TYPE
  // ============================================================================
  // Tells us if user is on login, register, password recovery, etc.
  const authFlow = request?.route?.flow;

  // ============================================================================
  // 4. HELPER FUNCTIONS FOR DYNAMIC CONTENT
  // ============================================================================

  /**
   * Get page heading based on auth flow
   */
  const getNewsletterHeading = () => {
    switch (authFlow) {
      case 'login':
        return 'Welcome Back';
      case 'register':
        return 'Get Started Free';
      case 'recovery':
        return 'Reset Your Password';
      case 'verify':
        return 'Verify Your Email';
      case 'mfa':
        return 'Two-Factor Authentication';
      default:
        return 'TrueTone Insights';
    }
  };

  /**
   * Get page subheading based on auth flow
   */
  const getNewsletterSubheading = () => {
    switch (authFlow) {
      case 'login':
        return 'Sign in to access your personalized market insights';
      case 'register':
        return 'Join 10,000+ loan officers staying ahead of the market';
      case 'recovery':
        return "Enter your email and we'll send you a reset link";
      case 'verify':
        return "We've sent a verification code to your email";
      case 'mfa':
        return 'Enter the code from your authenticator app';
      default:
        return 'Market Intelligence for Loan Officers';
    }
  };

  // ============================================================================
  // 5. CONDITIONAL RENDERING BASED ON CLIENT ID
  // ============================================================================

  return (
    <Layout context={context} request={request}>
      {/* ===================================================================== */}
      {/* TRUETONE NEWSLETTER APPLICATION */}
      {/* ===================================================================== */}
      {clientId === CLIENT_ID_NEWSLETTER ? (
        <div className="newsletter-auth-container">
          {/* Newsletter Header */}
          <div className="newsletter-brand">
            <div className="newsletter-logo">
              {/* Replace with your actual logo URL */}
              <img
                src="https://truetoneai.com/logo.svg"
                alt="TrueTone Insights"
                width={180}
                height={48}
              />
            </div>

            <h1 className="newsletter-title">
              {getNewsletterHeading()}
            </h1>

            <p className="newsletter-subtitle">
              {getNewsletterSubheading()}
            </p>
          </div>

          {/* Value Proposition - Show only on login/register */}
          {(authFlow === 'login' || authFlow === 'register') && (
            <div className="newsletter-value-props">
              <ul className="feature-list">
                <li>
                  <span className="feature-icon">✓</span>
                  <span className="feature-text">AI-powered market analysis</span>
                </li>
                <li>
                  <span className="feature-icon">✓</span>
                  <span className="feature-text">Personalized newsletter content</span>
                </li>
                <li>
                  <span className="feature-icon">✓</span>
                  <span className="feature-text">Multi-channel marketing scripts</span>
                </li>
                <li>
                  <span className="feature-icon">✓</span>
                  <span className="feature-text">Real-time industry insights</span>
                </li>
              </ul>
            </div>
          )}

          {/* Authentication Form - Kinde Widget */}
          <div className="auth-form-wrapper">
            {getKindeWidget()}
          </div>

          {/* Social Proof - Show only on register */}
          {authFlow === 'register' && (
            <div className="newsletter-social-proof">
              <p className="social-proof-text">
                🎉 Join 10,000+ loan officers who get market insights delivered weekly
              </p>
            </div>
          )}

          {/* Footer Links */}
          <div className="newsletter-footer">
            <div className="footer-links">
              <a
                href="https://truetoneai.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                Terms of Service
              </a>
              <span className="footer-separator">·</span>
              <a
                href="https://truetoneai.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                Privacy Policy
              </a>
              <span className="footer-separator">·</span>
              <a
                href="https://truetoneai.com/support"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                Support
              </a>
            </div>

            {/* Security Badge */}
            <div className="security-badge">
              <svg
                className="security-icon"
                fill="currentColor"
                viewBox="0 0 20 20"
                width={16}
                height={16}
              >
                <path
                  fillRule="evenodd"
                  d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11.5 10a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="security-text">Secured by Kinde</span>
            </div>
          </div>
        </div>

      /* ===================================================================== */
      /* TRUETONE DASHBOARD APPLICATION (Future) */
      /* ===================================================================== */
      ) : clientId === CLIENT_ID_DASHBOARD ? (
        <div className="dashboard-auth-container">
          <div className="dashboard-brand">
            <h1>TrueTone Dashboard</h1>
            <p>Analytics & Insights Platform</p>
          </div>

          <div className="auth-heading">
            {authFlow === 'login' && <h2>Sign In to Dashboard</h2>}
            {authFlow === 'register' && <h2>Create Dashboard Account</h2>}
          </div>

          <div className="dashboard-features">
            <ul>
              <li>✓ Advanced analytics</li>
              <li>✓ Team collaboration</li>
              <li>✓ Custom reports</li>
              <li>✓ API access</li>
            </ul>
          </div>

          <div className="auth-form-wrapper">
            {getKindeWidget()}
          </div>
        </div>

      /* ===================================================================== */
      /* TRUETONE ADMIN APPLICATION (Future) */
      /* ===================================================================== */
      ) : clientId === CLIENT_ID_ADMIN ? (
        <div className="admin-auth-container">
          <div className="admin-brand">
            <h1>TrueTone Admin</h1>
            <p>Administration Portal</p>
          </div>

          <div className="auth-heading">
            <h2>Admin Sign In</h2>
            <p className="admin-warning">⚠️ Admin access only. All actions are logged.</p>
          </div>

          <div className="auth-form-wrapper">
            {getKindeWidget()}
          </div>
        </div>

      /* ===================================================================== */
      /* DEFAULT/FALLBACK FOR OTHER APPLICATIONS */
      /* ===================================================================== */
      ) : (
        <div className="default-auth-container">
          <div className="default-brand">
            <h1>TrueTone Authentication</h1>
          </div>

          <div className="auth-heading">
            {authFlow === 'login' && <h2>Sign In</h2>}
            {authFlow === 'register' && <h2>Create Account</h2>}
            {authFlow === 'recovery' && <h2>Reset Password</h2>}
            {!authFlow && <h2>Welcome</h2>}
          </div>

          <div className="auth-form-wrapper">
            {getKindeWidget()}
          </div>

          {/* Debug info - remove in production */}
          <div className="debug-info">
            <p>Client ID: {clientId || 'Not available'}</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

// ============================================================================
// EXPORT PAGE COMPONENT
// ============================================================================
// Kinde requires the page to be exported as a string
export default async function Page(event: KindePageEvent): Promise<string> {
  const page = await DefaultPage(event);
  return renderToString(page);
}

/**
 * =============================================================================
 * IMPLEMENTATION NOTES
 * =============================================================================
 *
 * 1. CLIENT ID SETUP:
 *    - Get Client ID from: Kinde Dashboard → Settings → Applications
 *    - Current Newsletter Client ID: 8f8a80b86ec844b5b68e9c570649e05a
 *    - Store in custom UI repo .env as CLIENT_ID_NEWSLETTER
 *    - Configure in Kinde Dashboard → Design → Custom code → Settings
 *
 * 2. ENVIRONMENT VARIABLES:
 *    Create .env in your custom UI repository:
 *    ```
 *    CLIENT_ID_NEWSLETTER=8f8a80b86ec844b5b68e9c570649e05a
 *    CLIENT_ID_DASHBOARD=your_dashboard_id (when created)
 *    CLIENT_ID_ADMIN=your_admin_id (when created)
 *    ```
 *
 * 3. TESTING:
 *    - Test by authenticating through Newsletter app
 *    - Verify Newsletter branding appears
 *    - Test all auth flows (login, register, recovery, etc.)
 *
 * 4. ADDING NEW APPLICATIONS:
 *    - Create new app in Kinde Dashboard
 *    - Copy Client ID
 *    - Add to .env
 *    - Add new conditional block above
 *    - Add corresponding CSS in layout.tsx
 *    - Test and deploy
 *
 * 5. CUSTOMIZATION:
 *    - Update logo URL to your actual logo
 *    - Adjust feature list for your value props
 *    - Update footer links to your actual pages
 *    - Customize colors in layout.tsx CSS
 *
 * 6. PERFORMANCE:
 *    - All logic runs server-side (no client impact)
 *    - Conditional rendering happens before page sends to user
 *    - Fast and efficient
 *
 * 7. DEBUGGING:
 *    - Temporarily add this to see active Client ID:
 *      <div>DEBUG: Client ID = {clientId}</div>
 *    - Check browser console for any errors
 *    - Verify env vars loaded in Kinde dashboard
 *
 * =============================================================================
 */
