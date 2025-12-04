'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Copy,
  RotateCw,
  Check,
  CheckCircle2,
  Circle,
  Save,
  Loader2,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Platform configuration
export type SocialPlatform = 'facebook' | 'instagram' | 'twitter' | 'linkedin';

interface PlatformConfig {
  id: SocialPlatform;
  name: string;
  icon: typeof Facebook;
  gradient: string;
  hoverGradient: string;
  maxChars: number;
  description: string;
}

const PLATFORM_CONFIGS: PlatformConfig[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Facebook,
    gradient: 'from-blue-600 to-blue-700',
    hoverGradient: 'from-blue-700 to-blue-800',
    maxChars: 63206,
    description: 'Long-form posts with engagement focus'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    gradient: 'from-pink-600 to-pink-700',
    hoverGradient: 'from-pink-700 to-pink-800',
    maxChars: 2200,
    description: 'Visual-first, concise captions'
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: Twitter,
    gradient: 'from-blue-500 to-blue-600',
    hoverGradient: 'from-blue-600 to-blue-700',
    maxChars: 280,
    description: 'Short, punchy messaging'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    gradient: 'from-indigo-600 to-indigo-700',
    hoverGradient: 'from-indigo-700 to-indigo-800',
    maxChars: 3000,
    description: 'Professional, industry-focused'
  }
];

interface SocialPlatformSelectorProps {
  onPlatformsChange: (platforms: SocialPlatform[]) => void;
  selectedPlatforms?: SocialPlatform[];
  excludePlatforms?: SocialPlatform[];
  disabled?: boolean;
  className?: string;
}

