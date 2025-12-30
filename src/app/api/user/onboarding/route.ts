import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { sendWelcome } from '@/emails';
import { kindeManagementService } from '@/lib/services/kinde-management.service';

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
  truetoneSettings: z.object({
    tone_of_voice: z.string().optional(),
    humor: z.string().optional(),
    detail_orientation: z.string().optional(),
    content_length: z.string().optional(),
    formality: z.string().optional(),
    emotional_expression: z.string().optional(),
    vocabulary: z.string().optional(),
    engagement_style: z.string().optional(),
  }).optional(), // TrueTone characteristics as individual fields
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

    // Validate that email exists - never use synthetic email addresses
    if (!kindeUser.email) {
      return NextResponse.json({
        error: 'Email address is required. Please ensure your authentication provider has your email address.'
      }, { status: 400 });
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

    const { profileData, transcript, analysisResults, truetoneSettings, categoryPreferences, tagPreferences, billingData } = validationResult.data;

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
            email: kindeUser.email, // Email is guaranteed to exist by validation above
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            name: `${profileData.firstName} ${profileData.lastName}`.trim(),
            company: profileData.company || null,
            category_preferences: categoryPreferences || [],
            tag_preferences: tagPreferences || [],
            tone_of_voice: truetoneSettings?.tone_of_voice || 'Friendly',
            humor: truetoneSettings?.humor || 'Dry',
            detail_orientation: truetoneSettings?.detail_orientation || 'Comprehensive',
            content_length: truetoneSettings?.content_length || 'Thorough',
            formality: truetoneSettings?.formality || 'Professional',
            emotional_expression: truetoneSettings?.emotional_expression || 'Reserved',
            vocabulary: truetoneSettings?.vocabulary || 'Sophisticated',
            engagement_style: truetoneSettings?.engagement_style || 'Interactive',
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

        // Grant Newsletter access in Kinde for cross-product access control
        try {
          await kindeManagementService.grantProductAccess(kindeUser.id, 'newsletter');
          console.log('[Onboarding] Granted Newsletter access to new user:', kindeUser.id);
        } catch (kindeError) {
          console.error('[Onboarding] Failed to grant Newsletter access (non-blocking):', kindeError);
          // Don't fail onboarding if Kinde access grant fails
        }

        // Send welcome email to new user
        if (newUser && kindeUser.email) {
          try {
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.KINDE_SITE_URL || 'http://localhost:3000';
            await sendWelcome({
              to: kindeUser.email,
              name: newUser.firstName || newUser.name || 'there',
              onboardingUrl: `${baseUrl}/onboarding`,
            });
            console.log('[Onboarding] Welcome email sent successfully to:', kindeUser.email);
          } catch (emailError) {
            console.error('[Onboarding] Failed to send welcome email:', emailError);
            // Don't fail the onboarding process if email fails
          }
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
      subscriptionStatus = 'active';
    } else if (billingData?.billingType === 'enterprise') {
      subscriptionTier = 'premium';
      subscriptionStatus = 'active';
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
        tone_of_voice: truetoneSettings?.tone_of_voice || 'Friendly',
        humor: truetoneSettings?.humor || 'Dry',
        detail_orientation: truetoneSettings?.detail_orientation || 'Comprehensive',
        content_length: truetoneSettings?.content_length || 'Thorough',
        formality: truetoneSettings?.formality || 'Professional',
        emotional_expression: truetoneSettings?.emotional_expression || 'Reserved',
        vocabulary: truetoneSettings?.vocabulary || 'Sophisticated',
        engagement_style: truetoneSettings?.engagement_style || 'Interactive',
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

    // Grant Newsletter access in Kinde for cross-product access control
    // This ensures existing users who complete onboarding also have the Kinde property set
    try {
      await kindeManagementService.grantProductAccess(kindeUser.id, 'newsletter');
      console.log('[Onboarding] Granted Newsletter access to existing user:', kindeUser.id);
    } catch (kindeError) {
      console.error('[Onboarding] Failed to grant Newsletter access (non-blocking):', kindeError);
      // Don't fail onboarding if Kinde access grant fails
    }

    // Send welcome email to existing user who completed onboarding
    if (user && kindeUser.email) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.KINDE_SITE_URL || 'http://localhost:3000';
        await sendWelcome({
          to: kindeUser.email,
          name: user.firstName || user.name || 'there',
          onboardingUrl: `${baseUrl}/onboarding`,
        });
        console.log('[Onboarding] Welcome email sent successfully to:', kindeUser.email);
      } catch (emailError) {
        console.error('[Onboarding] Failed to send welcome email:', emailError);
        // Don't fail the onboarding process if email fails
      }
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