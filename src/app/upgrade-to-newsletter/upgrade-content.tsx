'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Mail, Newspaper, ExternalLink, Copy, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';

export function UpgradeToNewsletterContent() {
  const searchParams = useSearchParams();
  const source = searchParams.get('source') || 'truetone';
  const email = searchParams.get('email') || '';

  const features = [
    {
      icon: Newspaper,
      label: 'AI-Powered Content',
      description: 'Industry news curated and personalized for your voice',
      color: 'lilac'
    },
    {
      icon: Copy,
      label: 'One-Click Copy',
      description: 'Instantly share scripts across email, video & social',
      color: 'lilac'
    },
    {
      icon: Mail,
      label: 'Impact Per Platform',
      description: 'AI crafts content optimized for email, video, and social',
      color: 'lilac'
    },
    {
      icon: TrendingUp,
      label: 'Stay Ahead',
      description: 'Weekly mortgage insights to keep your clients engaged',
      color: 'lilac'
    },
  ];

  const handleGetStarted = () => {
    const onboardingUrl = new URL('/onboarding', window.location.origin);
    if (email) {
      onboardingUrl.searchParams.set('email', email);
    }
    onboardingUrl.searchParams.set('upgrade', 'true');
    window.location.href = onboardingUrl.toString();
  };

  const handleGoBack = () => {
    // Logout and redirect to home page
    window.location.href = '/api/auth/logout';
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      orchid: { bg: 'bg-orchid/20', text: 'text-orchid', border: 'border-orchid/30' },
      lilac: { bg: 'bg-lilac/20', text: 'text-lilac', border: 'border-lilac/30' },
      skyward: { bg: 'bg-skyward/20', text: 'text-skyward', border: 'border-skyward/30' },
      lavender: { bg: 'bg-lavender/20', text: 'text-lavender', border: 'border-lavender/30' },
    };
    return colors[color] || colors.orchid;
  };

  return (
    <div className="min-h-screen bg-shadow flex flex-col items-center justify-center relative overflow-hidden py-12 px-4">
      {/* Atmospheric background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary gradient orbs */}
        <motion.div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo/30 rounded-full blur-[150px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orchid/20 rounded-full blur-[130px]"
          animate={{
            x: [0, -40, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Accent glow */}
        <motion.div
          className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-skyward/10 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-xl">
        {/* Logo */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src="/logo/landscape/TrueToneAI-Landscape-Logo-White.png"
            alt="TrueTone AI"
            width={220}
            height={55}
            className="h-12 w-auto"
            priority
          />
        </motion.div>

        {/* Main Card */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="w-full bg-indigo/40 backdrop-blur-xl border border-orchid/20 shadow-2xl shadow-orchid/10 overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1 bg-gradient-to-r from-orchid via-lilac to-skyward" />

            <CardContent className="px-6 py-2 sm:px-8 sm:py-2">
              {/* Header Section */}
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-3">
                  {source === 'truetone' ? 'Upgrade to Spark' : 'Amplify Your Voice'}
                </h1>

                <p className="text-lavender/80 text-base max-w-md mx-auto leading-relaxed">
                  {source === 'truetone' ? (
                    <>
                      As a TrueTone customer, you can now access{' '}
                      <span className="text-skyward font-medium">Spark</span> — our newsletter platform that turns
                      industry news into ready-to-share content in your authentic voice.
                    </>
                  ) : (
                    <>
                      Transform industry news into personalized content your clients will love with{' '}
                      <span className="text-skyward font-medium">Spark</span>.
                    </>
                  )}
                </p>

                {email && (
                  <motion.div
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-shadow/50 rounded-full border border-orchid/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Mail className="h-4 w-4 text-lilac" />
                    <span className="text-sm text-lavender/90">{email}</span>
                  </motion.div>
                )}
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {features.map((feature, index) => {
                  const colors = getColorClasses(feature.color);
                  return (
                    <motion.div
                      key={feature.label}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className={`group p-4 rounded-xl bg-shadow/40 border ${colors.border} hover:bg-shadow/60 hover:border-opacity-50 transition-all duration-300`}
                    >
                      <div className={`w-9 h-9 rounded-lg ${colors.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className={`h-4.5 w-4.5 ${colors.text}`} />
                      </div>
                      <h3 className="font-heading font-semibold text-white text-sm mb-1">{feature.label}</h3>
                      <p className="text-xs text-lavender/60 leading-relaxed">{feature.description}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA Buttons */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  className="w-full bg-gradient-to-r from-orchid to-indigo hover:from-orchid/90 hover:to-indigo/90 text-white shadow-lg shadow-orchid/20 h-12 text-base font-heading font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-orchid/30 hover:scale-[1.02]"
                  onClick={handleGetStarted}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                {source === 'truetone' && (
                  <Button
                    variant="outline"
                    className="w-full border-lavender/20 bg-transparent text-lavender hover:bg-lavender/10 hover:border-lavender/30 hover:text-white h-11 font-medium transition-all duration-300"
                    onClick={handleGoBack}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                )}
              </motion.div>

              {/* Help Link */}
              <motion.div
                className="text-center mt-6 pt-6 border-t border-orchid/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <p className="text-sm text-lavender/50">
                  Questions?{' '}
                  <Link
                    href="mailto:support@truetone.ai"
                    className="text-lilac hover:text-lavender underline underline-offset-2 transition-colors"
                  >
                    Contact support
                  </Link>
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="mt-8 text-center text-sm text-lavender/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Start creating in minutes. No credit card required.
        </motion.p>
      </div>
    </div>
  );
}
