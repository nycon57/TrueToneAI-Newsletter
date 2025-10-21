import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id parameter' },
        { status: 400 }
      );
    }

    // Query the stripe.checkout_sessions table to verify payment
    const { data: session, error } = await supabase
      .from('stripe.checkout_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) {
      console.error('Error querying checkout session:', error);

      // If the table doesn't exist yet, return a pending status
      if (error.code === '42P01') {
        return NextResponse.json({
          status: 'pending',
          message: 'Stripe Sync Engine not yet configured. Please complete setup.',
        });
      }

      return NextResponse.json(
        { error: 'Failed to verify session' },
        { status: 500 }
      );
    }

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Check if payment was successful
    const paymentStatus = session.payment_status; // 'paid', 'unpaid', or 'no_payment_required'
    const subscriptionId = session.subscription;

    if (paymentStatus === 'paid' || paymentStatus === 'no_payment_required') {
      return NextResponse.json({
        status: 'success',
        subscriptionId,
        customerEmail: session.customer_details?.email,
      });
    }

    return NextResponse.json({
      status: 'incomplete',
      message: 'Payment not completed',
    });
  } catch (error: any) {
    console.error('Error verifying session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
