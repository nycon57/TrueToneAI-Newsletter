'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit2, Save, X, Check, Loader2, Plus, Trash2, GripVertical, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface EditableKeyInsightsProps {
  insights: string[];
  onSave: (newInsights: string[]) => Promise<void>;
  maxInsights?: number;
  maxLength?: number;
  className?: string;
  disabled?: boolean;
}

export function EditableKeyInsights({
  insights,
  onSave,
  maxInsights = 6,
  maxLength = 200,
  className,
  disabled = false,
}: EditableKeyInsightsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedInsights, setEditedInsights] = useState<string[]>(insights);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);

  // Update edited insights when insights prop changes
  useEffect(() => {
    setEditedInsights(insights);
    setIsDirty(false);
  }, [insights]);

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
  }, [isEditing, editedInsights]);

  const handleEdit = () => {
    if (disabled) return;
    setIsEditing(true);
    // Focus first insight after a short delay
    setTimeout(() => {
      textareaRefs.current[0]?.focus();
    }, 100);
  };

  const handleCancel = () => {
    setEditedInsights(insights);
    setIsEditing(false);
    setIsDirty(false);
    setFocusedIndex(null);
  };

  const handleSave = async () => {
    if (disabled || !isDirty) return;

    // Filter out empty insights
    const filteredInsights = editedInsights.filter(insight => insight.trim().length > 0);

    if (filteredInsights.length === 0) {
      // Don't save if there are no insights
      return;
    }

    setIsSaving(true);
    try {
      await onSave(filteredInsights);
      setIsEditing(false);
      setIsDirty(false);
      setFocusedIndex(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to save insights:', error);
      // You could add error toast notification here
    } finally {
      setIsSaving(false);
    }
  };

  const handleInsightChange = (index: number, value: string) => {
    const newInsights = [...editedInsights];
    newInsights[index] = value;
    setEditedInsights(newInsights);
    setIsDirty(JSON.stringify(newInsights) !== JSON.stringify(insights));
  };

  const handleAddInsight = () => {
    if (editedInsights.length >= maxInsights) return;

    const newInsights = [...editedInsights, ''];
    setEditedInsights(newInsights);
    setIsDirty(true);

    // Focus the new insight after a short delay
    setTimeout(() => {
      const newIndex = newInsights.length - 1;
      textareaRefs.current[newIndex]?.focus();
      setFocusedIndex(newIndex);
    }, 100);
  };

  const handleRemoveInsight = (index: number) => {
    if (editedInsights.length <= 1) return; // Keep at least one insight

    const newInsights = editedInsights.filter((_, i) => i !== index);
    setEditedInsights(newInsights);
    setIsDirty(true);

    // Focus previous insight if available
    if (focusedIndex === index && index > 0) {
      setTimeout(() => {
        textareaRefs.current[index - 1]?.focus();
        setFocusedIndex(index - 1);
      }, 100);
    }
  };

  const canAddMore = editedInsights.length < maxInsights;
  const hasValidInsights = editedInsights.some(insight => insight.trim().length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('relative', className)}
    >
      <div className={cn(
        'p-6 bg-gradient-to-br from-purple-50 to-purple-50/50 rounded-xl border border-purple-200 transition-all duration-200',
        isEditing && 'ring-2 ring-purple-300 ring-offset-2'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-purple-600" />
            <h4 className="font-bold text-gray-900">Key Insights</h4>
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
            {isEditing && (
              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                {editedInsights.length} / {maxInsights} insights
              </Badge>
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
                className="gap-1.5 hover:bg-purple-100"
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
                  disabled={isSaving || !isDirty || !hasValidInsights}
                  size="sm"
                  className="gap-1.5 bg-purple-600 hover:bg-purple-700 text-white"
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

        {/* Insights List */}
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="editing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {editedInsights.map((insight, index) => {
                const charCount = insight.length;
                const isOverLimit = charCount > maxLength;
                const isNearLimit = charCount > maxLength * 0.8;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={cn(
                      'group relative flex gap-2 p-3 rounded-lg border transition-all',
                      focusedIndex === index ? 'border-purple-300 bg-purple-50/50' : 'border-gray-200 bg-white'
                    )}
                  >
                    {/* Drag Handle (visual only for now) */}
                    <div className="flex items-start pt-2">
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-grab active:cursor-grabbing" />
                    </div>

                    {/* Insight Number */}
                    <div className="flex items-start pt-2">
                      <div className="flex items-center justify-center h-5 w-5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                        {index + 1}
                      </div>
                    </div>

                    {/* Insight Content */}
                    <div className="flex-1 space-y-1">
                      <Textarea
                        ref={(el) => {
                          textareaRefs.current[index] = el;
                        }}
                        value={insight}
                        onChange={(e) => handleInsightChange(index, e.target.value)}
                        onFocus={() => setFocusedIndex(index)}
                        onBlur={() => setFocusedIndex(null)}
                        placeholder={`Key insight ${index + 1}...`}
                        maxLength={maxLength}
                        disabled={isSaving}
                        className={cn(
                          'min-h-16 resize-y text-sm leading-relaxed',
                          isOverLimit && 'border-red-500 focus-visible:ring-red-200'
                        )}
                        aria-label={`Insight ${index + 1}`}
                      />

                      {/* Character Count */}
                      <div className="flex items-center justify-end text-xs">
                        <span className={cn(
                          'font-medium',
                          isOverLimit ? 'text-red-600' : isNearLimit ? 'text-amber-600' : 'text-gray-500'
                        )}>
                          {charCount} / {maxLength}
                        </span>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <div className="flex items-start pt-2">
                      <Button
                        onClick={() => handleRemoveInsight(index)}
                        disabled={editedInsights.length <= 1 || isSaving}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Remove insight ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}

              {/* Add Insight Button */}
              {canAddMore && (
                <Button
                  onClick={handleAddInsight}
                  disabled={isSaving}
                  variant="outline"
                  size="sm"
                  className="w-full gap-1.5 border-dashed border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400"
                >
                  <Plus className="h-4 w-4" />
                  Add Insight
                </Button>
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
              className="space-y-2"
            >
              {insights.length > 0 ? (
                insights.map((insight, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-purple-600 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{insight}</span>
                  </div>
                ))
              ) : (
                <span className="text-sm text-gray-400 italic">No insights yet</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
