import type { NextConfig } from "next";

// Injected content via Sentry wizard below
import { withSentryConfig } from "@sentry/nextjs";

// Bundle analyzer - run with ANALYZE=true npm run build
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  // Skip build-time prerendering - generate pages on-demand at runtime
  // This is necessary because the app uses dynamic features (useSearchParams) extensively
  skipTrailingSlashRedirect: true,

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
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
