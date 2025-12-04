/**
 * Email Unsubscribe API
 *
 * Handles unsubscribe requests from email links with cryptographic token validation.
 * Supports both GET and POST methods.
 *
 * Security:
 * - HMAC-SHA256 token validation
 * - Time-limited tokens (72 hours)
 * - Email address verification
 * - Timing-safe comparison to prevent timing attacks
 *
 * Usage:
 * - GET /api/email/unsubscribe?token=xxx&email=user@example.com
 * - POST /api/email/unsubscribe with JSON body
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isValidEmail } from '@/emails';
import { validateEmailToken } from '@/lib/email/tokens';

/**
 * Generate HTML response for unsubscribe pages
 */
function generateHtmlResponse(
  title: string,
  heading: string,
  message: string,
  isSuccess: boolean,
  email?: string
): string {
  const headingColor = isSuccess ? '#2e7d32' : '#d32f2f';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return `
<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
      text-align: center;
      background: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: ${headingColor};
      margin-bottom: 20px;
    }
    p {
      color: #666;
      line-height: 1.6;
      margin: 15px 0;
    }
    .email {
      background: #f5f5f5;
      padding: 10px;
      border-radius: 4px;
      font-family: monospace;
      margin: 20px 0;
    }
    .note {
      font-size: 14px;
      color: #999;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    a {
      color: #0066cc;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${heading}</h1>
    <p>${message}</p>
    ${email ? `<div class="email">${email}</div>` : ''}
    ${isSuccess ? `
    <p>You will no longer receive marketing emails, product updates, or newsletters from us.</p>
    <p>You will still receive important account-related emails such as password resets and billing notifications.</p>
    <div class="note">
      <p>Changed your mind? You can update your email preferences anytime in your <a href="${appUrl}/account">account settings</a>.</p>
    </div>
    ` : `
    <p>If you continue to have issues, please <a href="${appUrl}/contact">contact support</a>.</p>
    `}
  </div>
</body>
</html>
  `;
}

/**
 * GET /api/email/unsubscribe
 *
 * Unsubscribe via URL link (e.g., from email)
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    // Check required parameters
    if (!token || !email) {
      return new NextResponse(
        generateHtmlResponse(
          'Invalid Unsubscribe Link',
          'Invalid Unsubscribe Link',
          'This unsubscribe link is invalid or missing required parameters.',
          false
        ),
        { status: 400, headers: { 'Content-Type': 'text/html' } }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return new NextResponse(
        generateHtmlResponse(
          'Invalid Email',
          'Invalid Email Address',
          'The email address in this unsubscribe link is not valid.',
          false
        ),
        { status: 400, headers: { 'Content-Type': 'text/html' } }
      );
    }

    // Validate token cryptographically
    const tokenValidation = validateEmailToken(token, email, 'unsubscribe');

    if (!tokenValidation.valid) {
      console.log('[Unsubscribe] Token validation failed:', {
        email,
        error: tokenValidation.error,
        timestamp: new Date().toISOString()
      });

      let errorMessage = 'The unsubscribe token is invalid.';
      if (tokenValidation.error === 'Token has expired') {
        errorMessage = 'This unsubscribe link has expired. Please use a more recent email or log in to manage your preferences.';
      }

      return new NextResponse(
        generateHtmlResponse(
          'Invalid Token',
          'Invalid or Expired Link',
          errorMessage,
          false
        ),
        { status: 400, headers: { 'Content-Type': 'text/html' } }
      );
    }

    // Update user preferences in database
    try {
      const supabase = await createClient();

      const { error } = await supabase
        .from('users')
        .update({
          email_preferences: {
            marketing: false,
            product_updates: false,
            newsletter: false,
            transactional: true // Always keep transactional emails enabled
          },
          updatedAt: new Date().toISOString()
        })
        .eq('email', email.toLowerCase());

      if (error) {
        console.error('[Unsubscribe] Database error:', error);
        // Continue to show success page - user intent is clear
      }

      // Log unsubscribe event for analytics
      console.log('[Unsubscribe] User unsubscribed:', {
        email,
        tokenExpiresAt: tokenValidation.payload?.expiresAt,
        timestamp: new Date().toISOString()
      });

    } catch (dbError) {
      console.error('[Unsubscribe] Error updating database:', dbError);
      // Continue to show success page even if DB update fails
    }

    // Show success page
    return new NextResponse(
      generateHtmlResponse(
        'Unsubscribed Successfully',
        "You've been unsubscribed",
        "We've removed the following email address from our mailing list:",
        true,
        email
      ),
      { status: 200, headers: { 'Content-Type': 'text/html' } }
    );

  } catch (error) {
    console.error('[Unsubscribe] Error processing request:', error);
    return new NextResponse(
      generateHtmlResponse(
        'Unsubscribe Error',
        'Something went wrong',
        'We encountered an error while processing your unsubscribe request. Please try again later.',
        false
      ),
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    );
  }
}

/**
 * POST /api/email/unsubscribe
 *
 * Unsubscribe via API call (e.g., from account settings)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, token, preferences } = body;

    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email and token are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate token cryptographically
    const tokenValidation = validateEmailToken(token, email, 'unsubscribe');

    if (!tokenValidation.valid) {
      console.log('[Unsubscribe] API token validation failed:', {
        email,
        error: tokenValidation.error,
        timestamp: new Date().toISOString()
      });

      return NextResponse.json(
        { error: tokenValidation.error || 'Invalid token' },
        { status: 400 }
      );
    }

    // Update user preferences in database
    try {
      const supabase = await createClient();

      // Allow granular preferences if provided, otherwise unsubscribe from all
      const emailPreferences = preferences || {
        marketing: false,
        product_updates: false,
        newsletter: false,
        transactional: true
      };

      const { error } = await supabase
        .from('users')
        .update({
          email_preferences: emailPreferences,
          updatedAt: new Date().toISOString()
        })
        .eq('email', email.toLowerCase());

      if (error) {
        console.error('[Unsubscribe] Database error:', error);
        return NextResponse.json(
          { error: 'Failed to update preferences' },
          { status: 500 }
        );
      }

      // Log unsubscribe event
      console.log('[Unsubscribe] User unsubscribed via API:', {
        email,
        preferences: emailPreferences,
        timestamp: new Date().toISOString()
      });

      return NextResponse.json({
        success: true,
        message: 'Successfully updated email preferences',
        preferences: emailPreferences
      });

    } catch (dbError) {
      console.error('[Unsubscribe] Error updating database:', dbError);
      return NextResponse.json(
        { error: 'Failed to update preferences' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('[Unsubscribe] Error processing POST request:', error);
    return NextResponse.json(
      { error: 'Failed to process unsubscribe request' },
      { status: 500 }
    );
  }
}
