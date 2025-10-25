import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function PUT(req: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // Parse request body with error handling
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate required TrueTone fields
    const {
      tone_of_voice,
      humor,
      detail_orientation,
      content_length,
      formality,
      emotional_expression,
      vocabulary,
      engagement_style,
    } = body;

    if (
      !tone_of_voice ||
      !humor ||
      !detail_orientation ||
      !content_length ||
      !formality ||
      !emotional_expression ||
      !vocabulary ||
      !engagement_style
    ) {
      return NextResponse.json(
        { error: 'All TrueTone characteristics are required' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData = {
      tone_of_voice,
      humor,
      detail_orientation,
      content_length,
      formality,
      emotional_expression,
      vocabulary,
      engagement_style,
      updatedAt: new Date().toISOString(),
    };

    // Update user in database
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('kinde_id', kindeUser.id)
      .select('*')
      .single();

    if (updateError) {
      console.error('[TrueToneUpdate] Database update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update TrueTone settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {
    console.error('[TrueToneUpdate] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
