import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { inter, signal } from "./fonts";
import { Providers } from "./providers";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";

export const metadata: Metadata = {
  title: "TrueTone AI Newsletter",
  description: "Mobile-first newsletter platform for loan officers with AI-powered content customization",
  manifest: "/manifest.json",
  themeColor: "#9333EA",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TrueTone AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${signal.variable} font-sans antialiased`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <NuqsAdapter>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </NuqsAdapter>
          <ServiceWorkerRegistration />
        </Providers>
      </body>
    </html>
  );
}
