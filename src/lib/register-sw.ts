'use client';

// Store interval ID globally to allow cleanup
let updateCheckIntervalId: number | undefined;

/**
 * Service Worker registration utility
 * Registers the service worker for offline support
 */
export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // Only register in production
  if (process.env.NODE_ENV !== 'production') {
    console.log('[SW] Service worker disabled in development');
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[SW] Service worker registered:', registration.scope);

        // Check for updates periodically and store interval ID
        updateCheckIntervalId = window.setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Check every hour

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;

          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                console.log('[SW] New version available! Reload to update.');

                // Optionally, show a notification to the user
                if (window.confirm('A new version is available! Reload to update?')) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('[SW] Service worker registration failed:', error);
      });

    // Handle controller change
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[SW] Controller changed, reloading page...');
      window.location.reload();
    });
  });
}

/**
 * Unregister service worker (for development/debugging)
 */
export async function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    // Clear the update check interval to prevent timer leaks
    if (updateCheckIntervalId !== undefined) {
      window.clearInterval(updateCheckIntervalId);
      updateCheckIntervalId = undefined;
      console.log('[SW] Update check interval cleared');
    }

    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    console.log('[SW] Service worker unregistered');
  }
}
