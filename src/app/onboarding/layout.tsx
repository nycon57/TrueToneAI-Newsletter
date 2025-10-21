import React from "react";
import { ThemeProvider } from "next-themes";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
    >
      <div className="min-h-screen bg-background text-foreground">
        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
}