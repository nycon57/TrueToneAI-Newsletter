import { ArrowRight, Sparkles, Heart, Search, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export function UpgradePrompt() {
  return (
    <Card className="bg-gradient-to-br from-orchid/10 to-indigo/10 border-2 border-orchid/30 shadow-xl">
      <CardContent className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orchid/20 rounded-full mb-4">
          <Sparkles className="h-8 w-8 text-orchid" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          See All Articles & Get AI Personalization
        </h2>

        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          Upgrade to access our complete archive, save articles, and get AI-powered personalized content in your unique voice.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8 max-w-xl mx-auto">
          <div className="flex items-start gap-3 text-left">
            <Zap className="h-5 w-5 text-orchid mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">AI Personalization</h4>
              <p className="text-xs text-gray-600">Real-time content in your voice</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-left">
            <Heart className="h-5 w-5 text-orchid mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Save Articles</h4>
              <p className="text-xs text-gray-600">Build your content library</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-left">
            <Search className="h-5 w-5 text-orchid mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Full Search</h4>
              <p className="text-xs text-gray-600">Filter by industry & tags</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-left">
            <ArrowRight className="h-5 w-5 text-orchid mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Unlimited Access</h4>
              <p className="text-xs text-gray-600">All articles, anytime</p>
            </div>
          </div>
        </div>

        <Link href="/api/auth/register?post_login_redirect_url=/onboarding">
          <Button
            size="lg"
            className="bg-gradient-to-r from-orchid to-indigo hover:from-indigo hover:to-shadow text-white shadow-lg hover:shadow-xl transition-all"
          >
            Upgrade Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>

        <p className="text-sm text-gray-500 mt-4">
          Starting at $19.95/month • Cancel anytime
        </p>
      </CardContent>
    </Card>
  );
}
