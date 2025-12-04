"use client";

import { Monitor, Smartphone } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type DeviceType = "mobile" | "desktop";

interface DeviceToggleProps {
  value: DeviceType;
  onValueChange: (value: DeviceType) => void;
}

export function DeviceToggle({ value, onValueChange }: DeviceToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(val) => {
        if (val) onValueChange(val as DeviceType);
      }}
      variant="outline"
      className="bg-muted p-1 rounded-lg"
    >
      <ToggleGroupItem
        value="mobile"
        aria-label="Mobile view"
        className="gap-2 px-4 py-2 data-[state=on]:bg-white data-[state=on]:shadow-sm"
      >
        <Smartphone className="h-4 w-4" />
        <span className="text-sm font-medium">Mobile</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="desktop"
        aria-label="Desktop view"
        className="gap-2 px-4 py-2 data-[state=on]:bg-white data-[state=on]:shadow-sm"
      >
        <Monitor className="h-4 w-4" />
        <span className="text-sm font-medium">Desktop</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