export function SocialPlatformSelector({
  onPlatformsChange,
  selectedPlatforms = [],
  excludePlatforms = [],
  disabled = false,
  className
}: SocialPlatformSelectorProps) {
  const [selected, setSelected] = useState<Set<SocialPlatform>>(
    new Set(selectedPlatforms)
  );

  // Filter out excluded platforms
  const availablePlatforms = PLATFORM_CONFIGS.filter(
    p => !excludePlatforms.includes(p.id)
  );

  const handlePlatformToggle = (platformId: SocialPlatform) => {
    if (disabled) return;

    const newSelected = new Set(selected);
    if (newSelected.has(platformId)) {
      newSelected.delete(platformId);
    } else {
      newSelected.add(platformId);
    }
    setSelected(newSelected);
    onPlatformsChange(Array.from(newSelected));
  };

  const handleSelectAll = () => {
    if (disabled) return;
    const allPlatforms = availablePlatforms.map(p => p.id);
    setSelected(new Set(allPlatforms));
    onPlatformsChange(allPlatforms);
  };

  const handleDeselectAll = () => {
    if (disabled) return;
    setSelected(new Set());
    onPlatformsChange([]);
  };

  const isAllSelected = selected.size === availablePlatforms.length && availablePlatforms.length > 0;
  const isNoneSelected = selected.size === 0;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with quick actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Select Platforms
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Choose which platforms to generate content for
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSelectAll}
            disabled={disabled || isAllSelected}
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Select All
          </Button>
          <Button
            onClick={handleDeselectAll}
            disabled={disabled || isNoneSelected}
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
          >
            <Circle className="h-3 w-3 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {/* Platform selection grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {availablePlatforms.map((platform) => {
          const isSelected = selected.has(platform.id);
          const Icon = platform.icon;

          return (
            <motion.div
              key={platform.id}
              initial={false}
              animate={{
                scale: isSelected ? 1 : 1,
                opacity: disabled ? 0.5 : 1
              }}
              transition={{ duration: 0.2 }}
            >
              <label
                htmlFor={`platform-${platform.id}`}
                className={cn(
                  'relative flex items-start gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer group',
                  isSelected
                    ? 'border-orchid bg-gradient-to-br from-orchid/10 to-indigo/10 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 bg-white',
                  disabled && 'cursor-not-allowed'
                )}
              >
                {/* Checkbox */}
                <div className="flex items-center h-5 mt-0.5">
                  <Checkbox
                    id={`platform-${platform.id}`}
                    checked={isSelected}
                    onCheckedChange={() => handlePlatformToggle(platform.id)}
                    disabled={disabled}
                    className={cn(
                      isSelected && 'border-orchid'
                    )}
                  />
                </div>

                {/* Platform info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {/* Platform icon */}
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                        isSelected
                          ? `bg-gradient-to-br ${platform.gradient}`
                          : 'bg-gray-100 group-hover:bg-gray-200'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-4 w-4 transition-colors',
                          isSelected ? 'text-white' : 'text-gray-600'
                        )}
                      />
                    </div>

                    {/* Platform name */}
                    <div>
                      <Label
                        htmlFor={`platform-${platform.id}`}
                        className={cn(
                          'text-sm font-semibold cursor-pointer',
                          isSelected ? 'text-gray-900' : 'text-gray-700'
                        )}
                      >
                        {platform.name}
                      </Label>
                    </div>
                  </div>

                  {/* Platform description */}
                  <p className="text-xs text-muted-foreground">
                    {platform.description}
                  </p>

                  {/* Character limit indicator */}
                  <p className="text-[10px] text-gray-500 mt-1">
                    Max {platform.maxChars.toLocaleString()} characters
                  </p>
                </div>

                {/* Selected indicator */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-2 right-2"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orchid to-indigo flex items-center justify-center">
                        <Check className="h-3.5 w-3.5 text-white" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </label>
            </motion.div>
          );
        })}
      </div>

      {/* Selection summary */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-muted-foreground">
          {selected.size === 0 && 'No platforms selected'}
          {selected.size === 1 && '1 platform selected'}
          {selected.size > 1 && `${selected.size} platforms selected`}
        </p>
        {selected.size > 0 && (
          <div className="flex items-center gap-1.5">
            {Array.from(selected).map((platformId) => {
              const config = PLATFORM_CONFIGS.find(p => p.id === platformId);
              if (!config) return null;
              const Icon = config.icon;
              return (
                <div
                  key={platformId}
                  className={cn(
                    'w-6 h-6 rounded-md flex items-center justify-center',
                    `bg-gradient-to-br ${config.gradient}`
                  )}
                  title={config.name}
                >
                  <Icon className="h-3 w-3 text-white" />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Results display component
interface SocialPlatformResultsProps {
  results: Record<SocialPlatform, string>;
  onCopy: (platform: SocialPlatform, content: string) => void;
  onRegenerate: (platform: SocialPlatform) => void;
  onSave: (platform: SocialPlatform, content: string) => Promise<void>;
  savedPlatforms?: Set<SocialPlatform>;
  regeneratingPlatforms?: Set<SocialPlatform>;
  isSaving?: boolean;
  isSaved?: boolean;
  onSaveAll?: () => void;
  className?: string;
}

export function SocialPlatformResults({
  results,
  onCopy,
  onRegenerate,
  onSave,
  savedPlatforms = new Set(),
  regeneratingPlatforms = new Set(),
  isSaving = false,
  isSaved = false,
  onSaveAll,
  className
}: SocialPlatformResultsProps) {
  const [copiedPlatform, setCopiedPlatform] = useState<SocialPlatform | null>(null);
  const [isSavingPlatform, setIsSavingPlatform] = useState<SocialPlatform | null>(null);

  const handleCopyPlatform = async (platform: SocialPlatform, content: string) => {
    if (!navigator.clipboard) {
      toast.error('Clipboard not available');
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      setCopiedPlatform(platform);
      onCopy(platform, content);
      toast.success(`${PLATFORM_CONFIGS.find(p => p.id === platform)?.name} content copied!`);

      // Reset copied state after 2 seconds
      const timeoutId = setTimeout(() => {
        setCopiedPlatform(null);
      }, 2000);

      // Cleanup on unmount
      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleSavePlatform = async (platform: SocialPlatform, content: string) => {
    setIsSavingPlatform(platform);
    try {
      await onSave(platform, content);
      toast.success(`${PLATFORM_CONFIGS.find(p => p.id === platform)?.name} content saved!`);
    } catch (error) {
      console.error('Save error:', error);
      toast.error(`Failed to save ${platform} content`);
    } finally {
      setIsSavingPlatform(null);
    }
  };

  const platformsWithResults = Object.entries(results)
    .filter(([_, content]) => content && content.trim().length > 0)
    .map(([platform]) => platform as SocialPlatform);

  if (platformsWithResults.length === 0) {
    return null;
  }

  // Get platform names for regenerating platforms
  const getRegeneratingMessage = () => {
    if (regeneratingPlatforms.size === 0) return '';

    const platformNames = Array.from(regeneratingPlatforms)
      .map(p => PLATFORM_CONFIGS.find(config => config.id === p)?.name)
      .filter(Boolean);

    if (platformNames.length === 1) {
      return platformNames[0];
    } else if (platformNames.length === 2) {
      return `${platformNames[0]} and ${platformNames[1]}`;
    } else {
      return platformNames.slice(0, -1).join(', ') + `, and ${platformNames[platformNames.length - 1]}`;
    }
  };

  // Check if all platforms are saved
  const allSaved = platformsWithResults.every(p => savedPlatforms.has(p));

  return (
    <div className={cn('space-y-3', className)}>
      {/* Main content container with unified green theme */}
      <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50/50 border border-green-200">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-green-600" />
          <span className="text-sm font-semibold text-green-900">
            AI Generated Content
          </span>
          <span className="text-xs text-muted-foreground">
            ({platformsWithResults.length} {platformsWithResults.length === 1 ? 'platform' : 'platforms'})
          </span>
          {allSaved && (
            <span className="text-xs text-green-600 ml-auto">✓ Saved</span>
          )}
          {regeneratingPlatforms.size > 0 && (
            <span className="text-xs text-orchid font-medium ml-auto">
              Regenerating for {getRegeneratingMessage()}...
            </span>
          )}
        </div>

        {/* Platform cards */}
        <div className="space-y-3">
          {platformsWithResults.map((platformId) => {
            const config = PLATFORM_CONFIGS.find(p => p.id === platformId);
            if (!config) return null;

            const Icon = config.icon;
            const content = results[platformId];
            const isCopied = copiedPlatform === platformId;
            const isRegeneratingThis = regeneratingPlatforms.has(platformId);

            return (
              <motion.div
                key={platformId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative p-3 rounded-lg bg-white border border-gray-200"
              >
                {/* Platform header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        'w-7 h-7 rounded-lg flex items-center justify-center',
                        `bg-gradient-to-br ${config.gradient}`
                      )}
                    >
                      <Icon className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {config.name}
                      </h4>
                      <p className="text-[10px] text-muted-foreground">
                        {content.length} / {config.maxChars.toLocaleString()} characters
                      </p>
                    </div>
                  </div>

                  {/* Individual platform actions */}
                  <div className="flex items-center gap-1.5">
                    <Button
                      onClick={() => handleCopyPlatform(platformId, content)}
                      disabled={isCopied}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'h-7 text-xs px-2',
                        isCopied && 'text-green-600'
                      )}
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => onRegenerate(platformId)}
                      disabled={isRegeneratingThis}
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs px-2"
                    >
                      <RotateCw className={cn(
                        'h-3 w-3 mr-1',
                        isRegeneratingThis && 'animate-spin'
                      )} />
                      Regenerate
                    </Button>
                    <Button
                      onClick={() => handleSavePlatform(platformId, content)}
                      disabled={isSavingPlatform === platformId || savedPlatforms.has(platformId)}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'h-7 text-xs px-2',
                        savedPlatforms.has(platformId) && 'text-green-600'
                      )}
                    >
                      {isSavingPlatform === platformId ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Saving...
                        </>
                      ) : savedPlatforms.has(platformId) ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Save className="h-3 w-3 mr-1" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Generated content */}
                <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 p-3 rounded-md">
                  {content}
                </div>

                {/* Character limit warning */}
                {content.length > config.maxChars && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
                    <AlertTriangle className="h-3 w-3" />
                    Exceeds limit by {(content.length - config.maxChars).toLocaleString()} chars
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Unified action button */}
        <div className="mt-4">
          <Button
            onClick={onSaveAll}
            disabled={isSaving || isSaved}
            variant="default"
            size="sm"
            className={cn(
              'w-full bg-green-600 hover:bg-green-700 text-white',
              isSaved && 'bg-green-700'
            )}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Saving...
              </>
            ) : isSaved ? (
              <>
                <Save className="h-4 w-4 mr-1" />
                Saved
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-1" />
                Save All
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
