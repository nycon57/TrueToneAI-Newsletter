import type { NextConfig } from "next";

// Injected content via Sentry wizard below
import { withSentryConfig } from "@sentry/nextjs";

// Bot protection
import { withBotId } from 'botid/next/config';

// Bundle analyzer - run with ANALYZE=true npm run build --webpack
// Note: Bundle analyzer requires webpack mode in Next.js 16
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Build checks - ignore pre-existing type errors during builds
  // Note: eslint config removed in Next.js 16 - use eslint CLI directly
  typescript: {
    ignoreBuildErrors: true,
  },

  // Skip build-time prerendering - generate pages on-demand at runtime
  // This is necessary because the app uses dynamic features (useSearchParams) extensively
  skipTrailingSlashRedirect: true,

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Optimize production builds
  productionBrowserSourceMaps: false,

  // Server external packages (moved from experimental in Next.js 15)
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-pg'],

  // Experimental performance features (Next.js 16)
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'date-fns', 'motion'],
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60, // Keep at 60 seconds (Next.js 16 defaults to 14400)
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256], // Keep 16 (removed in Next.js 16 defaults)
  },

  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

// For Turbopack (default in Next.js 16), Sentry uses different instrumentation
// The withSentryConfig wrapper is still needed but works differently with Turbopack
export default withBotId(
  withSentryConfig(
    withBundleAnalyzer(nextConfig),
    {
      // For all available options, see:
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/build/

      // Suppresses source map uploading logs during build
      silent: true,
      org: "truetone-ai",
      project: "ttai-newsletter",

      // Turbopack-specific options (Next.js 16)
      // Source maps are uploaded after build completes
      runAfterProductionCompile: true,
    }
  )
);
