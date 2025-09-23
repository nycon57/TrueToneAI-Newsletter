'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Share2, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SocialAccount {
  id: string;
  type: string;
  name: string;
  displayName?: string;
  username?: string;
  avatarUrl?: string;
}

interface SocialMediaPublisherProps {
  initialContent?: string;
  contentType?: string;
}

export function SocialMediaPublisher({
  initialContent = '',
  contentType = 'social_post'
}: SocialMediaPublisherProps) {
  const [content, setContent] = useState(initialContent);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'success' | 'error'>('idle');
  const [scheduleType, setScheduleType] = useState<'now' | 'later'>('now');

  // Fetch connected social accounts
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/social/accounts');
      const data = await response.json();

      if (response.ok) {
        setAccounts(data.accounts || []);
      } else {
        console.error('Failed to fetch accounts:', data.error);
        toast.error('Failed to load social accounts');
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error('Failed to load social accounts');
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  const handlePlatformToggle = (platformType: string, checked: boolean) => {
    if (checked) {
      setSelectedPlatforms(prev => [...prev, platformType]);
    } else {
      setSelectedPlatforms(prev => prev.filter(p => p !== platformType));
    }
  };

  const handlePublish = async () => {
    if (!content.trim()) {
      toast.error('Please enter content to publish');
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    setIsLoading(true);
    setPublishStatus('publishing');

    try {
      const response = await fetch('/api/social/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          platforms: selectedPlatforms,
          scheduled_for: scheduleType === 'now' ? null : new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 mins from now for demo
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPublishStatus('success');
        toast.success('Content published successfully!');

        // Reset form after successful publish
        setTimeout(() => {
          setContent('');
          setSelectedPlatforms([]);
          setPublishStatus('idle');
        }, 3000);
      } else {
        setPublishStatus('error');
        toast.error(data.error || 'Failed to publish content');
      }
    } catch (error) {
      console.error('Publishing error:', error);
      setPublishStatus('error');
      toast.error('Failed to publish content');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (publishStatus) {
      case 'publishing':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Share2 className="h-4 w-4" />;
    }
  };

  const getStatusText = () => {
    switch (publishStatus) {
      case 'publishing':
        return 'Publishing...';
      case 'success':
        return 'Published';
      case 'error':
        return 'Publish';
      default:
        return 'Publish';
    }
  };

  // Group accounts by platform type
  const platformGroups = accounts.reduce((groups, account) => {
    const type = account.type.toLowerCase();
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(account);
    return groups;
  }, {} as Record<string, SocialAccount[]>);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Share2 className="h-5 w-5 mr-2 text-blue-600" />
          Publish to Social Media
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Content Input */}
        <div>
          <label className="text-sm font-medium mb-2 block">Content</label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your social media post..."
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {content.length}/280 characters
          </p>
        </div>

        {/* Platform Selection */}
        <div>
          <label className="text-sm font-medium mb-3 block">Select Platforms</label>

          {isLoadingAccounts ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span className="text-sm text-gray-600">Loading social accounts...</span>
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-600 mb-4">
                No social accounts connected yet.
              </p>
              <Button
                onClick={() => window.open('https://bundle.social/dashboard', '_blank')}
                variant="outline"
                size="sm"
              >
                Connect Accounts in Bundle Social
              </Button>
            </div>
          ) : (
            <div className="grid gap-3">
              {Object.entries(platformGroups).map(([platformType, platformAccounts]) => (
                <div key={platformType} className="flex items-center space-x-3">
                  <Checkbox
                    id={platformType}
                    checked={selectedPlatforms.includes(platformType)}
                    onCheckedChange={(checked) =>
                      handlePlatformToggle(platformType, checked as boolean)
                    }
                  />
                  <div className="flex-1 flex items-center">
                    <label
                      htmlFor={platformType}
                      className="text-sm font-medium capitalize cursor-pointer"
                    >
                      {platformType}
                    </label>
                    <Badge variant="outline" className="ml-2">
                      {platformAccounts.length} account{platformAccounts.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    {platformAccounts.map(acc => acc.name || acc.displayName).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Schedule Options */}
        <div>
          <label className="text-sm font-medium mb-2 block">When to Publish</label>
          <Select value={scheduleType} onValueChange={(value: 'now' | 'later') => setScheduleType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="now">
                <div className="flex items-center">
                  <Share2 className="h-4 w-4 mr-2" />
                  Publish Now
                </div>
              </SelectItem>
              <SelectItem value="later">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule for Later
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Publish Button */}
        <Button
          onClick={handlePublish}
          disabled={isLoading || !content.trim() || selectedPlatforms.length === 0}
          className="w-full"
          variant={publishStatus === 'success' ? 'default' : 'default'}
        >
          {getStatusIcon()}
          <span className="ml-2">{getStatusText()}</span>
        </Button>

        {/* Status Messages */}
        {publishStatus === 'success' && (
          <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              Successfully published to {selectedPlatforms.join(', ')}!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}