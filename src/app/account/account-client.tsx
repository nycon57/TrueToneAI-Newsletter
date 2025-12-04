'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  staggeredContainer,
  staggeredItem,
  springs,
} from '@/lib/motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileTab } from '@/components/account/profile-tab';
import { BillingTab } from '@/components/account/billing-tab';
import { SupportTab } from '@/components/account/support-tab';
import { TrueToneTab } from '@/components/account/truetone-tab';
import { UserCircle, CreditCard, MessageCircle, ArrowLeft, Wand2 } from 'lucide-react';
import { useQueryState } from 'nuqs';
import type { ApiUser } from '@/lib/api/auth-cached';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AccountClientProps {
  user: ApiUser;
}

export default function AccountClient({ user }: AccountClientProps) {
  // Use URL state for persistence, but local state for instant UI response
  const [urlTab, setUrlTab] = useQueryState('tab', { defaultValue: 'profile', shallow: true });
  const [activeTab, setActiveTab] = useState(urlTab || 'profile');

  // Sync URL changes to local state (e.g., back/forward navigation)
  useEffect(() => {
    if (urlTab && urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab, activeTab]);

  // Handle tab change: update local state immediately, URL in background
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value); // Instant UI update
    setUrlTab(value);    // Background URL sync
  }, [setUrlTab]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-lavender/20 to-background">
      <div className="container max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={springs.smooth}
          className="mb-6"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <motion.div
              whileHover={{ x: -2 }}
              transition={springs.snappy}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-background border border-border group-hover:border-orchid/50 group-hover:bg-orchid/5 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 group-hover:text-orchid transition-colors" />
            </motion.div>
            <span className="group-hover:translate-x-0.5 transition-transform duration-200">
              Back to Home
            </span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          variants={staggeredContainer}
          initial="hidden"
          animate="visible"
          className="text-center mb-8"
        >
          <motion.h1
            variants={staggeredItem}
            className="text-3xl sm:text-4xl font-heading font-bold mb-2"
          >
            Account Settings
          </motion.h1>
          <motion.p variants={staggeredItem} className="text-muted-foreground">
            Manage your profile, billing, and preferences
          </motion.p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.gentle, delay: 0.2 }}
        >
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 mb-8 h-auto p-1 bg-white border-2 border-orchid/20">
              <TabsTrigger
                value="profile"
                className="flex items-center gap-2 py-3 text-orchid/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orchid data-[state=active]:to-indigo data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-150"
              >
                <UserCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger
                value="truetone"
                className="flex items-center gap-2 py-3 text-orchid/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orchid data-[state=active]:to-indigo data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-150"
              >
                <Wand2 className="w-4 h-4" />
                <span className="hidden sm:inline">TrueTone</span>
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                className="flex items-center gap-2 py-3 text-orchid/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orchid data-[state=active]:to-indigo data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-150"
              >
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Billing</span>
              </TabsTrigger>
              <TabsTrigger
                value="support"
                className="flex items-center gap-2 py-3 text-orchid/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orchid data-[state=active]:to-indigo data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-150"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Support</span>
              </TabsTrigger>
            </TabsList>

            {/* All tabs stay mounted for instant switching - CSS handles visibility */}
            <div className="relative">
              <div
                className={cn(
                  'transition-opacity duration-150',
                  activeTab === 'profile' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'
                )}
              >
                <TabsContent value="profile" className="mt-0" forceMount>
                  <ProfileTab user={user} />
                </TabsContent>
              </div>

              <div
                className={cn(
                  'transition-opacity duration-150',
                  activeTab === 'truetone' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'
                )}
              >
                <TabsContent value="truetone" className="mt-0" forceMount>
                  <TrueToneTab user={user} />
                </TabsContent>
              </div>

              <div
                className={cn(
                  'transition-opacity duration-150',
                  activeTab === 'billing' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'
                )}
              >
                <TabsContent value="billing" className="mt-0" forceMount>
                  <BillingTab user={user} />
                </TabsContent>
              </div>

              <div
                className={cn(
                  'transition-opacity duration-150',
                  activeTab === 'support' ? 'opacity-100' : 'opacity-0 absolute inset-0 pointer-events-none'
                )}
              >
                <TabsContent value="support" className="mt-0" forceMount>
                  <SupportTab user={user} />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
