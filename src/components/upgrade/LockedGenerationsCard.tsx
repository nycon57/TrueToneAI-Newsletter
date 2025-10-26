'use client';

import { motion } from 'motion/react';
import { Lock, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface LockedGenerationsCardProps {
  lockedCount: number;
  className?: string;
}

export function LockedGenerationsCard({ lockedCount, className }: LockedGenerationsCardProps) {
  const router = useRouter();

  if (lockedCount === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      <Card className="border-2 border-orchid/30 bg-gradient-to-br from-orchid/10 via-white to-indigo/10 shadow-xl overflow-hidden">
        <CardContent className="p-8">
          {/* Lock Icon with Gradient Background */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orchid to-indigo blur-xl opacity-50" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-orchid to-indigo flex items-center justify-center shadow-lg">
                <Lock className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          {/* Main Message */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {lockedCount} Saved {lockedCount === 1 ? 'Personalization' : 'Personalizations'} Locked
            </h3>
            <p className="text-gray-600 text-base leading-relaxed">
              You have <span className="font-semibold text-orchid">{lockedCount} AI-generated {lockedCount === 1 ? 'personalization' : 'personalizations'}</span> saved from when you had Pro access.
              <br />
              <span className="text-sm text-gray-500 mt-1 block">
                These include email templates, video scripts, social media posts, and key insights.
              </span>
            </p>
          </div>

          {/* Value Proposition */}
          <div className="bg-white/80 rounded-lg p-4 mb-6 border border-orchid/20">
            <div className="flex items-start gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-orchid flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  Unlock Your Content Library
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  All your personalizations are safely stored and waiting for you. Upgrade to Pro to regain instant access.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-indigo flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  Plus 25 New Generations Monthly
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Create unlimited new personalized content with AI every month. Your creativity never stops.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={() => router.push('/account?tab=billing')}
            className="w-full bg-gradient-to-r from-orchid to-indigo hover:from-indigo hover:to-shadow text-white font-semibold py-6 text-base shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Lock className="w-5 h-5 mr-2" />
            Upgrade to Unlock {lockedCount} {lockedCount === 1 ? 'Personalization' : 'Personalizations'}
          </Button>

          {/* Fine Print */}
          <p className="text-xs text-center text-gray-500 mt-4">
            Your content is preserved. Upgrade anytime to restore full access.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
