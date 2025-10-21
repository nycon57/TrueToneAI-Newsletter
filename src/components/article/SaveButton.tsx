'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SaveButtonProps {
  articleId: string;
  initialSaved: boolean;
  isPaid: boolean;
  className?: string;
}

export function SaveButton({ articleId, initialSaved, isPaid, className }: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const toggleSave = async () => {
    if (!isPaid) {
      toast.error('Upgrade to save articles');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/articles/${articleId}/save`, {
        method: 'POST'
      });

      const data = await response.json();

      if (response.ok) {
        setSaved(data.saved);
        toast.success(data.saved ? 'Article saved!' : 'Article removed');
      } else {
        toast.error(data.error || 'Failed to save article');
      }
    } catch (error) {
      toast.error('Failed to save article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={toggleSave}
      disabled={loading}
      variant="ghost"
      size="sm"
      className={cn("flex-shrink-0", className)}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-all",
          saved && "fill-red-500 text-red-500",
          loading && "opacity-50"
        )}
      />
    </Button>
  );
}
