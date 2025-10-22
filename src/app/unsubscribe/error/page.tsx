import { Suspense } from 'react';
import Link from 'next/link';
import { XCircle, Mail, Home, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ErrorReason {
  title: string;
  description: string;
  suggestion: string;
}

function getErrorDetails(reason: string | null): ErrorReason {
  const errorMap: Record<string, ErrorReason> = {
    missing_token: {
      title: 'Missing Unsubscribe Token',
      description: 'The unsubscribe link you clicked is missing required information.',
      suggestion: 'Please use the unsubscribe link from the original email, or contact support for assistance.',
    },
    invalid_token: {
      title: 'Invalid or Expired Link',
      description: 'This unsubscribe link is invalid or has expired.',
      suggestion: 'Unsubscribe links expire after 90 days. Please use a recent email or contact support.',
    },
    user_not_found: {
      title: 'User Not Found',
      description: 'We couldn\'t find a user account associated with this unsubscribe request.',
      suggestion: 'Your account may have been deleted. If you believe this is an error, please contact support.',
    },
    update_failed: {
      title: 'Update Failed',
      description: 'We encountered a problem updating your email preferences.',
      suggestion: 'Please try again later, or contact support if the problem persists.',
    },
    server_error: {
      title: 'Server Error',
      description: 'An unexpected error occurred while processing your request.',
      suggestion: 'We apologize for the inconvenience. Please try again later or contact support.',
    },
  };

  return (
    errorMap[reason || ''] || {
      title: 'Unsubscribe Error',
      description: 'We encountered a problem processing your unsubscribe request.',
      suggestion: 'Please try again or contact our support team for assistance.',
    }
  );
}

function ErrorContent({ searchParams }: { searchParams: { reason?: string } }) {
  const errorDetails = getErrorDetails(searchParams.reason || null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/50 via-background to-orange-50/50 dark:from-red-950/10 dark:via-background dark:to-orange-950/10 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 space-y-6">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3">
            <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            {errorDetails.title}
          </h1>
          <p className="text-muted-foreground">
            {errorDetails.description}
          </p>
        </div>

        {/* Error Details */}
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-lg p-4">
          <div className="flex gap-3">
            <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h2 className="font-semibold text-sm text-amber-900 dark:text-amber-100">
                What to do next
              </h2>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                {errorDetails.suggestion}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/support">
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Link>
          </Button>

          <Button asChild className="w-full" variant="outline">
            <Link href="/preferences">
              Manage Email Preferences
            </Link>
          </Button>

          <Button asChild className="w-full" variant="ghost">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Link>
          </Button>
        </div>

        {/* Technical Details (for debugging) */}
        {searchParams.reason && (
          <div className="pt-4 border-t">
            <details className="text-xs text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground">
                Technical details
              </summary>
              <div className="mt-2 p-2 bg-muted rounded font-mono">
                Error code: {searchParams.reason}
              </div>
            </details>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pt-2">
          <p>
            Need immediate assistance?
          </p>
          <a
            href="mailto:support@truetoneinsights.com"
            className="text-orchid hover:text-orchid/80 underline"
          >
            support@truetoneinsights.com
          </a>
        </div>
      </Card>
    </div>
  );
}

export default function UnsubscribeErrorPage({
  searchParams,
}: {
  searchParams: { reason?: string };
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-red-50/50 via-background to-orange-50/50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orchid mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <ErrorContent searchParams={searchParams} />
    </Suspense>
  );
}

export const metadata = {
  title: 'Unsubscribe Error | TrueTone Insights',
  description: 'An error occurred while processing your unsubscribe request.',
  robots: 'noindex, nofollow',
};
