'use client';

import { Check, ChevronsUpDown, FileText, Lightbulb, Mail, Share2, Video, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export type PersonalizationType =
  | 'default'
  | 'key_insights'
  | 'video_script'
  | 'email_template'
  | 'social_media';

interface PersonalizationOption {
  id: PersonalizationType;
  label: string;
  icon: LucideIcon;
}

const PERSONALIZATION_OPTIONS: PersonalizationOption[] = [
  {
    id: 'default',
    label: 'Default Content Only',
    icon: FileText,
  },
  {
    id: 'key_insights',
    label: 'Key Insights',
    icon: Lightbulb,
  },
  {
    id: 'video_script',
    label: 'Video Script',
    icon: Video,
  },
  {
    id: 'email_template',
    label: 'Email Template',
    icon: Mail,
  },
  {
    id: 'social_media',
    label: 'Social Media',
    icon: Share2,
  },
];

interface PersonalizationsMultiselectProps {
  selectedPersonalizations: PersonalizationType[];
  onChange: (personalizations: PersonalizationType[]) => void;
  className?: string;
}

export function PersonalizationsMultiselect({
  selectedPersonalizations,
  onChange,
  className,
}: PersonalizationsMultiselectProps) {
  const [open, setOpen] = useState(false);

  const togglePersonalization = (personalizationId: PersonalizationType) => {
    const newSelection = selectedPersonalizations.includes(personalizationId)
      ? selectedPersonalizations.filter((id) => id !== personalizationId)
      : [...selectedPersonalizations, personalizationId];
    onChange(newSelection);
  };

  const removePersonalization = (personalizationId: PersonalizationType) => {
    onChange(selectedPersonalizations.filter((id) => id !== personalizationId));
  };

  const selectedPersonalizationObjects = PERSONALIZATION_OPTIONS.filter((gen) =>
    selectedPersonalizations.includes(gen.id)
  );

  const triggerLabel =
    selectedPersonalizations.length > 0
      ? `Personalizations (${selectedPersonalizations.length} selected)`
      : 'All personalizations';

  return (
    <div className={cn('w-full space-y-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select personalizations"
            className="w-full justify-between font-normal"
          >
            <span className="truncate">{triggerLabel}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search personalizations..." />
            <CommandList>
              <CommandEmpty>No personalizations found.</CommandEmpty>
              <CommandGroup>
                {PERSONALIZATION_OPTIONS.map((personalization) => {
                  const Icon = personalization.icon;
                  const isSelected = selectedPersonalizations.includes(personalization.id);

                  return (
                    <CommandItem
                      key={personalization.id}
                      value={personalization.label}
                      onSelect={() => togglePersonalization(personalization.id)}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-1 items-center gap-2">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => togglePersonalization(personalization.id)}
                          aria-label={`Select ${personalization.label}`}
                        />
                        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        <span className="font-medium">{personalization.label}</span>
                      </div>
                      {isSelected && (
                        <Check className="ml-auto h-4 w-4 text-primary" aria-hidden="true" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedPersonalizationObjects.length > 0 && (
        <div className="flex flex-wrap gap-2" role="list" aria-label="Selected personalizations">
          {selectedPersonalizationObjects.map((personalization) => {
            const Icon = personalization.icon;
            return (
              <Badge
                key={personalization.id}
                variant="outline"
                className="gap-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                role="listitem"
              >
                <Icon className="h-3 w-3" aria-hidden="true" />
                {personalization.label}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => removePersonalization(personalization.id)}
                  aria-label={`Remove ${personalization.label}`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
