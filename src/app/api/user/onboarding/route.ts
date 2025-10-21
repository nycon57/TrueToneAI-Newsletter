import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Validation schema for onboarding data
const OnboardingSchema = z.object({
  profileData: z.object({
    firstName: z.string().min(1).max(100).trim(),
    lastName: z.string().min(1).max(100).trim(),
    company: z.string().max(200).trim().optional(),
    title: z.string().max(200).trim().optional(),
  }),
  transcript: z.string().max(50000).optional(),
  analysisResults: z.any().optional(), // Complex nested object, validated separately if needed
  categoryPreferences: z.array(z.string()).optional(),
  tagPreferences: z.array(z.string()).optional(),
  billingData: z.object({
    selectedPlan: z.string().optional(),
    billingType: z.enum(['free_trial', 'paid_plan', 'enterprise']).optional(),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();

    if (!kindeUser?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = OnboardingSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const { profileData, transcript, analysisResults, categoryPreferences, tagPreferences, billingData } = validationResult.data;

    const supabase = await createClient();

    // First, check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('kinde_id', kindeUser.id)
      .single();

    if (fetchError) {
      // If user doesn't exist (PGRST116), create them
      if (fetchError.code === 'PGRST116') {
        const now = new Date().toISOString();
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            kinde_id: kindeUser.id,
            email: kindeUser.email || profileData.firstName + '@example.com',
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            name: `${profileData.firstName} ${profileData.lastName}`.trim(),
            company: profileData.company || null,
            category_preferences: categoryPreferences || [],
            tag_preferences: tagPreferences || [],
            subscription_tier: 'free',
            subscription_status: billingData?.billingType === 'free_trial' ? 'trialing' : null,
            createdAt: now,
            updatedAt: now,
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating user during onboarding:', createError);
          return NextResponse.json({
            error: 'Failed to create user',
            details: createError
          }, { status: 500 });
        }

        return NextResponse.json({
          success: true,
          message: 'Onboarding completed successfully',
          user: newUser
        });
      }

      console.error('Error fetching user during onboarding:', fetchError);
      return NextResponse.json({
        error: 'Failed to fetch user',
        details: fetchError
      }, { status: 500 });
    }

    // Determine subscription tier from billing data
    let subscriptionTier = 'free';
    let subscriptionStatus = null;

    if (billingData?.billingType === 'free_trial') {
      subscriptionTier = 'free';
      subscriptionStatus = 'trialing';
    } else if (billingData?.billingType === 'paid_plan') {
      subscriptionTier = 'paid';
    } else if (billingData?.billingType === 'enterprise') {
      subscriptionTier = 'premium';
    }

    // Update user with onboarding data (only fields that exist in the table)
    const { data: user, error } = await supabase
      .from('users')
      .update({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        name: `${profileData.firstName} ${profileData.lastName}`.trim(),
        company: profileData.company || null,
        category_preferences: categoryPreferences || [],
        tag_preferences: tagPreferences || [],
        subscription_tier: subscriptionTier,
        subscription_status: subscriptionStatus,
        updatedAt: new Date().toISOString(),
      })
      .eq('kinde_id', kindeUser.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user during onboarding:', error);
      return NextResponse.json({
        error: 'Failed to save onboarding data',
        details: error
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully',
      user
    });

  } catch (error) {
    console.error('Error in onboarding API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}