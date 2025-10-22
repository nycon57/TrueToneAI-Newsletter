import type { NextConfig } from "next";

// Injected content via Sentry wizard below
import { withSentryConfig } from "@sentry/nextjs";

// Bundle analyzer - run with ANALYZE=true npm run build
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // TODO(TICKET-XXX): Re-enable build checks after addressing existing lint/type errors
  // These are temporarily disabled during migration - remove before production deployment
  eslint: {
    ignoreDuringBuilds: process.env.LOCAL_DEV === 'true' || process.env.MIGRATION_MODE === 'true',
  },
  typescript: {
    ignoreBuildErrors: process.env.LOCAL_DEV === 'true' || process.env.MIGRATION_MODE === 'true',
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

  // Experimental performance features
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'date-fns', 'motion'],
    // Optimize server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
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

// Wrap config with bundle analyzer then Sentry
export default withSentryConfig(
  withBundleAnalyzer(nextConfig),
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "truetone-ai",
    project: "ttai-newsletter",
  }
);
