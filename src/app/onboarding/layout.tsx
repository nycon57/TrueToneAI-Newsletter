import React from "react";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ThemeProvider is already provided at the root level - no need to nest it here
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        {children}
      </div>
    </div>
  );
}