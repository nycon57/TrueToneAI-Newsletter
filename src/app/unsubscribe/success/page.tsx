import { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle2, Mail, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function SuccessContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orchid/5 via-background to-indigo/5 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 space-y-6">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            You&apos;ve been unsubscribed
          </h1>
          <p className="text-muted-foreground">
            We&apos;re sorry to see you go. You&apos;ll no longer receive marketing emails from TrueTone Insights.
          </p>
        </div>

        {/* What's Changed */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h2 className="font-semibold text-sm">What this means:</h2>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✓ No more newsletter emails</li>
            <li>✓ No more product updates</li>
            <li>✓ You&apos;ll still receive important account notifications</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button asChild className="w-full" variant="outline">
            <Link href="/preferences">
              <Settings className="w-4 h-4 mr-2" />
              Manage Email Preferences
            </Link>
          </Button>

          <Button asChild className="w-full" variant="ghost">
            <Link href="/support">
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Link>
          </Button>
        </div>

        {/* Changed Your Mind */}
        <div className="text-center pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-3">
            Changed your mind?
          </p>
          <Button asChild variant="default" size="sm">
            <Link href="/preferences">
              Resubscribe to Updates
            </Link>
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pt-2">
          <p>
            If you have questions or feedback, we&apos;d love to hear from you.
          </p>
          <Link
            href="/support"
            className="text-orchid hover:text-orchid/80 underline"
          >
            Reach out to our team
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default function UnsubscribeSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-orchid/5 via-background to-indigo/5 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orchid mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

export const metadata = {
  title: 'Unsubscribed Successfully | TrueTone Insights',
  description: 'You have been successfully unsubscribed from TrueTone Insights emails.',
  robots: 'noindex, nofollow',
};
