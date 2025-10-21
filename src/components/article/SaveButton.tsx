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

    // Store previous state for rollback on error
    const previousSaved = saved;

    // Optimistic update - toggle immediately for better UX
    setSaved(!previousSaved);
    setLoading(true);

    try {
      const response = await fetch(`/api/articles/${articleId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saved: !previousSaved })
      });

      // Handle empty or non-JSON responses
      let data = null;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (parseError) {
          console.error('Failed to parse response JSON:', parseError);
        }
      }

      if (response.ok) {
        // Confirm the optimistic update
        const newSavedState = data?.saved ?? !previousSaved;
        setSaved(newSavedState);
        toast.success(newSavedState ? 'Article saved!' : 'Article removed');
      } else {
        // Rollback on error
        setSaved(previousSaved);
        toast.error(data?.error || 'Failed to save article');
      }
    } catch (error) {
      // Rollback on network/other errors
      setSaved(previousSaved);
      console.error('Error saving article:', error);
      toast.error('Failed to save article. Please try again.');
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
