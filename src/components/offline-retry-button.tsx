'use client';

export function OfflineRetryButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-orchid to-indigo text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
    >
      Try Again
    </button>
  );
}
