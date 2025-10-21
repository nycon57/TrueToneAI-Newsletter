'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useOnboarding } from '../providers/onboarding-provider';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { CATEGORIES, type Category } from '@/lib/constants/categories';
import { useState } from 'react';

export function CategorySelection() {
  const {
    data,
    errors,
    updateData,
    nextStep,
    previousStep,
    validateCurrentStep,
  } = useOnboarding();

  const selectedCategories = (data.categoryPreferences || []) as string[];
  const selectedTags = (data.tagPreferences || []) as string[];
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(selectedCategories)
  );

  const handleCategoryToggle = (categoryId: string) => {
    const isCurrentlySelected = selectedCategories.includes(categoryId);

    if (isCurrentlySelected) {
      // Deselect category and all its tags
      const newCategories = selectedCategories.filter(id => id !== categoryId);
      const category = CATEGORIES.find(c => c.id === categoryId);
      const categoryTagIds = category?.tags.map(t => t.id) || [];
      const newTags = selectedTags.filter(t => !categoryTagIds.includes(t));

      updateData('categoryPreferences', newCategories);
      updateData('tagPreferences', newTags);

      // Collapse if deselected
      const newExpanded = new Set(expandedCategories);
      newExpanded.delete(categoryId);
      setExpandedCategories(newExpanded);
    } else {
      // Select category and expand it
      const newCategories = [...selectedCategories, categoryId];
      updateData('categoryPreferences', newCategories);

      const newExpanded = new Set(expandedCategories);
      newExpanded.add(categoryId);
      setExpandedCategories(newExpanded);
    }
  };

  const handleTagToggle = (tagId: string) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];

    updateData('tagPreferences', newTags);
  };

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCurrentStep()) {
      nextStep();
    }
  };

  const getCategoryTagCount = (categoryId: string) => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    if (!category) return 0;
    const categoryTagIds = category.tags.map(t => t.id);
    return selectedTags.filter(t => categoryTagIds.includes(t)).length;
  };

  const hasSelection = selectedCategories.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <Card className="shadow-lg border-border">
        <CardHeader className="text-center pb-6 space-y-2">
          <CardTitle className="text-3xl font-heading font-bold">
            Choose Your Content Preferences
          </CardTitle>
          <CardDescription className="text-base">
            Select categories you're interested in, then optionally refine with specific tags
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit}>
            {/* Selection Summary */}
            <div className="flex flex-wrap gap-3 items-center mb-6 pb-4 border-b">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {selectedCategories.length}
                  </span> {selectedCategories.length === 1 ? 'category' : 'categories'} selected
                </p>
                {selectedTags.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedTags.length} specific {selectedTags.length === 1 ? 'tag' : 'tags'}
                  </p>
                )}
              </div>
              {selectedCategories.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    updateData('categoryPreferences', []);
                    updateData('tagPreferences', []);
                    setExpandedCategories(new Set());
                  }}
                  className="text-destructive hover:text-destructive/90"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* Category Grid */}
            <div className="space-y-3">
              {CATEGORIES.map((category) => {
                const isSelected = selectedCategories.includes(category.id);
                const isExpanded = expandedCategories.has(category.id);
                const Icon = category.icon;
                const tagCount = getCategoryTagCount(category.id);

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "border-2 rounded-lg transition-all duration-200",
                      isSelected
                        ? "bg-primary/5 border-primary shadow-sm"
                        : "bg-background border-border hover:border-border/60"
                    )}
                  >
                    {/* Category Header */}
                    <div className="flex items-start gap-3 p-4">
                      <Checkbox
                        id={category.id}
                        checked={isSelected}
                        onCheckedChange={() => handleCategoryToggle(category.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <Label
                          htmlFor={category.id}
                          className="cursor-pointer flex items-center gap-2 mb-1"
                        >
                          <Icon className={cn(
                            "h-5 w-5 flex-shrink-0",
                            isSelected ? "text-primary" : "text-muted-foreground"
                          )} />
                          <span className={cn(
                            "font-medium text-base",
                            isSelected ? "text-primary" : "text-foreground"
                          )}>
                            {category.label}
                          </span>
                          {tagCount > 0 && (
                            <Badge variant="secondary" className="ml-auto">
                              {tagCount} {tagCount === 1 ? 'tag' : 'tags'}
                            </Badge>
                          )}
                        </Label>
                        <p className="text-sm text-muted-foreground leading-snug">
                          {category.description}
                        </p>
                      </div>
                      {isSelected && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(category.id)}
                          className="flex-shrink-0"
                        >
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>

                    {/* Tags (Expandable) */}
                    <AnimatePresence>
                      {isSelected && isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-2 border-t border-border/50">
                            <p className="text-xs font-medium text-muted-foreground mb-3">
                              Refine with specific topics (optional):
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {category.tags.map((tag) => {
                                const isTagSelected = selectedTags.includes(tag.id);
                                return (
                                  <Label
                                    key={tag.id}
                                    htmlFor={tag.id}
                                    className={cn(
                                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm cursor-pointer transition-all",
                                      "border hover:shadow-sm",
                                      isTagSelected
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-background border-border hover:bg-muted"
                                    )}
                                  >
                                    <Checkbox
                                      id={tag.id}
                                      checked={isTagSelected}
                                      onCheckedChange={() => handleTagToggle(tag.id)}
                                      className="sr-only"
                                    />
                                    {tag.label}
                                  </Label>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Error Message */}
            {errors.categoryPreferences && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4"
              >
                <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  {errors.categoryPreferences}
                </p>
              </motion.div>
            )}

            {/* Info Tip */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-6">
              <p className="text-primary text-sm leading-relaxed">
                <strong className="font-semibold">Tip:</strong> Select at least one category to receive personalized content.
                Tags help us further refine what you see, but they're completely optional!
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-6 mt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={previousStep}
                className="flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                type="submit"
                disabled={!hasSelection}
                className="flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
