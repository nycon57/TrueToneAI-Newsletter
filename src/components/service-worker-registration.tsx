'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/register-sw';

/**
 * Component to register service worker on mount
 * Only runs in production
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
}
