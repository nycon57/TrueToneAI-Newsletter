import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { inter, signal } from "./fonts";
import { Providers } from "./providers";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
import { WebVitals } from "@/components/performance/web-vitals";

export const metadata: Metadata = {
  title: "TrueTone AI Newsletter",
  description: "Mobile-first newsletter platform for loan officers with AI-powered content customization",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TrueTone AI",
  },
};

export const viewport: Viewport = {
  themeColor: "#9333EA",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/*
          Dev-only React Grab scripts for AI-assisted development
          - Pinned to specific versions (0.0.68) to avoid supply chain attacks
          - Only loaded in development mode - never in production builds
          - crossOrigin="anonymous" enables proper CORS and error reporting
          Security note: For maximum security, consider installing these as dev
          dependencies and bundling locally instead of loading from CDN
        */}
        {process.env.NODE_ENV === "development" && (
          <Script
            src="https://unpkg.com/react-grab@0.0.68/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
        {process.env.NODE_ENV === "development" && (
          <Script
            src="https://unpkg.com/@react-grab/claude-code@0.0.68/dist/client.global.js"
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}
        {/* DNS Prefetch & Preconnect for external resources */}
        <link rel="dns-prefetch" href="https://o4509674593124353.ingest.us.sentry.io" />
        <link rel="preconnect" href="https://o4509674593124353.ingest.us.sentry.io" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.variable} ${signal.variable} font-sans antialiased`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
          <ServiceWorkerRegistration />
          <WebVitals />
        </Providers>
      </body>
    </html>
  );
}
