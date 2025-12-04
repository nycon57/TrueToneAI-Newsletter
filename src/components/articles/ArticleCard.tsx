'use client';

import { useState } from 'react';
import { useCompletion } from 'ai/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import * as TabsPrimitive from '@radix-ui/react-tabs';

const Tabs = TabsPrimitive.Root;
const TabsList = TabsPrimitive.List;
const TabsTrigger = TabsPrimitive.Trigger;
const TabsContent = TabsPrimitive.Content;
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Copy,
  Sparkles,
  Wand2,
  Share2,
  Lock,
  RefreshCw,
  Crown,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SocialMediaPublisher } from '@/components/social/SocialMediaPublisher';

interface Article {
  id: string;
  title: string;
  summary?: string;
  content_type: string;
  article_topic?: string;
  category?: string;
  tags?: string[];
  position: number;
  image_url?: string;
  published_at: string;

  // Content outputs
  key_insights: string[];
  video_script: string;
  email_template: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  social_content: any;

  // Personalization metadata
  is_personalized: boolean;
  personalization_id?: string;
  last_generated_at?: string;
  generation_count?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  truetone_settings?: any;
  tier: string;
}

interface ArticleCardProps {
  article: Article;
  userTier: 'free' | 'paid' | 'premium';
  onPersonalize?: (articleId: string, outputType: string) => void;
  isPersonalizing?: boolean;
}

const OUTPUT_TYPES = [
  { key: 'key_insights', label: 'Key Insights', icon: Zap },
  { key: 'email_template', label: 'Email Template', icon: Share2 },
  { key: 'social_content', label: 'Social Media', icon: Share2 },
  { key: 'video_script', label: 'Video Script', icon: Sparkles }
];

export function ArticleCard({
  article,
  userTier,
  onPersonalize,
  isPersonalizing = false
}: ArticleCardProps) {
  const [activeTab, setActiveTab] = useState('key_insights');
  const [personalizing, setPersonalizing] = useState<string | null>(null);

  const isPaid = userTier !== 'free';

  const handleCopy = async (content: string | string[]) => {
    try {
      const textToCopy = Array.isArray(content)
        ? content.join('\n• ')
        : typeof content === 'object'
          ? JSON.stringify(content, null, 2)
          : content;

      await navigator.clipboard.writeText(textToCopy);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handlePersonalize = async (outputType: string) => {
    if (!isPaid) {
      toast.error('Upgrade to access personalization');
      return;
    }

    setPersonalizing(outputType);

    try {
      const response = await fetch('/api/personalize-output', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          article_id: article.id,
          output_type: outputType,
          regenerate: false
        }),
      });

      if (response.status === 403) {
        const data = await response.json();
        toast.error(data.message || 'Premium feature - upgrade required');
        return;
      }

      if (response.status === 429) {
        const data = await response.json();
        toast.error(data.message || 'Monthly limit reached');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to personalize content');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      let personalizedContent = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        personalizedContent += chunk;
      }

      toast.success('Content personalized with your TrueTone!');

      // Trigger parent component to refresh data
      if (onPersonalize) {
        onPersonalize(article.id, outputType);
      }

    } catch (error) {
      console.error('Personalization error:', error);
      toast.error('Failed to personalize content');
    } finally {
      setPersonalizing(null);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderContent = (outputType: string, content: any) => {
    if (!content) {
      return <p className="text-gray-500 italic">No content available</p>;
    }

    switch (outputType) {
      case 'key_insights':
        const insights = Array.isArray(content) ? content : [];
        return (
          <ul className="space-y-2">
            {insights.map((insight, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        );

      case 'social_content':
        const social = typeof content === 'object' ? content : {};
        return (
          <div className="space-y-3">
            {Object.entries(social).map(([platform, text]) => (
              <div key={platform} className="border rounded p-3">
                <div className="font-medium capitalize mb-1">{platform}</div>
                <p className="text-sm">{text as string}</p>
              </div>
            ))}
          </div>
        );

      default:
        return <div className="whitespace-pre-wrap">{content}</div>;
    }
  };

  const getContentForTab = (tabKey: string) => {
    switch (tabKey) {
      case 'key_insights':
        return article.key_insights;
      case 'email_template':
        return article.email_template;
      case 'social_content':
        return article.social_content;
      case 'video_script':
        return article.video_script;
      default:
        return '';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {article.title}
              {article.is_personalized && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Personalized
                </Badge>
              )}
              {!isPaid && (
                <Badge variant="outline" className="text-gray-600">
                  <Lock className="h-3 w-3 mr-1" />
                  Default
                </Badge>
              )}
            </CardTitle>
            {article.summary && (
              <CardDescription className="mt-2">
                {article.summary}
              </CardDescription>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{article.content_type}</Badge>
              {article.article_topic && (
                <Badge variant="outline">{article.article_topic}</Badge>
              )}
            </div>
          </div>

          {!isPaid && (
            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {!isPaid && (
          <Alert className="mb-4 border-amber-200 bg-amber-50">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              <strong>Upgrade to unlock personalization:</strong> Get content customized to your unique voice and communication style with AI-powered TrueTone technology.
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 rounded-lg p-1">
            {OUTPUT_TYPES.map((type) => (
              <TabsTrigger
                key={type.key}
                value={type.key}
                className="text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-3 py-2 font-medium transition-all"
              >
                <type.icon className="h-3 w-3 mr-1" />
                {type.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {OUTPUT_TYPES.map((type) => (
            <TabsContent key={type.key} value={type.key} className="mt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center">
                    <type.icon className="h-4 w-4 mr-2" />
                    {type.label}
                  </h4>

                  <div className="flex items-center gap-2">
                    {isPaid && !article.is_personalized && (
                      <Button
                        onClick={() => handlePersonalize(type.key)}
                        disabled={personalizing === type.key}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {personalizing === type.key ? (
                          <>
                            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                            Personalizing...
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-3 w-3 mr-1" />
                            Personalize
                          </>
                        )}
                      </Button>
                    )}

                    {isPaid && article.is_personalized && (
                      <Button
                        onClick={() => handlePersonalize(type.key)}
                        disabled={personalizing === type.key}
                        size="sm"
                        variant="outline"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Regenerate
                      </Button>
                    )}

                    <Button
                      onClick={() => handleCopy(getContentForTab(type.key))}
                      size="sm"
                      variant="outline"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>

                    {type.key === 'social_content' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Share2 className="h-3 w-3 mr-1" />
                            Publish
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Publish to Social Media</DialogTitle>
                          </DialogHeader>
                          <SocialMediaPublisher
                            initialContent={getContentForTab(type.key)}
                            contentType="social_content"
                          />
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-gray-50">
                  {personalizing === type.key ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-4/6" />
                      <div className="flex items-center mt-3">
                        <Wand2 className="h-4 w-4 text-blue-600 animate-spin mr-2" />
                        <span className="text-sm text-blue-600">
                          Personalizing with your TrueTone...
                        </span>
                      </div>
                    </div>
                  ) : (
                    renderContent(type.key, getContentForTab(type.key))
                  )}
                </div>

                {article.is_personalized && type.key === activeTab && (
                  <div className="text-xs text-gray-500 mt-2">
                    Personalized {article.generation_count || 1} time(s) •
                    Last generated: {article.last_generated_at ? new Date(article.last_generated_at).toLocaleDateString() : 'Unknown'}
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}