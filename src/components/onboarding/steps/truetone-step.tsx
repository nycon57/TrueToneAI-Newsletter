'use client';

import { useState } from 'react';
import { useOnboarding } from '../providers/onboarding-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Info } from 'lucide-react';
import {
  TRUETONE_CHARACTERISTICS,
} from '@/lib/constants/truetone-characteristics';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function TrueToneCharacteristicsStep() {
  const { data, updateData, nextStep, previousStep } = useOnboarding();

  // Initialize truetone settings with defaults if not already set
  const [truetoneSettings, setTruetoneSettings] = useState(
    data.truetoneSettings ||
      TRUETONE_CHARACTERISTICS.reduce((acc, char) => {
        acc[char.id] = char.defaultValue;
        return acc;
      }, {} as Record<string, string>)
  );

  const handleCharacteristicChange = (id: string, value: string) => {
    const updated = { ...truetoneSettings, [id]: value };
    setTruetoneSettings(updated);
    updateData('truetoneSettings', updated);
  };

  const handleContinue = () => {
    nextStep();
  };

  // Get example for currently selected value
  const getSelectedExample = (characteristicId: string) => {
    const characteristic = TRUETONE_CHARACTERISTICS.find(c => c.id === characteristicId);
    if (!characteristic) return '';

    const selectedValue = truetoneSettings[characteristicId];
    const option = characteristic.options.find(o => o.value === selectedValue);
    return option?.example || '';
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <Card className="shadow-lg">
        <CardContent className="p-8">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-heading font-bold mb-2">Customize Your TrueTone</CardTitle>
            <CardDescription className="text-lg">
              TrueTone personalizes your content to match your unique communication style.
              Select your preferences below to create content that sounds authentically like you.
            </CardDescription>
          </CardHeader>

          {/* Two Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TRUETONE_CHARACTERISTICS.map((characteristic) => (
              <div key={characteristic.id} className="space-y-3">
                {/* Label with Tooltip */}
                <div className="flex items-center gap-2">
                  <Label htmlFor={characteristic.id}>
                    {characteristic.label}
                  </Label>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <p>{characteristic.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Select Dropdown */}
                <Select
                  value={truetoneSettings[characteristic.id]}
                  onValueChange={(value) =>
                    handleCharacteristicChange(characteristic.id, value)
                  }
                >
                  <SelectTrigger
                    id={characteristic.id}
                    className="w-full bg-background border-border"
                  >
                    <SelectValue placeholder={`Select ${characteristic.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {characteristic.options.map((option) => (
                      <TooltipProvider key={option.value} delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SelectItem
                              value={option.value}
                              className="cursor-pointer"
                            >
                              {option.label}
                            </SelectItem>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-sm">
                            <div className="space-y-2">
                              <p className="font-medium">{option.description}</p>
                              <p className="text-xs text-muted-foreground italic">
                                Example: "{option.example}"
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </SelectContent>
                </Select>

                {/* Example Text */}
                <div className="text-sm text-muted-foreground bg-muted/50 rounded p-3 min-h-[60px] flex items-center">
                  <p className="italic">"{getSelectedExample(characteristic.id)}"</p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={previousStep} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleContinue} className="flex items-center gap-2">
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
