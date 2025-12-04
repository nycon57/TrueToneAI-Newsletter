'use client';

import { useState } from 'react';
import { useCompletion } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Copy, Sparkles, Wand2, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { SocialMediaPublisher } from '@/components/social/SocialMediaPublisher';

interface PersonalizedContentProps {
  article: {
    id?: string;
    title: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: any;
    contentType: string;
  };
  postId?: string;
  initialPersonalization?: string;
}

export function PersonalizedContent({
  article,
  postId,
  initialPersonalization
}: PersonalizedContentProps) {
  const [hasPersonalized, setHasPersonalized] = useState(!!initialPersonalization);

  const {
    completion,
    isLoading,
    complete,
    error,
    stop
  } = useCompletion({
    api: '/api/ai/personalize',
    onFinish: () => {
      setHasPersonalized(true);
      toast.success('Content personalized with your TrueTone!');
    },
    onError: (error) => {
      toast.error('Failed to personalize content: ' + error.message);
    }
  });

  const handlePersonalize = () => {
    complete('', {
      body: {
        articleContent: article.content,
        contentType: article.contentType,
        articleId: article.id,
        postId: postId
      }
    });
  };

  const handleCopy = async () => {
    const textToCopy = completion || initialPersonalization || '';
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const displayContent = completion || initialPersonalization;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
            Personalized with Your TrueTone
          </CardTitle>
          <Badge variant="outline" className="mt-2">
            {article.contentType}
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          {!hasPersonalized && !isLoading && (
            <Button onClick={handlePersonalize} className="flex items-center">
              <Wand2 className="h-4 w-4 mr-2" />
              Personalize
            </Button>
          )}

          {isLoading && (
            <Button onClick={stop} variant="outline">
              Stop
            </Button>
          )}

          {displayContent && (
            <>
              <Button onClick={handleCopy} variant="outline" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Publish
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Publish to Social Media</DialogTitle>
                  </DialogHeader>
                  <SocialMediaPublisher
                    initialContent={displayContent}
                    contentType={article.contentType}
                  />
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Original content preview */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Original:</h4>
          <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 line-clamp-3">
            {typeof article.content === 'string'
              ? article.content
              : JSON.stringify(article.content).substring(0, 200) + '...'
            }
          </div>
        </div>

        {/* Personalized content */}
        <div>
          <h4 className="text-sm font-medium text-blue-600 mb-2">
            Personalized with Your Voice:
          </h4>

          <div className="bg-blue-50 p-4 rounded-lg">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <div className="flex items-center mt-3">
                  <Wand2 className="h-4 w-4 text-blue-600 animate-spin mr-2" />
                  <span className="text-sm text-blue-600">
                    Personalizing content...
                  </span>
                </div>
              </div>
            ) : displayContent ? (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-blue-900">
                  {displayContent}
                </div>
              </div>
            ) : !hasPersonalized ? (
              <div className="text-center py-6 text-gray-500">
                <Sparkles className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm">
                  Click &quot;Personalize&quot; to transform this content with your unique TrueTone voice.
                </p>
              </div>
            ) : null}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              Error: {error.message}
            </p>
            <Button
              onClick={handlePersonalize}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}