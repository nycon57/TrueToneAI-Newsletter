'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit2, Save, X, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface EditableContentSectionProps {
  title: string;
  content: string;
  onSave: (newContent: string) => Promise<void>;
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  bgColor?: string;
  borderColor?: string;
  buttonColor?: string;
  buttonHoverColor?: string;
  multiline?: boolean;
  maxLength?: number;
  placeholder?: string;
  contentType: 'video_script' | 'email_template' | 'key_insights' | 'social_media';
  className?: string;
  disabled?: boolean;
}

export function EditableContentSection({
  title,
  content,
  onSave,
  icon: Icon,
  iconColor = 'text-gray-600',
  bgColor = 'from-gray-50 to-gray-50/50',
  borderColor = 'border-gray-200',
  buttonColor = 'bg-gray-600 hover:bg-gray-700',
  buttonHoverColor = 'hover:bg-gray-100',
  multiline = true,
  maxLength,
  placeholder = 'Enter content...',
  contentType,
  className,
  disabled = false,
}: EditableContentSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update edited content when content prop changes
  useEffect(() => {
    setEditedContent(content);
    setIsDirty(false);
  }, [content]);

  // Focus input/textarea when entering edit mode
  useEffect(() => {
    if (isEditing) {
      if (multiline) {
        textareaRef.current?.focus();
        textareaRef.current?.select();
      } else {
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    }
  }, [isEditing, multiline]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!isEditing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to cancel
      if (e.key === 'Escape') {
        handleCancel();
      }
      // Cmd/Ctrl + Enter to save
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, editedContent]);

  const handleEdit = () => {
    if (disabled) return;
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedContent(content);
    setIsEditing(false);
    setIsDirty(false);
  };

  const handleSave = async () => {
    if (disabled || !isDirty) return;

    setIsSaving(true);
    try {
      await onSave(editedContent);
      setIsEditing(false);
      setIsDirty(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to save content:', error);
      // You could add error toast notification here
    } finally {
      setIsSaving(false);
    }
  };

  const handleContentChange = (value: string) => {
    setEditedContent(value);
    setIsDirty(value !== content);
  };

  const remainingChars = maxLength ? maxLength - editedContent.length : null;
  const isOverLimit = remainingChars !== null && remainingChars < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('relative', className)}
    >
      <div className={cn(
        'p-6 bg-gradient-to-br rounded-xl border transition-all duration-200',
        bgColor,
        borderColor,
        isEditing && 'ring-2 ring-offset-2',
        isEditing && borderColor.replace('border-', 'ring-')
      )}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {Icon && <Icon className={cn('h-5 w-5', iconColor)} />}
            <h4 className="font-bold text-gray-900">{title}</h4>
            {isDirty && !isEditing && (
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 text-xs">
                Unsaved
              </Badge>
            )}
            {showSuccess && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <Badge className="bg-green-100 text-green-700 border-0 text-xs gap-1">
                  <Check className="h-3 w-3" />
                  Saved
                </Badge>
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button
                onClick={handleEdit}
                disabled={disabled}
                variant="outline"
                size="sm"
                className={cn('gap-1.5', buttonHoverColor)}
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleCancel}
                  disabled={isSaving}
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !isDirty || isOverLimit}
                  size="sm"
                  className={cn('gap-1.5 text-white', buttonColor)}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      Save
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Content Display / Edit */}
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="editing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {multiline ? (
                <Textarea
                  ref={textareaRef}
                  value={editedContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder={placeholder}
                  maxLength={maxLength}
                  disabled={isSaving}
                  className={cn(
                    'min-h-32 resize-y text-sm leading-relaxed',
                    isOverLimit && 'border-red-500 focus-visible:ring-red-200'
                  )}
                  aria-label={`Edit ${title}`}
                />
              ) : (
                <Input
                  ref={inputRef}
                  value={editedContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder={placeholder}
                  maxLength={maxLength}
                  disabled={isSaving}
                  className={cn(
                    'text-sm',
                    isOverLimit && 'border-red-500 focus-visible:ring-red-200'
                  )}
                  aria-label={`Edit ${title}`}
                />
              )}

              {/* Character Counter */}
              {maxLength && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    {contentType === 'social_media' && 'Character limit for optimal engagement'}
                  </span>
                  <span className={cn(
                    'font-medium',
                    isOverLimit ? 'text-red-600' : remainingChars !== null && remainingChars < 20 ? 'text-amber-600' : 'text-gray-500'
                  )}>
                    {editedContent.length} / {maxLength}
                    {remainingChars !== null && remainingChars >= 0 && (
                      <> ({remainingChars} remaining)</>
                    )}
                  </span>
                </div>
              )}

              {/* Keyboard Shortcuts Hint */}
              <div className="flex items-center gap-3 text-xs text-gray-500 pt-1">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Esc</kbd>
                  to cancel
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono">⌘ Enter</kbd>
                  to save
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="display"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed"
            >
              {content || <span className="text-gray-400 italic">No content yet</span>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
