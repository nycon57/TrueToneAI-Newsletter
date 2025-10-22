import { Card, CardContent } from '@/components/ui/card';
import { WifiOff } from 'lucide-react';
import { OfflineRetryButton } from '@/components/offline-retry-button';

export const metadata = {
  title: 'Offline | TrueTone AI Newsletter',
  description: 'You are currently offline',
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender/20 via-white to-lavender/20 flex items-center justify-center p-4">
      <Card className="shadow-lg border-0 max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-lavender/20 rounded-full flex items-center justify-center">
              <WifiOff className="h-8 w-8 text-orchid" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            You're Offline
          </h1>

          <p className="text-gray-600 mb-6">
            It looks like you've lost your internet connection. Some features may be unavailable until you're back online.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <p className="text-sm text-blue-900 mb-2 font-medium">
              💡 Tip: Some content may still be available from cache
            </p>
            <p className="text-sm text-blue-800">
              Try navigating to recently viewed pages to access cached content.
            </p>
          </div>

          <OfflineRetryButton />
        </CardContent>
      </Card>
    </div>
  );
}
