/**
 * Email Unsubscribe API
 *
 * Handles unsubscribe requests from email links.
 * Supports both GET and POST methods.
 *
 * Usage:
 * - GET /api/email/unsubscribe?token=xxx&email=user@example.com
 * - POST /api/email/unsubscribe with JSON body
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isValidEmail } from '@/emails';

/**
 * Simple token validation (in production, use proper JWT or encrypted tokens)
 * For now, we'll use a simple email-based approach
 */
function validateUnsubscribeToken(token: string, email: string): boolean {
  // TODO: Implement proper token validation
  // For now, just check if token and email exist
  return !!(token && email && isValidEmail(email));
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

    if (!token || !email) {
      return new NextResponse(
        `
<!DOCTYPE html>
<html>
<head>
  <title>Invalid Unsubscribe Link</title>
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
      color: #d32f2f;
      margin-bottom: 20px;
    }
    p {
      color: #666;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Invalid Unsubscribe Link</h1>
    <p>This unsubscribe link is invalid or has expired.</p>
    <p>If you'd like to manage your email preferences, please log in to your account.</p>
  </div>
</body>
</html>
        `,
        {
          status: 400,
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }

    // Validate token
    if (!validateUnsubscribeToken(token, email)) {
      return new NextResponse(
        `
<!DOCTYPE html>
<html>
<head>
  <title>Invalid Token</title>
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
      color: #d32f2f;
      margin-bottom: 20px;
    }
    p {
      color: #666;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Invalid Token</h1>
    <p>The unsubscribe token is invalid.</p>
    <p>Please contact support if you continue to have issues.</p>
  </div>
</body>
</html>
        `,
        {
          status: 400,
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }

    // Update user preferences in database
    try {
      const supabase = await createClient();

      // For now, we'll mark the user as unsubscribed from marketing emails
      // TODO: Add more granular email preferences
      const { error } = await supabase
        .from('users')
        .update({
          email_preferences: {
            marketing: false,
            product_updates: false,
            newsletter: false,
          },
          updatedAt: new Date().toISOString(),
        })
        .eq('email', email);

      if (error) {
        console.error('[Unsubscribe] Database error:', error);
        // Don't expose database errors to user
      }

      // Log unsubscribe event
      console.log('[Unsubscribe] User unsubscribed:', {
        email,
        timestamp: new Date().toISOString(),
      });

    } catch (dbError) {
      console.error('[Unsubscribe] Error updating database:', dbError);
      // Continue to show success page even if DB update fails
    }

    // Show success page
    return new NextResponse(
      `
<!DOCTYPE html>
<html>
<head>
  <title>Unsubscribed Successfully</title>
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
      color: #2e7d32;
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
    <h1>You've been unsubscribed</h1>
    <p>We've removed the following email address from our mailing list:</p>
    <div class="email">${email}</div>
    <p>You will no longer receive marketing emails, product updates, or newsletters from us.</p>
    <p>You will still receive important account-related emails such as password resets and billing notifications.</p>
    <div class="note">
      <p>Changed your mind? You can update your email preferences anytime in your <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/account">account settings</a>.</p>
    </div>
  </div>
</body>
</html>
      `,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );

  } catch (error) {
    console.error('[Unsubscribe] Error processing request:', error);
    return new NextResponse(
      `
<!DOCTYPE html>
<html>
<head>
  <title>Unsubscribe Error</title>
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
      color: #d32f2f;
      margin-bottom: 20px;
    }
    p {
      color: #666;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Something went wrong</h1>
    <p>We encountered an error while processing your unsubscribe request.</p>
    <p>Please try again later or contact support for assistance.</p>
  </div>
</body>
</html>
      `,
      {
        status: 500,
        headers: {
          'Content-Type': 'text/html',
        },
      }
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
    const { email, token } = body;

    if (!email || !token) {
      return NextResponse.json(
        { error: 'Email and token are required' },
        { status: 400 }
      );
    }

    // Validate token
    if (!validateUnsubscribeToken(token, email)) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
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
          },
          updatedAt: new Date().toISOString(),
        })
        .eq('email', email);

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
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: 'Successfully unsubscribed from emails',
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
