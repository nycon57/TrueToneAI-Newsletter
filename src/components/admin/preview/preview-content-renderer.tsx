"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Copy,
  CheckIcon,
  Video,
  Mail,
  Share2,
  Lightbulb,
  TrendingUp,
  Shield,
  FileText,
  Sparkles,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface Article {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  defaultKeyInsights: string[];
  defaultVideoScript: string | null;
  defaultEmailTemplate: string | null;
  defaultSocialContent: Record<string, string> | null;
  category: string | null;
  tags: string[];
}

interface PreviewContentRendererProps {
  article: Article;
}

// Simulated copy button (non-functional in preview)
function PreviewCopyButton({ type }: { type: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="group border-lavender/50 text-orchid hover:bg-lavender/20 hover:border-lavender transition-all duration-300"
      disabled
    >
      <Copy className="h-4 w-4 mr-2" />
      Copy {type}
    </Button>
  );
}

export function PreviewContentRenderer({ article }: PreviewContentRendererProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Determine article icon based on title
  const getArticleIcon = () => {
    if (!article.title) return TrendingUp;
    const title = article.title.toLowerCase();
    if (title.includes("rate") || title.includes("fed")) return TrendingUp;
    if (title.includes("fha") || title.includes("loan")) return Shield;
    if (title.includes("credit") || title.includes("score")) return FileText;
    return TrendingUp;
  };

  const sections = [];

  if (article.defaultKeyInsights && article.defaultKeyInsights.length > 0) {
    sections.push({
      id: "insights",
      title: "Key Insights",
      icon: Lightbulb,
      buttonClass:
        "bg-lavender/20 hover:bg-lavender/30 text-orchid hover:text-indigo border-lavender/50 hover:border-lavender",
      activeButtonClass:
        "bg-gradient-to-r from-orchid to-indigo text-white hover:text-white border-0 shadow-md",
    });
  }

  if (article.defaultVideoScript) {
    sections.push({
      id: "video",
      title: "Video Script",
      icon: Video,
      buttonClass:
        "bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 border-red-200 hover:border-red-300",
      activeButtonClass:
        "bg-gradient-to-r from-red-600 to-red-700 text-white hover:text-white border-0 shadow-md",
    });
  }

  if (article.defaultEmailTemplate) {
    sections.push({
      id: "email",
      title: "Email",
      icon: Mail,
      buttonClass:
        "bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 border-green-200 hover:border-green-300",
      activeButtonClass:
        "bg-gradient-to-r from-green-600 to-green-700 text-white hover:text-white border-0 shadow-md",
    });
  }

  if (article.defaultSocialContent) {
    sections.push({
      id: "social",
      title: "Social",
      icon: Share2,
      buttonClass:
        "bg-pink-50 hover:bg-pink-100 text-pink-700 hover:text-pink-800 border-pink-200 hover:border-pink-300",
      activeButtonClass:
        "bg-gradient-to-r from-pink-700 to-pink-800 text-white hover:text-white border-0 shadow-md",
    });
  }

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  const renderSectionContent = () => {
    if (!activeSection) return null;

    switch (activeSection) {
      case "insights":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-lavender/30 to-lavender/20 rounded-xl" />
            <div className="relative p-8 bg-white/60 backdrop-blur-sm rounded-xl border border-lavender/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-lavender/30 rounded-lg">
                  <Lightbulb className="h-5 w-5 text-orchid" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Key Insights</h3>
              </div>

              <div className="space-y-4 mb-6">
                {article.defaultKeyInsights?.map((insight, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className="flex items-start gap-3 group"
                  >
                    <div className="p-1.5 bg-lavender/30 rounded-full mt-0.5">
                      <CheckIcon className="h-3.5 w-3.5 text-orchid" />
                    </div>
                    <span className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                      {insight}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case "video":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 bg-gradient-to-br from-gray-50 to-gray-100/50 p-8 rounded-xl border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <Video className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Video Script</h3>
              <Badge className="bg-red-100 text-red-700 border-0 text-xs">
                30-60 seconds
              </Badge>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
              <div className="space-y-4">
                {article.defaultVideoScript?.split("\n\n").map((paragraph, idx) => (
                  <p key={idx} className="text-gray-700 leading-relaxed text-lg">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <PreviewCopyButton type="Video Script" />
              <span className="text-sm text-gray-500">Ready to record!</span>
            </div>
          </motion.div>
        );

      case "email":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50/50 p-8 rounded-xl border border-green-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Mail className="h-5 w-5 text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Email Template</h3>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-green-100 mb-6">
              <div className="space-y-4">
                {article.defaultEmailTemplate?.split("\n\n").map((paragraph, idx) => (
                  <p key={idx} className="text-gray-700 leading-relaxed">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <PreviewCopyButton type="Email Template" />
              <span className="text-sm text-gray-500">Personalize before sending</span>
            </div>
          </motion.div>
        );

      case "social":
        const socialPlatforms = [
          {
            name: "Facebook",
            icon: Facebook,
            color: "from-blue-600 to-blue-700",
            content: article.defaultSocialContent?.facebook,
          },
          {
            name: "Instagram",
            icon: Instagram,
            color: "from-pink-600 to-orchid",
            content: article.defaultSocialContent?.instagram,
          },
          {
            name: "Twitter",
            icon: Twitter,
            color: "from-blue-500 to-blue-600",
            content: article.defaultSocialContent?.twitter,
          },
          {
            name: "LinkedIn",
            icon: Linkedin,
            color: "from-indigo to-orchid",
            content: article.defaultSocialContent?.linkedin,
          },
        ];

        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 bg-gradient-to-br from-lavender/20 to-pink-50/50 p-8 rounded-xl border border-lavender/50"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-lavender/30 rounded-lg">
                <Share2 className="h-5 w-5 text-orchid" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Social Media Content</h3>
            </div>
            <div className="grid gap-4">
              {socialPlatforms.map((platform, idx) => {
                const PlatformIcon = platform.icon;
                return (
                  platform.content && (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-r ${platform.color} shadow-sm`}
                        >
                          <PlatformIcon className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="font-bold text-lg text-gray-900">{platform.name}</h4>
                      </div>
                      <p className="text-gray-800 text-sm mb-5 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100 font-medium">
                        {platform.content}
                      </p>
                      <PreviewCopyButton type={platform.name} />
                    </motion.div>
                  )
                );
              })}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-lavender/30 mb-8">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="relative h-10">
              <Image
                src="/logo/landscape/TrueToneAI-Landscape-Logo-Full-Color.png"
                alt="TrueTone AI"
                width={200}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </div>
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              Preview Mode
            </Badge>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="text-center mb-8 px-4">
        <div className="inline-flex items-center gap-2 bg-lavender/30 text-orchid px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Sparkles className="h-4 w-4" />
          <span>Welcome back!</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Market Intelligence
        </h1>
      </div>

      {/* Article Card */}
      <div className="max-w-4xl mx-auto px-4">
        <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
          <CardContent className="p-7">
            <div className="flex-1">
              <div className="flex items-center mb-4">
                <Badge className="bg-lavender/30 text-orchid border-0 px-3 py-1">
                  {article.category || "Market Update"}
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                {article.title || "Untitled Article"}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                {article.summary || "No summary available."}
              </p>

              <div className="flex flex-wrap gap-3">
                {sections.map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <Button
                      key={section.id}
                      onClick={() => handleSectionClick(section.id)}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-10 px-5 flex items-center gap-2 transition-all duration-200 rounded-lg border font-medium hover:scale-105",
                        activeSection === section.id
                          ? section.activeButtonClass
                          : section.buttonClass
                      )}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="text-sm">{section.title}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {renderSectionContent()}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-500 px-4">
        &copy; 2024 TrueTone AI. Built for ambitious, top-producing Loan Officers.
      </div>
    </div>
  );
}
