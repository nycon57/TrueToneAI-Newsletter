import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createClient } from '@/lib/supabase/server';
import { sendSupportConfirmation, sendSupportNotification } from '@/emails';
import { randomBytes } from 'crypto';

/**
 * Generate a unique reference number for support tickets
 */
function generateReferenceNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = randomBytes(3).toString('hex').toUpperCase();
  return `SUP-${timestamp}-${random}`;
}

export async function POST(req: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters' },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Message must be less than 2000 characters' },
        { status: 400 }
      );
    }

    // Get subject label
    const subjectLabels: Record<string, string> = {
      general: 'General Question',
      technical: 'Technical Issue',
      billing: 'Billing Question',
      feature: 'Feature Request',
    };

    const subjectLabel = subjectLabels[subject] || subject;
    const referenceNumber = generateReferenceNumber();
    const submittedAt = new Date();

    // Get user info from database for tier information
    let userTier = 'free';
    try {
      const supabase = await createClient();
      const { data: dbUser } = await supabase
        .from('users')
        .select('subscription_tier')
        .eq('kinde_id', kindeUser.id)
        .single();

      if (dbUser?.subscription_tier) {
        userTier = dbUser.subscription_tier;
      }
    } catch (error) {
      console.warn('[Support] Could not fetch user tier:', error);
      // Continue without tier info
    }

    // Log the support request
    console.log('[Support] New support request:', {
      referenceNumber,
      name,
      email,
      subject: subjectLabel,
      userTier,
      timestamp: submittedAt.toISOString(),
    });

    // Send confirmation email to user
    const confirmationResult = await sendSupportConfirmation({
      to: email,
      name: name || 'there',
      referenceNumber,
      subject: subjectLabel,
      message,
      category: subject,
      expectedResponseTime: userTier === 'premium' ? '12-24 hours' : '24-48 hours',
    });

    if (!confirmationResult.success) {
      console.error('[Support] Failed to send confirmation email:', confirmationResult.error);
      // Don't fail the request, just log the error
    }

    // Send notification email to support team
    const supportEmail = process.env.SUPPORT_EMAIL;
    if (supportEmail) {
      const notificationResult = await sendSupportNotification({
        to: supportEmail,
        userName: name || 'Unknown User',
        userEmail: email,
        userTier,
        referenceNumber,
        subject: subjectLabel,
        category: subject,
        message,
        userId: kindeUser.id,
      });

      if (!notificationResult.success) {
        console.error('[Support] Failed to send notification email:', notificationResult.error);
        // Don't fail the request, just log the error
      }
    } else {
      console.warn('[Support] SUPPORT_EMAIL not configured, skipping notification email');
    }

    return NextResponse.json({
      success: true,
      message: 'Support request submitted successfully',
      referenceNumber,
    });

  } catch (error) {
    console.error('[Support] Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process support request' },
      { status: 500 }
    );
  }
}
