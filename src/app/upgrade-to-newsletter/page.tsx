import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { UpgradeToNewsletterContent } from './upgrade-content';

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-shadow flex flex-col items-center justify-center relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orchid/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-skyward/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <Image
          src="/logo/landscape/TrueToneAI-Landscape-Logo-White.png"
          alt="TrueTone AI"
          width={200}
          height={50}
          className="h-10 w-auto"
          priority
        />
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 text-lavender animate-spin" />
          <span className="text-sm text-lavender/70 font-body">Loading...</span>
        </div>
      </div>
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
