'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  staggeredContainer,
  staggeredItem,
  fadeInUp,
  springs,
  stagger,
  buttonInteraction,
} from '@/lib/motion';
import { Check, Crown, CreditCard, Sparkles, ArrowLeft, Zap, Shield, Headphones } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { ApiUser } from '@/lib/api/auth-cached';

interface PricingClientProps {
  isAuthenticated: boolean;
  user: ApiUser | null;
}

export function PricingClient({ isAuthenticated, user }: PricingClientProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      window.location.href = `/api/auth/login?post_login_redirect_url=/pricing`;
      return;
    }

    setIsLoading(true);

    try {
      const baseUrl = window.location.origin;
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl: `${baseUrl}/account?tab=billing`,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout. Please try again or contact support.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender/20 via-white to-lavender/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-lavender/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo/landscape/TrueToneAI-Landscape-Logo-Full-Color.png"
                alt="TrueTone AI"
                width={200}
                height={40}
                className="object-contain"
                style={{ height: '40px', width: 'auto' }}
                priority
              />
            </Link>
            {isAuthenticated && (
              <Link href="/account?tab=billing">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Account
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            variants={staggeredContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.div variants={staggeredItem}>
              <Badge className="mb-6 bg-gradient-to-r from-orchid to-indigo text-white border-0">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="inline-block"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                </motion.span>
                Upgrade to Pro
              </Badge>
            </motion.div>

            <motion.h1
              variants={staggeredItem}
              className="text-5xl font-bold text-gray-900 leading-tight font-heading"
            >
              Transform Your Content Game with AI
            </motion.h1>

            <motion.p
              variants={staggeredItem}
              className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            >
              Unlock unlimited AI-powered content personalization, advanced analytics, and premium features to supercharge your marketing.
            </motion.p>

            {/* Trust Indicators */}
            <motion.div
              variants={staggeredItem}
              className="flex items-center justify-center gap-6 text-sm text-muted-foreground"
            >
              {[
                { icon: Shield, label: 'Secure Payments' },
                { icon: Zap, label: 'Instant Access' },
                { icon: Headphones, label: 'Priority Support' },
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springs.gentle, delay: 0.6 + idx * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <item.icon className="h-4 w-4 text-orchid" />
                  <span>{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Pricing Card */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springs.gentle}
          whileHover={{ y: -4 }}
        >
          <Card className="shadow-2xl border-2 border-orchid/20 relative overflow-hidden">
            {/* Popular Badge */}
            <div className="absolute -right-12 top-6 rotate-45 bg-gradient-to-r from-orchid to-indigo text-white text-sm font-medium py-1 px-12">
              Most Popular
            </div>

            <CardHeader className="text-center pb-8 pt-10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orchid to-indigo flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>

              <CardTitle className="text-3xl font-heading font-bold mb-2">
                TrueTone Pro
              </CardTitle>

              <CardDescription className="text-base">
                Everything you need to scale your content marketing
              </CardDescription>

              <div className="mt-6">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold text-gray-900 font-heading">$29</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Billed monthly • Cancel anytime
                </p>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              {/* Features */}
              <div className="space-y-4 mb-8">
                <h3 className="font-semibold text-lg mb-4">what&apos;s included:</h3>

                <div className="grid gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-orchid/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-orchid" />
                    </div>
                    <div>
                      <p className="font-medium">25 AI Generations per Month</p>
                      <p className="text-sm text-muted-foreground">Transform articles into your unique voice with AI personalization</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-orchid/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-orchid" />
                    </div>
                    <div>
                      <p className="font-medium">Voice-Based Personalization</p>
                      <p className="text-sm text-muted-foreground">AI learns your writing style and creates content that sounds like you</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-orchid/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-orchid" />
                    </div>
                    <div>
                      <p className="font-medium">Easy-Copy Marketing Scripts</p>
                      <p className="text-sm text-muted-foreground">One-click copy for emails, social posts, and video scripts</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-orchid/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-orchid" />
                    </div>
                    <div>
                      <p className="font-medium">Personalized Newsletter Content</p>
                      <p className="text-sm text-muted-foreground">Curated market insights tailored to your audience</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-orchid/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-orchid" />
                    </div>
                    <div>
                      <p className="font-medium">Multi-Channel Content</p>
                      <p className="text-sm text-muted-foreground">Generate content for email, social media, and video in seconds</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-orchid/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-orchid" />
                    </div>
                    <div>
                      <p className="font-medium">Priority Customer Support</p>
                      <p className="text-sm text-muted-foreground">Get help when you need it with priority support access</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-orchid/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-orchid" />
                    </div>
                    <div>
                      <p className="font-medium">Advanced Analytics</p>
                      <p className="text-sm text-muted-foreground">Track your content performance and AI usage</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-orchid/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-orchid" />
                    </div>
                    <div>
                      <p className="font-medium">Cancel Anytime</p>
                      <p className="text-sm text-muted-foreground">No long-term commitment. Cancel from your billing portal anytime.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Button
                onClick={handleUpgrade}
                disabled={isLoading}
                className="w-full h-14 text-lg bg-gradient-to-r from-orchid to-indigo hover:from-indigo hover:to-shadow text-white border-0 shadow-lg hover:shadow-xl transition-all"
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    {isAuthenticated ? 'Upgrade to Pro' : 'Sign Up for Pro'}
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground mt-4">
                By continuing, you agree to our Terms of Service and Privacy Policy.
                Secure checkout powered by Stripe.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* FAQ or Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>

          <motion.div
            variants={staggeredContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid md:grid-cols-2 gap-6 text-left"
          >
            {[
              {
                q: 'Can I cancel anytime?',
                a: "Yes! You can cancel anytime from your billing portal. Your subscription will remain active until the end of your billing period."
              },
              {
                q: 'What happens if I run out of AI generations?',
                a: "Your limit resets monthly. If you need more, you'll see options to upgrade or wait until next month. You can still access all newsletter content."
              },
              {
                q: 'How does billing work?',
                a: "You'll be charged $29 monthly on the same day you subscribe. Manage your billing, payment methods, and invoices through your secure billing portal."
              },
              {
                q: 'Is my payment information secure?',
                a: "Absolutely. All payments are processed securely through Stripe. We never store your credit card information."
              }
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                variants={staggeredItem}
                whileHover={{ scale: 1.02, transition: springs.snappy }}
                className="p-4 rounded-lg bg-white/50 border border-lavender/20 hover:border-orchid/30 hover:shadow-md transition-shadow"
              >
                <h4 className="font-medium mb-2">{faq.q}</h4>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-8">
            <p className="text-muted-foreground mb-4">Still have questions?</p>
            <Link href="/account?tab=support">
              <Button variant="outline">
                <Headphones className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="border-t border-lavender/30 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
          © 2024 Spark by TrueTone AI. Curated insights for sales professionals who lead.
        </div>
      </div>
    </div>
  );
}
