import * as Sentry from "@sentry/nextjs";
import { initBotId } from 'botid/client/core';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: 1.0,

  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

// Bot protection - define routes that need protection
initBotId({
  protect: [
    // AI endpoints (expensive operations)
    { path: '/api/ai/*', method: 'POST' },
    { path: '/api/chat/*', method: 'POST' },
    // Payment
    { path: '/api/stripe/checkout', method: 'POST' },
    // Email
    { path: '/api/email/send', method: 'POST' },
    // Support
    { path: '/api/support/*', method: 'POST' },
    // Social
    { path: '/api/social/publish', method: 'POST' },
    // User profile
    { path: '/api/user/profile', method: 'PUT' },
    { path: '/api/user/profile', method: 'POST' },
  ],
});

// This export will instrument router navigations, and is only relevant if you enable tracing.
// `captureRouterTransitionStart` is available from SDK version 9.12.0 onwards
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart; 