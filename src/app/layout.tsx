import type { Metadata, Viewport } from "next";
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
