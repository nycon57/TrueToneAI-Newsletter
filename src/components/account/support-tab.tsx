'use client';

import { useState, useRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Loader2,
  Send,
  CheckCircle2,
  Mail,
  MessageSquare,
  Search,
  Paperclip,
  File,
  X,
  HelpCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import type { ApiUser } from '@/lib/api/auth-cached';
import { motion, AnimatePresence } from 'motion/react';

const supportSchema = z.object({
  subject: z.string().min(1, 'Please select a subject'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters'),
});

type SupportFormData = z.infer<typeof supportSchema>;

const supportTopics = [
  { value: 'general', label: 'General Question' },
  { value: 'technical', label: 'Technical Issue' },
  { value: 'billing', label: 'Billing Question' },
  { value: 'feature', label: 'Feature Request' },
];

const FAQ_ITEMS = [
  {
    id: '1',
    question: 'How do I upgrade my subscription?',
    answer:
      'Go to the Billing tab and click "Manage Billing" to upgrade your plan through our secure payment portal. You can choose between monthly and annual plans, and changes take effect immediately.',
    tags: ['billing', 'subscription', 'upgrade'],
  },
  {
    id: '2',
    question: 'How many AI generations do I get per month?',
    answer:
      'Free users get 3 AI personalizations per month. Paid users get unlimited generations with no restrictions. Usage resets on the first day of each month.',
    tags: ['ai', 'limits', 'usage'],
  },
  {
    id: '3',
    question: 'Can I change my email address?',
    answer:
      "Yes, you can update your email in the Profile tab. You'll receive a verification email to confirm the change. Note that your email is used for login, so make sure to use the new email next time you sign in.",
    tags: ['profile', 'email', 'account'],
  },
  {
    id: '4',
    question: 'How do I customize newsletter content preferences?',
    answer:
      "In the Profile tab, scroll down to Content Preferences and select the topics you're interested in. You can choose multiple categories, and we'll tailor your newsletter content to match your selections.",
    tags: ['preferences', 'newsletter', 'content'],
  },
  {
    id: '5',
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, Mastercard, American Express, Discover) through our secure Stripe integration. We also support digital wallets like Apple Pay and Google Pay.',
    tags: ['billing', 'payment', 'stripe'],
  },
  {
    id: '6',
    question: 'How do I cancel my subscription?',
    answer:
      'You can cancel anytime from the Billing tab by clicking "Manage Billing" and selecting "Cancel Subscription". Your access will continue until the end of your current billing period.',
    tags: ['billing', 'subscription', 'cancel'],
  },
  {
    id: '7',
    question: 'What happens to my data if I cancel?',
    answer:
      "Your account and saved content remain accessible for 30 days after cancellation. After that, your data is permanently deleted. You can export your data from the Profile tab before canceling.",
    tags: ['account', 'data', 'privacy'],
  },
  {
    id: '8',
    question: 'How does the AI personalization work?',
    answer:
      'Our AI analyzes newsletter articles and personalizes them based on your preferences, writing style, and past interactions. You can customize the tone, length, and focus of generated content using the AI chat feature.',
    tags: ['ai', 'personalization', 'features'],
  },
  {
    id: '9',
    question: 'Can I share newsletter content with my team?',
    answer:
      'Yes! You can copy and share any newsletter content. For team collaboration features, check out our Business plan which includes team workspaces and shared content libraries.',
    tags: ['sharing', 'team', 'collaboration'],
  },
  {
    id: '10',
    question: 'Is my data secure?',
    answer:
      'Absolutely. We use industry-standard encryption, secure cloud storage, and follow GDPR and CCPA compliance guidelines. We never share your personal information with third parties.',
    tags: ['security', 'privacy', 'data'],
  },
];

interface SupportTabProps {
  user: ApiUser;
}

export function SupportTab({ user }: SupportTabProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [faqSearch, setFaqSearch] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SupportFormData>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      subject: '',
      message: '',
    },
  });

  const message = watch('message');
  const subject = watch('subject');

  // Filter FAQs based on search
  const filteredFAQs = useMemo(() => {
    if (!faqSearch.trim()) return FAQ_ITEMS;

    const searchLower = faqSearch.toLowerCase();
    return FAQ_ITEMS.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchLower) ||
        faq.answer.toLowerCase().includes(searchLower) ||
        faq.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  }, [faqSearch]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];

    for (const file of files) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 10MB.`);
        continue;
      }

      // Check file type
      const validTypes = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];

      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported file type.`);
        continue;
      }

      validFiles.push(file);
    }

    // Check total number of files (max 5)
    const totalFiles = attachments.length + validFiles.length;
    if (totalFiles > 5) {
      toast.error('Maximum 5 files allowed');
      return;
    }

    setAttachments((prev) => [...prev, ...validFiles]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: SupportFormData) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', user.name || '');
      formData.append('email', user.email || '');
      formData.append('subject', data.subject);
      formData.append('message', data.message);

      // Add attachments
      attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });

      const response = await fetch('/api/support', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setShowSuccess(true);
      toast.success('Message sent successfully!');
      reset();
      setAttachments([]);

      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Support form error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* FAQ Section */}
      <Card className="shadow-lg border-orchid/10">
        <CardHeader>
          <CardTitle className="text-2xl font-heading flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-orchid" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            Find quick answers to common questions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search help articles..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="pl-10 focus:ring-orchid focus:border-orchid"
            />
          </div>

          {/* FAQ Accordion */}
          {filteredFAQs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {filteredFAQs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="hover:text-orchid transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">
                No results found for "{faqSearch}"
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Try different keywords or contact support below
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Support Form */}
      <Card className="shadow-lg border-orchid/10">
        <CardHeader>
          <CardTitle className="text-2xl font-heading">Contact Support</CardTitle>
          <CardDescription>
            Have a question or need help? We're here for you
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-orchid to-indigo flex items-center justify-center mb-6"
                >
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-heading font-bold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Thank you for reaching out. Our support team will get back to you within 24 hours.
                </p>
                <Button
                  onClick={() => setShowSuccess(false)}
                  variant="outline"
                  className="border-orchid/30 hover:bg-orchid/5"
                >
                  Send Another Message
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Contact Info (Read-only) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-border">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={user.name || ''}
                      disabled
                      className="bg-muted cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      value={user.email || ''}
                      disabled
                      className="bg-muted cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Subject Selection */}
                <div className="space-y-2">
                  <Label htmlFor="subject" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    Subject
                  </Label>
                  <Select
                    value={subject}
                    onValueChange={(value) => setValue('subject', value, { shouldValidate: true })}
                  >
                    <SelectTrigger
                      id="subject"
                      className="focus:ring-orchid focus:border-orchid"
                    >
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {supportTopics.map((topic) => (
                        <SelectItem key={topic.value} value={topic.value}>
                          {topic.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.subject && (
                    <p className="text-sm text-destructive">{errors.subject.message}</p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="message">Message</Label>
                    <span className="text-xs text-muted-foreground">
                      {message?.length || 0} / 2000
                    </span>
                  </div>
                  <Textarea
                    id="message"
                    {...register('message')}
                    placeholder="Please describe your question or issue in detail. The more information you provide, the better we can help you."
                    className="min-h-[180px] resize-none focus:ring-orchid focus:border-orchid"
                    maxLength={2000}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive">{errors.message.message}</p>
                  )}
                </div>

                {/* File Attachments */}
                <div className="space-y-2">
                  <Label htmlFor="attachments">Attachments (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-orchid/50 transition-colors bg-muted/20">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="hover:border-orchid hover:text-orchid"
                    >
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attach Files
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      PNG, JPG, PDF, DOC (max 10MB per file, 5 files max)
                    </p>
                  </div>

                  {/* Attached Files List */}
                  {attachments.length > 0 && (
                    <div className="space-y-2">
                      {attachments.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <File className="h-4 w-4 text-orchid shrink-0" />
                            <span className="text-sm truncate">{file.name}</span>
                            <span className="text-xs text-muted-foreground shrink-0">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(index)}
                            className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Info Box */}
                <div className="p-4 rounded-lg bg-orchid/5 border border-orchid/20">
                  <p className="text-sm text-orchid">
                    <strong>Response Time:</strong> We typically respond within 24 hours during
                    business days. For urgent issues, please include "URGENT" in your message.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="min-w-[160px] bg-gradient-to-r from-orchid to-indigo hover:from-indigo hover:to-shadow transition-all shadow-lg shadow-orchid/25"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
