'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Loader2, Check, Info, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import type { ApiUser } from '@/lib/api/auth-cached';
import { TRUETONE_CHARACTERISTICS } from '@/lib/constants/truetone-characteristics';

const truetoneSchema = z.object({
  tone_of_voice: z.string(),
  humor: z.string(),
  detail_orientation: z.string(),
  content_length: z.string(),
  formality: z.string(),
  emotional_expression: z.string(),
  vocabulary: z.string(),
  engagement_style: z.string(),
});

type TrueToneFormData = z.infer<typeof truetoneSchema>;

interface TrueToneTabProps {
  user: ApiUser;
}

export function TrueToneTab({ user }: TrueToneTabProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isDirty },
  } = useForm<TrueToneFormData>({
    resolver: zodResolver(truetoneSchema),
    defaultValues: {
      tone_of_voice: user.toneOfVoice || 'Friendly',
      humor: user.humor || 'Dry',
      detail_orientation: user.detailOrientation || 'Comprehensive',
      content_length: user.contentLength || 'Thorough',
      formality: user.formality || 'Professional',
      emotional_expression: user.emotionalExpression || 'Reserved',
      vocabulary: user.vocabulary || 'Sophisticated',
      engagement_style: user.engagementStyle || 'Interactive',
    },
  });

  const formValues = watch();

  const handleCharacteristicChange = useCallback((id: string, value: string) => {
    setValue(id as keyof TrueToneFormData, value, { shouldDirty: true });
  }, [setValue]);

  // Get example for currently selected value
  const getSelectedExample = (characteristicId: string) => {
    const characteristic = TRUETONE_CHARACTERISTICS.find(c => c.id === characteristicId);
    if (!characteristic) return '';

    const selectedValue = formValues[characteristicId as keyof TrueToneFormData];
    const option = characteristic.options.find(o => o.value === selectedValue);
    return option?.example || '';
  };

  const onSubmit = async (data: TrueToneFormData) => {
    setIsSubmitting(true);
    setShowSuccess(false);

    try {
      const response = await fetch('/api/user/truetone', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update TrueTone settings');
      }

      setShowSuccess(true);
      toast.success('TrueTone settings updated successfully!');
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('TrueTone update error:', error);
      toast.error('Failed to update TrueTone settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-lg border-orchid/10">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-orchid/5 to-indigo/5">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orchid to-indigo flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-heading">TrueTone Settings</CardTitle>
            <CardDescription className="text-base mt-1">
              Customize how AI personalizes content to match your unique communication style
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Info Banner */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-primary text-sm leading-relaxed">
              <strong className="font-semibold">About TrueTone:</strong> These settings help our AI
              generate content that sounds authentically like you. Adjust them to fine-tune your
              personalized content experience.
            </p>
          </div>

          {/* Two Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TRUETONE_CHARACTERISTICS.map((characteristic) => (
              <div key={characteristic.id} className="space-y-3">
                {/* Label with Tooltip */}
                <div className="flex items-center gap-2">
                  <Label htmlFor={`truetone-${characteristic.id}`}>
                    {characteristic.label}
                  </Label>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p>{characteristic.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Select Dropdown */}
                <Select
                  value={formValues[characteristic.id as keyof TrueToneFormData]}
                  onValueChange={(value) =>
                    handleCharacteristicChange(characteristic.id, value)
                  }
                >
                  <SelectTrigger
                    id={`truetone-${characteristic.id}`}
                    className="w-full bg-background border-border"
                  >
                    <SelectValue placeholder={`Select ${characteristic.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {characteristic.options.map((option) => (
                      <TooltipProvider key={option.value} delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SelectItem
                              value={option.value}
                              className="cursor-pointer"
                            >
                              {option.label}
                            </SelectItem>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-sm">
                            <div className="space-y-2">
                              <p className="font-medium">{option.description}</p>
                              <p className="text-xs text-muted-foreground italic">
                                Example: "{option.example}"
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </SelectContent>
                </Select>

                {/* Example Text */}
                <div className="text-sm text-muted-foreground bg-muted/50 rounded p-3 min-h-[60px] flex items-center">
                  <p className="italic">"{getSelectedExample(characteristic.id)}"</p>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t border-border">
            <Button
              type="submit"
              disabled={!isDirty || isSubmitting}
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
  );
}
