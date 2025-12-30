import { Suspense } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { UpgradeToNewsletterContent } from './upgrade-content';

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex flex-col items-center justify-center">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-8 w-8 text-purple-400" />
        <span className="text-2xl font-bold text-white">Spark Newsletter</span>
      </div>
      <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
    </div>
  );
}

export default function UpgradeToNewsletterPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <UpgradeToNewsletterContent />
    </Suspense>
  );
}
