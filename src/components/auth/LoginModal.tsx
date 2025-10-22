'use client';

import { useState } from 'react';
import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';

interface LoginModalProps {
  children: React.ReactNode;
}

export function LoginModal({ children }: LoginModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild suppressHydrationWarning>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-border/60 shadow-2xl animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center font-heading">
            Welcome Back
          </DialogTitle>
          <DialogDescription className="text-center">
            Sign in to access your personalized market insights
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <LoginLink
            postLoginRedirectURL="/dashboard"
            className="w-full"
          >
            <Button className="w-full bg-gradient-to-r from-orchid to-indigo hover:from-indigo hover:to-shadow text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In with Kinde
            </Button>
          </LoginLink>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Don't have an account?
            </p>
            <RegisterLink
              postLoginRedirectURL="/onboarding"
              className="w-full"
            >
              <Button
                variant="outline"
                className="w-full border-primary/40 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                onClick={() => setOpen(false)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Create Account
              </Button>
            </RegisterLink>
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our{' '}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              Terms of Service
            </a>
            {' '}and{' '}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}