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

    // Parse form data
    const formData = await req.formData();
    const name = formData.get('name') as string;
    const company = formData.get('company') as string | null;
    const categoryPreferencesStr = formData.get('categoryPreferences') as string;
    const avatarFile = formData.get('avatar') as File | null;

    // Validate required fields
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters' },
        { status: 400 }
      );
    }

    // Parse category preferences
    let categoryPreferences: string[] = [];
    try {
      categoryPreferences = JSON.parse(categoryPreferencesStr);
    } catch {
      return NextResponse.json(
        { error: 'Invalid category preferences format' },
        { status: 400 }
      );
    }

    if (!Array.isArray(categoryPreferences) || categoryPreferences.length === 0) {
      return NextResponse.json(
        { error: 'At least one category must be selected' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: {
      name: string;
      company?: string | null;
      category_preferences: string[];
      updatedAt: string;
      avatar?: string;
    } = {
      name: name.trim(),
      company: company?.trim() || null,
      category_preferences: categoryPreferences,
      updatedAt: new Date().toISOString(),
    };

    // Handle avatar upload if provided
    if (avatarFile && avatarFile.size > 0) {
      // Validate file size (5MB limit)
      if (avatarFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Avatar file must be less than 5MB' },
          { status: 400 }
        );
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(avatarFile.type)) {
        return NextResponse.json(
          { error: 'Avatar must be a valid image file (JPEG, PNG, WebP, or GIF)' },
          { status: 400 }
        );
      }

      try {
        // Convert File to Buffer
        const bytes = await avatarFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${kindeUser.id}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('user-uploads')
          .upload(filePath, buffer, {
            contentType: avatarFile.type,
            upsert: false,
          });

        if (uploadError) {
          console.error('[ProfileUpdate] Avatar upload error:', uploadError);
          throw uploadError;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('user-uploads')
          .getPublicUrl(filePath);

        if (urlData?.publicUrl) {
          updateData.avatar = urlData.publicUrl;
        }
      } catch (uploadError) {
        console.error('[ProfileUpdate] Failed to upload avatar:', uploadError);
        // Don't fail the entire update if avatar upload fails
        // Just continue without updating the avatar
      }
    }

    // Update user in database
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('kinde_id', kindeUser.id)
      .select('*')
      .single();

    if (updateError) {
      console.error('[ProfileUpdate] Database update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {
    console.error('[ProfileUpdate] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
