"use client";

import { cn } from "@/lib/utils";
import type { DeviceType } from "./device-toggle";

interface DeviceFrameProps {
  device: DeviceType;
  children: React.ReactNode;
}

export function DeviceFrame({ device, children }: DeviceFrameProps) {
  if (device === "mobile") {
    return (
      <div className="flex justify-center p-8">
        {/* iPhone-style frame */}
        <div className="relative">
          {/* Phone outer frame */}
          <div className="w-[375px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-3xl z-10" />

            {/* Screen */}
            <div className="relative bg-white rounded-[2.5rem] overflow-hidden">
              {/* Status bar */}
              <div className="h-12 bg-white flex items-center justify-between px-8 pt-2">
                <span className="text-xs font-semibold text-gray-900">9:41</span>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-2 border border-gray-900 rounded-sm">
                    <div className="w-3 h-1.5 bg-gray-900 rounded-sm" />
                  </div>
                </div>
              </div>

              {/* Content area */}
              <div
                className="h-[667px] overflow-y-auto bg-gradient-to-br from-lavender/20 via-white to-lavender/20"
                style={{ scrollbarWidth: 'thin' }}
              >
                {children}
              </div>

              {/* Home indicator */}
              <div className="h-8 bg-white flex items-center justify-center">
                <div className="w-32 h-1 bg-gray-900 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop view
  return (
    <div className="flex justify-center p-8">
      {/* Desktop browser frame */}
      <div className="w-full max-w-[1024px] bg-gray-100 rounded-lg shadow-2xl overflow-hidden border border-gray-300">
        {/* Browser chrome */}
        <div className="h-10 bg-gray-200 border-b border-gray-300 flex items-center px-4 gap-2">
          {/* Window controls */}
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>

          {/* URL bar */}
          <div className="flex-1 mx-4">
            <div className="bg-white rounded-md px-4 py-1.5 text-sm text-gray-500 border border-gray-300">
              truetone.ai/newsletter/preview
            </div>
          </div>
        </div>

        {/* Content area */}
        <div
          className={cn(
            "h-[600px] overflow-y-auto bg-gradient-to-br from-lavender/20 via-white to-lavender/20"
          )}
          style={{ scrollbarWidth: 'thin' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
