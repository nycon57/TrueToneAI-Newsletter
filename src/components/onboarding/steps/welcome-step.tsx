'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Grid3x3, CreditCard, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useOnboarding } from '../providers/onboarding-provider';
import { motion } from 'motion/react';

export function WelcomeStep() {
  const { nextStep } = useOnboarding();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-2xl border-2 border-primary/20">
          <CardContent className="p-8 sm:p-12">
            <div className="text-center">
              <CardHeader className="pb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto mb-4"
                >
                  <Sparkles className="h-16 w-16 text-orchid mx-auto animate-pulse" />
                </motion.div>
                <CardTitle className="text-4xl font-heading font-bold mb-4 bg-gradient-to-r from-orchid via-primary to-skyward bg-clip-text text-transparent">
                  Welcome to TrueTone Newsletter!
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Let's personalize your newsletter experience in just 3 simple steps.
                  Get AI-powered content tailored to your interests and industry.
                </CardDescription>
              </CardHeader>

              <div className="grid md:grid-cols-3 gap-6 my-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center space-y-4 p-6 rounded-lg border border-border hover:border-orchid/50 hover:shadow-md transition-all"
                >
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orchid/20 to-orchid/10 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-orchid" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-orchid text-white flex items-center justify-center text-xs font-bold">1</div>
                      <h3 className="font-heading font-semibold text-lg">Profile Setup</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tell us about your professional role and company
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center space-y-4 p-6 rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all"
                >
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                    <Grid3x3 className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">2</div>
                      <h3 className="font-heading font-semibold text-lg">Content Preferences</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Select categories and tags to personalize your feed
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center space-y-4 p-6 rounded-lg border border-border hover:border-skyward/50 hover:shadow-md transition-all"
                >
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-skyward/20 to-skyward/10 rounded-full flex items-center justify-center">
                    <CreditCard className="h-8 w-8 text-skyward" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-skyward text-white flex items-center justify-center text-xs font-bold">3</div>
                      <h3 className="font-heading font-semibold text-lg">Choose Your Plan</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Start with a free trial or select a paid plan
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="bg-gradient-to-br from-primary/5 via-orchid/5 to-skyward/5 border border-primary/20 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <h4 className="font-heading font-semibold text-foreground text-lg">What You'll Get:</h4>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground text-left max-w-2xl mx-auto">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-orchid rounded-full mt-2 flex-shrink-0"></div>
                    <span>AI-powered content tailored to your selected categories</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Personalized recommendations based on your industry</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-skyward rounded-full mt-2 flex-shrink-0"></div>
                    <span>One-click copy for emails, social media, and more</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-shadow rounded-full mt-2 flex-shrink-0"></div>
                    <span>Easy-to-manage preferences you can update anytime</span>
                  </div>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={nextStep}
                  className="px-10 py-6 text-lg font-semibold bg-gradient-to-r from-orchid to-primary hover:from-orchid/90 hover:to-primary/90 shadow-lg"
                >
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </motion.div>

              <p className="text-xs text-muted-foreground mt-6">
                ⏱️ Takes about 3-5 minutes to complete
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}