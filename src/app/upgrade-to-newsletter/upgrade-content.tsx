'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ArrowRight, Mail, Newspaper, Zap, Users, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function UpgradeToNewsletterContent() {
  const searchParams = useSearchParams();
  const source = searchParams.get('source') || 'truetone';
  const email = searchParams.get('email') || '';

  const features = [
    { icon: Newspaper, label: 'AI Newsletter Generator', description: 'Create engaging newsletters in minutes' },
    { icon: Zap, label: 'Industry News', description: 'Curated mortgage industry updates' },
    { icon: Users, label: 'Client Engagement', description: 'Keep your clients informed and connected' },
    { icon: Mail, label: 'Email Templates', description: 'Professional templates ready to customize' },
  ];

  const handleGetStarted = () => {
    // Redirect to onboarding to set up their Newsletter account
    const onboardingUrl = new URL('/onboarding', window.location.origin);
    if (email) {
      onboardingUrl.searchParams.set('email', email);
    }
    onboardingUrl.searchParams.set('upgrade', 'true');
    window.location.href = onboardingUrl.toString();
  };

  const handleGoBack = () => {
    // Redirect to TrueTone app
    window.location.href = 'https://app.truetone.ai';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex flex-col items-center justify-center relative overflow-hidden py-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl px-4">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-purple-400" />
          <span className="text-2xl font-bold text-white">Spark Newsletter</span>
        </div>

        {/* Card */}
        <Card className="w-full bg-white/10 backdrop-blur-xl border-white/10 shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/30 to-indigo-500/30 rounded-full flex items-center justify-center">
              <Newspaper className="h-8 w-8 text-purple-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Welcome to Spark Newsletter
            </CardTitle>
            <CardDescription className="text-gray-300">
              {source === 'truetone' ? (
                <>
                  We noticed you're a <span className="text-purple-400 font-medium">TrueTone AI</span> user.
                  Get started with Spark to create engaging newsletters for your clients.
                </>
              ) : (
                <>
                  Get started with Spark Newsletter to create engaging newsletters for your clients.
                </>
              )}
            </CardDescription>
            {email && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full text-sm text-white/70">
                <Mail className="h-3.5 w-3.5" />
                {email}
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature) => (
                <div
                  key={feature.label}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-colors"
                >
                  <feature.icon className="h-5 w-5 text-purple-400 mb-2" />
                  <h3 className="font-medium text-white text-sm">{feature.label}</h3>
                  <p className="text-xs text-gray-400 mt-1">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg h-12 text-base font-medium"
                onClick={handleGetStarted}
              >
                Get Started with Spark
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              {source === 'truetone' && (
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10 hover:border-white/30 h-12"
                  onClick={handleGoBack}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Return to TrueTone AI
                </Button>
              )}
            </div>

            {/* Help Link */}
            <div className="text-center">
              <p className="text-sm text-gray-400">
                Have questions?{' '}
                <Link href="mailto:sparksupport@truetone.ai" className="text-purple-400 hover:text-purple-300 underline">
                  Contact support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer note */}
        <p className="mt-6 text-center text-sm text-white/60">
          Start creating newsletters in minutes. Free to try.
        </p>
      </div>
    </div>
  );
}
