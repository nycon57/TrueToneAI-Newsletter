'use client';

import { useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Camera, Loader2, Check, X, Upload, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { ApiUser } from '@/lib/api/auth-cached';
import { motion, AnimatePresence } from 'motion/react';
import { AvatarCropModal } from './avatar-crop-modal';
import { ContentPreferencesSection } from './content-preferences-section';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  categoryPreferences: z.array(z.string()).min(1, 'Select at least one category'),
  tagPreferences: z.array(z.string()),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileTabProps {
  user: ApiUser;
}

export function ProfileTab({ user }: ProfileTabProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarBlob, setAvatarBlob] = useState<Blob | null>(null);
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
      company: user.company || '',
      categoryPreferences: user.category_preferences || [],
      tagPreferences: user.tag_preferences || [],
    },
  });

  const categoryPreferences = watch('categoryPreferences') || [];
  const tagPreferences = watch('tagPreferences') || [];

  const handleCategoryChange = useCallback((categories: string[]) => {
    setValue('categoryPreferences', categories, { shouldDirty: true });
  }, [setValue]);

  const handleTagChange = useCallback((tags: string[]) => {
    setValue('tagPreferences', tags, { shouldDirty: true });
  }, [setValue]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file);
    } else {
      toast.error('Please drop an image file');
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImageUrl(reader.result as string);
      setShowCropModal(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    const url = URL.createObjectURL(croppedBlob);
    setAvatarPreview(url);
    setAvatarBlob(croppedBlob);
    setAvatarChanged(true);
    toast.success('Avatar cropped successfully');
  };

  const handleDeleteAvatar = () => {
    setShowDeleteDialog(true);
  };

  const confirmDeleteAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
    setAvatarBlob(null);
    setAvatarChanged(true);
    setShowDeleteDialog(false);
    // Reset file input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('Avatar removed');
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    setShowSuccess(false);

    try {
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      if (data.company) formData.append('company', data.company);
      formData.append('categoryPreferences', JSON.stringify(data.categoryPreferences));
      formData.append('tagPreferences', JSON.stringify(data.tagPreferences));

      if (avatarBlob) {
        formData.append('avatar', avatarBlob, 'avatar.jpg');
      } else if (avatarPreview === null && avatarChanged) {
        formData.append('removeAvatar', 'true');
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setShowSuccess(true);
      toast.success('Profile updated successfully!');

      // Reset avatar state after successful upload
      setAvatarFile(null);
      setAvatarBlob(null);
      setAvatarChanged(false);

      // Reset file input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = () => {
    const names = user.name?.split(' ') || [];
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name?.[0]?.toUpperCase() || 'U';
  };

  const hasAvatar = avatarPreview || user.avatar;

  return (
    <>
      <Card className="shadow-lg border-orchid/10">
        <CardHeader>
          <CardTitle className="text-2xl font-heading">Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and content preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4 pb-6 border-b border-border">
              <div
                className={`relative group cursor-pointer transition-transform ${
                  isDragging ? 'scale-105' : ''
                }`}
                onClick={handleAvatarClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Avatar
                  className={`w-24 h-24 border-4 border-dashed transition-all ring-4 ring-orchid/10 ${
                    isDragging
                      ? 'border-orchid/80 scale-105'
                      : 'border-orchid/40 hover:border-orchid/60'
                  }`}
                >
                  {(avatarPreview || user.avatar) && (
                    <AvatarImage src={avatarPreview || user.avatar || undefined} />
                  )}
                  <AvatarFallback className="bg-gradient-to-br from-orchid to-indigo text-white text-2xl font-heading">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>

                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  {isDragging ? (
                    <Upload className="w-6 h-6 text-white animate-bounce" />
                  ) : (
                    <Camera className="w-6 h-6 text-white" />
                  )}
                </div>

                {/* Camera Badge */}
                <div className="absolute -bottom-1 -right-1 bg-orchid rounded-full p-2 shadow-lg group-hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4 text-white" />
                </div>

                {/* Delete Button */}
                <AnimatePresence>
                  {hasAvatar && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      whileHover={{ scale: 1.1 }}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAvatar();
                      }}
                      className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </motion.button>
                  )}
                </AnimatePresence>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  {isDragging ? 'Drop image here' : 'Click or drag to upload a photo'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG, WebP or GIF (max 5MB)
                </p>
                {avatarChanged && !isDirty && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-500 mt-2"
                  >
                    <AlertCircle className="w-3 h-3" />
                    <span>Unsaved avatar change</span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="John Doe"
                  className="focus:ring-orchid focus:border-orchid"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  {...register('email')}
                  placeholder="john@example.com"
                  readOnly
                  className="bg-muted cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company (Optional)</Label>
                <Input
                  id="company"
                  {...register('company')}
                  placeholder="Acme Lending"
                  className="focus:ring-orchid focus:border-orchid"
                />
              </div>
            </div>

            {/* Content Preferences */}
            <div className="space-y-4 pt-6 border-t border-border">
              <div>
                <h3 className="text-lg font-heading font-semibold mb-1">
                  Content Preferences
                </h3>
                <p className="text-sm text-muted-foreground">
                  Choose categories and optionally refine with specific tags
                </p>
              </div>

              <ContentPreferencesSection
                selectedCategories={categoryPreferences}
                selectedTags={tagPreferences}
                onCategoryChange={handleCategoryChange}
                onTagChange={handleTagChange}
              />

              {errors.categoryPreferences && (
                <p className="text-sm text-destructive mt-2">
                  {errors.categoryPreferences.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={(!isDirty && !avatarChanged) || isSubmitting}
                className="min-w-[140px] bg-gradient-to-r from-orchid to-indigo hover:from-indigo hover:to-shadow transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : showSuccess ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Crop Modal */}
      {uploadedImageUrl && (
        <AvatarCropModal
          imageUrl={uploadedImageUrl}
          open={showCropModal}
          onClose={() => {
            setShowCropModal(false);
            setUploadedImageUrl(null);
            // Reset file input to allow selecting the same file again
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
          onCropComplete={handleCropComplete}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Profile Photo?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove your profile photo? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteAvatar}
              className="bg-red-500 hover:bg-red-600"
            >
              Remove Photo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
