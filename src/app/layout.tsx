import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnalyticsProvider } from "@/lib/analytics/hooks";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { inter, signal } from "./fonts";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrueTone AI Newsletter",
  description: "Mobile-first newsletter platform for loan officers with AI-powered content customization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${signal.variable} ${geistMono.variable} font-sans antialiased`}
        suppressHydrationWarning={true}
      >
        <TooltipProvider>
          <AnalyticsProvider
            enableAutoTracking={true}
            config={{
              enablePageViews: true,
              enableClickTracking: true,
              enablePerformanceTracking: true
            }}
          >
            {children}
            <Toaster />
          </AnalyticsProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
