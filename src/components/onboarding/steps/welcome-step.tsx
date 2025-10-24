'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Grid3x3, CreditCard, ArrowRight, Sparkles, CheckCircle2, Settings2 } from 'lucide-react';
import { useOnboarding } from '../providers/onboarding-provider';
import { motion } from 'motion/react';

export function WelcomeStep() {
  const { nextStep } = useOnboarding();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-2xl border-2 border-orchid/20 bg-gradient-to-br from-white to-lavender/10">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto mb-3"
              >
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orchid/20 to-indigo/20 rounded-full flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-orchid" />
                </div>
              </motion.div>
              <CardTitle className="text-3xl sm:text-4xl font-heading font-bold mb-2 text-gray-900">
                Welcome to Spark!
              </CardTitle>
              <CardDescription className="text-base text-gray-700 max-w-2xl mx-auto">
                Personalize your experience in 4 simple steps and get curated content tailored to you.
              </CardDescription>
            </div>

            {/* Steps in compact horizontal layout */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative p-5 rounded-xl border-2 border-shadow/30 bg-gradient-to-br from-shadow/5 to-white hover:border-shadow hover:shadow-lg transition-all"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-shadow text-white flex items-center justify-center text-sm font-bold shadow-lg">1</div>
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <User className="h-6 w-6 text-shadow" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Profile Setup</h3>
                    <p className="text-xs text-gray-600">Your role & company</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative p-5 rounded-xl border-2 border-indigo/30 bg-gradient-to-br from-indigo/5 to-white hover:border-indigo hover:shadow-lg transition-all"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-indigo text-white flex items-center justify-center text-sm font-bold shadow-lg">2</div>
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Settings2 className="h-6 w-6 text-indigo" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">TrueTone Settings</h3>
                    <p className="text-xs text-gray-600">Your unique voice</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="relative p-5 rounded-xl border-2 border-orchid/30 bg-gradient-to-br from-orchid/5 to-white hover:border-orchid hover:shadow-lg transition-all"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-orchid text-white flex items-center justify-center text-sm font-bold shadow-lg">3</div>
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Grid3x3 className="h-6 w-6 text-orchid" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Content Preferences</h3>
                    <p className="text-xs text-gray-600">Personalize your feed</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="relative p-5 rounded-xl border-2 border-lilac/30 bg-gradient-to-br from-lilac/5 to-white hover:border-lilac hover:shadow-lg transition-all"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-lilac text-white flex items-center justify-center text-sm font-bold shadow-lg">4</div>
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <CreditCard className="h-6 w-6 text-lilac" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Choose Your Plan</h3>
                    <p className="text-xs text-gray-600">Free trial or paid</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="bg-gradient-to-br from-primary/5 via-orchid/5 to-skyward/5 border border-primary/20 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <h4 className="font-heading font-semibold text-gray-900 text-base">What You'll Get:</h4>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 text-xs text-gray-700 text-left max-w-2xl mx-auto">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-shadow rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Curated content for sales pros</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-indigo rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>AI personalization for your voice</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-orchid rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>One-click copy for emails & social</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-lilac rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Fresh prompts delivered weekly</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Button
                  size="lg"
                  onClick={nextStep}
                  className="px-8 py-5 text-base font-semibold bg-gradient-to-r from-orchid to-indigo hover:from-orchid/90 hover:to-indigo/90 text-white shadow-lg"
                >
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}