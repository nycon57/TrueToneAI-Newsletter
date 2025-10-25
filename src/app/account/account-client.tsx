'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileTab } from '@/components/account/profile-tab';
import { BillingTab } from '@/components/account/billing-tab';
import { SupportTab } from '@/components/account/support-tab';
import { TrueToneTab } from '@/components/account/truetone-tab';
import { UserCircle, CreditCard, MessageCircle, Sparkles, ArrowLeft, Wand2 } from 'lucide-react';
import { useQueryState } from 'nuqs';
import type { ApiUser } from '@/lib/api/auth-cached';
import Link from 'next/link';

interface AccountClientProps {
  user: ApiUser;
}

export default function AccountClient({ user }: AccountClientProps) {
  const [activeTab, setActiveTab] = useQueryState('tab', { defaultValue: 'profile' });

  return (
    <div className="min-h-screen bg-gradient-to-b from-lavender/20 to-background">
      <div className="container max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background border border-border group-hover:border-orchid/50 group-hover:bg-orchid/5 transition-all duration-200">
              <ArrowLeft className="w-4 h-4 group-hover:text-orchid transition-colors" />
            </div>
            <span className="group-hover:translate-x-0.5 transition-transform duration-200">
              Back to Home
            </span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orchid to-indigo mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-2">
            Account Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your profile, billing, and preferences
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 mb-8 h-auto p-1">
              <TabsTrigger
                value="profile"
                className="flex items-center gap-2 py-3 data-[state=active]:bg-background"
              >
                <UserCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger
                value="truetone"
                className="flex items-center gap-2 py-3 data-[state=active]:bg-background"
              >
                <Wand2 className="w-4 h-4" />
                <span className="hidden sm:inline">TrueTone</span>
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                className="flex items-center gap-2 py-3 data-[state=active]:bg-background"
              >
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Billing</span>
              </TabsTrigger>
              <TabsTrigger
                value="support"
                className="flex items-center gap-2 py-3 data-[state=active]:bg-background"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Support</span>
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="profile" className="mt-0">
                    <ProfileTab user={user} />
                  </TabsContent>
                </motion.div>
              )}

              {activeTab === 'truetone' && (
                <motion.div
                  key="truetone"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="truetone" className="mt-0">
                    <TrueToneTab user={user} />
                  </TabsContent>
                </motion.div>
              )}

              {activeTab === 'billing' && (
                <motion.div
                  key="billing"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="billing" className="mt-0">
                    <BillingTab user={user} />
                  </TabsContent>
                </motion.div>
              )}

              {activeTab === 'support' && (
                <motion.div
                  key="support"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="support" className="mt-0">
                    <SupportTab user={user} />
                  </TabsContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
