'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PersonalizeButtonProps {
  articleId: string;
  contentType: 'key_insights' | 'video_script' | 'email_template' | 'social_content';
  label: string;
  isPaid: boolean;
  className?: string;
  onComplete?: (content: string) => void;
}

export function PersonalizeButton({
  articleId,
  contentType,
  label,
  isPaid,
  className,
  onComplete
}: PersonalizeButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');

  const handlePersonalize = async () => {
    if (!isPaid) {
      toast.error('Upgrade to use AI personalization');
      return;
    }

    setIsGenerating(true);
    setStreamedContent('');

    try {
      const response = await fetch('/api/ai/personalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, contentType })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to personalize');
      }

      const data = await response.json();
      setStreamedContent(data.content);
      toast.success('Personalization complete!');
      onComplete?.(data.content);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to personalize content');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isPaid) {
    return (
      <Button
        onClick={() => {
          // Redirect to billing page for upgrade
          window.location.href = '/account?tab=billing';
        }}
        variant="outline"
        size="sm"
        className={cn(
          "border-2 border-orchid/50 hover:border-orchid hover:bg-orchid/10 text-orchid font-semibold transition-all",
          "hover:scale-105 active:scale-95",
          className
        )}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Upgrade for AI
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handlePersonalize}
        disabled={isGenerating}
        variant="outline"
        size="sm"
        className={className}
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Personalizing...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Personalize {label}
          </>
        )}
      </Button>

      {/* Show generated content */}
      {streamedContent && (
        <div className="p-4 bg-lavender/10 rounded-lg border border-lavender/30 animate-in fade-in">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {streamedContent}
          </p>
        </div>
      )}
    </div>
  );
}
